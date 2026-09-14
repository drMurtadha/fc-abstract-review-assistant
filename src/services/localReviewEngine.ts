import { checklist } from '../data/checklist';
import type { ItemResult, ReviewItem, ReviewResult, SubmissionInput } from '../types';

export const countWords = (text: string) => text.trim().split(/\s+/u).filter(Boolean).length;
export const countParagraphs = (text: string) => text.trim() ? text.trim().split(/\n\s*\n|\r\n\s*\r\n/u).filter((p) => p.trim()).length : 0;

const contentIndicators = {
  B1: ['is important','plays a key role','has become','is considered','remains','merupakan','memainkan peranan','menjadi','dianggap','masih'],
  B2: ['however','nevertheless','challenge','problem','limitation','lack of','gap','walau bagaimanapun','namun','cabaran','masalah','kekangan','jurang','kekurangan'],
  B3: ['this study aims','this research aims','this study investigates','this study proposes','this research develops','kajian ini bertujuan','penyelidikan ini bertujuan','kajian ini mengkaji','kajian ini mencadangkan','kajian ini membangunkan'],
  B4: ['data were collected','was developed','was analysed','was analyzed','was evaluated','method','approach','algorithm','experiment','survey','interview','data dikumpulkan','dibangunkan','dianalisis','dinilai','kaedah','pendekatan','algoritma','eksperimen','tinjauan','temu bual'],
  B5: ['results showed','results show','findings showed','findings show','achieved','improved','outperformed','accuracy','performance','keputusan menunjukkan','dapatan menunjukkan','mencapai','meningkatkan','mengatasi','ketepatan','prestasi'],
  B6: ['the findings suggest','contributes','contribution','implication','can enhance','provides','supports','dapatan ini menunjukkan','menyumbang','sumbangan','implikasi','dapat meningkatkan','menyediakan','menyokong']
} as const;

const futurePattern = /\b(will\s+(?:examine|investigate|propose|develop|conduct|analyse|analyze)|will\s+be\s+(?:conducted|analysed|analyzed)|akan\s+(?:mengkaji|mencadangkan|membangunkan|dijalankan|dianalisis))\b/giu;
const badUnitPattern = /\b\d+(?:\.\d+)?(?:mm|cm|km|kg|mg|GHz|MHz|kHz|Hz|ms)\b/giu;
const abbreviationPattern = /\b([A-Za-zÀ-ž][A-Za-zÀ-ž\s-]{2,}?)\s*\(([A-Z]{2,}[a-z]?)\)/gu;

export function extractAbbreviations(text: string): string[] {
  return [...text.matchAll(abbreviationPattern)].map((match) => match[2]);
}

const item = (code: string, result: ItemResult, evidence: string, comment = ''): ReviewItem => {
  const definition = checklist.find(([itemCode]) => itemCode === code)!;
  return { itemCode: code, section: definition[1], itemDescription: definition[2], autoResult: result, evidence, comment, source: 'rule-based' };
};

const uncertain = (code: string, evidence: string) => item(code, 'Needs Review', evidence, 'Reviewer confirmation is required.');

export function runLocalReview(input: SubmissionInput): ReviewResult {
  const english = input.englishAbstract.trim();
  const malay = input.malayAbstract.trim();
  const combined = `${english} ${malay}`.toLowerCase();
  const englishWords = countWords(english);
  const malayWords = countWords(malay);
  const englishParagraphs = countParagraphs(english);
  const malayParagraphs = countParagraphs(malay);
  const futureMatches = [...combined.matchAll(futurePattern)].map((match) => match[0]);
  const unitMatches = [...combined.matchAll(badUnitPattern)].map((match) => match[0]);
  const englishAbbr = extractAbbreviations(english);
  const malayAbbr = extractAbbreviations(malay);
  const sharedAbbr = englishAbbr.filter((abbr) => malayAbbr.includes(abbr));
  const items: ReviewItem[] = [];

  items.push(item('A1', english && malay ? 'Yes' : 'No', english && malay ? 'Both language versions are present.' : 'One or both abstracts are missing.'));
  items.push(item('A2', 'Yes', `${input.thesisLanguage} is the thesis language; the report will present that version first.`, 'Order is represented by the structured fields and generated report.'));
  items.push(item('A3', englishParagraphs === 1 && malayParagraphs === 1 ? 'Yes' : 'No', `English: ${englishParagraphs} paragraph(s); Bahasa Melayu: ${malayParagraphs} paragraph(s).`));
  items.push(uncertain('A4', 'Page length depends on final font, spacing and document layout; word counts are shown as a proxy.'));
  items.push(item('A5', englishWords >= 150 && englishWords <= 300 ? 'Yes' : 'No', `${englishWords} English words detected.`));
  items.push(item('A6', malayWords >= 150 && malayWords <= 300 ? 'Yes' : 'No', `${malayWords} Bahasa Melayu words detected.`));

  for (const code of Object.keys(contentIndicators) as Array<keyof typeof contentIndicators>) {
    const hits = contentIndicators[code].filter((term) => combined.includes(term));
    items.push(item(code, hits.length ? 'Needs Review' : 'Needs Review', hits.length ? `Possible indicators: ${hits.slice(0, 4).join(', ')}.` : 'No strong keyword indicator found.', hits.length ? 'Indicators found; confirm the element is clear and adequate.' : 'This element may be missing; reviewer confirmation is required.'));
  }

  items.push(uncertain('C1', 'Academic clarity and coherence require language review.'));
  items.push(uncertain('C2', 'Automated spelling-variant detection is not conclusive.'));
  items.push(item('C3', englishAbbr.length ? 'Needs Review' : 'Yes', englishAbbr.length ? `Introduced abbreviations: ${englishAbbr.join(', ')}.` : 'No parenthetical abbreviations detected.'));
  items.push(uncertain('C4', englishAbbr.length ? `Detected: ${englishAbbr.join(', ')}. Check later use and source formatting.` : 'No abbreviations detected.'));
  items.push(uncertain('C5', 'The full thesis terminology is not available to the local checker.'));
  items.push(uncertain('D1', 'Tatabahasa, ejaan, tanda baca dan gaya akademik memerlukan semakan bahasa.'));
  items.push(uncertain('D2', 'Terjemahan istilah teknikal perlu disahkan dengan rujukan bidang/DBP.'));
  items.push(uncertain('D3', 'Kualiti terjemahan literal memerlukan pertimbangan manusia.'));
  items.push(item('D4', englishAbbr.length === 0 || englishAbbr.every((abbr) => malayAbbr.includes(abbr)) ? 'Yes' : 'Needs Review', englishAbbr.length ? `English: ${englishAbbr.join(', ') || 'none'}; BM: ${malayAbbr.join(', ') || 'none'}.` : 'No English abbreviations detected.'));
  items.push(uncertain('D5', 'Semantic alignment requires bilingual reviewer or AI-assisted review.'));
  ['E1','E2','E3','E4','E5'].forEach((code) => items.push(uncertain(code, 'Tense must be evaluated in the context of each abstract component.')));
  items.push(item('E6', futureMatches.length ? 'No' : 'Yes', futureMatches.length ? `Future-tense phrase(s): ${[...new Set(futureMatches)].join(', ')}.` : 'No listed future-tense pattern detected.'));
  items.push(uncertain('E7', 'Readability and passive-voice balance require reviewer judgment.'));
  items.push(uncertain('F1', 'Cross-language terminology alignment requires semantic review.'));
  items.push(item('F2', englishAbbr.length === 0 || englishAbbr.every((abbr) => malayAbbr.includes(abbr)) ? 'Yes' : 'Needs Review', englishAbbr.length ? `${sharedAbbr.length}/${englishAbbr.length} introduced English abbreviation(s) also occur in BM.` : 'No abbreviations detected.'));
  items.push(item('F3', unitMatches.length ? 'No' : 'Yes', unitMatches.length ? `Missing spacing: ${[...new Set(unitMatches)].join(', ')}.` : 'No listed number-unit spacing issue detected.'));
  items.push(uncertain('F4', 'Translation provenance and quality cannot be determined reliably by rules alone.'));

  const decisive = items.filter((reviewItem) => reviewItem.autoResult !== 'Needs Review');
  const score = decisive.length ? Math.round(decisive.filter((reviewItem) => reviewItem.autoResult === 'Yes').length / decisive.length * 100) : 0;
  return { submission: input, items, englishWordCount: englishWords, malayWordCount: malayWords, score, generatedAt: new Date().toISOString() };
}
