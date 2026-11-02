# Rosa Chen Liang

Public portfolio. It reads published work from Supabase and is deployed on Vercel from `main`.

## Local

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in the Supabase URL, the publishable key, and `REVALIDATE_SECRET`.

## Checks

GitHub Actions runs these on pull requests and on `main`:

- `npm run lint`
- `npm test` checks the revalidate input. A chaos pass then fuzzes that input for 400 rounds. The seed is the commit SHA, so a failure can be repeated.
- `npm run build`
- React Doctor fails when a change adds a new error.

The build needs `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `REVALIDATE_SECRET` as repository Actions secrets. Vercel deploys `main` and needs the same values in the project settings.
