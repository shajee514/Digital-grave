# DIGITAL GRAVE — $RIP

**BUY. HOLD. LIVE. SELL. DIE.**

Every wallet has a story. This website turns any wallet's $RIP trading
history into a funny digital life story.

---

## For someone who has never written code

You only need to know three commands. Open a terminal in this folder and type:

| Command | What it does |
| --- | --- |
| `npm install` | Downloads everything the website needs. Run once. |
| `npm run dev` | Starts the website so you can look at it. |
| `npm run build` | Checks everything works, ready for the real internet. |

After `npm run dev`, open **http://localhost:3000** in your browser.

To stop it, press `Ctrl` + `C` in the terminal.

---

## Where settings live

**One file controls everything: `.env.local`**

Open it in any text editor. Lines look like this:

```
NEXT_PUBLIC_RIP_TOKEN_ADDRESS=""
```

You put your value between the quotes. Save the file, then stop and restart
`npm run dev` for changes to take effect.

`.env.example` is a copy with explanations of every single setting.

> ⚠️ Never put a private key or seed phrase in this file, or in any file.
> This project never needs one.

---

## Demo mode vs real mode

Right now the site runs in **DEMO MODE**. Every wallet, grave and number you
see is invented sample data, and a yellow banner says so at the top of every
page. This lets you review the whole design before the token exists.

**Live mode is built and working.** To switch, put these in `.env.local`:

```
NEXT_PUBLIC_DATA_MODE="live"
NEXT_PUBLIC_RH_RPC_URL="<your Robinhood Chain RPC address>"
NEXT_PUBLIC_RIP_TOKEN_ADDRESS="<your $RIP contract address>"
INDEXER_START_BLOCK="<the block your token was created in>"
```

Then stop and restart `npm run dev`. The yellow banner disappears and every
page — wallet search, graveyard, living wall, leaderboard — is built from
real Transfer events read straight from the chain. **No database needed.**

Strongly recommended, so buys and sells can be told apart from ordinary
transfers:

```
NEXT_PUBLIC_RIP_PAIR_ADDRESS="<liquidity pair address>"
NEXT_PUBLIC_RIP_ROUTER_ADDRESS="<DEX router address>"
```

Without them nothing is guessed — every movement is simply labelled a
transfer.

To put the site on the internet, see **[DEPLOY.md](DEPLOY.md)**.

---

## Project layout

```
src/
  app/                 Every page of the website
  components/          Reusable pieces (buttons, cards, navbar)
  lib/
    config/            ⭐ ALL addresses and settings live here
    domain/            The rules: lives, deaths, levels, causes of death
    data/              Swappable data source (demo now, database later)
    mock/              The pretend cemetery used in demo mode
    celebrities/       ⭐ Celebrity Graveyard content (parody profiles)
    wallet/            Optional "connect wallet" support
```

---

## 🪦 Celebrity Graveyard

A joke section at `/celebrities` with parody graves for famous names.

**To change the wording of any profile**, open:

```
src/lib/celebrities/data.ts
```

Each person is a block of plain text — name, title, status, cause of death,
last words, achievement and biography. Edit the words between the quotes,
save, and restart `npm run dev`.

**Every profile is parody.** Rules built into the code:

- The data has **no field for a wallet address or token balance**, so this
  section physically cannot claim anyone bought, holds or endorses $RIP.
- Nobody is described as dead. Causes of death and "last words" are invented
  jokes, and every screen labels them as fictional.
- The disclaimer appears on the graveyard page and on every profile.
- The words **FICTIONAL PARODY** are drawn into the share image itself, so
  the label travels with the picture even if someone re-posts it alone.

The most important idea: **every page asks `dataSource` for its data.**
Swapping demo data for real data is a change in one folder, not fifty pages.

---

## The rules of life and death

Written once in `src/lib/domain/survival.ts`, used everywhere:

- A **life starts** when a wallet goes from holding nothing to holding $RIP.
- A **life ends** when the balance returns to zero.
- A **grave** is only created when the life ended in an actual **sale**.
  Sending tokens to another wallet is *not* dying, so it makes no grave.
- **Resurrection** is starting a new life after having died before.

Causes of death are jokes chosen by a fixed rule from how long the position
was held. The same grave always shows the same cause, forever.

---

## Build phases

| Phase | What | Status |
| --- | --- | --- |
| 1 | Full frontend with demo data | ✅ Done |
| 2 | Supabase database | ⬜ Only needed at large scale |
| 3 | Blockchain configuration | ✅ Done |
| 4 | The indexer | ⬜ Only needed at large scale |
| 5 | Connect real $RIP data | ✅ Done (direct from chain) |
| 6 | Wallet history engine | ✅ Done |
| 7 | Grave generation | ✅ Done |
| 8 | Leaderboard | ✅ Done |
| 9 | Sharing system | ✅ Done |
| 10 | Lucky Survivor architecture | ⬜ |
| 11 | Security and performance | ⬜ |
| 12 | Production deployment | ⬜ |

---

## Safety rules this project follows

- Never asks for a seed phrase, private key or password — for any reason.
- Never stores private keys.
- The Supabase service-role key is server-only, never sent to the browser.
- Wallet connection is **optional**. Searching works without it.
- Only shortened addresses (`0x71...92A`) are shown publicly and on share cards.
- No contract address is ever invented. Unknown values show
  **CONFIGURATION REQUIRED** instead.
- The admin page is hidden in production unless `ADMIN_PASSWORD` is set.
- Public APIs are rate-limited.

---

## Legal note

$RIP is a meme project. Graves, survival levels and achievements are
cosmetic. They carry no financial value, ownership or entitlement.
Nothing here is financial advice.
