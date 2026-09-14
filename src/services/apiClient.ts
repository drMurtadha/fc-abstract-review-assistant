import type { ReviewResult, SubmissionInput } from '../types';
import { auth, isUtmUser, saveCloudReview } from './firebaseClient';

const endpoint = import.meta.env.VITE_APPS_SCRIPT_URL as string | undefined;

export async function callApi<T>(action: string, payload: unknown): Promise<T> {
  if (!endpoint) throw new Error('Apps Script endpoint is not configured.');
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, payload }),
      signal: controller.signal
    });
    const body = await response.json();
    if (!body.success) throw new Error(body.error || 'API request failed.');
    return body.data as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw new Error('The Google request timed out.');
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
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
  if (auth.currentUser && isUtmUser(auth.currentUser)) {
    const submissionId = `SUB-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    try {
      await saveCloudReview({ ...review, backendSaved: true, submission: { ...input, submissionId } });
      return { submissionId, status: 'Pre-checked', backendSaved: true, warning: undefined as string | undefined };
    } catch (error) {
      const local = saveLocalReview(review);
      return { submissionId: local.submission.submissionId!, status: 'Pre-checked', backendSaved: false, warning: error instanceof Error ? `Pre-check completed locally, but Firestore sync failed: ${error.message}` : 'Pre-check completed locally, but Firestore sync failed.' };
    }
  }
  if (endpoint) {
    try {
      const saved = await callApi<{ submissionId: string; status: string }>('createSubmission', { ...input, reviewItems: review.items });
      return { ...saved, backendSaved: true, warning: undefined as string | undefined };
    } catch (error) {
      const local = saveLocalReview(review);
      return {
        submissionId: local.submission.submissionId!,
        status: 'Pre-checked',
        backendSaved: false,
        warning: error instanceof Error
          ? `Pre-check completed locally, but Google storage is unavailable: ${error.message}`
          : 'Pre-check completed locally, but Google storage is unavailable.'
      };
    }
  }
  const saved = saveLocalReview(review);
  return { submissionId: saved.submission.submissionId!, status: 'Pre-checked', backendSaved: false, warning: 'Pre-check completed in local mode. Google storage is not configured.' };
}

export async function saveReviewerDecision(review: ReviewResult) {
  if (auth.currentUser && isUtmUser(auth.currentUser)) {
    try {
      await saveCloudReview(review);
      return { status: review.finalDecision!, backendSaved: true, warning: undefined as string | undefined };
    } catch (error) {
      return { backendSaved: false, warning: error instanceof Error ? `Decision saved locally, but Firestore sync failed: ${error.message}` : 'Decision saved locally, but Firestore sync failed.' };
    }
  }
  if (!review.backendSaved) {
    return {
      backendSaved: false,
      warning: 'Decision saved in this browser only because the original submission was not synced to Google.'
    };
  }
  try {
    const saved = await callApi<{ status: string }>('saveReviewerDecision', {
      submissionId: review.submission.submissionId,
      finalDecision: review.finalDecision,
      mainCorrections: review.mainCorrections || '',
      reviewerName: review.reviewerName,
      decisionDate: new Date().toISOString()
    });
    return { ...saved, backendSaved: true, warning: undefined as string | undefined };
  } catch (error) {
    return {
      backendSaved: false,
      warning: error instanceof Error
        ? `Decision saved in this browser, but Google storage is unavailable: ${error.message}`
        : 'Decision saved in this browser, but Google storage is unavailable.'
    };
  }
}
