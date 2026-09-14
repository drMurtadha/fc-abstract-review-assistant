# Deployment guide

## GitHub Pages

1. Push the repository to GitHub with the repository name `fc-abstract-review-assistant` (or update `base` in `vite.config.ts`).
2. In repository **Settings → Pages**, select **GitHub Actions** as the source.
3. Add the repository Actions secret `VITE_APPS_SCRIPT_URL` if the backend is enabled.
4. Push to `main`; the workflow builds and publishes `dist/`.

Hash routing is used so direct navigation works reliably on GitHub Pages.

## Apps Script

Follow `GOOGLE_APPS_SCRIPT_SETUP.md`, deploy a new version after backend changes, and verify `healthCheck`. Production deployments should be limited to the faculty organisation or approved accounts.
