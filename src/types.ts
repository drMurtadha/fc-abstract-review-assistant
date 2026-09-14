export type ReviewStatus = 'Draft' | 'Pre-checked' | 'Pending reviewer decision' | 'Acceptable - No correction required' | 'Acceptable - Minor correction required' | 'Revision required before acceptance';
export type ItemResult = 'Yes' | 'No' | 'Needs Review';
export type SectionCode = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface SubmissionInput {
  submissionId?: string;
  studentName: string;
  matricNo: string;
  programme: string;
  thesisTitle: string;
  supervisorName: string;
  examinerName: string;
  reviewDate: string;
  thesisLanguage: 'English' | 'Bahasa Melayu';
  englishAbstract: string;
  malayAbstract: string;
}

export interface ReviewItem {
  section: SectionCode;
  itemCode: string;
  itemDescription: string;
  autoResult: ItemResult;
  reviewerResult?: ItemResult;
  evidence: string;
  comment: string;
  source: 'rule-based' | 'reviewer';
}

export interface ReviewResult {
  submission: SubmissionInput;
  items: ReviewItem[];
  englishWordCount: number;
  malayWordCount: number;
  score: number;
  generatedAt: string;
  finalDecision?: Exclude<ReviewStatus, 'Draft' | 'Pre-checked' | 'Pending reviewer decision'>;
  mainCorrections?: string;
  reviewerName?: string;
  syncWarning?: string;
}
