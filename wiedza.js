/* Wiedza page: renders the post grid, category filters, and single-post
   detail view based on URL query params (?q=, ?category=, ?post=).
   Articles come from posts-data.js, which loads them from Contentful
   (or uses its built-in sample posts when Contentful isn't configured)
   together with the podcast episodes from podcast-episodes.json;
   rendering waits for `wiedzaReady`. */
(function () {
  const heroSection = document.querySelector(".wiedza-hero");
  const tagsBar = document.getElementById("wiedzaTags");
  const gridSection = document.getElementById("wiedzaGridSection");
  const grid = document.getElementById("wiedzaGrid");
  const postSection = document.getElementById("wiedzaPostSection");
  const searchInput = document.getElementById("wiedzaSearchInput");
  const PAGE_SIZE = 24;
  const YOUTUBE_URL = "https://www.youtube.com/@moznazwariowac";
  const SPOTIFY_SHOW_URL = "https://open.spotify.com/show/7yq7L2H5VwxzbtKMXawCY4";

  if (!grid || typeof wiedzaReady === "undefined") return;


  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : str;
    return div.innerHTML;
  }


  function getParams() {
    return new URLSearchParams(window.location.search);
  }

  function isPodcast(post) {
    return !!post.podcast;
  }

  function renderCard(post) {
    const href = "wiedza.html?post=" + encodeURIComponent(post.slug);
    const linkText = isPodcast(post) ? "Posłuchaj odcinka →" : "Czytaj więcej →";
    return (
      '<article class="wiedza-card">' +
      '<p class="wiedza-card-category ' + wiedzaCategoryClass(post.category) + '">' + escapeHtml(post.category) + "</p>" +
      '<h3><a href="' + href + '">' + escapeHtml(post.title) + "</a></h3>" +
      "<p>" + escapeHtml(post.excerpt) + "</p>" +
      '<a class="wiedza-card-link" href="' + href + '">' + linkText + "</a>" +
      "</article>"
    );
  }

  function shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = list[i]; list[i] = list[j]; list[j] = tmp;
    }
    return list;
  }

  // Random order that spreads every article category evenly through the
  // list: each category is shuffled, then its posts get evenly spaced
  // positions (with a random offset) and all posts are sorted by position.
  function mixedArticles(posts) {
    const byCategory = {};
    posts.forEach(function (post) {
      (byCategory[post.category] = byCategory[post.category] || []).push(post);
    });
    const placed = [];
    Object.keys(byCategory).forEach(function (category) {
      const group = shuffle(byCategory[category]);
      group.forEach(function (post, i) {
        placed.push({ post: post, key: (i + Math.random()) / group.length });
      });
    });
    placed.sort(function (a, b) { return a.key - b.key; });
    return placed.map(function (item) { return item.post; });
  }

  // There are many more podcast episodes than articles, so instead of
  // spreading them evenly, one random episode follows every two articles;
  // the remaining episodes come after the articles.
  function mixedOrder(posts) {
    const articles = mixedArticles(posts.filter(function (p) { return !isPodcast(p); }));
    const episodes = shuffle(posts.filter(isPodcast));
    const mixed = [];
    articles.forEach(function (post, i) {
      mixed.push(post);
      if (i % 2 === 1 && episodes.length) mixed.push(episodes.shift());
    });
    return mixed.concat(episodes);
  }

  function newestFirst(posts) {
    return posts.slice().sort(function (a, b) {
      return (b.date || "").localeCompare(a.date || "");
    });
  }

  let mixedPosts = null;
  let shownPosts = [];
  let shownCount = 0;

  // Coming back to the list (back button or swipe) shows it exactly as it
  // was left: same order, same number of cards, same scroll position.
  const navEntry = performance.getEntriesByType ? performance.getEntriesByType("navigation")[0] : null;
  const cameBack = !!navEntry && navEntry.type === "back_forward";

  function remember(key, value) {
    try { sessionStorage.setItem("wiedza-" + key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
  }

  function recall(key) {
    try { return JSON.parse(sessionStorage.getItem("wiedza-" + key)); } catch (e) { return null; }
  }

  function listOrder(posts) {
    const saved = cameBack ? recall("order") : null;
    if (Array.isArray(saved)) {
      const bySlug = {};
      posts.forEach(function (post) { bySlug[post.slug] = post; });
      const ordered = saved.map(function (slug) { return bySlug[slug]; }).filter(Boolean);
      const known = {};
      ordered.forEach(function (post) { known[post.slug] = true; });
      if (ordered.length) {
        return ordered.concat(posts.filter(function (post) { return !known[post.slug]; }));
      }
    }
    const order = mixedOrder(posts);
    remember("order", order.map(function (post) { return post.slug; }));
    return order;
  }

  function renderMore(count) {
    const next = shownPosts.slice(shownCount, shownCount + (count || PAGE_SIZE));
    shownCount += next.length;
    const oldButton = grid.querySelector(".wiedza-more");
    if (oldButton) oldButton.remove();
    grid.insertAdjacentHTML("beforeend", next.map(renderCard).join(""));
    if (shownCount < shownPosts.length) {
      grid.insertAdjacentHTML(
        "beforeend",
        '<div class="wiedza-more"><button type="button" class="cta-button">Pokaż więcej</button></div>'
      );
      grid.querySelector(".wiedza-more button").addEventListener("click", function () {
        renderMore();
      });
    }
    remember("shown", { key: location.search, count: shownCount });
  }

  function renderGrid(query, category) {
    if (!mixedPosts) mixedPosts = listOrder(WIEDZA_POSTS);
    let posts = query ? wiedzaSearch(query) : mixedPosts.slice();
    if (category) {
      posts = posts.filter(function (post) {
        return post.category === category;
      });
      if (!query && category === WIEDZA_PODCAST_CATEGORY) posts = newestFirst(posts);
    }

    if (WIEDZA_LOAD_ERROR && !WIEDZA_POSTS.length) {
      grid.innerHTML =
        '<p class="wiedza-empty">Nie udało się wczytać artykułów. Odśwież stronę za chwilę.</p>';
      return;
    }

    if (!posts.length) {
      grid.innerHTML =
        '<p class="wiedza-empty">Nie znaleźliśmy wyników pasujących do „' +
        escapeHtml(query || category) +
        '”. Spróbuj innego hasła.</p>';
      return;
    }

    grid.innerHTML = "";
    shownPosts = posts;
    shownCount = 0;
    const shown = cameBack ? recall("shown") : null;
    renderMore(shown && shown.key === location.search ? Math.max(shown.count, PAGE_SIZE) : PAGE_SIZE);

    const scroll = cameBack ? recall("scroll") : null;
    if (scroll && scroll.key === location.search) {
      const html = document.documentElement;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, scroll.y);
      html.style.scrollBehavior = "";
    }
  }

  window.addEventListener("pagehide", function () {
    if (gridSection && gridSection.style.display !== "none") {
      remember("scroll", { key: location.search, y: window.scrollY });
    }
  });

  function renderTags(activeCategory) {
    if (!tagsBar) return;
    const categories = [];
    WIEDZA_POSTS.forEach(function (post) {
      if (categories.indexOf(post.category) === -1) categories.push(post.category);
    });
    categories.sort(function (a, b) {
      return wiedzaCategoryRank(a) - wiedzaCategoryRank(b);
    });

    let html =
      '<button type="button" class="wiedza-tag' +
      (!activeCategory ? " active" : "") +
      '" data-category="">Wszystkie</button>';

    categories.forEach(function (category) {
      html +=
        '<button type="button" class="wiedza-tag ' + wiedzaCategoryClass(category) +
        (activeCategory === category ? " active" : "") +
        '" data-category="' +
        escapeHtml(category) +
        '">' +
        escapeHtml(category) +
        "</button>";
    });

    tagsBar.innerHTML = html;

    tagsBar.querySelectorAll(".wiedza-tag").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const category = btn.getAttribute("data-category");
        const params = getParams();
        params.delete("post");
        if (category) {
          params.set("category", category);
        } else {
          params.delete("category");
        }
        const qs = params.toString();
        window.location.href = "wiedza.html" + (qs ? "?" + qs : "");
      });
    });
  }

  function showGrid() {
    if (postSection) postSection.style.display = "none";
    if (gridSection) gridSection.style.display = "block";
    if (heroSection) heroSection.style.display = "flex";
    if (tagsBar) tagsBar.style.display = "flex";
  }

  function renderPost(slug) {
    const post = WIEDZA_POSTS.find(function (p) {
      return p.slug === slug;
    });

    if (!post || !postSection) {
      showGrid();
      renderGrid("", "");
      return;
    }

    const bodyHtml = post.bodyHtml
      ? post.bodyHtml
      : (post.body || [])
          .map(function (paragraph) {
            return "<p>" + paragraph + "</p>";
          })
          .join("");

    const podcastHtml = isPodcast(post)
      ? '<div class="wiedza-podcast">' +
        (post.podcast.audio
          ? '<audio controls preload="none" src="' + escapeHtml(post.podcast.audio) + '"></audio>'
          : "") +
        '<div class="wiedza-podcast-links">' +
        '<a class="cta-button" href="' + escapeHtml(post.podcast.link || SPOTIFY_SHOW_URL) +
        '" target="_blank" rel="noopener">Słuchaj na Spotify</a>' +
        '<a class="cta-button wiedza-podcast-youtube" href="' + YOUTUBE_URL +
        '" target="_blank" rel="noopener">Podcast na YouTube</a>' +
        "</div></div>"
      : "";

    const sourceHtml = post.source
      ? '<p class="wiedza-post-source">Na podstawie: ' +
        (post.sourceUrl && /^https?:\/\//.test(post.sourceUrl)
          ? '<a href="' + escapeHtml(post.sourceUrl) + '" target="_blank" rel="noopener">' + escapeHtml(post.source) + "</a>"
          : escapeHtml(post.source)) +
        "</p>"
      : "";

    const tagsHtml = (post.tags || [])
      .map(function (tag) {
        return '<span class="wiedza-post-tag">' + escapeHtml(tag) + "</span>";
      })
      .join("");

    postSection.innerHTML =
      '<a class="wiedza-back-link" href="wiedza.html">← Wróć do wiedzy</a>' +
      '<a class="wiedza-card-category wiedza-post-category ' + wiedzaCategoryClass(post.category) +
      '" href="wiedza.html?category=' + encodeURIComponent(post.category) + '">' +
      escapeHtml(post.category) + "</a>" +
      "<h1>" + escapeHtml(post.title) + "</h1>" +
      podcastHtml +
      '<div class="wiedza-post-body">' + bodyHtml + "</div>" +
      '<div class="wiedza-post-tags">' + tagsHtml + "</div>" +
      sourceHtml +
      '<div class="wiedza-disclaimer">' + (isPodcast(post) ? "Ten odcinek" : "Ten artykuł") + ' ma charakter edukacyjny i nie zastępuje konsultacji ze specjalistą. Jeśli Ty lub ktoś bliski potrzebuje wsparcia teraz, skorzystaj z bezpłatnych, całodobowych linii pomocowych wymienionych na stronie głównej w sekcji „Szukasz wsparcia?”.</div>';

    if (gridSection) gridSection.style.display = "none";
    if (heroSection) heroSection.style.display = "none";
    if (tagsBar) tagsBar.style.display = "none";
    postSection.style.display = "block";
    if (window.fmzScrollToTop) window.fmzScrollToTop();
    else window.scrollTo(0, 0);
  }

  function init() {
    const params = getParams();
    const postSlug = params.get("post");
    const query = params.get("q") || "";
    const category = params.get("category") || "";

    if (searchInput && query) searchInput.value = query;

    renderTags(category);

    if (postSlug) {
      renderPost(postSlug);
    } else {
      showGrid();
      renderGrid(query, category);
    }
  }

  grid.innerHTML = '<p class="wiedza-empty">Wczytywanie artykułów…</p>';
  wiedzaReady.then(init);
})();
