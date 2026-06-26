#!/usr/bin/env python3
import json
import math
import re
import subprocess
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PDF_DIR = ROOT / "public" / "acadia-documents" / "governing"
TMP_DIR = ROOT / "tmp" / "acadia-ocr"
OUTPUT_PATH = ROOT / "data" / "acadiaOcrIndex.json"

PDFTOPPM = "/Users/stefanoswald/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pdftoppm"

DOCUMENTS = [
    {
        "id": "amendment-to-master-declaration",
        "title": "Amendment to Master Declaration",
        "filename": "amendment-to-master-declaration.pdf",
        "topics": ["amendment", "master", "declaration", "covenants", "restrictions"],
    },
    {
        "id": "plat-book-document",
        "title": "Plat Book Document",
        "filename": "plat-book-document.pdf",
        "topics": ["plat", "map", "layout", "property", "lots", "recorded"],
    },
    {
        "id": "articles-of-incorporation-wp-2002",
        "title": "Articles of Incorporation of WP - 2002",
        "filename": "articles-of-incorporation-wp-2002.pdf",
        "topics": ["articles", "incorporation", "wyndham", "pointe", "corporation", "2002"],
    },
    {
        "id": "acadia-estates-by-laws-exhibit-b",
        "title": "Acadia Estates By-Laws Exhibit B",
        "filename": "acadia-estates-by-laws-exhibit-b.pdf",
        "topics": ["bylaws", "by-laws", "rules", "governance", "board", "exhibit"],
    },
    {
        "id": "acadia-estates-articles-of-incorporation-exhibit-a",
        "title": "Acadia Estates Articles of Incorporation Exhibit A",
        "filename": "acadia-estates-articles-of-incorporation-exhibit-a.pdf",
        "topics": ["articles", "incorporation", "acadia", "estates", "corporation", "exhibit"],
    },
    {
        "id": "exhibit-a",
        "title": "Exhibit A",
        "filename": "exhibit-a.pdf",
        "topics": ["exhibit", "attachment", "governing"],
    },
    {
        "id": "amendment-to-acadia-estates-2003",
        "title": "Amendment to Acadia Estates - 2003",
        "filename": "amendment-to-acadia-estates-2003.pdf",
        "topics": ["amendment", "acadia", "estates", "2003", "governing"],
    },
    {
        "id": "wyndham-pointe-declaration",
        "title": "Wyndham Pointe Declaration",
        "filename": "wyndham-pointe-declaration.pdf",
        "topics": ["declaration", "wyndham", "pointe", "covenants", "restrictions"],
    },
    {
        "id": "master-declaration-covenants-easements-restrictions",
        "title": "Master Declaration of Covenants, Easements & Restrictions",
        "filename": "master-declaration-covenants-easements-restrictions.pdf",
        "topics": ["master", "declaration", "covenants", "easements", "restrictions", "rules"],
    },
    {
        "id": "by-laws-fgm",
        "title": "By-Laws FGM",
        "filename": "by-laws-fgm.pdf",
        "topics": ["bylaws", "by-laws", "rules", "governance", "fgm"],
    },
]

STOPWORDS = {
    "about",
    "after",
    "also",
    "and",
    "any",
    "are",
    "association",
    "been",
    "being",
    "between",
    "but",
    "can",
    "declaration",
    "each",
    "from",
    "have",
    "herein",
    "into",
    "may",
    "not",
    "shall",
    "such",
    "that",
    "the",
    "their",
    "there",
    "this",
    "with",
    "within",
    "will",
    "you",
    "your",
}


def run(command):
    return subprocess.run(command, check=True, capture_output=True, text=True)


def render_pages(pdf_path, output_dir):
    output_dir.mkdir(parents=True, exist_ok=True)
    prefix = output_dir / "page"
    if not list(output_dir.glob("page-*.png")):
      run([PDFTOPPM, "-r", "240", "-png", str(pdf_path), str(prefix)])
    return sorted(output_dir.glob("page-*.png"))


def ocr_page(image_path):
    result = run(["tesseract", str(image_path), "stdout", "-l", "eng", "--psm", "6"])
    return clean_text(result.stdout)


def clean_text(text):
    text = text.replace("\u2018", "'").replace("\u2019", "'").replace("\u201c", '"').replace("\u201d", '"')
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def tokenize(text):
    words = re.findall(r"[a-z][a-z0-9]{2,}", text.lower())
    return [word for word in words if word not in STOPWORDS]


def make_excerpt(text, max_length=520):
    compact = re.sub(r"\s+", " ", text).strip()
    if len(compact) <= max_length:
        return compact
    return compact[:max_length].rsplit(" ", 1)[0] + "..."


def normalize_vector(counter, vocabulary):
    values = [counter.get(term, 0) for term in vocabulary]
    length = math.sqrt(sum(value * value for value in values)) or 1
    return [round(value / length, 4) for value in values]


def main():
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    chunks = []

    for document in DOCUMENTS:
        pdf_path = PDF_DIR / document["filename"]
        output_dir = TMP_DIR / document["id"]
        pages = render_pages(pdf_path, output_dir)

        for page_index, image_path in enumerate(pages, start=1):
            text_path = output_dir / f"page-{page_index:02d}.txt"
            if text_path.exists():
                text = text_path.read_text()
            else:
                text = ocr_page(image_path)
                text_path.write_text(text)

            if len(text) < 24:
                continue

            tokens = tokenize(text)
            term_counts = Counter(tokens)
            chunks.append(
                {
                    "id": f"{document['id']}-p{page_index}",
                    "documentId": document["id"],
                    "documentTitle": document["title"],
                    "href": f"/acadia-documents/governing/{document['filename']}#page={page_index}",
                    "page": page_index,
                    "text": text,
                    "excerpt": make_excerpt(text),
                    "termCounts": term_counts,
                    "topicTags": document["topics"],
                }
            )

    corpus_counts = Counter()
    document_frequency = Counter()
    for chunk in chunks:
        corpus_counts.update(chunk["termCounts"])
        document_frequency.update(chunk["termCounts"].keys())

    topic_terms = {
        "assessment",
        "articles",
        "board",
        "bylaws",
        "common",
        "corporation",
        "covenants",
        "declaration",
        "directors",
        "easement",
        "easements",
        "election",
        "exhibit",
        "fence",
        "fees",
        "fine",
        "gate",
        "homeowner",
        "insurance",
        "landscape",
        "lot",
        "maintenance",
        "master",
        "meeting",
        "member",
        "notice",
        "parking",
        "plat",
        "property",
        "restriction",
        "restrictions",
        "road",
        "rules",
        "sidewalk",
        "tree",
        "vote",
    }
    top_terms = [
        term
        for term, _ in corpus_counts.most_common(220)
        if document_frequency[term] > 1 and term not in STOPWORDS
    ]
    vocabulary = sorted(set(top_terms[:140]) | topic_terms)

    index_chunks = []
    for chunk in chunks:
        weighted_counts = Counter()
        for term, count in chunk["termCounts"].items():
            if term in vocabulary:
                idf = math.log((1 + len(chunks)) / (1 + document_frequency[term])) + 1
                weighted_counts[term] = count * idf

        index_chunks.append(
            {
                "id": chunk["id"],
                "documentId": chunk["documentId"],
                "documentTitle": chunk["documentTitle"],
                "href": chunk["href"],
                "page": chunk["page"],
                "text": chunk["text"],
                "excerpt": chunk["excerpt"],
                "topicTags": chunk["topicTags"],
                "vector": normalize_vector(weighted_counts, vocabulary),
                "topTerms": [term for term, _ in chunk["termCounts"].most_common(12)],
            }
        )

    OUTPUT_PATH.write_text(
        json.dumps(
            {
                "generatedAt": "2026-06-26",
                "ocrEngine": "tesseract-eng-psm6",
                "chunkUnit": "page",
                "vocabulary": vocabulary,
                "chunks": index_chunks,
            },
            indent=2,
        )
    )
    print(f"Wrote {len(index_chunks)} OCR chunks to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
