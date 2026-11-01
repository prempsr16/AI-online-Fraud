/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { WorkflowStepper } from './components/common/WorkflowStepper';
import { HomeScreen } from './components/home/HomeScreen';
import { Step1LoanApplication } from './components/workflow/Step1LoanApplication';
import { Step2DocumentUpload } from './components/workflow/Step2DocumentUpload';
import { Step3VideoKyc } from './components/workflow/Step3VideoKyc';
import { Step4AiVerification } from './components/workflow/Step4AiVerification';
import { Step5Decision } from './components/workflow/Step5Decision';
import { ReportsScreen } from './components/reports/ReportsScreen';
import { ThemeProvider } from './components/common/ThemeContext';
import {
  AiVerificationResult,
  AuditRecord,
  DocumentUploadData,
  LoanApplicationData,
  SampleProfile,
  VerificationDecision,
  VideoKycData
} from './types';
import { SAMPLE_PROFILES } from './data/mockData';
import { getAuditRecords, saveVerificationDecision } from './services/verificationApi';

const BLANK_LOAN_DATA: LoanApplicationData = {
  fullName: '',
  dob: '',
  email: '',
  phone: '',
  loanAmount: 0,
  loanTenure: 12,
  loanPurpose: '',
  employmentStatus: '',
  annualIncome: 0,
  nationalIdNumber: ''
};

const BLANK_DOCUMENT_DATA: DocumentUploadData = {
  documentType: 'passport',
  fileName: '',
  fileSize: '',
  previewUrl: '',
  extractedPhotoUrl: '',
  documentNumber: '',
  expiryDate: '',
  issuingAuthority: '',
  mrzValid: false,
  hologramIntact: false,
  tamperScore: 0
};

const BLANK_KYC_DATA: VideoKycData = {
  mode: 'webcam',
  sampleId: '',
  videoUrl: '',
  capturedFrameUrl: '',
  faceDetected: false,
  faceCentered: false,
  lightingQuality: 'optimal',
  livenessPassed: false,
  blinkDetected: false,
  headTurnDetected: false,
  fps: 0
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'workflow' | 'reports'>('home');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [referenceId, setReferenceId] = useState<string>('VL-KYC-2026-1001');
  const [activePresetId, setActivePresetId] = useState<string | undefined>(undefined);

  // Audit Records State (persisted in localStorage, defaults to empty)
  const [records, setRecords] = useState<AuditRecord[]>([]);
  const [inspectedRecordFromHome, setInspectedRecordFromHome] = useState<AuditRecord | null>(null);

  // Workflow Data State (all start completely blank)
  const [loanData, setLoanData] = useState<LoanApplicationData>(BLANK_LOAN_DATA);
  const [documentData, setDocumentData] = useState<DocumentUploadData>(BLANK_DOCUMENT_DATA);
  const [kycData, setKycData] = useState<VideoKycData>(BLANK_KYC_DATA);
  const [verificationResult, setVerificationResult] = useState<AiVerificationResult | null>(null);
  const [decision, setDecision] = useState<VerificationDecision | null>(null);

  // Load stored audit logs on mount
  useEffect(() => {
    const loaded = getAuditRecords();
    setRecords(loaded);
  }, []);

  const generateNewReferenceId = () => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `VL-KYC-2026-${randomDigits}`;
  };

  // Reset workflow to Step 1 with a clean blank slate
  const handleResetWorkflow = (optionalPreset?: SampleProfile) => {
    const newRef = generateNewReferenceId();
    setReferenceId(newRef);
    if (optionalPreset) {
      setActivePresetId(optionalPreset.id);
      setLoanData(optionalPreset.applicant);
      setDocumentData(optionalPreset.document);
      setKycData(optionalPreset.kyc);
    } else {
      setActivePresetId(undefined);
      setLoanData(BLANK_LOAN_DATA);
      setDocumentData(BLANK_DOCUMENT_DATA);
      setKycData(BLANK_KYC_DATA);
    }
    setVerificationResult(null);
    setDecision(null);
    setCurrentStep(1);
    setCompletedSteps([]);
    setCurrentTab('workflow');
  };

  const handleApplyPreset = (profile: SampleProfile) => {
    setActivePresetId(profile.id);
    setLoanData(profile.applicant);
    setDocumentData(profile.document);
    setKycData(profile.kyc);
    setVerificationResult(null);
    setDecision(null);
  };

  const markStepComplete = (stepNumber: number) => {
    if (!completedSteps.includes(stepNumber)) {
      setCompletedSteps((prev) => [...prev, stepNumber]);
    }
  };

  // Step 1 -> Step 2
  const handleStep1Next = () => {
    markStepComplete(1);
    setCurrentStep(2);
  };

  // Step 2 -> Step 3
  const handleStep2Next = () => {
    markStepComplete(2);
    setCurrentStep(3);
  };

  // Step 3 -> Step 4
  const handleStep3Next = () => {
    markStepComplete(3);
    setCurrentStep(4);
  };

  // Step 4 analysis finishes
  const handleAnalysisComplete = (result: AiVerificationResult) => {
    setVerificationResult(result);

    // Formulate final decision
    let outcome: 'Verified' | 'Flagged for Manual Review' | 'Verification Failed' = 'Verified';
    let recommendedAction = 'Eligible for straight-through automated credit underwriting.';

    if (result.overallStatus === 'potential_manipulation' || result.riskScore > 75) {
      outcome = 'Verification Failed';
      recommendedAction =
        'Reject digital session. Block user identity hash in compliance registry and file suspicious activity report (SAR).';
    } else if (result.overallStatus === 'manual_review_required' || result.riskScore > 35) {
      outcome = 'Flagged for Manual Review';
      recommendedAction =
        'Schedule Tier-2 video interview with secondary biometric token verification.';
    }

    const newDecision: VerificationDecision = {
      referenceId,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      applicantName: loanData.fullName || 'Applicant',
      loanAmount: loanData.loanAmount || 0,
      loanPurpose: loanData.loanPurpose || 'General Credit Facility',
      documentType: documentData.documentType,
      outcome,
      riskLevel: result.riskLevel,
      recommendedAction,
      reviewerNotes:
        result.manipulationType && result.manipulationType !== 'None'
          ? `Detected artifact pattern: ${result.manipulationType}. Deepfake confidence ${result.deepfakeProbability}%.`
          : 'Biometric alignment verified; no generative manipulation signatures detected.',
      complianceOfficer: 'Sarah Vance (ID: FIN-8842)',
      aiResult: result
    };

    setDecision(newDecision);

    // Persist to audit records
    saveVerificationDecision(newDecision).then(() => {
      setRecords(getAuditRecords());
    });
  };

  // Step 4 -> Step 5
  const handleStep4Next = () => {
    markStepComplete(4);
    markStepComplete(5);
    setCurrentStep(5);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col bg-subtle-waves bg-grid-pattern">
        
        {/* Top Navigation */}
        <Header
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
          }}
          activeStepIndex={currentStep - 1}
          referenceId={referenceId}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* View 1: Home Screen (clean & blank of fake prerequisites) */}
          {currentTab === 'home' && (
            <HomeScreen
              recentRecords={records}
              onStartNewVerification={() => {
                handleResetWorkflow();
              }}
              onViewReports={() => setCurrentTab('reports')}
              onViewRecordDetail={(record) => {
                setInspectedRecordFromHome(record);
                setCurrentTab('reports');
              }}
            />
          )}

          {/* View 2: Verification Workflow (Left Stepper + Single Focused Right Content) */}
          {currentTab === 'workflow' && (
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              
              {/* Slim Vertical Stepper on Left */}
              <WorkflowStepper
                currentStep={currentStep}
                completedSteps={completedSteps}
                onStepClick={(step) => setCurrentStep(step)}
                canNavigateToStep={(step) => {
                  if (step <= currentStep) return true;
                  if (completedSteps.includes(step - 1)) return true;
                  return false;
                }}
              />

              {/* Focused Content Area on Right */}
              <section className="flex-1 w-full min-w-0">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
                  
                  {/* Step 1: Loan Application */}
                  {currentStep === 1 && (
                    <Step1LoanApplication
                      formData={loanData}
                      onChange={setLoanData}
                      onNext={handleStep1Next}
                      onApplyPreset={handleApplyPreset}
                      activePresetId={activePresetId}
                    />
                  )}

                  {/* Step 2: Document Upload */}
                  {currentStep === 2 && (
                    <Step2DocumentUpload
                      documentData={documentData}
                      applicantName={loanData.fullName}
                      onChange={setDocumentData}
                      onNext={handleStep2Next}
                      onBack={() => setCurrentStep(1)}
                    />
                  )}

                  {/* Step 3: Video KYC */}
                  {currentStep === 3 && (
                    <Step3VideoKyc
                      kycData={kycData}
                      applicantName={loanData.fullName}
                      documentPortraitUrl={documentData.extractedPhotoUrl}
                      activePresetId={activePresetId}
                      onChange={setKycData}
                      onNext={handleStep3Next}
                      onBack={() => setCurrentStep(2)}
                    />
                  )}

                  {/* Step 4: AI Verification */}
                  {currentStep === 4 && (
                    <Step4AiVerification
                      applicantData={loanData}
                      documentData={documentData}
                      kycData={kycData}
                      verificationResult={verificationResult}
                      activePresetId={activePresetId}
                      onAnalysisComplete={handleAnalysisComplete}
                      onNext={handleStep4Next}
                      onBack={() => setCurrentStep(3)}
                    />
                  )}

                  {/* Step 5: Decision */}
                  {currentStep === 5 && decision && (
                    <Step5Decision
                      decision={decision}
                      onResetWorkflow={() => handleResetWorkflow()}
                      onGoToReports={() => setCurrentTab('reports')}
                    />
                  )}

                </div>
              </section>

            </div>
          )}

          {/* View 3: Reports Screen */}
          {currentTab === 'reports' && (
            <ReportsScreen
              records={records}
              onRefresh={() => setRecords(getAuditRecords())}
              selectedRecordFromHome={inspectedRecordFromHome}
              onClearSelectedRecord={() => setInspectedRecordFromHome(null)}
              onStartNewVerification={() => handleResetWorkflow()}
            />
          )}

        </main>

        {/* Enterprise Footer */}
        <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm no-print">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">VeriLoom</span>
              <span>•</span>
              <span>AI Face-Swapping & Deepfake Impersonation Detection Platform</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
              <span>ACADEMIC SIMULATION</span>
              <span>v2.4.1</span>
            </div>
          </div>
        </footer>

      </div>
    </ThemeProvider>
  );
}
