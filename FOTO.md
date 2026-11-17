# Foto segnaposto — istruzioni per la generazione

Genera le immagini elencate qui sotto e salvale **esattamente** nei percorsi indicati. Il sito le carica da solo: non toccare HTML, CSS o JavaScript. Finché un file manca, il sito mostra un segnaposto colorato.

## Regole per tutte le foto

- Formato JPG, qualità circa 80, peso sotto i 400 KB. Dimensioni esatte in pixel come indicato.
- Nomi di file e cartelle esattamente come scritti, tutto minuscolo.
- Fotorealistiche, come un servizio di moda professionale. Niente illustrazioni né aspetto da render 3D.
- Nessun testo, logo, scritta, marchio riconoscibile o filigrana nell'immagine.
- Solo modelle adulte.
- Stile comune da ripetere in ogni prompt (è già incluso nei prompt sotto): luce naturale morbida da finestra, atmosfera da atelier, palette avorio, cipria (rosa nude polveroso), champagne e beige caldo, pochi contrasti, grana fotografica leggera, eleganza discreta. Coerenti con la foto della hero (`assets/img/hero-sposa.jpg`): interno classico con boiserie chiare, tende leggere, fiori bianchi e rosa pallido.
- Dopo aver aggiunto o sostituito le foto, lancia `python3 tools/varianti.py`: crea le versioni ridotte che il sito usa su telefono e nelle anteprime.
- Alla fine fai un unico commit: `Foto segnaposto generate`.

## Collezioni (sezione "Tre mondi")

**`assets/img/reparti/donna.jpg`** — 1600 × 2000 (verticale 4:5)
> Editorial fashion photograph of an elegant woman in her thirties wearing a tailored cognac leather jacket over a cream silk top and wide beige trousers, standing in a bright classical atelier with pale wood paneling and sheer curtains, soft natural window light, warm ivory and nude color palette, calm confident pose, full body slightly off-center, photorealistic, Vogue Italia style, subtle film grain, no text, no logos.

**`assets/img/reparti/cerimonia.jpg`** — 1600 × 2000 (verticale 4:5)
> Editorial fashion photograph of a woman wearing a long champagne satin evening gown with soft draping, standing near a tall window in a classical cream atelier, soft diffused daylight, warm ivory, champagne and powder pink palette, graceful pose, full length, photorealistic, luxury ceremony wear campaign, subtle film grain, no text, no logos.

**`assets/img/reparti/sposa.jpg`** — 1600 × 2000 (verticale 4:5)
> Bridal fashion photograph of a bride seen from behind wearing a lace wedding gown with an open back and delicate floral lace details, hair in a soft low bun, standing in a bright classical atelier with sheer curtains and pale pink roses, soft window light, ivory and powder pink palette, romantic and elegant, photorealistic, subtle film grain, no text, no logos.

## Sposa 2027 (schede Kamala e Petra)

**`assets/img/sposa/kamala.jpg`** — 1500 × 2000 (verticale 3:4, viene ritagliata ad arco in alto: lascia aria sopra la testa)
> Bridal campaign photograph of a bride wearing a structured ivory satin ball gown with a sweetheart neckline and a full voluminous skirt, clean minimal lines, standing centered in a bright classical atelier with cream paneling, soft natural light, ivory and champagne palette, generous empty space above her head, full length, photorealistic, luxury bridal editorial, subtle film grain, no text, no logos.

**`assets/img/sposa/petra.jpg`** — 1500 × 2000 (verticale 3:4, viene ritagliata ad arco in alto: lascia aria sopra la testa)
> Bridal campaign photograph of a bride wearing a fitted ivory wedding gown covered in delicate floral lace, sheer long sleeves and a long flowing lace train spread on the floor, standing centered in a bright classical atelier with sheer curtains, soft window light, ivory and powder pink palette, generous empty space above her head, full length, photorealistic, luxury bridal editorial, subtle film grain, no text, no logos.

## Compra il look

**`assets/img/look/look-sera.jpg`** — 1600 × 2000 (verticale 4:5)

Sulla foto ci sono quattro punti cliccabili in posizioni fisse (percentuali da sinistra e dall'alto): giacca 36% / 30%, top 54% / 40%, gonna 48% / 70%, borsa 72% / 56%. Componi la figura in modo che ogni capo cada vicino al suo punto. Se serve, aggiorna solo i valori `x` e `y` dell'array `LOOK` in `assets/js/main.js`.
> Full-length editorial fashion photograph of a woman standing facing the camera, centered, wearing an open tailored beige blazer, a cream satin camisole top with lace trim, a midi satin skirt in warm taupe, and holding a small dark brown leather handbag with a silk scarf on the handle in her left hand at hip height on the right side of the frame, plain warm ivory studio backdrop, soft even light, every garment clearly visible, photorealistic, luxury boutique lookbook, subtle film grain, no text, no logos.

## Evento

**`assets/img/evento/sfilata.jpg`** — 2400 × 1350 (orizzontale 16:9, a tutto schermo con testo in basso a sinistra: tieni la parte bassa a sinistra più scura e libera)
> Wide photograph of an intimate evening fashion show inside an elegant boutique, a model walking toward the camera on a narrow runway in a flowing champagne gown, guests seated on both sides softly out of focus, warm golden ambient lighting with soft spotlights, cream and champagne tones, cinematic depth of field, darker and calmer lower left area, photorealistic, subtle film grain, no text, no logos.

## Boutique

**`assets/img/boutique/boutique.jpg`** — 1600 × 1200 (orizzontale 4:3)
> Interior photograph of a small luxury bridal and fashion boutique, cream walls with classical paneling, a rail of ivory wedding dresses, a round cream bouclé armchair, a gold-framed mirror, white and pale pink flowers in a glass vase, soft daylight from a large window, ivory, powder pink and champagne palette, inviting and calm, photorealistic, architectural interior photography, no people, no text, no logos.

## Prodotti in vetrina

Tutte **1200 × 1500** (verticale 4:5). Stesso set per tutte: still life del solo capo, senza modella, su sfondo avorio uniforme `#F3EAE2`, luce morbida da sinistra, ombra leggera, capo centrato con margine intorno, fotografia e-commerce di lusso, fotorealistica, nessun testo né logo.

**`assets/img/prodotti/giacca-pelle-intrecciata.jpg`**
> Luxury e-commerce still life of a woven leather jacket in warm taupe brown, hanging on a slim wooden hanger, uniform ivory background, soft light from the left, gentle shadow, centered with margin, photorealistic, no text, no logos.

**`assets/img/prodotti/top-raso-pizzo.jpg`**
> Luxury e-commerce still life of a cream satin camisole top with delicate lace trim, neatly laid flat, uniform ivory background, soft light from the left, gentle shadow, centered with margin, photorealistic, no text, no logos.

**`assets/img/prodotti/gonna-raso.jpg`**
> Luxury e-commerce still life of a midi satin slip skirt in warm taupe beige, hanging on a slim wooden hanger with soft folds, uniform ivory background, soft light from the left, gentle shadow, centered with margin, photorealistic, no text, no logos.

**`assets/img/prodotti/giacca-sartoriale.jpg`**
> Luxury e-commerce still life of a tailored single-breasted blazer in light sand beige wool, on a slim wooden hanger, uniform ivory background, soft light from the left, gentle shadow, centered with margin, photorealistic, no text, no logos.

**`assets/img/prodotti/abito-lungo-paillettes.jpg`**
> Luxury e-commerce still life of a long sleeveless evening gown fully embroidered with soft champagne sequins, on a dress form, uniform ivory background, soft light from the left, gentle shimmer, centered with margin, photorealistic, no text, no logos.

**`assets/img/prodotti/abito-raso-drappeggiato.jpg`**
> Luxury e-commerce still life of a long draped satin ceremony dress in warm mocha beige, on a dress form, elegant folds at the waist, uniform ivory background, soft light from the left, gentle shadow, centered with margin, photorealistic, no text, no logos.

**`assets/img/prodotti/borsa-pelle-foulard.jpg`**
> Luxury e-commerce still life of a structured dark brown leather top-handle handbag with a small gold clasp and a printed silk scarf tied on the handle, standing upright, uniform ivory background, soft light from the left, gentle shadow, centered with margin, photorealistic, no text, no logos.

**`assets/img/prodotti/stola-pelliccia-ecologica.jpg`**
> Luxury e-commerce still life of a soft ivory faux fur stole draped elegantly, uniform ivory background, soft light from the left, gentle shadow, centered with margin, photorealistic, no text, no logos.

## Controllo finale

Prima del commit verifica che ci siano tutti e 16 i file, con i nomi esatti:

```
assets/img/reparti/donna.jpg
assets/img/reparti/cerimonia.jpg
assets/img/reparti/sposa.jpg
assets/img/sposa/kamala.jpg
assets/img/sposa/petra.jpg
assets/img/look/look-sera.jpg
assets/img/evento/sfilata.jpg
assets/img/boutique/boutique.jpg
assets/img/prodotti/giacca-pelle-intrecciata.jpg
assets/img/prodotti/top-raso-pizzo.jpg
assets/img/prodotti/gonna-raso.jpg
assets/img/prodotti/giacca-sartoriale.jpg
assets/img/prodotti/abito-lungo-paillettes.jpg
assets/img/prodotti/abito-raso-drappeggiato.jpg
assets/img/prodotti/borsa-pelle-foulard.jpg
assets/img/prodotti/stola-pelliccia-ecologica.jpg
```
