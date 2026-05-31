# Calcolatore Vantaggi TFR

Webapp statica per simulare i vantaggi del conferimento del TFR al fondo pensione.

## File

- `index.html`: struttura della webapp.
- `styles.css`: layout responsive e stile grafico.
- `app.js`: formule di calcolo ricavate dal Google Sheet.
- `logo.svg`: logo inserito dal file Google Drive fornito.

## Formule principali

- Montante Retributivo = N° dipendenti × RAL media.
- Flusso TFR = Montante Retributivo × 6,91%.
- Deduzione extra = Flusso TFR × 6% × 27,9%.
- Misure compensative = Montante Retributivo × (0,20% + 0,28%).
- Mancata rivalutazione = Flusso TFR × (1,5% + 75% × inflazione).
- TFR maturato a bilancio = Fondo TFR × (1,5% + 75% × inflazione).

Apri `index.html` nel browser per usare la webapp.
