import { AuditRecord, SampleProfile } from '../types';

export const INITIAL_AUDIT_RECORDS: AuditRecord[] = [];

export const SAMPLE_PROFILES: SampleProfile[] = [
  {
    id: 'marcus_vance',
    label: 'Marcus Vance (Authentic)',
    tagline: 'Standard genuine applicant with valid passport and high biometric confidence',
    expectedOutcome: 'Verified',
    riskLevel: 'low',
    applicant: {
      fullName: 'Marcus Vance',
      dob: '1989-04-12',
      email: 'm.vance.demo@fincorp-test.io',
      phone: '+91 98201 44820',
      loanAmount: 1500000,
      loanTenure: 36,
      loanPurpose: 'Commercial Equipment Upgrade',
      employmentStatus: 'Full-time Employed (Senior Systems Architect)',
      annualIncome: 2400000,
      nationalIdNumber: 'P-982410884'
    },
    document: {
      documentType: 'passport',
      fileName: 'passport_mvance.jpg',
      fileSize: '2.4 MB',
      previewUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=700&q=80',
      extractedPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      documentNumber: 'USA-9021481',
      expiryDate: '2031-08-15',
      issuingAuthority: 'Department of State (Simulated)',
      mrzValid: true,
      hologramIntact: true,
      tamperScore: 2.1
    },
    kyc: {
      mode: 'sample_video',
      sampleId: 'mvance_live',
      videoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      capturedFrameUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
      faceDetected: true,
      faceCentered: true,
      lightingQuality: 'optimal',
      livenessPassed: true,
      blinkDetected: true,
      headTurnDetected: true,
      fps: 30
    },
    verification: {
      overallStatus: 'likely_authentic',
      overallConfidence: 98.4,
      riskLevel: 'low',
      riskScore: 6,
      faceMatchScore: 97.2,
      livenessConfidence: 96.8,
      mediaIntegrityScore: 99.1,
      deepfakeProbability: 1.8,
      manipulationType: 'None',
      modelVersion: 'ResNeXt-MesoNet-v3.4.1 (Simulated)',
      analysisDurationMs: 3820,
      heatMapUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
      originalComparisonUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=500&q=80',
      indicators: [
        {
          name: 'Biometric Face Cross-Match',
          status: 'passed',
          score: 97.2,
          detail: '128-d cosine distance 0.12 (well below 0.38 fraud threshold) against passport photo.',
          category: 'biometrics'
        },
        {
          name: 'Micro-Tremor & Blood Pulse (rPPG)',
          status: 'passed',
          score: 95.4,
          detail: 'Consistent pulse signal detected across facial capillary regions (72 bpm).',
          category: 'biometrics'
        },
        {
          name: 'Frequency Domain FFT Analysis',
          status: 'passed',
          score: 98.9,
          detail: 'No high-frequency checkerboard artifacts typical of generative upsampling.',
          category: 'frequency'
        },
        {
          name: 'Temporal Eye-Blink Kinetics',
          status: 'passed',
          score: 96.1,
          detail: 'Spontaneous 18 blinks/min with natural eyelid occlusion velocity.',
          category: 'temporal'
        },
        {
          name: 'Boundary Warp & Poisson Blending',
          status: 'passed',
          score: 99.2,
          detail: 'Zero mask boundary gradient discontinuity detected along jawline.',
          category: 'boundary'
        }
      ]
    }
  },
  {
    id: 'elena_rostova',
    label: 'Elena Rostova (Deepfake Face-Swap)',
    tagline: 'High-risk synthetic attack using real-time generative facial overlay',
    expectedOutcome: 'Verification Failed',
    riskLevel: 'critical',
    applicant: {
      fullName: 'Elena Rostova (Fictional)',
      dob: '1994-11-23',
      email: 'e.rostova.synthetic@demo-verify.net',
      phone: '+91 97112 88390',
      loanAmount: 2500000,
      loanTenure: 48,
      loanPurpose: 'Unsecured Business Expansion',
      employmentStatus: 'Contractor (FinTech Consult)',
      annualIncome: 1800000,
      nationalIdNumber: 'ABCDE1234F'
    },
    document: {
      documentType: 'pan_card',
      fileName: 'national_id_erostova.png',
      fileSize: '1.8 MB',
      previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
      extractedPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      documentNumber: 'GBR-8831092',
      expiryDate: '2029-03-30',
      issuingAuthority: 'Identity & Passport Service (Simulated)',
      mrzValid: true,
      hologramIntact: false,
      tamperScore: 68.4
    },
    kyc: {
      mode: 'sample_video',
      sampleId: 'erostova_swap',
      videoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      capturedFrameUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
      faceDetected: true,
      faceCentered: true,
      lightingQuality: 'harsh',
      livenessPassed: false,
      blinkDetected: false,
      headTurnDetected: true,
      fps: 24
    },
    verification: {
      overallStatus: 'potential_manipulation',
      overallConfidence: 94.6,
      riskLevel: 'critical',
      riskScore: 92,
      faceMatchScore: 84.1,
      livenessConfidence: 18.2,
      mediaIntegrityScore: 23.4,
      deepfakeProbability: 95.8,
      manipulationType: 'DeepFaceLab / Face-Swap',
      modelVersion: 'ResNeXt-MesoNet-v3.4.1 (Simulated)',
      analysisDurationMs: 4410,
      heatMapUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
      originalComparisonUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
      indicators: [
        {
          name: 'Boundary Mask Warp Detection',
          status: 'failed',
          score: 14.5,
          detail: 'Severe high-frequency gradient seam located along jawline and hairline (confidence 96.2%).',
          category: 'boundary'
        },
        {
          name: 'Corneal Specular Reflection Anomaly',
          status: 'failed',
          score: 21.0,
          detail: 'Left and right eye light reflections fail geometric ray consistency; synthesized irises detected.',
          category: 'biometrics'
        },
        {
          name: 'Temporal Eye-Blink Kinetics',
          status: 'failed',
          score: 18.4,
          detail: 'Zero complete palpebral closure recorded over 12 seconds of active streaming.',
          category: 'temporal'
        },
        {
          name: 'FFT Spatial Frequency Artifacts',
          status: 'warning',
          score: 32.8,
          detail: 'Periodic spectrum spikes characteristic of bilinear interpolation and autoencoder resampling.',
          category: 'frequency'
        },
        {
          name: 'Color Spectrum Discordance',
          status: 'warning',
          score: 41.2,
          detail: 'RGB color histogram divergence between inner facial ellipse and ear/neck background.',
          category: 'boundary'
        }
      ]
    }
  }
];
