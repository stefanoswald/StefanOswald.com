#!/usr/bin/env python3
import hashlib
import json
import os
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PDF_DIR = ROOT / "public" / "acadia-documents" / "governing"
TMP_DIR = ROOT / "tmp" / "acadia-rag"
OUTPUT_PATH = TMP_DIR / "chunks.json"
PDFTOPPM = os.environ.get(
    "PDFTOPPM",
    "/Users/stefanoswald/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pdftoppm",
)

DOCUMENTS = [
    ("amendment-to-master-declaration", "Amendment to Master Declaration", "amendment-to-master-declaration.pdf"),
    ("plat-book-document", "Plat Book Document", "plat-book-document.pdf"),
    ("articles-of-incorporation-wp-2002", "Articles of Incorporation of WP - 2002", "articles-of-incorporation-wp-2002.pdf"),
    ("acadia-estates-by-laws-exhibit-b", "Acadia Estates By-Laws Exhibit B", "acadia-estates-by-laws-exhibit-b.pdf"),
    ("acadia-estates-articles-of-incorporation-exhibit-a", "Acadia Estates Articles of Incorporation Exhibit A", "acadia-estates-articles-of-incorporation-exhibit-a.pdf"),
    ("exhibit-a", "Exhibit A", "exhibit-a.pdf"),
    ("amendment-to-acadia-estates-2003", "Amendment to Acadia Estates - 2003", "amendment-to-acadia-estates-2003.pdf"),
    ("wyndham-pointe-declaration", "Wyndham Pointe Declaration", "wyndham-pointe-declaration.pdf"),
    ("master-declaration-covenants-easements-restrictions", "Master Declaration of Covenants, Easements & Restrictions", "master-declaration-covenants-easements-restrictions.pdf"),
    ("by-laws-fgm", "By-Laws FGM", "by-laws-fgm.pdf"),
]


def run(command):
    return subprocess.run(command, check=True, capture_output=True, text=True)


def render_pages(pdf_path, output_dir):
    output_dir.mkdir(parents=True, exist_ok=True)
    prefix = output_dir / "page"
    if not list(output_dir.glob("page-*.png")):
        run([PDFTOPPM, "-r", "300", "-png", str(pdf_path), str(prefix)])
    return sorted(output_dir.glob("page-*.png"))


def ocr_page(image_path, text_path):
    if text_path.exists():
        return text_path.read_text()

    result = run(["tesseract", str(image_path), "stdout", "-l", "eng", "--psm", "6"])
    text = clean_text(result.stdout)
    text_path.write_text(text)
    return text


def clean_text(text):
    text = text.replace("\u2018", "'").replace("\u2019", "'").replace("\u201c", '"').replace("\u201d", '"')
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def page_quality(text):
    warnings = []
    words = re.findall(r"[A-Za-z]{2,}", text)
    weird = re.findall(r"[^A-Za-z0-9\s.,;:!?$%&'\"()/#-]", text)
    short_lines = [line for line in text.splitlines() if 0 < len(line.strip()) < 4]

    if len(words) < 35:
        warnings.append("very_few_words")
    if len(weird) > max(12, len(text) * 0.015):
        warnings.append("many_unusual_characters")
    if len(short_lines) > 18:
        warnings.append("many_short_ocr_lines")
    if re.search(r"(\w)\1{6,}", text):
        warnings.append("repeated_character_noise")

    if "very_few_words" in warnings or len(warnings) >= 3:
        return "poor", warnings
    if warnings:
        return "review", warnings
    return "good", warnings


def split_logical_blocks(text):
    lines = [line.strip() for line in text.splitlines()]
    blocks = []
    current = []

    for line in lines:
        if not line:
            if current:
                blocks.append(" ".join(current))
                current = []
            continue

        if is_heading(line) and current:
            blocks.append(" ".join(current))
            current = [line]
        else:
            current.append(line)

    if current:
        blocks.append(" ".join(current))

    return [block for block in blocks if len(block) > 40]


def is_heading(line):
    return bool(
        re.match(r"^(article|section|subsection)\b", line, re.I)
        or re.match(r"^\d+(\.\d+)*\s+[-A-Z]", line)
        or re.match(r"^[A-Z][A-Z\s,&()/-]{8,}$", line)
    )


def estimate_tokens(text):
    return max(1, round(len(re.findall(r"\S+", text)) * 1.25))


def chunk_blocks(blocks, min_tokens=300, max_tokens=600, overlap_tokens=80):
    chunks = []
    current = []
    current_tokens = 0

    for block in blocks:
        block_tokens = estimate_tokens(block)

        if current and current_tokens + block_tokens > max_tokens:
            chunks.append(" ".join(current))
            overlap = []
            overlap_count = 0

            for previous in reversed(current):
                overlap.insert(0, previous)
                overlap_count += estimate_tokens(previous)
                if overlap_count >= overlap_tokens:
                    break

            current = overlap
            current_tokens = overlap_count

        current.append(block)
        current_tokens += block_tokens

        if current_tokens >= min_tokens:
            chunks.append(" ".join(current))
            current = []
            current_tokens = 0

    if current:
        chunks.append(" ".join(current))

    return chunks


def extract_structure(text, previous):
    article = previous.get("article")
    section = previous.get("section")
    subsection = previous.get("subsection")
    article_match = re.search(r"\bArticle\s+([IVXLC\d]+)[\s:.-]+([^.;\n]{0,90})", text, re.I)
    section_match = re.search(r"\bSection\s+([A-Z\d.]+)[\s:.-]+([^.;\n]{0,100})", text, re.I)
    numbered_match = re.search(r"\b(\d+(?:\.\d+)*)[\s:.-]+([A-Z][^.;\n]{8,100})", text)

    if article_match:
        article = f"Article {article_match.group(1)} {article_match.group(2).strip()}".strip()
    if section_match:
        section = f"Section {section_match.group(1)} {section_match.group(2).strip()}".strip()
    elif numbered_match:
        section = f"{numbered_match.group(1)} {numbered_match.group(2).strip()}".strip()

    subsection_match = re.search(r"\(([a-zA-Z]|\d+)\)\s+([^.;\n]{8,100})", text)
    if subsection_match:
        subsection = f"({subsection_match.group(1)}) {subsection_match.group(2).strip()}".strip()

    return {"article": article, "section": section, "subsection": subsection}


def checksum(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    documents = []
    chunks = []

    for document_id, document_name, file_name in DOCUMENTS:
        pdf_path = PDF_DIR / file_name
        document_dir = TMP_DIR / document_id
        pages = render_pages(pdf_path, document_dir)
        documents.append(
            {
                "documentId": document_id,
                "documentName": document_name,
                "fileName": file_name,
                "href": f"/acadia-documents/governing/{file_name}",
                "checksum": checksum(pdf_path),
                "pageCount": len(pages),
            }
        )

        previous_structure = {"article": None, "section": None, "subsection": None}

        for page_index, image_path in enumerate(pages, start=1):
            text_path = document_dir / f"page-{page_index:02d}.txt"
            text = ocr_page(image_path, text_path)
            quality, warnings = page_quality(text)

            if quality == "poor":
                chunks.append(
                    {
                        "chunkId": f"{document_id}-p{page_index}-poor-ocr",
                        "documentId": document_id,
                        "documentName": document_name,
                        "fileName": file_name,
                        "href": f"/acadia-documents/governing/{file_name}#page={page_index}",
                        "page": page_index,
                        "article": previous_structure["article"],
                        "section": previous_structure["section"],
                        "subsection": previous_structure["subsection"],
                        "text": text[:1200],
                        "tokenCount": estimate_tokens(text),
                        "ocrQuality": quality,
                        "ocrWarnings": warnings,
                    }
                )
                continue

            blocks = split_logical_blocks(text)
            page_chunks = chunk_blocks(blocks)

            for chunk_index, chunk_text in enumerate(page_chunks, start=1):
                previous_structure = extract_structure(chunk_text, previous_structure)
                chunks.append(
                    {
                        "chunkId": f"{document_id}-p{page_index}-c{chunk_index}",
                        "documentId": document_id,
                        "documentName": document_name,
                        "fileName": file_name,
                        "href": f"/acadia-documents/governing/{file_name}#page={page_index}",
                        "page": page_index,
                        "article": previous_structure["article"],
                        "section": previous_structure["section"],
                        "subsection": previous_structure["subsection"],
                        "text": chunk_text,
                        "tokenCount": estimate_tokens(chunk_text),
                        "ocrQuality": quality,
                        "ocrWarnings": warnings,
                    }
                )

    OUTPUT_PATH.write_text(json.dumps({"documents": documents, "chunks": chunks}, indent=2))
    print(f"Wrote {len(chunks)} chunks to {OUTPUT_PATH}")
    print(f"Flagged {sum(1 for chunk in chunks if chunk['ocrQuality'] != 'good')} chunks for OCR review")


if __name__ == "__main__":
    main()
