const STOPWORDS = new Set([
  "about",
  "after",
  "also",
  "and",
  "any",
  "are",
  "can",
  "could",
  "does",
  "for",
  "from",
  "have",
  "hoa",
  "how",
  "into",
  "may",
  "not",
  "our",
  "the",
  "their",
  "there",
  "this",
  "through",
  "use",
  "what",
  "when",
  "where",
  "who",
  "with",
  "would",
  "you",
  "your"
]);

const QUERY_EXPANSIONS: Record<string, string[]> = {
  architect: ["architectural", "arc", "approval", "design"],
  architectural: ["architect", "arc", "approval", "design"],
  assessment: ["assessments", "dues", "fees"],
  assessments: ["assessment", "dues", "fees"],
  boat: ["boats", "vehicle", "recreational", "storage"],
  boats: ["boat", "vehicle", "recreational", "storage"],
  bylaw: ["bylaws", "by-laws", "rules"],
  bylaws: ["bylaw", "by-laws", "rules"],
  car: ["vehicle", "vehicles", "parking"],
  commercial: ["business", "truck", "vehicle"],
  driveway: ["parking", "vehicle", "vehicles"],
  fine: ["fines", "violation", "hearing", "enforcement"],
  fines: ["fine", "violation", "hearing", "enforcement"],
  landscaping: ["landscape", "trees", "plants", "maintenance"],
  lease: ["leasing", "rental", "rent", "tenant"],
  leasing: ["lease", "rental", "rent", "tenant"],
  meeting: ["meetings", "notice", "board", "members"],
  meetings: ["meeting", "notice", "board", "members"],
  noise: ["nuisance", "quiet", "disturbance"],
  paint: ["color", "colors", "architectural", "approval"],
  parking: ["park", "vehicle", "vehicles", "street", "driveway"],
  pet: ["pets", "animal", "animals"],
  pets: ["pet", "animal", "animals"],
  rental: ["rentals", "lease", "leasing", "tenant"],
  rentals: ["rental", "lease", "leasing", "tenant"],
  rv: ["recreational", "vehicle", "camper", "motorhome", "trailer"],
  tree: ["trees", "landscape", "landscaping", "plants"],
  trees: ["tree", "landscape", "landscaping", "plants"],
  violation: ["violations", "fine", "fines", "hearing", "enforcement"],
  vote: ["votes", "voting", "member", "members"],
  voting: ["vote", "votes", "member", "members"]
};

export function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function tokenize(value: string) {
  return normalizeText(value)
    .split(" ")
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));
}

export function expandQuery(question: string) {
  const terms = tokenize(question);
  const expandedTerms = new Set<string>();

  for (const term of terms) {
    expandedTerms.add(term);
    for (const expansion of QUERY_EXPANSIONS[term] || []) {
      expandedTerms.add(expansion);
    }
  }

  return Array.from(expandedTerms).join(" ");
}

export function keywordOverlapScore(question: string, text: string) {
  const questionTerms = new Set(tokenize(expandQuery(question)));
  const textTerms = new Set(tokenize(text));
  let matches = 0;

  for (const term of questionTerms) {
    if (textTerms.has(term)) {
      matches += 1;
    }
  }

  return questionTerms.size ? matches / questionTerms.size : 0;
}

export function cleanChunkText(text: string) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\b(CL|ORBK|ORBKI|OR|Bk|P61)\b[\w\s/.-]{0,80}/gi, " ")
    .replace(/\bPrepared by and return to:[\w\s,.-]{0,160}/gi, " ")
    .trim();
}
