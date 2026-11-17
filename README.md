# Cipria Boutique & Sposa

Sito e-commerce di Cipria Boutique & Sposa, Ravenna.

- Sito statico, pubblicabile su GitHub Pages.
- Catalogo e checkout tramite Shopify Storefront API: credenziali in `assets/js/config.js`.
- Senza token Shopify il sito usa il catalogo demo in `data/catalogo-demo.json`.
- Dopo aver sostituito una foto in `assets/img`, lancia `python3 tools/varianti.py` per rigenerare le versioni ridotte.
- Intro: in `index.html` l'attributo `data-stile` dell'intro sceglie lo stile. `entra` entra nella foto della hero (circa 3 s), `riavvolgi` rifà il volo al contrario e apre il sito con un sipario (circa 6 s). La versione completa precedente è anche nel branch `backup/intro-riavvolgimento`.
