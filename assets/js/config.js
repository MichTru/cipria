// Configurazione unica del sito.
// Per collegare Shopify: inserisci il dominio .myshopify.com e lo Storefront access token PUBBLICO.
// Finché il token è vuoto il sito gira in modalità demo con data/catalogo-demo.json.

export const SHOPIFY = {
  domain: '',            // es. 'cipria-boutique.myshopify.com'
  storefrontToken: '',   // token pubblico Storefront API (mai il token Admin)
  apiVersion: '2026-10', // verifica l'ultima versione stabile sulla documentazione Shopify
  excludeTag: 'sposa'    // i prodotti con questo tag non si vendono online
};

export const BOUTIQUE = {
  whatsapp: '393349748428',
  telefono: '0544 65512',
  indirizzo: 'Via Circonvallazione Canale Molinetto 37, 48121 Ravenna',
  mappa: 'https://www.google.com/maps/search/?api=1&query=Via+Circonvallazione+Canale+Molinetto+37+Ravenna',
  instagram: 'https://www.instagram.com/cipriaboutiquee'
};

// Punto unico per collegare un servizio di prenotazione prove (es. Cal.com).
// Se vuoto, la prenotazione passa da WhatsApp con messaggio precompilato.
export const PRENOTAZIONI = {
  calendarUrl: ''
};

// Endpoint della lista email per la guida all'abito da sposa (es. Brevo, Mailchimp).
export const NEWSLETTER = {
  endpoint: ''
};
