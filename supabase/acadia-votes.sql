create table if not exists acadia_project_votes (
  project_id text not null,
  house_number integer not null check (house_number between 8000 and 8039),
  vote_type text not null check (vote_type in ('up', 'down')),
  voted_at timestamptz not null default now(),
  primary key (project_id, house_number)
);

comment on table acadia_project_votes is
  'Informal Acadia project feedback. House numbers are never returned by the public API.';

create index if not exists acadia_project_votes_project_idx
  on acadia_project_votes (project_id, vote_type);

alter table acadia_project_votes enable row level security;

revoke all on table acadia_project_votes from anon, authenticated;
grant select, insert, update on table acadia_project_votes to service_role;
