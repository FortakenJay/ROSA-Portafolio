# Rosa Chen Liang

A portfolio is a room you walk through. This one belongs to Rosa Chen Liang: a name at the top, a landing picture, projects, illustrations, a short about, and a way to write. The address is [rosachenliang.com](https://rosachenliang.com).

The first visit in a browser tab opens on a pink curtain. Roses grow, the curtain lifts, and petals linger for a moment before the landing is there. Refresh the tab and the landing is already waiting. The curtain has done its job for that visit. Someone who prefers reduced motion never sees it.

Home, Projects, Illustration, and About sit in a row of pills under the name. On the landing the name is large. On every other page it shrinks, so the work can take the width. Home is one picture and one sentence. Projects is a list, and each project is a sequence of pictures with a title and a line under it. You can play that sequence, fill the screen, or open a picture and look closer. Illustration is a gallery: a piece can hold several pictures, and you move through them without leaving the page. About is a portrait, a few paragraphs, and an email. The footer carries whatever links were saved: Instagram, Pinterest, YouTube.

The sentences and pictures live as published rows in Supabase. This repository only reads them. An empty list says “New work soon.” A picture that is still processing does not appear. Drafts do not appear. The public page only meets work that has a published date and a finished image.

The pages are cached. A save in the editor asks this site to drop the matching cache, and the next visit reads the new row. That request has to carry a shared secret. A body full of junk tags is refused. The check for that lives in `npm test`, including a few hundred rounds of hostile input. The seed is the commit, so a failure can be run again.

Petrona and Yeseva One ship with the app, so a production build never waits on Google Fonts.

## Run it locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in the Supabase URL, the publishable key, and `REVALIDATE_SECRET`. The same secret belongs on the editor. Without a Supabase URL, local development falls back to stand-in drawings. A production build refuses to start without the URL and the key.

## What runs before a merge

GitHub Actions, on pull requests and on `main`:

- `npm run lint`
- `npm test`, which checks the revalidate body and then fuzzes it
- `npm run build`
- React Doctor, which fails when a change adds a new error

The build reads `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `REVALIDATE_SECRET` from repository Actions secrets. Add them under Settings, Secrets and variables, Actions, Repository secrets.

Vercel deploys `main` on its own and needs the same three values in the project settings. The editor that writes the rows lives in a separate repository.
