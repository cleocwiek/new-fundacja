/* Wiedza page: renders the post grid, category filters, and single-post
   detail view based on URL query params (?q=, ?category=, ?post=).
   Data currently comes from posts-data.js (static array) — swapping that
   file for a Contentful fetch later shouldn't require changes here, as
   long as the resulting posts keep the same shape. */
(function () {
  const heroSection = document.querySelector(".wiedza-hero");
  const tagsBar = document.getElementById("wiedzaTags");
  const gridSection = document.getElementById("wiedzaGridSection");
  const grid = document.getElementById("wiedzaGrid");
  const postSection = document.getElementById("wiedzaPostSection");
  const searchInput = document.getElementById("wiedzaSearchInput");

  if (!grid || typeof WIEDZA_POSTS === "undefined") return;

  const MONTHS = [
    "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
    "lipca", "sierpnia", "września", "października", "listopada", "grudnia",
  ];

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : str;
    return div.innerHTML;
  }

  function formatDate(iso) {
    const parts = (iso || "").split("-");
    if (parts.length !== 3) return "";
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    if (!MONTHS[month]) return iso;
    return day + " " + MONTHS[month] + " " + year;
  }

  function getParams() {
    return new URLSearchParams(window.location.search);
  }

  function renderCard(post) {
    return (
      '<article class="wiedza-card">' +
      '<p class="wiedza-card-category">' + escapeHtml(post.category) + "</p>" +
      "<h3>" + escapeHtml(post.title) + "</h3>" +
      "<p>" + escapeHtml(post.excerpt) + "</p>" +
      '<a class="wiedza-card-link" href="wiedza.html?post=' +
      encodeURIComponent(post.slug) +
      '">Czytaj więcej →</a>' +
      "</article>"
    );
  }

  function renderGrid(query, category) {
    let posts = query ? wiedzaSearch(query) : WIEDZA_POSTS.slice();
    if (category) {
      posts = posts.filter(function (post) {
        return post.category === category;
      });
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

    let html =
      '<button type="button" class="wiedza-tag' +
      (!activeCategory ? " active" : "") +
      '" data-category="">Wszystkie</button>';

    categories.forEach(function (category) {
      html +=
        '<button type="button" class="wiedza-tag' +
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

    const bodyHtml = post.body
      .map(function (paragraph) {
        return "<p>" + paragraph + "</p>";
      })
      .join("");

    const tagsHtml = (post.tags || [])
      .map(function (tag) {
        return '<span class="wiedza-post-tag">' + escapeHtml(tag) + "</span>";
      })
      .join("");

    postSection.innerHTML =
      '<a class="wiedza-back-link" href="wiedza.html">← Wróć do wiedzy</a>' +
      '<p class="eyebrow wiedza-post-category">' + escapeHtml(post.category) + "</p>" +
      "<h1>" + escapeHtml(post.title) + "</h1>" +
      '<p class="wiedza-post-date">' + formatDate(post.date) + "</p>" +
      '<div class="wiedza-post-body">' + bodyHtml + "</div>" +
      '<div class="wiedza-post-tags">' + tagsHtml + "</div>" +
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

  init();
})();
