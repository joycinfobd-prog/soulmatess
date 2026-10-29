# Love Universe (full-stack)

Node.js + Express. No database to install locally (content lives in `data/content.json`).

## Run
    npm install
    ADMIN_PASSWORD="your-secret" npm start     # Windows PowerShell: $env:ADMIN_PASSWORD="your-secret"; npm start

- Website: http://localhost:3000   (first asks for the **entrance PIN**, default `1234`)
- Admin: http://localhost:3000/admin   (password = `ADMIN_PASSWORD`, default `admin123`; change it in Admin -> Settings)

## Vercel — ONE-TIME SETUP (this is why admin changes did not show on the site)
Vercel has no permanent disk. Without a database every "Save & go live" fails with *"Storage not set up"* and the site keeps showing the original texts.
1. vercel.com -> your project -> **Storage** -> create/connect **Upstash Redis** (free plan is enough) -> connect to this project (all environments).
2. Settings -> Environment Variables -> add `ADMIN_PASSWORD` (your admin password).
3. **Deployments -> latest -> Redeploy** (needed so the project sees the new database).
4. Open `/admin`, change something, press **Save & go live** — it is live immediately.

## What is where
- **Entrance PIN** — Admin -> Settings -> "Website entrance PIN". Visitors must type it before they see anything. Change/turn off any time. (Boxes can still have their own extra PIN.)
- **Home & Boxes** — each box = a gift card on the home page. "New box" lets you pick a **preset** (layout + design):
  Love Letters · Chirkut Notes · Sealed Envelopes · Our Story/Anniversary · Puja & Festival Wishes · Pohela Boishakh · or start from scratch.
  Afterwards you can change the **layout** (tap-to-open, serial notes, envelopes, timeline, swipe cards), **colors** (7), **decoration**, PIN, opening date and whether visitors can reply.
- **Letters** — serial letters per box (#1, #2 …). No character limit. Each letter can have its own photo (upload / change / remove). "Add letters from photos" makes one letter per photo.
- **Chirkut** (was "Birthday Wishes") — notes in serial order, each with a photo.
- **Photo Letters** — a separate page with its own photos and its own letters. Not connected to the Birthday website.
- **Birthday Page** — everything for the birthday website, including its own Love Gallery photos. Nothing here links to other pages.
- **Replies** — visitors can reply under every letter (all boxes + Photo Letters). All conversations show here: the main letter, her reply, your reply. Your reply appears under the letter on the site. "Message me" on the site is a general chat that also lands here.
- **Auto Text / Settings** — as before (WhatsApp number, quick replies, admin password, backup).

Press **Save & go live** (or Ctrl+S) — changes appear on the site instantly. Replies you send from the Replies page are live immediately.
Photos you no longer use anywhere are deleted from storage on the next save.
