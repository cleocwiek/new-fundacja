// Reads the Można Zwariować podcast RSS feed and writes podcast-episodes.json,
// which the Wiedza page and the search bar load next to the Contentful articles.
//
//   node podcast/fetch-podcast.mjs [feed.xml]
//
// Without an argument the feed is downloaded from FEED_URL; with a path it is
// read from that file (handy for testing). Keywords added by hand in
// content/podcast-keywords.json (episode guid → list of keywords) are merged in,
// so episodes can be found by topics their description doesn't name word for
// word. Run by .github/workflows/podcast-update.yml every day.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FEED_URL = "https://anchor.fm/s/3a1db750/podcast/rss";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "podcast-episodes.json");
const keywordsFile = join(root, "content", "podcast-keywords.json");

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code) => {
    if (code[0] === "#") {
      const n = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : match;
    }
    return ENTITIES[code.toLowerCase()] ?? match;
  });
}

function unwrapCdata(text) {
  return text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
}

function tag(xml, name) {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return m ? unwrapCdata(m[1]).trim() : "";
}

function attr(xml, name, attribute) {
  const m = xml.match(new RegExp(`<${name}\\s[^>]*${attribute}="([^"]*)"`, "i"));
  return m ? decodeEntities(m[1]) : "";
}

const httpsOnly = (url) => (/^https?:\/\//i.test(url) ? url : "");

// Episode description (HTML) → the simple Markdown the site already renders:
// paragraphs, "- " lists and [links](https://...). Everything is escaped again
// in the browser, so nothing from the feed can inject HTML into the page.
function htmlToMarkdown(html) {
  let text = html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
    .replace(/<(b|strong)>([\s\S]*?)<\/\1>/gi, (_, t, inner) => {
      const clean = inner.replace(/<[^>]+>/g, "").trim();
      return clean ? `**${clean}**` : "";
    })
    .replace(/<a\s[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, label) => {
      const url = httpsOnly(decodeEntities(href).trim());
      const clean = label.replace(/<[^>]+>/g, "").trim();
      if (!url) return clean;
      return clean && clean !== url ? `[${clean}](${url})` : url;
    })
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n- ")
    .replace(/<\/(p|div|ul|ol|h\d)>/gi, "\n\n")
    .replace(/<[^>]+>/g, "");
  text = decodeEntities(text)
    .replace(/[\u200b-\u200d\u2060\ufeff\u00ad]/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  // bare links → [url](url) so the site shows them as links; links that
  // already are [label](url) are set aside first so they aren't wrapped twice
  const kept = [];
  text = text.replace(/\[[^\]]*\]\(\s*https?:\/\/[^\s)]+\s*\)/g, (link) => `\u0000${kept.push(link.replace(/\(\s+/, "(").replace(/\s+\)$/, ")")) - 1}\u0000`);
  text = text.replace(/https?:\/\/[^\s)\]<>"]+/g, (url) => {
    const clean = url.replace(/[.,;:!?]+$/, "");
    return `[${clean}](${clean})` + url.slice(clean.length);
  });
  return text.replace(/\u0000(\d+)\u0000/g, (_, i) => kept[i]);
}

// Most descriptions end with the same block (Autopromocja: Poradnia, books,
// Patronite, where to find us, social links). It says nothing about the
// episode and would make every episode match searches like "emocje", so
// everything from the start of that block onwards is left out.
const PROMO = new RegExp(
  [
    "#?autopromocja",
    "dziękujemy za wasze wsparcie",
    "(?:posłuchajcie i )?podzielcie się swoimi wrażeniami",
    "możecie podzielić się swoimi wrażeniami",
    "jeśli chcecie podzielić się swoimi refleksjami",
    "szukajcie nas",
    "znajdźcie nas",
    "znajdziesz nas",
    "aplikacja do medytacji cleo",
    "książka ani:",
    "książka cleo:",
    "pierścionek ?wishbone",
  ].join("|"),
  "i"
);

function withoutPromo(markdown) {
  return markdown
    .split(/(?:^|\n)\s*_{3,}\s*(?:\n|$)/)
    .map((part) => {
      const m = part.match(PROMO);
      return (m ? part.slice(0, m.index) : part).trim();
    })
    .filter(Boolean)
    .join("\n\n");
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");
}

async function loadFeed() {
  const file = process.argv[2];
  if (file) return readFileSync(file, "utf8");
  const res = await fetch(FEED_URL, { headers: { "User-Agent": "moznazwariowac-site/1.0" } });
  if (!res.ok) throw new Error(`Feed HTTP ${res.status}`);
  return res.text();
}

const xml = await loadFeed();
const keywords = existsSync(keywordsFile) ? JSON.parse(readFileSync(keywordsFile, "utf8")) : {};
const items = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || [];
const usedSlugs = new Set();

const episodes = items
  .map((item) => {
    const title = decodeEntities(tag(item, "title"));
    const guid = decodeEntities(tag(item, "guid"));
    const html = tag(item, "content:encoded") || tag(item, "description");
    const pub = new Date(tag(item, "pubDate"));
    return {
      guid,
      title,
      number: parseInt(tag(item, "itunes:episode"), 10) || null,
      date: Number.isNaN(pub.getTime()) ? "" : pub.toISOString().slice(0, 10),
      link: httpsOnly(decodeEntities(tag(item, "link"))),
      audio: httpsOnly(attr(item, "enclosure", "url")),
      description: withoutPromo(htmlToMarkdown(html)),
      tags: Array.isArray(keywords[guid]) ? keywords[guid] : [],
    };
  })
  .filter((ep) => ep.title && ep.guid)
  .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
  .map((ep) => {
    const base = "podcast-" + (slugify(ep.title) || "odcinek");
    let slug = base;
    for (let n = 2; usedSlugs.has(slug); n++) slug = base + "-" + n;
    usedSlugs.add(slug);
    return { slug, ...ep };
  });

if (!episodes.length) {
  throw new Error("No episodes found in the feed – leaving podcast-episodes.json unchanged");
}

writeFileSync(output, JSON.stringify({ episodes }, null, 1) + "\n", "utf8");
const tagged = episodes.filter((ep) => ep.tags.length).length;
console.log(`Wrote ${episodes.length} episodes (${tagged} with keywords) to podcast-episodes.json`);
