import type { ReviewResult, SubmissionInput } from '../types';

const endpoint = import.meta.env.VITE_APPS_SCRIPT_URL as string | undefined;

export async function callApi<T>(action: string, payload: unknown): Promise<T> {
  if (!endpoint) throw new Error('Apps Script endpoint is not configured.');
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, payload })
  });
  const body = await response.json();
  if (!body.success) throw new Error(body.error || 'API request failed.');
  return body.data as T;
}

const storageKey = 'fc-abstract-review-submissions';
export function listLocalReviews(): ReviewResult[] {
  try { return JSON.parse(localStorage.getItem(storageKey) || '[]') as ReviewResult[]; }
  catch { return []; }
}
export function saveLocalReview(review: ReviewResult): ReviewResult {
  const current = listLocalReviews();
  const id = review.submission.submissionId || `SUB-${new Date().getFullYear()}-${String(current.length + 1).padStart(4, '0')}`;
  const saved = { ...review, submission: { ...review.submission, submissionId: id } };
  const next = [saved, ...current.filter((entry) => entry.submission.submissionId !== id)];
  localStorage.setItem(storageKey, JSON.stringify(next));
  return saved;
}
export async function saveSubmission(input: SubmissionInput, review: ReviewResult) {
  if (endpoint) return callApi<{ submissionId: string; status: string }>('createSubmission', { ...input, reviewItems: review.items });
  const saved = saveLocalReview(review);
  return { submissionId: saved.submission.submissionId!, status: 'Pre-checked' };
}
