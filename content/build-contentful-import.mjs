// Builds a Contentful import file (for `contentful space import`) from
// content/wiedza-articles.json.
//
//   node content/build-contentful-import.mjs [locale] [output]
//
// locale  – the default locale code of your Contentful space (default "en-US",
//           check it in Contentful: Settings → Locales)
// output  – where to write the file (default content/contentful-import.json)
//
// The "article" content type is created and published by the import; the
// articles themselves are imported as DRAFTS so every one can be reviewed in
// Contentful before it is published on the site.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const locale = process.argv[2] || "en-US";
const output = process.argv[3] || join(here, "contentful-import.json");

const articles = JSON.parse(readFileSync(join(here, "wiedza-articles.json"), "utf8"));

export const CATEGORIES = [
  "Pierwsza pomoc",
  "Jak wspierać bliskich",
  "Zdrowie psychiczne",
  "Ciąża i rodzicielstwo",
  "Higiena cyfrowa",
];

const field = (id, name, type, extra = {}) => ({
  id,
  name,
  type,
  localized: false,
  required: false,
  validations: [],
  disabled: false,
  omitted: false,
  ...extra,
});

const contentType = {
  sys: { id: "article", type: "ContentType", publishedVersion: 1 },
  name: "Artykuł (Wiedza)",
  description: "Artykuł do bazy wiedzy na stronie wiedza.html",
  displayField: "title",
  fields: [
    field("title", "Tytuł", "Symbol", { required: true }),
    field("slug", "Slug (adres)", "Symbol", {
      required: true,
      validations: [
        { unique: true },
        { regexp: { pattern: "^[a-z0-9-]+$" }, message: "Tylko małe litery bez polskich znaków, cyfry i myślniki" },
      ],
    }),
    field("category", "Kategoria", "Symbol", {
      required: true,
      validations: [{ in: CATEGORIES }],
    }),
    field("excerpt", "Zajawka (krótki opis)", "Text", {
      required: true,
      validations: [{ size: { max: 300 } }],
    }),
    field("body", "Treść (Markdown)", "Text", { required: true }),
    field("tags", "Słowa kluczowe (do wyszukiwarki)", "Array", {
      items: { type: "Symbol", validations: [] },
    }),
    field("date", "Data", "Date", { required: true }),
    field("source", "Na podstawie (nazwa materiału)", "Symbol"),
    field("sourceUrl", "Na podstawie (link)", "Symbol"),
  ],
};

const loc = (value) => ({ [locale]: value });

const entries = articles.map((a) => ({
  sys: {
    id: "wiedza-" + a.slug,
    type: "Entry",
    contentType: { sys: { type: "Link", linkType: "ContentType", id: "article" } },
  },
  fields: {
    title: loc(a.title),
    slug: loc(a.slug),
    category: loc(a.category),
    excerpt: loc(a.excerpt),
    body: loc(a.body),
    tags: loc(a.tags),
    date: loc(a.date),
    ...(a.source ? { source: loc(a.source) } : {}),
    ...(a.sourceUrl ? { sourceUrl: loc(a.sourceUrl) } : {}),
  },
}));

writeFileSync(
  output,
  JSON.stringify({ contentTypes: [contentType], entries }, null, 2) + "\n",
  "utf8"
);
console.log(`Wrote ${entries.length} articles (locale ${locale}) to ${output}`);
