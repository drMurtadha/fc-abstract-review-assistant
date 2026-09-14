# Google Apps Script setup

1. Create a standalone Apps Script project in the faculty-controlled Google account.
2. Copy every file from `apps-script/` into the project, preserving filenames.
3. In **Project Settings → Script Properties**, add private values as needed:

   - `REVIEWER_PASSCODE` (if passcode protection is added for Phase 1)
   - `AI_API_KEY` and `AI_API_URL` (optional)

4. Run `setupWorkspace()` once from the editor and approve the requested Sheets/Drive permissions. It creates the Drive folders and registry spreadsheet, then saves their IDs as Script Properties.
5. Deploy as **Web app**. Use **Execute as me** and restrict access to the organisation or approved users for production.
6. Copy the `/exec` URL into frontend `VITE_APPS_SCRIPT_URL`.
7. Test `GET <url>?action=healthCheck` before connecting the frontend.

Do not commit generated folder IDs, spreadsheet IDs, deployment URLs, API keys, or passcodes.
