# Enable personal accounts

The bilingual interface and browser-local guest favorites work without configuration. The project URL and public publishable key are now configured for the owner's Supabase project. The favorites table, RLS policies, `https://adecolab.space` Site URL and `https://adecolab.space/japanese.html` callback were configured on 2026-11-17. Email authentication, email confirmation and an 8-character password minimum are enabled. Custom SMTP and live account acceptance tests still need completion before inviting classmates.

1. Create a Supabase project in your own account. Keep the database password private.
2. Run the complete contents of `japanese/supabase.sql` once in that project's SQL Editor. This creates `vocabulary_favorites`, enables row-level security, and allows authenticated users to select, insert and delete only their own rows. Anonymous users have no table access. No passwords are stored in this table.
3. In Authentication, enable Email/password sign-in and email confirmations. Set the password minimum to at least 8 characters to match this UI. Configure production email delivery before inviting the class; test confirmation and password-reset delivery.
4. Set Authentication URL Configuration's Site URL to the actual website. Add the exact `https://YOUR-SITE/japanese.html` URL to Redirect URLs. Include the GitHub Pages repository path if applicable. For local QA, add `http://localhost:8766/japanese.html` as a separate redirect URL.
5. From the project's Connect dialog / API Keys settings, obtain the Project URL and a **publishable** key (`sb_publishable_...`). Fill in `japanese/config.js`. These two values are public browser configuration. Never use a secret key, `service_role`, a database connection string, or a database password. The app rejects keys without the publishable prefix.
6. Deploy the website including the `japanese/` directory. Supabase's SDK is loaded from `https://esm.sh/@supabase/supabase-js@2.119.0` only when both configuration values are present. A blocked SDK/network connection shows an account connection error; guest study remains available. Reload after repairing a connection or configuration error.

## Required live acceptance checks

Use two test email accounts owned by you (A and B); don't use classmates' credentials.

- Register A, confirm its email, sign in, save a word and reload: A's favorite remains. Sign out: A's cloud favorites disappear; the browser's separate guest collection returns.
- Sign in as B: A's favorite is absent. Save a different word. Return to A: A sees only its own collection. Test A on another device to confirm cloud sync on login/reload.
- Verify the policies directly using the project's API: A cannot SELECT, INSERT or DELETE rows with B's user ID; an unauthenticated request cannot read the table. RLS must be enabled before public deployment.
- Confirm duplicate saves are harmless, removing a favorite persists, a failed request is visibly reported, and retrying a failed load restores the current account.
- Request a password reset, open the email link, enter a new password and use Set new password. Confirm sign-in with the new password.

Do not claim live authentication or database isolation is verified until these checks pass against the configured project. Local automated tests exercise account transitions and persistence with an injected mock data source, not a live Supabase database.

## Cloudflare deployment

The existing `adecolab-animal-tracker` Worker uses the GitHub repository's `main` branch. Its build command is `node scripts/build-static.cjs`; production deploy remains `npx wrangler deploy`, and preview versions use `npx wrangler versions upload`. `wrangler.jsonc` identifies the static assets output as `dist/`. The build copies only the runtime HTML/JS/CSS and `_redirects`; docs, SQL, tests, local PDF renders and Git metadata are excluded. `_redirects` serves the root URL from `index.html` while preserving `japanese.html` for auth callbacks.

## Behavior

UI language follows the browser on first visit; a one-click choice is remembered and shared with the animal tracker. Language switching preserves the current exercise and typed answer. Guest favorites are stored only in this browser. Each signed-in account reads its own cloud collection; guest favorites are not automatically copied into an account. Cloud edits are loaded on sign-in/reload/retry, not pushed to other open tabs in real time. Changing account resets the active exercise. Changing favorites does not modify a running exercise until restart.

References: [password authentication](https://supabase.com/docs/guides/auth/passwords), [publishable keys](https://supabase.com/docs/guides/api/api-keys), [row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security).
