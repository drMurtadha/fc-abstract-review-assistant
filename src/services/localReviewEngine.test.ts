import { describe, expect, it } from 'vitest';
import { countParagraphs, countWords, extractAbbreviations, runLocalReview } from './localReviewEngine';
import { checklist } from '../data/checklist';

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
  it('covers every official checklist item exactly once', () => {
    const expected = [
      'A1','A2','A3','A4','A5','A6','B1','B2','B3','B4','B5','B6',
      'C1','C2','C3','C4','C5','D1','D2','D3','D4','D5',
      'E1','E2','E3','E4','E5','E6','E7','F1','F2','F3','F4'
    ];
    const definitions = checklist.map(([code]) => code);
    const results = runLocalReview(base).items.map(({ itemCode }) => itemCode);
    expect(definitions).toEqual(expected);
    expect(results).toEqual(expected);
    expect(new Set(results).size).toBe(33);
  });
});
