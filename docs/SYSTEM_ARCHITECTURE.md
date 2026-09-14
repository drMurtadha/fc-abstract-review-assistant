# System architecture

```text
Browser on GitHub Pages
  ├─ instant rule-based review (no AI required)
  ├─ temporary localStorage fallback for prototype mode
  └─ HTTPS text/plain JSON requests
          ↓
Google Apps Script Web App
  ├─ Google Sheets: submissions, checklist items, decisions, audit
  ├─ Google Drive: original text, Docs, PDFs
  └─ optional approved AI endpoint (key in Script Properties)
```

The frontend contains no privileged credential. Semantic, language, translation, and one-page judgments are marked `Needs Review` unless a reviewer or approved server-side review confirms them.

## API contract

Requests use `{ "action": "...", "payload": { ... } }`. Responses use `{ "success": true, "data": ..., "error": null }` or the corresponding structured error shape.

Available actions: `healthCheck`, `setupWorkspace`, `createSubmission`, `getSubmission`, `listSubmissions`, `saveReviewItems`, `saveReviewerDecision`, `updateSubmissionStatus`, `runAiReview`, and `generateReport`.
