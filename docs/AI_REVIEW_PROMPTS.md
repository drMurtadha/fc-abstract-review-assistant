# AI review guidance

AI review is optional and must run only through Google Apps Script. Use the exact English, Bahasa Melayu, and alignment prompt structures from `FC_Abstract_Review_App_Instructions_v2.md`. Require structured JSON, preserve the student's meaning, and explicitly forbid invented results or claims.

The provided backend expects `AI_API_URL` and `AI_API_KEY` in Script Properties. Its payload is intentionally provider-neutral; adapt it to an institutionally approved provider, validate returned JSON, and write individual issues to `AI_Comments` before production use.

AI output remains advisory. Reviewers may accept, edit, or ignore it.
