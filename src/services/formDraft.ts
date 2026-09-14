import type { SubmissionInput } from '../types';

const draftKey = (userId = 'local') => `fc-abstract-review-form-draft:${userId}`;
const legacyDraftKey = 'fc-abstract-review-form-draft';

export function loadFormDraft(fallback: SubmissionInput, userId?: string): SubmissionInput {
  try {
    const raw = localStorage.getItem(draftKey(userId)) || localStorage.getItem(legacyDraftKey);
    const saved = JSON.parse(raw || 'null') as Partial<SubmissionInput> | null;
    return saved ? { ...fallback, ...saved } : fallback;
  } catch {
    return fallback;
  }
}

export function saveFormDraft(form: SubmissionInput, userId?: string): void {
  localStorage.setItem(draftKey(userId), JSON.stringify(form));
}

export function clearFormDraft(userId?: string): void {
  localStorage.removeItem(draftKey(userId));
}
