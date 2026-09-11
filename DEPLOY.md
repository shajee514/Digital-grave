# Putting Digital Grave on the internet (Vercel)

You do **not** need to type any code. Everything is clicking buttons on a
website.

---

## Part 1 — Put the site online (5 minutes)

1. Go to **https://vercel.com** and click **Sign Up**.
2. Choose **Continue with GitHub** and allow access.
3. On your Vercel dashboard click **Add New… → Project**.
4. Find **Digital-grave** in the list and click **Import**.
5. Vercel will detect Next.js automatically. **Change nothing.**
6. Click **Deploy**.

Wait about two minutes. You will get a link like:

```
https://digital-grave.vercel.app
```

That link is your live website. It runs in **demo mode** — every wallet and
grave is clearly-labelled sample data, with a yellow banner saying so.

---

## Part 2 — Point it at your real token

Do this once you have the token deployed and know its address.

1. In Vercel, open your project → **Settings** → **Environment Variables**.
2. Add the rows from the table below (Name on the left, Value on the right).
3. Go to the **Deployments** tab → click the **…** menu on the newest one →
   **Redeploy**.

### The settings that matter

| Name | Value to enter |
| --- | --- |
| `NEXT_PUBLIC_DATA_MODE` | `live` |
| `NEXT_PUBLIC_RH_RPC_URL` | Your Robinhood Chain RPC address |
| `NEXT_PUBLIC_RIP_TOKEN_ADDRESS` | Your `$RIP` contract address |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel link, e.g. `https://digital-grave.vercel.app` |
| `INDEXER_START_BLOCK` | The block number your token was created in |

### Strongly recommended

Without these, the site plays it safe and calls every movement a
**transfer** instead of a buy or a sell. It will never guess.

| Name | Value to enter |
| --- | --- |
| `NEXT_PUBLIC_RIP_PAIR_ADDRESS` | The liquidity pair address |
| `NEXT_PUBLIC_RIP_ROUTER_ADDRESS` | The DEX router address |

### Optional polish

| Name | Value to enter |
| --- | --- |
| `NEXT_PUBLIC_RH_EXPLORER_URL` | Block explorer address |
| `NEXT_PUBLIC_DEX_NAME` | Name of the exchange |
| `NEXT_PUBLIC_DEX_SWAP_URL` | Direct "buy" link |
| `NEXT_PUBLIC_TWITTER_URL` | Your X profile |
| `NEXT_PUBLIC_TELEGRAM_URL` | Your Telegram group |
| `ADMIN_PASSWORD` | A long random password for `/admin` |

> The admin page is **hidden completely** in production until you set
> `ADMIN_PASSWORD`. That is deliberate, so it can never be left open.

---

## Why `INDEXER_START_BLOCK` matters

The site reads your token's history directly from the blockchain. Telling it
which block your token was born in means it reads **exactly** the right
range — fast and complete.

If you leave it at `0`, the site looks back a limited window instead. For a
brand-new token that is fine. For an older one it may miss early history —
and when that happens the site **says** the history is partial rather than
pretending it is complete.

---

## Checking it worked

Open your live link and check:

- The yellow **DEMO MODE** banner is **gone**
- `/token` shows your real contract address and its supply
- Searching a wallet that holds `$RIP` shows **🟢 ALIVE**

If something looks wrong, the site shows a friendly message such as
*"The cemetery database is temporarily updating"* instead of a technical
error. That usually means the RPC address is wrong or unreachable.

---

## A note on safety

- Never put a **private key** or **seed phrase** into Vercel, or anywhere else.
  This project never needs one — it only ever **reads** public data.
- `.env.local` on your computer is never uploaded to GitHub or Vercel.
- Only names starting with `NEXT_PUBLIC_` are visible in the browser.
  Everything else stays on the server.
