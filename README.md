# Velnora Travel

The Velnora Travel website, rebuilt from the original PHP site in Next.js 16, TypeScript and Tailwind CSS 4.

Every piece of text, image and link on the public site comes from JSON files in `content/`, and there is an admin panel at `/admin` for editing them. Form submissions (trip inquiries, contact messages, newsletter signups) are stored and shown in the admin inbox.

## Running it locally

You need Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

- `SITE_URL`: the address the site runs on. Used for canonical links, the sitemap and share links.
- `ADMIN_EMAIL`: the email you sign in with.
- `ADMIN_PASSWORD_HASH`: generate it with `npm run admin:hash -- "your password"` and paste the printed line.
- `SESSION_SECRET`: a random string of 32+ characters. The command to generate one is in `.env.example`.

Then start the dev server with `npm run dev`, or run a production build:

```bash
npm run build
npm start
```

Other scripts: `npm run lint` and `npm run typecheck`.

## Where things live

```
content/            All site content (commit this)
  settings.json     Contact details, social links, footer, home video
  taxonomy.json     Regions, travel styles, package types, article categories
  destinations.json
  packages.json
  articles.json     Travel guide
  faqs.json
  legal.json        Privacy policy, terms, cookie policy, booking terms, cancellation policy
  pages/*.json      Copy for each page, plus shared wording for detail-page templates
storage/            Written at runtime, not in git
  submissions.json  Form submissions
  uploads/          Images uploaded through the admin (served at /uploads/...)
public/images/      The original site's photos
src/app/(site)/     Public pages
src/app/admin/      Admin panel
src/lib/content/    Reading, validating and saving content
```

Collections (destinations, packages, articles, legal pages) are validated with the zod schemas in `src/lib/content/schemas.ts`. Page copy has no hand-written schema. When it's saved, it's checked against the structure of the existing file, so a missing or misspelled field is rejected instead of breaking a page.

In titles, `*words*` get the gold accent style and a line break becomes `<br>`. For example, `Curated *Vacation* Collections`.

## How edits reach the site

Public pages are pre-rendered as static HTML at build time. When something is saved in the admin, the server rewrites the JSON file and calls `revalidatePath("/", "layout")`, so the next visitor gets freshly rendered pages. No rebuild or restart is needed.

If you edit files in `content/` by hand on a running server, those changes won't appear until the next save in the admin or the next build.

## Admin panel

Sign in at `/admin/login`. From there you can:

- edit page copy, destinations, packages, articles, FAQs and legal pages, and create or delete entries,
- manage regions and categories. Menus and filters only list ones that have content, so an empty region never shows up as a dead link,
- upload images, either from the Media page or straight from any image field,
- read, mark and delete form submissions, and export them as CSV,
- change contact details, social links and the home page video.

Some safeguards run on the server:

- A destination that packages or the home page still point to can't be deleted.
- A region or category that content still uses can't be removed.
- Renaming a destination's slug updates the packages and home page cards that reference it.

Login attempts are limited to 5 per IP every 15 minutes. Sessions are signed, HTTP-only cookies that last 8 hours.

## Deploying

This app writes to its own disk (`content/`, `storage/`), so it needs a Node.js server with a persistent filesystem: a VPS, a container with a mounted volume, or a Node host such as Render or Railway with a disk attached. It **won't keep changes on serverless hosting like Vercel or Netlify**, because their filesystem is read-only or wiped between requests. If you want to host there, swap the functions in `src/lib/content/store.ts` and `src/lib/submissions.ts` for a database; the rest of the app only talks to those modules.

Checklist:

- Set the four environment variables on the host. `SITE_URL` must be the real `https://` address, because the session cookie is only marked Secure on https.
- Back up `content/` and `storage/`. They hold everything the admin creates.
- Run a single instance. Login rate limiting is kept in memory, and file writes are serialized per process. If you ever run several instances, also set `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`.
- Put the server behind a reverse proxy that sets `X-Forwarded-For`, so rate limiting sees real visitor IPs.

## Coming from the PHP site

Old URLs such as `/about.php`, `/destination-detail.php?slug=maldives` and `/packages.html` redirect permanently to their new addresses.

Behavior that changed on purpose:

- Forms save their submissions instead of only showing a thank-you message. There are no email notifications yet.
- Unknown destinations, packages and articles return a real 404.
- Listing pages are rendered on the server, so their content is in the HTML for search engines.
- Images are resized and served as AVIF/WebP. The 2.8 MB hero photo is delivered at about 110 KB.
- The placeholder video link and the `#` social links were removed. Add real links under Settings and they'll appear.
- The package page's sidebar phone and email come from Settings instead of the old placeholder number.
- Package pages list each package's own inclusions, where the old site showed the same hard-coded list on every package.
- The "Paris" card on the home page was replaced with Kyoto, because there's no Paris destination for it to link to.
