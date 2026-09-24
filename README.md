# Nardin Le Tende · Homepage

Homepage statica di Nardin Le Tende, realizzata a partire dal design "Nardin Homepage - v2" di Claude Design.

## Struttura

```
index.html          markup semantico della homepage (contenuti, FAQ e dati strutturati inclusi)
css/style.css       stili: scala tipografica, griglia, moduli, responsive, prefers-reduced-motion
js/main.js          comportamento: menu mobile, video pausa/play, FAQ, comparsa dei contenuti,
                    header sticky, parallasse, contatore dei passi, caroselli
assets/img/         foto e logo
assets/video/       video dell'hero e del laboratorio
```

Nessuna dipendenza e nessun passaggio di build: JavaScript vanilla, font PT Sans e PT Serif da Google Fonts.
Senza JavaScript la pagina resta leggibile: i contenuti sono visibili e le animazioni si disattivano.

## Avvio in locale

```sh
python3 -m http.server 8000
# poi apri http://localhost:8000
```

## Da completare prima della messa online

- **Video:** `hero.mp4` e `laboratorio.mp4` pesano circa 11 MB ciascuno. Serve una versione compressa (circa 1080p, pochi MB) e un'immagine `poster` da mostrare durante il caricamento.
- **Segnaposto tra parentesi quadre:** risposte FAQ (costo del sopralluogo, tempi medi, capitolati hotel) e anteprime delle news.
- **Foto provvisorie:** la foto dello showroom (516 px, si sgrana sugli schermi larghi), le immagini delle news e dei capitoli "Chi siamo" riprendono foto già usate altrove in pagina.
- **Link:** i pulsanti puntano ad ancore interne (`#showroom`, `#progetti`, `#news`, ...) finché non esistono le pagine di destinazione.
- **Microcopy da confermare:** "Richiedi un referente" (Professionisti), titolo "Ultime novità" ed etichetta "FAQ".
