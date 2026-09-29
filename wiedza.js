/* Wiedza page: renders the post grid, category filters, and single-post
   detail view based on URL query params (?q=, ?category=, ?post=).
   Articles come from posts-data.js, which loads them from Contentful
   (or uses its built-in sample posts when Contentful isn't configured);
   rendering waits for `wiedzaReady`. */
(function () {
  const heroSection = document.querySelector(".wiedza-hero");
  const tagsBar = document.getElementById("wiedzaTags");
  const gridSection = document.getElementById("wiedzaGridSection");
  const grid = document.getElementById("wiedzaGrid");
  const postSection = document.getElementById("wiedzaPostSection");
  const searchInput = document.getElementById("wiedzaSearchInput");

  if (!grid || typeof wiedzaReady === "undefined") return;


  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : str;
    return div.innerHTML;
  }


  function getParams() {
    return new URLSearchParams(window.location.search);
  }

  function renderCard(post) {
    const href = "wiedza.html?post=" + encodeURIComponent(post.slug);
    return (
      '<article class="wiedza-card">' +
      '<p class="wiedza-card-category ' + wiedzaCategoryClass(post.category) + '">' + escapeHtml(post.category) + "</p>" +
      '<h3><a href="' + href + '">' + escapeHtml(post.title) + "</a></h3>" +
      "<p>" + escapeHtml(post.excerpt) + "</p>" +
      '<a class="wiedza-card-link" href="' + href + '">Czytaj więcej →</a>' +
      "</article>"
    );
  }

  // Random order that spreads every category evenly through the list:
  // each category is shuffled, then its posts get evenly spaced positions
  // (with a random offset) and all posts are sorted by position.
  function mixedOrder(posts) {
    const byCategory = {};
    posts.forEach(function (post) {
      (byCategory[post.category] = byCategory[post.category] || []).push(post);
    });
    const placed = [];
    Object.keys(byCategory).forEach(function (category) {
      const group = byCategory[category];
      for (let i = group.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = group[i]; group[i] = group[j]; group[j] = tmp;
      }
      group.forEach(function (post, i) {
        placed.push({ post: post, key: (i + Math.random()) / group.length });
      });
    });
    placed.sort(function (a, b) { return a.key - b.key; });
    return placed.map(function (item) { return item.post; });
  }

  let mixedPosts = null;

  function renderGrid(query, category) {
    if (!mixedPosts) mixedPosts = mixedOrder(WIEDZA_POSTS);
    let posts = query ? wiedzaSearch(query) : mixedPosts.slice();
    if (category) {
      posts = posts.filter(function (post) {
        return post.category === category;
      });
    }

    if (WIEDZA_LOAD_ERROR) {
      grid.innerHTML =
        '<p class="wiedza-empty">Nie udało się wczytać artykułów. Odśwież stronę za chwilę.</p>';
      return;
    }

    if (!posts.length) {
      grid.innerHTML =
        '<p class="wiedza-empty">Nie znaleźliśmy artykułów pasujących do „' +
        escapeHtml(query || category) +
        '”. Spróbuj innego hasła.</p>';
      return;
    }

    grid.innerHTML = posts.map(renderCard).join("");
  }

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
      '<div class="wiedza-post-body">' + bodyHtml + "</div>" +
      '<div class="wiedza-post-tags">' + tagsHtml + "</div>" +
      sourceHtml +
      '<div class="wiedza-disclaimer">Ten artykuł ma charakter edukacyjny i nie zastępuje konsultacji ze specjalistą. Jeśli Ty lub ktoś bliski potrzebuje wsparcia teraz, skorzystaj z bezpłatnych, całodobowych linii pomocowych wymienionych na stronie głównej w sekcji „Szukasz wsparcia?”.</div>';

    if (gridSection) gridSection.style.display = "none";
    if (heroSection) heroSection.style.display = "none";
    if (tagsBar) tagsBar.style.display = "none";
    postSection.style.display = "block";
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
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
