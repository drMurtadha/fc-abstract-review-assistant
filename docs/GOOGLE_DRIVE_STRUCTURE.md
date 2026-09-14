# Google Drive structure

`setupWorkspace()` creates:

```text
FC Abstract Review System/
├── 2026-2027/
│   ├── Master/
│   ├── PhD/
│   └── Mixed Mode/
├── Uploaded Abstracts/
├── Generated Reports/
├── Generated Corrections/
├── Templates/
└── System Logs/
```

Each submission creates a folder named `{submission_id}_{student_name}` under Generated Reports. Names are sanitised before folder creation.
