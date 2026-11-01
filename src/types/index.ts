export type VerificationStatus = 
  | 'pending'
  | 'processing'
  | 'likely_authentic'
  | 'potential_manipulation'
  | 'manual_review_required'
  | 'verified'
  | 'flagged'
  | 'failed';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export type DocumentType = 
  | 'passport' 
  | 'drivers_license' 
  | 'aadhaar_card' 
  | 'pan_card';

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  passport: 'International Passport',
  drivers_license: 'Driving License',
  aadhaar_card: 'Aadhaar Card',
  pan_card: 'PAN Card'
};

export function formatDocumentType(type?: DocumentType | string): string {
  if (!type) return 'Document';
  return DOCUMENT_TYPE_LABELS[type as DocumentType] || type.replace(/_/g, ' ');
}

export function formatINR(amount: number = 0): string {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  } catch {
    return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
  }
}

export interface LoanApplicationData {
  fullName: string;
  dob: string;
  email: string;
  phone: string;
  loanAmount: number;
  loanTenure: number; // months
  loanPurpose: string;
  employmentStatus: string;
  annualIncome: number;
  nationalIdNumber: string;
}

export interface DocumentUploadData {
  documentType: DocumentType;
  fileName: string;
  fileSize?: string;
  previewUrl: string;
  extractedPhotoUrl: string;
  documentNumber: string;
  expiryDate: string;
  issuingAuthority: string;
  mrzValid: boolean;
  hologramIntact: boolean;
  tamperScore: number; // 0 to 100 (lower is cleaner)
}

export interface VideoKycData {
  mode: 'webcam' | 'sample_video' | 'uploaded_media';
  sampleId?: string;
  videoUrl?: string;
  capturedFrameUrl?: string;
  faceDetected: boolean;
  faceCentered: boolean;
  lightingQuality: 'optimal' | 'low' | 'harsh';
  livenessPassed: boolean;
  blinkDetected: boolean;
  headTurnDetected: boolean;
  fps: number;
}

export interface AiVerificationIndicator {
  name: string;
  status: 'passed' | 'warning' | 'failed';
  score: number; // 0-100
  detail: string;
  category: 'biometrics' | 'frequency' | 'temporal' | 'boundary';
}

export interface AiVerificationResult {
  overallStatus: 'likely_authentic' | 'potential_manipulation' | 'manual_review_required';
  overallConfidence: number; // e.g. 98.2%
  riskLevel: RiskLevel;
  riskScore: number; // 0-100 (higher = riskier)
  faceMatchScore: number; // 0-100 match with document portrait
  livenessConfidence: number; // 0-100
  mediaIntegrityScore: number; // 0-100
  deepfakeProbability: number; // 0-100
  manipulationType?: 'None' | 'DeepFaceLab / Face-Swap' | 'Replay / Display Attack' | 'Diffusion Puppet Synthesis' | 'Audio-Video Desync';
  indicators: AiVerificationIndicator[];
  analysisDurationMs: number;
  modelVersion: string;
  heatMapUrl?: string;
  originalComparisonUrl?: string;
}

export interface VerificationDecision {
  referenceId: string;
  timestamp: string;
  applicantName: string;
  loanAmount: number;
  loanPurpose: string;
  documentType: DocumentType;
  outcome: 'Verified' | 'Flagged for Manual Review' | 'Verification Failed';
  riskLevel: RiskLevel;
  recommendedAction: string;
  reviewerNotes: string;
  complianceOfficer: string;
  aiResult: AiVerificationResult;
}

export interface AuditRecord {
  id: string;
  referenceId: string;
  applicantName: string;
  date: string;
  loanAmount: number;
  loanPurpose: string;
  documentType: DocumentType;
  outcome: 'Verified' | 'Flagged for Manual Review' | 'Verification Failed';
  riskLevel: RiskLevel;
  confidence: number;
  deepfakeType?: string;
  keyFlag?: string;
}

export interface SampleProfile {
  id: string;
  label: string;
  tagline: string;
  expectedOutcome: 'Verified' | 'Flagged for Manual Review' | 'Verification Failed';
  riskLevel: RiskLevel;
  applicant: LoanApplicationData;
  document: DocumentUploadData;
  kyc: VideoKycData;
  verification: AiVerificationResult;
}
