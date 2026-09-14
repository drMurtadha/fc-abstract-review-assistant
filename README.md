# FC Abstract Review Assistant

A responsive Vite + React application for reviewing bilingual thesis abstracts against the Faculty of Computing guideline and official review checklist.

## What is included

- Bilingual English/Bahasa Melayu submission form
- Local rule-based pre-check covering checklist A1–F4
- Word count, paragraph, future-tense, abbreviation, and number-unit checks
- Explicit `Needs Review` status for judgments that rules cannot safely make
- Reviewer overrides and one of three official final decisions
- Dashboard with browser-storage fallback
- Printable report preview (use the browser's **Save as PDF** option)
- Google Apps Script API for Sheets, Drive, audit logs, AI proxying, and report generation
- GitHub Pages deployment workflow

The application assists review; it does not automatically approve an abstract.

## Run locally

Requirements: Node.js 20 or later.

```bash
pnpm install
pnpm dev
```

Run verification:

```bash
pnpm test
pnpm build
```

Without an Apps Script URL, submissions are stored only in the current browser's `localStorage`. To connect the backend:

```bash
cp .env.example .env
```

Then set `VITE_APPS_SCRIPT_URL` to the deployed Web App `/exec` URL and rebuild.

## Production setup

1. Follow [Google Apps Script setup](docs/GOOGLE_APPS_SCRIPT_SETUP.md).
2. Configure the frontend endpoint in `.env` or the GitHub Actions repository variable.
3. Follow the [deployment guide](docs/DEPLOYMENT_GUIDE.md).
4. Restrict Apps Script access to approved organisational users before processing real student records.

## Source of truth

- `Thesis Abstract Guidelines_FC_Ver1.0.pdf`
- `Thesis Abstract Review Checklist_FC.docx`

The rule mapping is documented in [CHECKLIST_MAPPING.md](docs/CHECKLIST_MAPPING.md). No faculty rules beyond those sources are treated as authoritative.

## Project structure

```text
src/                 React UI, local review engine, services, tests
apps-script/         Google Apps Script backend
docs/                Architecture, setup, checklist, testing, deployment
.github/workflows/   GitHub Pages deployment
```

## Important security notes

- Never put AI keys, reviewer passcodes, Drive IDs, or student records in frontend source.
- Store private values in Apps Script Properties Service.
- The included `AI_API_URL` interface is provider-neutral; adapt the payload/response parser to your approved provider.
- Browser storage is intended for prototype/testing data, not sensitive production records.
