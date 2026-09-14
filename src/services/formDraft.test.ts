import { beforeEach, describe, expect, it } from 'vitest';
import { clearFormDraft, loadFormDraft, saveFormDraft } from './formDraft';
import type { SubmissionInput } from '../types';

const fallback: SubmissionInput = {
  studentName: '', matricNo: '', programme: '', thesisTitle: '', supervisorName: '', examinerName: '',
  reviewDate: '2026-09-14', thesisLanguage: 'English', englishAbstract: '', malayAbstract: ''
};

describe('form draft persistence', () => {
  beforeEach(() => localStorage.clear());

  it('keeps each signed-in user draft separate', () => {
    saveFormDraft({ ...fallback, studentName: 'Student A' }, 'user-a');
    saveFormDraft({ ...fallback, studentName: 'Student B' }, 'user-b');
    expect(loadFormDraft(fallback, 'user-a').studentName).toBe('Student A');
    expect(loadFormDraft(fallback, 'user-b').studentName).toBe('Student B');
  });

  it('clears only the selected user draft', () => {
    saveFormDraft({ ...fallback, thesisTitle: 'Saved title' }, 'user-a');
    clearFormDraft('user-a');
    expect(loadFormDraft(fallback, 'user-a')).toEqual(fallback);
  });
});
