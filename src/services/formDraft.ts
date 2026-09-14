import type { SubmissionInput } from '../types';

const draftKey = 'fc-abstract-review-form-draft';

export function loadFormDraft(fallback: SubmissionInput): SubmissionInput {
  try {
    const saved = JSON.parse(localStorage.getItem(draftKey) || 'null') as Partial<SubmissionInput> | null;
    return saved ? { ...fallback, ...saved } : fallback;
  } catch {
    return fallback;
  }
}

export function saveFormDraft(form: SubmissionInput): void {
  localStorage.setItem(draftKey, JSON.stringify(form));
}

export function clearFormDraft(): void {
  localStorage.removeItem(draftKey);
}
