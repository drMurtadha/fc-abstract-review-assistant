import { describe, expect, it } from 'vitest';
import { checklist } from '../data/checklist';
import { runLocalReview } from './localReviewEngine';
import { mergeAiReview, parseAiPayload, validateAiPayload, type AiReviewPayload } from './aiReviewService';

const input = { studentName:'A', matricNo:'1', programme:'PhD', thesisTitle:'T', supervisorName:'S', examinerName:'', reviewDate:'2026-09-14', thesisLanguage:'English' as const, englishAbstract:'word '.repeat(150), malayAbstract:'kata '.repeat(150) };
const payload: AiReviewPayload = {
  items: checklist.map(([itemCode]) => ({ itemCode, result:'Yes', evidence:`Evidence ${itemCode}`, comment:`Comment ${itemCode}`, confidence:84 })),
  overallSummary:'Summary', majorCorrections:['Correction'], suggestedEnglishAbstract:'English revision', suggestedMalayAbstract:'Malay revision'
};

describe('AI review merge', () => {
  it('maps all AI judgments while preserving text-only caveats', () => {
    const result = mergeAiReview(runLocalReview(input), payload);
    expect(result.items).toHaveLength(33);
    expect(result.items.find((item) => item.itemCode === 'B1')?.autoResult).toBe('Yes');
    expect(result.items.find((item) => item.itemCode === 'B1')?.source).toBe('ai-assisted');
    expect(result.items.find((item) => item.itemCode === 'A4')?.autoResult).toBe('Needs Review');
    expect(result.items.find((item) => item.itemCode === 'C5')?.autoResult).toBe('Needs Review');
    expect(result.items.find((item) => item.itemCode === 'D2')?.autoResult).toBe('Needs Review');
    expect(result.aiStatus).toBe('completed');
  });

  it('keeps mechanical rule failures authoritative', () => {
    const local = runLocalReview({ ...input, englishAbstract:'short abstract', malayAbstract:'abstrak pendek' });
    const result = mergeAiReview(local, payload);
    expect(result.items.find((item) => item.itemCode === 'A5')?.autoResult).toBe('No');
    expect(result.items.find((item) => item.itemCode === 'A6')?.autoResult).toBe('No');
  });
});

describe('AI payload validation', () => {
  it('rejects malformed JSON', () => {
    expect(() => parseAiPayload('not json')).toThrow('AI returned malformed JSON.');
  });

  it('rejects a response missing the items array', () => {
    expect(() => parseAiPayload('{"overallSummary":"x"}')).toThrow('AI response was missing the expected structure.');
  });

  it('accepts a well-formed payload', () => {
    expect(() => validateAiPayload(payload)).not.toThrow();
  });

  it('rejects an unknown checklist code', () => {
    const bad: AiReviewPayload = { ...payload, items: [...payload.items, { itemCode:'Z9', result:'Yes', evidence:'e', comment:'c', confidence:80 }] };
    expect(() => validateAiPayload(bad)).toThrow('unknown checklist codes: Z9');
  });

  it('rejects a duplicate checklist code', () => {
    const bad: AiReviewPayload = { ...payload, items: [...payload.items, payload.items[0]] };
    expect(() => validateAiPayload(bad)).toThrow(`duplicate checklist codes: ${payload.items[0].itemCode}`);
  });

  it('rejects a missing checklist code', () => {
    const bad: AiReviewPayload = { ...payload, items: payload.items.slice(1) };
    expect(() => validateAiPayload(bad)).toThrow(`missing checklist items: ${checklist[0][0]}`);
  });

  it('rejects an invalid result value', () => {
    const bad: AiReviewPayload = { ...payload, items: [{ ...payload.items[0], result:'Maybe' as never }, ...payload.items.slice(1)] };
    expect(() => validateAiPayload(bad)).toThrow(`invalid result value for ${payload.items[0].itemCode}`);
  });
});
