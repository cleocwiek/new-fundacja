// Builds a Contentful import file (for `contentful space import`) from
// content/wiedza-articles.json.
//
//   node content/build-contentful-import.mjs [locale] [output] [articles]
//
// locale   – the default locale code of your Contentful space (default "en-US",
//            check it in Contentful: Settings → Locales)
// output   – where to write the file (default content/contentful-import.json)
// articles – which articles file in content/ to import (default
//            wiedza-articles.json)
//
// With the default articles file the "article" content type is created and
// published too. Any other articles file is imported on its own (entries only),
// so the articles already in Contentful are left untouched. Articles are always
// imported as DRAFTS so every one can be reviewed in Contentful before it is
// published on the site.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const CATEGORIES = [
  "Pierwsza pomoc",
  "Jak wspierać bliskich",
  "Zdrowie psychiczne",
  "Ciąża i rodzicielstwo",
  "Higiena cyfrowa",
];

const here = dirname(fileURLToPath(import.meta.url));
const locale = process.argv[2] || "en-US";
const output = process.argv[3] || join(here, "contentful-import.json");
const articlesFile = process.argv[4] || "wiedza-articles.json";
const withContentType = articlesFile === "wiedza-articles.json";

const articles = JSON.parse(readFileSync(join(here, articlesFile), "utf8"));

const badCategory = articles.find((a) => !CATEGORIES.includes(a.category));
if (badCategory) {
  throw new Error(`Unknown category "${badCategory.category}" in ${badCategory.slug}`);
}

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
  JSON.stringify(withContentType ? { contentTypes: [contentType], entries } : { entries }, null, 2) + "\n",
  "utf8"
);
console.log(`Wrote ${entries.length} articles from ${articlesFile} (locale ${locale}) to ${output}`);
