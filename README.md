# Cipria Boutique & Sposa

Sito e-commerce di Cipria Boutique & Sposa, Ravenna.

- Sito statico, pubblicabile su GitHub Pages.
- Catalogo e checkout tramite Shopify Storefront API: credenziali in `assets/js/config.js`.
- Senza token Shopify il sito usa il catalogo demo in `data/catalogo-demo.json`.
- Dopo aver sostituito una foto in `assets/img`, lancia `python3 tools/varianti.py` per rigenerare le versioni ridotte.
