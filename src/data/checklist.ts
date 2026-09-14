import type { SectionCode } from '../types';

export const sectionTitles: Record<SectionCode, string> = {
  A: 'General Requirements', B: 'Content of Abstract', C: 'English Abstract',
  D: 'Bahasa Melayu Abstract', E: 'Tense & Writing Quality', F: 'Consistency & Technical Check'
};

export const checklist = [
  ['A1','A','Abstract is provided in both English and Bahasa Melayu.'],
  ['A2','A','Abstracts appear in the correct order according to the language of the thesis.'],
  ['A3','A','Each abstract is written as one paragraph.'],
  ['A4','A','Abstract does not exceed one page.'],
  ['A5','A','English abstract is within 150–300 words.'],
  ['A6','A','Bahasa Melayu abstract is within 150–300 words.'],
  ['B1','B','Provides a clear introduction/background to the study.'],
  ['B2','B','Clearly identifies the problem statement/research problem.'],
  ['B3','B','Clearly states the aim and/or objectives of the study.'],
  ['B4','B','Adequately summarises the methodology/approach used.'],
  ['B5','B','Clearly presents the main results/findings and achievements.'],
  ['B6','B','States the implications/expectations/contribution arising from the findings.'],
  ['C1','C','Written in clear, coherent and formal academic English.'],
  ['C2','C','Uses either UK English or US English consistently.'],
  ['C3','C','Abbreviations are introduced correctly at first mention.'],
  ['C4','C','Abbreviations are used consistently and are not italicised.'],
  ['C5','C','Terminology is consistent with that used throughout the thesis.'],
  ['D1','D','Uses correct Bahasa Melayu grammar, spelling, punctuation and academic style.'],
  ['D2','D','Technical terminology is appropriately translated into Bahasa Melayu.'],
  ['D3','D','Translation avoids literal wording that may distort the intended meaning.'],
  ['D4','D','English abbreviations are retained consistently where required.'],
  ['D5','D','Content and meaning are fully aligned with the English abstract.'],
  ['E1','E','Background/problem statement appropriately uses simple present tense.'],
  ['E2','E','Study aims/objectives appropriately use simple present tense.'],
  ['E3','E','Completed methodology/actions appropriately use simple past tense.'],
  ['E4','E','Results/findings appropriately use simple past tense.'],
  ['E5','E','Conclusions/implications appropriately use simple present tense.'],
  ['E6','E','Future tense is avoided when describing work already completed.'],
  ['E7','E','Excessive passive voice is avoided, and the abstract is readable and concise.'],
  ['F1','F','Terminology is consistent between the English and Bahasa Melayu versions.'],
  ['F2','F','Abbreviations are consistent between both versions.'],
  ['F3','F','Appropriate spacing is used between numerical values and units, e.g. 3 mm.'],
  ['F4','F','No obvious poor-quality machine/AI translation is present.']
] as const;
