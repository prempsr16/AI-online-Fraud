/**
 * @file verificationApi.ts
 * @description API service layer designed for integration with a Python/FastAPI
 * deepfake detection backend (e.g., PyTorch / ResNeXt-MesoNet / EfficientNet-B4 models).
 *
 * Current implementation uses realistic client-side simulation with simulated latency
 * and progress streams. To connect to an actual FastAPI backend, update `API_BASE_URL`
 * and switch `USE_SIMULATED_BACKEND` to false.
 */

import {
  AiVerificationResult,
  DocumentUploadData,
  LoanApplicationData,
  VerificationDecision,
  VideoKycData,
  AuditRecord
} from '../types';
import { SAMPLE_PROFILES, INITIAL_AUDIT_RECORDS } from '../data/mockData';

export const API_BASE_URL = import.meta.env.VITE_PY_BACKEND_URL || 'http://localhost:8000/api/v1';
export const USE_SIMULATED_BACKEND = true;

const AUDIT_STORAGE_KEY = 'veriloom_audit_records_v2';

/**
 * Uploads identity document to server/storage.
 * In Python FastAPI, this calls: POST /api/v1/documents/upload
 */
export async function uploadIdentityDocument(
  file: File | Blob,
  documentType: string
): Promise<Partial<DocumentUploadData>> {
  if (!USE_SIMULATED_BACKEND) {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('document_type', documentType);
    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Document upload failed on backend');
    return response.json();
  }

  // Realistic simulation
  await new Promise((resolve) => setTimeout(resolve, 800));
  const previewUrl = URL.createObjectURL(file);
  return {
    documentType: documentType as any,
    fileName: (file as File).name || 'uploaded_document.jpg',
    fileSize: `${((file.size || 1500000) / (1024 * 1024)).toFixed(1)} MB`,
    previewUrl,
    extractedPhotoUrl: previewUrl,
    documentNumber: `EXT-${Math.floor(1000000 + Math.random() * 9000000)}`,
    expiryDate: '2032-12-31',
    issuingAuthority: 'National Issuing Authority (Verified Extraction)',
    mrzValid: true,
    hologramIntact: true,
    tamperScore: 3.5,
  };
}

/**
 * Submits video-KYC live frame or video sample for deepfake & face-match analysis.
 * In Python FastAPI, this calls: POST /api/v1/analyze/deepfake
 *
 * @param params Video KYC stream or captured frame + reference document portrait
 * @param onProgress Callback providing step-by-step pipeline status updates
 */
export async function runAiDeepfakeVerification(
  params: {
    applicantData: LoanApplicationData;
    documentData: DocumentUploadData;
    kycData: VideoKycData;
    presetProfileId?: string;
  },
  onProgress?: (stage: string, percent: number) => void
): Promise<AiVerificationResult> {
  if (!USE_SIMULATED_BACKEND) {
    const response = await fetch(`${API_BASE_URL}/analyze/deepfake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!response.ok) throw new Error('Deepfake analysis failed on backend');
    return response.json();
  }

  // If a preset profile is matched, use its curated benchmark indicators
  const preset = SAMPLE_PROFILES.find((p) => p.id === params.presetProfileId);

  // Progressive simulated pipeline steps
  const stages = [
    { name: 'Initializing Neural Inference Pipeline...', percent: 15, delay: 500 },
    { name: 'Spatial FFT & High-Frequency Spectrum Analysis...', percent: 35, delay: 700 },
    { name: 'Facial Landmark Tracking & Temporal Blink Kinetics...', percent: 60, delay: 800 },
    { name: 'Boundary Mask Warp & Poisson Blending Detection...', percent: 80, delay: 700 },
    { name: 'Biometric Document Cross-Matching & Aggregating Confidence...', percent: 95, delay: 600 },
    { name: 'Analysis Complete', percent: 100, delay: 300 }
  ];

  for (const step of stages) {
    if (onProgress) onProgress(step.name, step.percent);
    await new Promise((resolve) => setTimeout(resolve, step.delay));
  }

  if (preset) {
    return preset.verification;
  }

  // Dynamic heuristic for custom user inputs or live webcam
  // Default to authentic unless liveness / faceCentered was flagged
  const isOrganic = params.kycData.livenessPassed && params.kycData.faceDetected;
  
  if (isOrganic) {
    return {
      overallStatus: 'likely_authentic',
      overallConfidence: 96.7,
      riskLevel: 'low',
      riskScore: 9,
      faceMatchScore: 94.8,
      livenessConfidence: 95.2,
      mediaIntegrityScore: 97.4,
      deepfakeProbability: 3.3,
      manipulationType: 'None',
      analysisDurationMs: 3600,
      modelVersion: 'ResNeXt-MesoNet-v3.4.1 (Simulated)',
      heatMapUrl: params.kycData.capturedFrameUrl || params.documentData.extractedPhotoUrl,
      originalComparisonUrl: params.documentData.previewUrl,
      indicators: [
        {
          name: 'Biometric Face Cross-Match',
          status: 'passed',
          score: 94.8,
          detail: 'High 128-d facial embedding correspondence against identity document photo.',
          category: 'biometrics'
        },
        {
          name: 'Blood Volume Pulse (rPPG)',
          status: 'passed',
          score: 93.6,
          detail: 'Micro-vascular blood perfusion signal matches human cardiac cycle (68 bpm).',
          category: 'biometrics'
        },
        {
          name: 'Discrete Fourier Transform (FFT)',
          status: 'passed',
          score: 97.4,
          detail: 'Clean frequency dispersion with no GAN grid pattern.',
          category: 'frequency'
        },
        {
          name: 'Temporal Kinematics & Blink Rate',
          status: 'passed',
          score: 94.0,
          detail: 'Natural ocular micro-saccades and organic eyelid transitions.',
          category: 'temporal'
        },
        {
          name: 'Mask Edge Continuity',
          status: 'passed',
          score: 98.1,
          detail: 'No boundary blurring or seam stitching detected around jawline.',
          category: 'boundary'
        }
      ]
    };
  } else {
    return {
      overallStatus: 'manual_review_required',
      overallConfidence: 82.5,
      riskLevel: 'moderate',
      riskScore: 58,
      faceMatchScore: 78.4,
      livenessConfidence: 45.0,
      mediaIntegrityScore: 68.2,
      deepfakeProbability: 41.8,
      manipulationType: 'Audio-Video Desync',
      analysisDurationMs: 3600,
      modelVersion: 'ResNeXt-MesoNet-v3.4.1 (Simulated)',
      heatMapUrl: params.kycData.capturedFrameUrl || params.documentData.extractedPhotoUrl,
      originalComparisonUrl: params.documentData.previewUrl,
      indicators: [
        {
          name: 'Biometric Face Cross-Match',
          status: 'warning',
          score: 78.4,
          detail: 'Sub-optimal lighting or pose variation produced borderline embedding match.',
          category: 'biometrics'
        },
        {
          name: 'Liveness Motion Consistency',
          status: 'warning',
          score: 45.0,
          detail: 'Incomplete blink prompt response during interactive video KYC challenge.',
          category: 'temporal'
        },
        {
          name: 'Discrete Fourier Transform (FFT)',
          status: 'passed',
          score: 88.0,
          detail: 'Standard sensor noise without clear generative upsampling anomalies.',
          category: 'frequency'
        }
      ]
    };
  }
}

/**
 * Saves completed verification outcome to audit storage.
 * In Python FastAPI, this calls: POST /api/v1/decisions
 */
export async function saveVerificationDecision(
  decision: VerificationDecision
): Promise<{ success: boolean; recordId: string }> {
  const auditRecord: AuditRecord = {
    id: `AUD-${Date.now().toString().slice(-4)}`,
    referenceId: decision.referenceId,
    applicantName: decision.applicantName,
    date: new Date().toISOString().replace('T', ' ').slice(0, 19),
    loanAmount: decision.loanAmount,
    loanPurpose: decision.loanPurpose,
    documentType: decision.documentType,
    outcome: decision.outcome,
    riskLevel: decision.riskLevel,
    confidence: decision.aiResult.overallConfidence,
    deepfakeType: decision.aiResult.manipulationType || 'None',
    keyFlag: decision.reviewerNotes || 'Completed standard automated evaluation pipeline'
  };

  try {
    const existingStr = localStorage.getItem(AUDIT_STORAGE_KEY);
    const existing: AuditRecord[] = existingStr ? JSON.parse(existingStr) : INITIAL_AUDIT_RECORDS;
    const updated = [auditRecord, ...existing];
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to write audit to localStorage:', err);
  }

  return { success: true, recordId: auditRecord.id };
}

/**
 * Retrieves audit verification history.
 * In Python FastAPI, this calls: GET /api/v1/reports
 */
export function getAuditRecords(): AuditRecord[] {
  try {
    const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_RECORDS));
      return INITIAL_AUDIT_RECORDS;
    }
    return JSON.parse(stored);
  } catch {
    return INITIAL_AUDIT_RECORDS;
  }
}
