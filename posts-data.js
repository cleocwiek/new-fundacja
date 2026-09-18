/* =========================================================
   Wiedza — baza artykułów o zdrowiu psychicznym
   Statyczne dane na start; struktura jest przygotowana pod
   łatwe podpięcie CMS-a (np. Contentful) w przyszłości —
   docelowo ta tablica zostanie zastąpiona wynikiem zapytania
   do API, ale kształt pojedynczego obiektu posta może zostać
   taki sam.
   ========================================================= */

const WIEDZA_POSTS = [
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

/* Simple text-normalization helper shared by search + listing logic */
function wiedzaNormalize(str) {
  return (str || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function wiedzaSearch(query, limit) {
  const q = wiedzaNormalize(query).trim();
  if (!q) return [];
  return WIEDZA_POSTS.filter((post) => {
    const haystack = wiedzaNormalize(
      [post.title, post.excerpt, post.category, (post.tags || []).join(" ")].join(" ")
    );
    return haystack.includes(q);
  }).slice(0, limit || WIEDZA_POSTS.length);
}
