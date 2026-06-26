import type { AcadiaGoverningDocument } from "@/types/acadia";

export const acadiaGoverningDocuments: AcadiaGoverningDocument[] = [
  {
    id: "amendment-to-master-declaration",
    title: "Amendment to Master Declaration",
    href: "/acadia-documents/governing/amendment-to-master-declaration.pdf",
    fileType: "PDF",
    summary: "Amendment document related to the master declaration.",
    topicTags: ["amendment", "master", "declaration", "covenants", "restrictions"]
  },
  {
    id: "plat-book-document",
    title: "Plat Book Document",
    href: "/acadia-documents/governing/plat-book-document.pdf",
    fileType: "PDF",
    summary: "Recorded plat reference for the community or property layout.",
    topicTags: ["plat", "map", "layout", "property", "lots", "recorded"]
  },
  {
    id: "articles-of-incorporation-wp-2002",
    title: "Articles of Incorporation of WP - 2002",
    href: "/acadia-documents/governing/articles-of-incorporation-wp-2002.pdf",
    fileType: "PDF",
    summary: "Wyndham Pointe incorporation document from 2002.",
    topicTags: ["articles", "incorporation", "wyndham", "pointe", "corporation", "2002"]
  },
  {
    id: "acadia-estates-by-laws-exhibit-b",
    title: "Acadia Estates By-Laws Exhibit B",
    href: "/acadia-documents/governing/acadia-estates-by-laws-exhibit-b.pdf",
    fileType: "PDF",
    summary: "By-laws exhibit for Acadia Estates.",
    topicTags: ["bylaws", "by-laws", "rules", "governance", "board", "exhibit"]
  },
  {
    id: "acadia-estates-articles-of-incorporation-exhibit-a",
    title: "Acadia Estates Articles of Incorporation Exhibit A",
    href: "/acadia-documents/governing/acadia-estates-articles-of-incorporation-exhibit-a.pdf",
    fileType: "PDF",
    summary: "Articles of incorporation exhibit for Acadia Estates.",
    topicTags: ["articles", "incorporation", "acadia", "estates", "corporation", "exhibit"]
  },
  {
    id: "exhibit-a",
    title: "Exhibit A",
    href: "/acadia-documents/governing/exhibit-a.pdf",
    fileType: "PDF",
    summary: "Short exhibit document from the HOA governing document set.",
    topicTags: ["exhibit", "attachment", "governing"]
  },
  {
    id: "amendment-to-acadia-estates-2003",
    title: "Amendment to Acadia Estates - 2003",
    href: "/acadia-documents/governing/amendment-to-acadia-estates-2003.pdf",
    fileType: "PDF",
    summary: "2003 amendment related to Acadia Estates.",
    topicTags: ["amendment", "acadia", "estates", "2003", "governing"]
  },
  {
    id: "wyndham-pointe-declaration",
    title: "Wyndham Pointe Declaration",
    href: "/acadia-documents/governing/wyndham-pointe-declaration.pdf",
    fileType: "PDF",
    summary: "Declaration document for Wyndham Pointe.",
    topicTags: ["declaration", "wyndham", "pointe", "covenants", "restrictions"]
  },
  {
    id: "master-declaration-covenants-easements-restrictions",
    title: "Master Declaration of Covenants, Easements & Restrictions",
    href: "/acadia-documents/governing/master-declaration-covenants-easements-restrictions.pdf",
    fileType: "PDF",
    summary: "Master declaration covering covenants, easements, and restrictions.",
    topicTags: ["master", "declaration", "covenants", "easements", "restrictions", "rules"]
  },
  {
    id: "by-laws-fgm",
    title: "By-Laws FGM",
    href: "/acadia-documents/governing/by-laws-fgm.pdf",
    fileType: "PDF",
    summary: "By-laws document associated with FGM.",
    topicTags: ["bylaws", "by-laws", "rules", "governance", "fgm"]
  }
];

export const acadiaGoverningRelatedDocuments = acadiaGoverningDocuments.map(
  ({ title, href, fileType }) => ({ title, href, fileType })
);
