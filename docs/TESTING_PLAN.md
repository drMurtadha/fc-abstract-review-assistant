# Testing plan

Automated unit tests cover word count, paragraph count, abbreviation extraction, future tense, unit spacing, checklist length, and a 150-word boundary case.

Run:

```bash
pnpm test
pnpm build
```

Manual cases should include valid 150–300 word abstracts, both word-count boundaries, missing language, multiple paragraphs, missing content components, future tense, inconsistent abbreviations, `3mm`, literal BM translation, reviewer overrides, all three decisions, browser refresh, print/PDF, mobile layout, keyboard navigation, backend failure, and missing AI configuration.

For Apps Script, verify `healthCheck`, one-time workspace creation, submission persistence, folder creation, list/get actions, audit entries, decision updates, report generation, and safe AI failure when properties are missing.
