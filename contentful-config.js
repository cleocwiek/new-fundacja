/* Połączenie z Contentful dla strony Wiedza i wyszukiwarki.
   spaceId      – Contentful: Settings → General settings → Space ID
   deliveryToken – Contentful: Settings → API keys → Content Delivery API - access token
   Token Content Delivery API służy tylko do odczytu opublikowanych treści,
   więc może być widoczny w kodzie strony (tak działa każda strona z Contentful).
   Nigdy nie wklejaj tu tokenu Content Management API (CFPAT-...). */
window.CONTENTFUL_CONFIG = {
  spaceId: "wr9m3r2dkdcn",
  deliveryToken: "WE1Hov-8uouNRXU-jmKIFmbkAYI_DTs_BDUcXJGj9w4",
  environment: "master",
};
