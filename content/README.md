# Wiedza + Contentful

The Wiedza page (`wiedza.html`) and the search on the home page read articles
from Contentful. Until `contentful-config.js` is filled in, the site shows the
sample articles built into `posts-data.js`.

## Files

- `wiedza-articles.json` – the 62 articles for the first import: 56 written from
  the foundation's four brochures plus the 6 original sample articles
- `wiedza-artykuly-do-przegladu.md` – the same articles as one readable document
  for review, with a list of points to check
- `wiedza-przewodnik-po-zaburzeniach.json` – 14 more articles (Zdrowie
  psychiczne) from the campaign's "Przewodnik po zaburzeniach psychicznych";
  `przewodnik-artykuly-do-przegladu.md` is the review document for them
- `build-contentful-import.mjs` – turns `wiedza-articles.json` into a Contentful
  import file (`contentful-import.json`, locale `en-US`)
- `../.github/workflows/contentful-import.yml` – GitHub Action that runs the import

## One-time setup

1. **Contentful → Settings → General settings**: copy the **Space ID**.
2. **Contentful → Settings → Locales**: note the default locale code (usually `en-US`).
3. **Contentful → Settings → CMA tokens → Create personal access token**: copy the
   token (it is shown only once). Keep it private – never paste it into the site
   or a chat.
4. **GitHub → repository Settings → Secrets and variables → Actions → New
   repository secret**, add:
   - `CONTENTFUL_SPACE_ID` – the Space ID
   - `CONTENTFUL_MANAGEMENT_TOKEN` – the CMA token
5. **GitHub → Actions → "Import artykułów do Contentful" → Run workflow**, enter the
   locale from step 2, run. It creates the "Artykuł (Wiedza)" content type and
   imports all articles **as drafts**.
6. **Contentful → Content**: review the articles, then publish them (one by one, or
   select several → Publish). Only published articles appear on the site.
7. **Contentful → Settings → API keys → Add API key**: copy the **Space ID** and the
   **Content Delivery API – access token** into `contentful-config.js`
   (`spaceId`, `deliveryToken`). This token is read-only and is meant to be public.
8. Optional: delete the CMA token from step 3 once the import is done.

Do not run the import workflow with `wiedza-articles.json` again after editing
articles in Contentful – it overwrites the imported articles with the versions
from that file.

## Importing the Przewodnik articles

GitHub → Actions → "Import artykułów do Contentful" → Run workflow → locale as
before, articles file `wiedza-przewodnik-po-zaburzeniach.json` → Run. It only
adds these 14 articles as drafts (no other article or the content type is
changed). Review and publish them in Contentful. The CMA token secret must still
be valid – if you deleted it, create a new one and update the
`CONTENTFUL_MANAGEMENT_TOKEN` secret first.

## Adding an article later

Contentful → Content → Add entry → **Artykuł (Wiedza)** → fill in the fields →
Publish. It shows up on the site right away, no code change needed.

Body text uses simple Markdown:

- empty line = new paragraph
- `**bold**`, `*italic*`
- lines starting with `- ` = bullet list
- `### ` = subheading
- `[link text](https://...)`

The note that articles are educational and not a substitute for a specialist is
added automatically under every article.

## Podcast episodes

The Wiedza page and the search also show every podcast episode (category
"Podcast"). They are not in Contentful – they come from the podcast's RSS feed
(`https://anchor.fm/s/3a1db750/podcast/rss`):

- `.github/workflows/podcast-update.yml` runs every morning (and on demand:
  Actions → "Aktualizacja odcinków podcastu" → Run workflow). It runs
  `podcast/fetch-podcast.mjs`, which saves all episodes to
  `podcast-episodes.json`, and commits the file when something changed. New
  episodes appear on the site on their own, usually by the next morning.
- `content/podcast-keywords.json` holds extra search keywords per episode
  (episode guid → list of words), so an episode can be found by topics its
  description doesn't name word for word. Editing it on `main` re-runs the job.
