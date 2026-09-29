/* =========================================================
   Wiedza — baza artykułów o zdrowiu psychicznym

   Artykuły są pobierane z Contentful (typ treści "article"),
   gdy w contentful-config.js są uzupełnione spaceId i
   deliveryToken. Dopóki konfiguracji nie ma, strona korzysta
   z przykładowych artykułów zapisanych poniżej.

   Globalne API używane przez script.js (wyszukiwarka na stronie
   głównej) i wiedza.js (strona Wiedza):
     WIEDZA_POSTS     – aktualna lista artykułów
     wiedzaReady      – Promise, który rozwiązuje się po wczytaniu
     wiedzaSearch()   – wyszukiwanie
     WIEDZA_LOAD_ERROR – true, jeśli Contentful nie odpowiedział
   ========================================================= */

/* Przykładowe artykuły – używane tylko bez konfiguracji Contentful */
var WIEDZA_FALLBACK_POSTS = [
  {
    slug: "depresja",
    category: "Zaburzenia psychiczne",
    title: "Depresja – jak ją rozpoznać i co zrobić dalej?",
    excerpt:
      "Depresja to coś więcej niż chwilowy smutek. Sprawdź, jakie objawy powinny zwrócić Twoją uwagę i jak wygląda pierwszy krok do pomocy.",
    date: "2025-02-04",
    tags: ["depresja", "objawy", "leczenie", "smutek", "psychoedukacja"],
    body: [
      "Depresja jest jednym z najczęstszych zaburzeń psychicznych na świecie, a mimo to wciąż bywa mylona ze zwykłym gorszym nastrojem. Kluczowa różnica polega na czasie trwania i natężeniu objawów – o depresji mówimy, gdy obniżony nastrój, utrata radości z rzeczy, które wcześniej sprawiały przyjemność, i spadek energii utrzymują się <b>przez co najmniej dwa tygodnie</b> i wyraźnie utrudniają codzienne funkcjonowanie.",
      "Do najczęstszych objawów należą: <b>uczucie smutku, pustki lub beznadziei</b>, problemy ze snem (bezsenność lub nadmierna senność), zmiany apetytu i wagi, trudności z koncentracją, spadek energii, poczucie winy lub bezwartościowości, a także izolowanie się od bliskich. U części osób pojawiają się również objawy fizyczne – bóle głowy, mięśni czy dolegliwości żołądkowe, które nie mają innej przyczyny medycznej.",
      "Depresja ma wiele twarzy – u niektórych osób dominuje smutek i wycofanie, u innych rozdrażnienie, niepokój lub wręcz spłycenie emocji, gdy nic już „nie rusza”. Dlatego tak ważne jest, by nie oceniać własnego stanu przez pryzmat stereotypu „ciągłego płaczu”, tylko zwracać uwagę na to, <b>jak bardzo zmieniło się Twoje funkcjonowanie</b> względem tego, jak wyglądało wcześniej.",
      "Co zrobić, jeśli rozpoznajesz u siebie te objawy? Pierwszym krokiem jest rozmowa – z lekarzem pierwszego kontaktu, psychologiem lub psychiatrą. Diagnoza depresji stawiana jest klinicznie, na podstawie wywiadu, a leczenie najczęściej łączy psychoterapię i, w razie potrzeby, farmakoterapię. Nie trzeba czekać, aż będzie „wystarczająco źle” – im wcześniej zgłosisz się po pomoc, tym łatwiej odzyskać równowagę.",
      "Jeśli martwisz się o kogoś bliskiego, najważniejsze jest, by nie bagatelizować tego, co mówi, i nie zachęcać do „wzięcia się w garść”. Depresja nie jest kwestią silnej woli. Najlepsze, co możesz zrobić, to być obecnym, słuchać bez oceniania i pomóc znaleźć specjalistę, jeśli druga osoba nie ma na to siły.",
    ],
  },
  {
    slug: "kryzys-psychiczny",
    category: "Pierwsza pomoc",
    title: "Kryzys psychiczny – pierwsza (samo)pomoc krok po kroku",
    excerpt:
      "Kryzys psychiczny może dotknąć każdego. Poznaj sześć filarów pierwszej (samo)pomocy, które pomagają wrócić do równowagi.",
    date: "2025-03-18",
    tags: ["kryzys", "pierwsza pomoc", "wsparcie", "profilaktyka"],
    body: [
      "Kryzys psychiczny to stan silnego napięcia emocjonalnego, w którym dotychczasowe sposoby radzenia sobie przestają wystarczać. Może go wywołać strata, choroba, przeciążenie obowiązkami, trudne wydarzenie życiowe – albo suma wielu mniejszych trudności, które w końcu przelewają czarę. <b>Kryzys psychiczny może spotkać każdego</b>, niezależnie od tego, jak silny czy „poukładany” ktoś się wydaje.",
      "Z okazji Światowego Dnia Zdrowia Psychicznego stworzyliśmy kampanię „Pierwsza (samo)pomoc”, która upowszechnia wiedzę o tym, jak reagować w takich momentach – zarówno profilaktycznie, jak i w samym środku kryzysu. Zidentyfikowaliśmy sześć filarów, które realnie wspierają dobrostan psychiczny: <b>kontakt ze specjalistą, relacje z innymi, psychoedukację, kontakt z naturą, aktywność fizyczną oraz odpowiednią ilość snu i odpoczynku</b>.",
      "Rozmowa ze specjalistą – psychologiem, terapeutą lub interwentem kryzysowym – daje poczucie bezpieczeństwa i realną pomoc tu i teraz. Nie trzeba mieć postawionej diagnozy, żeby skorzystać z takiego wsparcia. Czasem wystarczy jedna rozmowa, by zobaczyć sytuację z innej perspektywy.",
      "Równie ważne są relacje. Samotność szkodzi zdrowiu tak samo jak przewlekły stres, a bliskość z ludźmi wzmacnia odporność psychiczną. Jeśli jesteś w kryzysie, spróbuj nie zamykać się na innych – nawet krótki kontakt z kimś zaufanym może odciążyć.",
      "Reszta filarów – natura, ruch i sen – brzmią prosto, ale mają udokumentowany wpływ na regenerację układu nerwowego. Krótki spacer, uregulowanie rytmu dobowego czy ograniczenie bodźców przed snem to małe kroki, które realnie pomagają, gdy wszystko wydaje się przytłaczające.",
      "Jeśli Ty lub ktoś w Twoim otoczeniu jest w kryzysie i potrzebuje pomocy natychmiast, skorzystaj z bezpłatnych, całodobowych linii wsparcia wymienionych na naszej stronie głównej w sekcji „Szukasz wsparcia?”.",
    ],
  },
  {
    slug: "higiena-cyfrowa",
    category: "Higiena cyfrowa",
    title: "Higiena cyfrowa – jak nadmiar ekranu wpływa na samopoczucie",
    excerpt:
      "Przeciętny dorosły spędza przed ekranem ponad 6 godzin dziennie. Sprawdź, jak to wpływa na Twoją psychikę i od czego zacząć zmianę.",
    date: "2025-04-22",
    tags: ["higiena cyfrowa", "ekran", "telefon", "profilaktyka", "sen"],
    body: [
      "Według danych WHO przeciętny dorosły spędza przed ekranem ponad 6 godzin dziennie, a młodzi dorośli nawet 9. W Polsce aż 37% osób w wieku 18–34 lat przyznaje, że nadmiar bodźców cyfrowych negatywnie wpływa na ich samopoczucie. To nie przypadek – nieustanna dostępność, powiadomienia i przewijanie treści utrzymują układ nerwowy w ciągłej gotowości.",
      "Konsekwencje nadmiaru czasu spędzanego online to między innymi <b>problemy ze snem, trudności z koncentracją, nasilone stany lękowe czy poczucie osamotnienia</b> – paradoksalnie, mimo że jesteśmy bardziej „połączeni” niż kiedykolwiek. Scrollowanie mediów społecznościowych tuż po przebudzeniu czy tuż przed snem szczególnie mocno zaburza naturalny rytm dobowy.",
      "Higiena cyfrowa nie oznacza całkowitej rezygnacji z technologii, tylko świadome ustalenie własnych zasad korzystania z niej. Kilka podstawowych praktyk, od których warto zacząć: <b>ustaw limity aplikacji i wycisz zbędne powiadomienia</b>, zadbaj o poranną i wieczorną rutynę offline, wyznacz strefy bez ekranów (np. sypialnia czy stół podczas posiłków), ogranicz korzystanie z telefonu podczas spotkań z ludźmi i planuj aktywności analogowe – spacer, sport, książkę.",
      "Warto też zwrócić uwagę na to, <i>w jaki sposób</i> korzystamy z ekranu, a nie tylko <i>ile czasu</i> mu poświęcamy. Bierne scrollowanie w poszukiwaniu ucieczki od nudy czy stresu działa inaczej niż świadome, ograniczone w czasie korzystanie z konkretnej aplikacji w konkretnym celu.",
      "Jeśli chcesz sprawdzić, jak wygląda Twoja higiena cyfrowa, zapraszamy do wypełnienia krótkiego quizu w ramach naszego projektu <b>Take Care OFF Yourself</b> – znajdziesz go na naszej stronie.",
    ],
  },
  {
    slug: "leki-stany-lekowe",
    category: "Zaburzenia psychiczne",
    title: "Lęk i stany lękowe – jak sobie z nimi radzić",
    excerpt:
      "Lęk to naturalna reakcja organizmu, ale bywa też przewlekłym problemem. Poznaj różnicę i sprawdzone sposoby na obniżenie napięcia.",
    date: "2025-05-09",
    tags: ["lęk", "stres", "objawy", "regulacja emocji"],
    body: [
      "Lęk sam w sobie nie jest czymś złym – to naturalny mechanizm obronny, który pomagał naszym przodkom przetrwać zagrożenie. Problem pojawia się wtedy, gdy reakcja lękowa uruchamia się <b>nieproporcjonalnie często lub nieproporcjonalnie silnie</b> do realnego zagrożenia, i zaczyna ograniczać codzienne funkcjonowanie.",
      "Objawy stanów lękowych mogą być zarówno psychiczne (nadmierne zamartwianie się, poczucie zagrożenia, trudność z „wyłączeniem” myśli), jak i fizyczne – przyspieszone bicie serca, spłycony oddech, napięcie mięśni, problemy żołądkowe czy zawroty głowy. U wielu osób lęk bywa mylony z problemami somatycznymi, zanim zostanie rozpoznany jego prawdziwy charakter.",
      "Kilka strategii, które pomagają obniżyć poziom napięcia w danym momencie: <b>świadomy, spowolniony oddech</b> (np. wdech na 4 sekundy, wydech na 6), uziemienie poprzez skupienie się na zmysłach (co widzę, słyszę, czuję pod stopami), ograniczenie kofeiny i używek, a także ruch fizyczny, który pomaga „rozładować” nagromadzoną w ciele energię stresową.",
      "Długofalowo najskuteczniejsza bywa <b>psychoterapia</b>, szczególnie nurty pracujące z myślami i przekonaniami leżącymi u podstaw lęku. Jeśli lęk pojawia się często, trwa długo lub znacząco utrudnia Ci funkcjonowanie – pracę, relacje, sen – warto skonsultować się ze specjalistą, zamiast czekać, aż „samo przejdzie”.",
    ],
  },
  {
    slug: "wypalenie-zawodowe",
    category: "Zdrowie w pracy",
    title: "Wypalenie zawodowe – jak je rozpoznać, zanim będzie za późno",
    excerpt:
      "Chroniczne przemęczenie, cynizm wobec pracy i spadek poczucia skuteczności to sygnały wypalenia zawodowego. Sprawdź, jak temu zapobiegać.",
    date: "2025-06-14",
    tags: ["wypalenie zawodowe", "praca", "stres", "profilaktyka"],
    body: [
      "Wypalenie zawodowe to zjawisko na tyle powszechne, że Światowa Organizacja Zdrowia sklasyfikowała je jako zespół wynikający z <b>przewlekłego stresu w miejscu pracy, który nie został skutecznie opanowany</b>. Nie jest to jednorazowe „zmęczenie po ciężkim tygodniu”, tylko narastający proces.",
      "Trzy główne wymiary wypalenia to: <b>wyczerpanie emocjonalne</b> (chroniczne zmęczenie, które nie mija po odpoczynku), <b>cynizm i dystansowanie się</b> od pracy oraz osób, z którymi się pracuje, a także <b>obniżone poczucie skuteczności zawodowej</b> – wrażenie, że niezależnie od wysiłku, nic z tego nie wynika.",
      "Wypalenie rzadko pojawia się nagle. Zwykle poprzedzają je sygnały ostrzegawcze: rosnąca drażliwość, problemy ze snem, spadek motywacji do rzeczy, które wcześniej sprawiały satysfakcję, izolowanie się od współpracowników czy narastające poczucie, że praca „pochłania” całe życie.",
      "Profilaktyka wypalenia opiera się na kilku filarach: wyznaczaniu realnych granic między pracą a życiem prywatnym, regularnych przerwach w ciągu dnia, dbaniu o relacje poza pracą oraz – jeśli to możliwe – rozmowie z przełożonym o obciążeniu obowiązkami, zanim dojdzie do kryzysu. Warto też pamiętać, że wypalenie <b>nie jest oznaką słabości</b>, tylko sygnałem, że system, w którym funkcjonujemy, przez dłuższy czas przekraczał naszą wydolność.",
      "Jeśli rozpoznajesz u siebie kilka z powyższych objawów utrzymujących się od tygodni lub miesięcy, warto skonsultować się z psychologiem – wypalenie, pozostawione bez wsparcia, może przejść w pełnoobjawową depresję.",
    ],
  },
  {
    slug: "sen-a-zdrowie-psychiczne",
    category: "Higiena cyfrowa",
    title: "Sen a zdrowie psychiczne – dlaczego regeneracja to nie luksus",
    excerpt:
      "Sen to jeden z filarów pierwszej (samo)pomocy. Zobacz, jak niedobór snu wpływa na nastrój i koncentrację – i jak poprawić jego jakość.",
    date: "2025-07-01",
    tags: ["sen", "regeneracja", "profilaktyka", "koncentracja"],
    body: [
      "Sen to absolutna podstawa zdrowia psychicznego – pozwala mózgowi odpocząć, przetworzyć emocje z minionego dnia i wzmocnić odporność na stres. Mimo to bywa jednym z pierwszych elementów, z których rezygnujemy, gdy robi się intensywnie – zawodowo czy prywatnie.",
      "Chroniczny niedobór snu wpływa nie tylko na koncentrację i pamięć, ale też na <b>regulację emocji</b> – niewyspani jesteśmy bardziej drażliwi, gorzej radzimy sobie ze stresem i mamy mniejszą odporność na trudne sytuacje. Badania wiążą przewlekłe problemy ze snem ze zwiększonym ryzykiem depresji i zaburzeń lękowych.",
      "Jednym z największych wrogów dobrego snu jest ekran telefonu tuż przed zaśnięciem – zarówno przez emitowane niebieskie światło, jak i przez pobudzające treści, które łatwo wciągają na dłużej, niż planowaliśmy. To jeden z powodów, dla których higiena cyfrowa i higiena snu tak mocno się ze sobą łączą.",
      "Kilka prostych nawyków, które poprawiają jakość snu: stała pora zasypiania i budzenia się (nawet w weekendy), ograniczenie ekranów na godzinę przed snem, unikanie kofeiny w drugiej połowie dnia oraz wprowadzenie krótkiego rytuału wyciszającego – np. czytania książki zamiast scrollowania telefonu.",
      "Jeśli problemy ze snem utrzymują się mimo zadbania o podstawowe nawyki i wyraźnie wpływają na Twoje funkcjonowanie w ciągu dnia, warto porozmawiać o tym z lekarzem lub specjalistą – długotrwała bezsenność bywa zarówno skutkiem, jak i przyczyną pogarszającego się stanu psychicznego.",
      "Poznaj więcej praktycznych wskazówek w naszym poradniku o higienie cyfrowej dostępnym w sekcji Psychoedu na stronie głównej.",
    ],
  },
];

var WIEDZA_CONFIG = window.CONTENTFUL_CONFIG || {};
var WIEDZA_USES_CONTENTFUL = !!(WIEDZA_CONFIG.spaceId && WIEDZA_CONFIG.deliveryToken);
var WIEDZA_POSTS = WIEDZA_USES_CONTENTFUL ? [] : WIEDZA_FALLBACK_POSTS.slice();
var WIEDZA_LOAD_ERROR = false;

/* Simple text-normalization helper shared by search + listing logic */
function wiedzaNormalize(str) {
  return (str || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ł/g, "l");
}

function wiedzaEscapeHtml(str) {
  return (str == null ? "" : String(str))
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* Minimal Markdown → HTML for article bodies written in Contentful:
   paragraphs (blank line between), "- " lists, "### " subheadings,
   **bold**, *italic* and [links](https://...). Everything else is
   escaped, so the body can never inject HTML into the page. */
function wiedzaInlineMarkdown(text) {
  return wiedzaEscapeHtml(text)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, function (_, label, url) {
      return '<a href="' + url + '" target="_blank" rel="noopener">' + label + "</a>";
    })
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
    .replace(/(^|[^*])\*([^*\s][^*]*?)\*(?!\*)/g, "$1<i>$2</i>");
}

function wiedzaMarkdown(md) {
  const blocks = (md || "").replace(/\r\n/g, "\n").split(/\n\s*\n/);
  return blocks
    .map(function (block) {
      const lines = block.split("\n").map(function (l) { return l.trim(); }).filter(Boolean);
      if (!lines.length) return "";
      if (lines.every(function (l) { return /^[-*] /.test(l); })) {
        return (
          "<ul>" +
          lines.map(function (l) { return "<li>" + wiedzaInlineMarkdown(l.slice(2)) + "</li>"; }).join("") +
          "</ul>"
        );
      }
      if (lines.length === 1 && /^#{1,4} /.test(lines[0])) {
        return "<h3>" + wiedzaInlineMarkdown(lines[0].replace(/^#{1,4} /, "")) + "</h3>";
      }
      return "<p>" + wiedzaInlineMarkdown(lines.join(" ")) + "</p>";
    })
    .join("");
}

function wiedzaStripHtml(html) {
  return (html || "").replace(/<[^>]+>/g, " ");
}

function wiedzaFromContentful(item) {
  const f = item.fields || {};
  const body = f.body || "";
  return {
    slug: f.slug,
    category: f.category || "",
    title: f.title || "",
    excerpt: f.excerpt || "",
    date: (f.date || "").slice(0, 10),
    tags: f.tags || [],
    bodyHtml: wiedzaMarkdown(body),
    bodyText: body.replace(/[*#\[\]()_]/g, " "),
    source: f.source || "",
    sourceUrl: f.sourceUrl || "",
  };
}

var wiedzaReady = (function () {
  if (!WIEDZA_USES_CONTENTFUL) return Promise.resolve(WIEDZA_POSTS);

  const url =
    "https://cdn.contentful.com/spaces/" +
    encodeURIComponent(WIEDZA_CONFIG.spaceId) +
    "/environments/" +
    encodeURIComponent(WIEDZA_CONFIG.environment || "master") +
    "/entries?content_type=article&limit=1000&order=-fields.date,fields.title" +
    "&access_token=" +
    encodeURIComponent(WIEDZA_CONFIG.deliveryToken);

  return fetch(url)
    .then(function (res) {
      if (!res.ok) throw new Error("Contentful HTTP " + res.status);
      return res.json();
    })
    .then(function (data) {
      WIEDZA_POSTS = (data.items || [])
        .map(wiedzaFromContentful)
        .filter(function (post) { return post.slug && post.title; });
      return WIEDZA_POSTS;
    })
    .catch(function (err) {
      console.error("Nie udało się wczytać artykułów z Contentful:", err);
      WIEDZA_LOAD_ERROR = true;
      WIEDZA_POSTS = [];
      return WIEDZA_POSTS;
    });
})();

/* Category → colour class (see .cat-* in style.css). Categories not listed
   here simply get the neutral style. */
var WIEDZA_CATEGORY_COLORS = {
  "pierwsza pomoc": "cat-green",
  "ciaza i rodzicielstwo": "cat-pink",
  "higiena cyfrowa": "cat-blue",
  "zdrowie psychiczne": "cat-yellow",
  "jak wspierac bliskich": "cat-navy",
};

function wiedzaCategoryClass(category) {
  return WIEDZA_CATEGORY_COLORS[wiedzaNormalize(category).trim()] || "";
}

/* Search: every word of the query has to appear somewhere in the article;
   matches in the title count most, then tags/category, excerpt and body. */
function wiedzaSearch(query, limit) {
  const words = wiedzaNormalize(query).trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];

  const scored = [];
  WIEDZA_POSTS.forEach(function (post, index) {
    const fields = [
      [wiedzaNormalize(post.title), 5],
      [wiedzaNormalize((post.tags || []).join(" ") + " " + post.category), 3],
      [wiedzaNormalize(post.excerpt), 2],
      [wiedzaNormalize(post.bodyText || wiedzaStripHtml((post.body || []).join(" "))), 1],
    ];
    let score = 0;
    for (let w = 0; w < words.length; w++) {
      let best = 0;
      for (let i = 0; i < fields.length; i++) {
        if (fields[i][0].indexOf(words[w]) !== -1 && fields[i][1] > best) best = fields[i][1];
      }
      if (!best) return;
      score += best;
    }
    scored.push({ post: post, score: score, index: index });
  });

  scored.sort(function (a, b) {
    return b.score - a.score || a.index - b.index;
  });
  return scored.slice(0, limit || scored.length).map(function (s) { return s.post; });
}
