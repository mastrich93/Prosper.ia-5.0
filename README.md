# Prosperia – Raccolta e Vendita Lead

Questo repository contiene il prototipo di **Prosperia**, una piattaforma per la raccolta e la vendita di lead in Italia. È destinata alla raccolta di richieste da parte di utenti finali per prodotti e servizi e alla rivendita di tali lead a imprese interessate, con un processo di verifica tramite OTP, determinazione dinamica del prezzo e assegnazione alle aziende. La struttura è suddivisa in tre applicazioni principali:

- **apps/api** – backend REST costruito con NestJS. Gestisce l'autenticazione, la raccolta lead, il matching con le aziende, i pagamenti e i webhook.
- **apps/web** – frontend Next.js (React) che fornisce la chat intake e la dashboard admin/supervisore.
- **apps/worker** – processo worker basato su BullMQ per l'esecuzione asincrona di attività (OTP, matching, invio email/WhatsApp, newsletter, retry).

## Componenti principali

* **API (`apps/api`)** – Backend REST costruito con [NestJS](https://nestjs.com/). Espone gli endpoint per:
  - **Intake dei lead** (`POST /leads/intake`): accetta i dati del lead, genera un OTP e lo memorizza in maniera volatile; l'OTP dovrebbe essere inviato via e‑mail/SMS.
  - **Verifica OTP** (`POST /leads/:id/verify-email`): conferma il lead con l'OTP ricevuto dall'utente.
  - **Stima score e prezzo** (`POST /leads/:id/estimate`): calcola uno *score* (qualità) e un prezzo dinamico basandosi sui dati forniti, usando le funzioni di `src/utils/scoring.ts`.
  - **Lista lead** (`GET /leads`): restituisce tutti i lead raccolti (solo admin).

  Le funzionalità di invio OTP, matching con aziende, pagamenti e newsletter sono predisposte per essere integrate tramite servizi dedicati (non implementati in questo prototipo).

* **Web (`apps/web`)** – Frontend [Next.js](https://nextjs.org/) con semplici pagine per:
  - Presentazione e modulo di contatto.
  - Verifica del codice OTP.
  - Dashboard di amministrazione (placeholder).
  - Form di iscrizione alla newsletter con double opt‑in.

* **Worker (`apps/worker`)** – Processi asincroni basati su [BullMQ](https://docs.bullmq.io/) per gestire job a coda (matching, invio email/WhatsApp, newsletter, retry, ecc.).

Questo repository include anche uno schema Prisma (`prisma/schema.prisma`) di esempio per un database PostgreSQL (non utilizzato nel prototipo in memoria).

## Avvio locale

Prerequisiti:

* **Node.js 18 o superiore** e **npm** installati.
* **PostgreSQL** e **Redis** in esecuzione (oppure service Render se configurato).

```bash
# installazione dipendenze per ciascuna app (necessario accesso internet)
cd apps/api && npm install
cd ../web && npm install
cd ../worker && npm install

# avvio in modalità sviluppo
cd apps/api && npm run start:dev
cd apps/web && npm run dev
cd apps/worker && npm run start
```

Le variabili d'ambiente necessarie (DB, Redis, Gmail, Stripe, PayPal, ecc.) vanno definite in un file `.env` o tramite Render. Fare riferimento al documento di specifica per la lista completa.

## Distribuzione su Render

Il file `render.yaml` contiene una configurazione di esempio per deployare le tre app su [Render.com](https://render.com). Prevede un database PostgreSQL e una cache Redis.

## Distribuzione su Railway (1‑click)

Per distribuire Prosperia su [Railway](https://railway.com) con un solo click è consigliato creare un **template Railway**. Il template permette di generare un progetto con tre servizi (API, Web e Worker) e un add‑on Redis già collegato. Una volta creato il template, puoi aggiungere questo pulsante nel README del tuo repository pubblico:

```md
[![Deploy on Railway](https://railway.com/button.svg)](TEMPLATE_URL)
```

Sostituisci `TEMPLATE_URL` con il link generato da Railway quando crei il template. Puoi creare il template seguendo questi passaggi:

1. Accedi a Railway e scegli **Template Composer → Create Template**.
2. Aggiungi tre servizi dal tuo repository impostando per ognuno la **Root Directory** a `apps/web`, `apps/api` e `apps/worker`. Railway rileverà automaticamente i file `railway.json` presenti in ciascuna cartella per definire i comandi di build e start.
3. Aggiungi l'add‑on **Redis** e mappa la variabile `REDIS_URL` verso il servizio **worker** (e verso altri servizi se necessario). Per un database PostgreSQL puoi aggiungere l'add‑on **PostgreSQL** e mappare `DATABASE_URL` nel servizio API.
4. Salva il template e copia l'URL del template. Chiunque clicchi il pulsante “Deploy on Railway” nel README potrà creare un nuovo progetto con i servizi già configurati.

Il progetto è predisposto con file `railway.json` in ogni cartella e il worker legge la variabile `REDIS_URL`. La cartella API espone un endpoint `/health` per il check di salute configurato nel file `railway.json` (vedi `apps/api/src/health.controller.ts`).
