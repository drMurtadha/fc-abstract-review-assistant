import { describe, expect, it } from 'vitest';
import { countParagraphs, countWords, extractAbbreviations, runLocalReview } from './localReviewEngine';

const base = { studentName:'A', matricNo:'1', programme:'PhD', thesisTitle:'T', supervisorName:'S', examinerName:'', reviewDate:'2026-09-14', thesisLanguage:'English' as const, englishAbstract:'word '.repeat(150), malayAbstract:'kata '.repeat(150) };
describe('local review engine', () => {
  it('counts words and paragraphs', () => { expect(countWords('one two\nthree')).toBe(3); expect(countParagraphs('one\n\ntwo')).toBe(2); });
  it('extracts abbreviations', () => expect(extractAbbreviations('Machine Learning (ML) is used.')).toEqual(['ML']));
  it('passes valid word counts and flags future tense and unit spacing', () => {
    const result = runLocalReview({ ...base, englishAbstract: `${base.englishAbstract} will examine 3mm` });
    expect(result.items.find((x) => x.itemCode === 'E6')?.autoResult).toBe('No');
    expect(result.items.find((x) => x.itemCode === 'F3')?.autoResult).toBe('No');
    expect(result.items).toHaveLength(33);
  });
});
