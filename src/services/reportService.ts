import type { ReviewResult } from '../types';

export function copyReportSummary(review: ReviewResult) {
  const failed = review.items.filter((item) => (item.reviewerResult || item.autoResult) === 'No');
  const text = [
    'Faculty of Computing — Thesis Abstract Review Report',
    `${review.submission.studentName} (${review.submission.matricNo})`,
    review.submission.thesisTitle,
    `English: ${review.englishWordCount} words | Bahasa Melayu: ${review.malayWordCount} words`,
    `Decision: ${review.finalDecision || 'Pending reviewer decision'}`,
    `Corrections: ${failed.map((item) => `${item.itemCode} ${item.comment || item.evidence}`).join('; ') || 'None recorded.'}`
  ].join('\n');
  return navigator.clipboard.writeText(text);
}
