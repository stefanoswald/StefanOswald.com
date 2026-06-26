create extension if not exists vector;
create extension if not exists pg_trgm;

create table if not exists acadia_documents (
  document_id text primary key,
  document_name text not null,
  file_name text not null,
  href text not null,
  checksum text not null,
  page_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists acadia_document_chunks (
  chunk_id text primary key,
  document_id text not null references acadia_documents(document_id) on delete cascade,
  document_name text not null,
  href text not null,
  page_number integer not null,
  article text,
  section text,
  subsection text,
  content text not null,
  content_tsv tsvector generated always as (to_tsvector('english', content)) stored,
  token_count integer not null,
  ocr_quality text not null check (ocr_quality in ('good', 'review', 'poor')),
  ocr_warnings text[] not null default '{}',
  embedding vector(3072) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists acadia_document_chunks_embedding_idx
  on acadia_document_chunks using hnsw (embedding vector_cosine_ops);

create index if not exists acadia_document_chunks_tsv_idx
  on acadia_document_chunks using gin (content_tsv);

create index if not exists acadia_document_chunks_metadata_idx
  on acadia_document_chunks (document_id, page_number);

create or replace function match_acadia_chunks(
  query_embedding vector(3072),
  query_text text,
  match_count int default 20
)
returns table (
  chunk_id text,
  document_id text,
  document_name text,
  href text,
  page_number integer,
  article text,
  section text,
  subsection text,
  content text,
  ocr_quality text,
  similarity double precision,
  keyword_rank double precision
)
language sql
stable
as $$
  with semantic_matches as (
    select
      c.chunk_id,
      c.document_id,
      c.document_name,
      c.href,
      c.page_number,
      c.article,
      c.section,
      c.subsection,
      c.content,
      c.ocr_quality,
      1 - (c.embedding <=> query_embedding) as similarity,
      0::double precision as keyword_rank
    from acadia_document_chunks c
    where c.ocr_quality <> 'poor'
    order by c.embedding <=> query_embedding
    limit greatest(match_count, 20)
  ),
  keyword_matches as (
    select
      c.chunk_id,
      c.document_id,
      c.document_name,
      c.href,
      c.page_number,
      c.article,
      c.section,
      c.subsection,
      c.content,
      c.ocr_quality,
      0::double precision as similarity,
      ts_rank_cd(c.content_tsv, plainto_tsquery('english', query_text))::double precision as keyword_rank
    from acadia_document_chunks c
    where
      c.ocr_quality <> 'poor'
      and c.content_tsv @@ plainto_tsquery('english', query_text)
    order by keyword_rank desc
    limit greatest(match_count, 20)
  )
  select
    m.chunk_id,
    m.document_id,
    m.document_name,
    m.href,
    m.page_number,
    m.article,
    m.section,
    m.subsection,
    m.content,
    m.ocr_quality,
    max(m.similarity) as similarity,
    max(m.keyword_rank) as keyword_rank
  from (
    select * from semantic_matches
    union all
    select * from keyword_matches
  ) m
  group by
    m.chunk_id,
    m.document_id,
    m.document_name,
    m.href,
    m.page_number,
    m.article,
    m.section,
    m.subsection,
    m.content,
    m.ocr_quality
  order by (max(m.similarity) * 0.7 + max(m.keyword_rank) * 0.3) desc
  limit match_count;
$$;
