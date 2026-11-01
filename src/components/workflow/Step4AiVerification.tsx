import React, { useState } from 'react';
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Zap,
  Info,
  Play
} from 'lucide-react';
import {
  AiVerificationResult,
  DocumentUploadData,
  LoanApplicationData,
  VideoKycData
} from '../../types';
import { runAiDeepfakeVerification } from '../../services/verificationApi';

interface Step4AiVerificationProps {
  applicantData: LoanApplicationData;
  documentData: DocumentUploadData;
  kycData: VideoKycData;
  verificationResult: AiVerificationResult | null;
  activePresetId?: string;
  onAnalysisComplete: (result: AiVerificationResult) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step4AiVerification: React.FC<Step4AiVerificationProps> = ({
  applicantData,
  documentData,
  kycData,
  verificationResult,
  activePresetId,
  onAnalysisComplete,
  onNext,
  onBack
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [pipelineStage, setPipelineStage] = useState<string>('Initializing Neural Models...');
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const executeAnalysis = async () => {
    setIsAnalyzing(true);
    setProgressPercent(0);
    try {
      const result = await runAiDeepfakeVerification(
        {
          applicantData,
          documentData,
          kycData,
          presetProfileId: activePresetId
        },
        (stageName, percent) => {
          setPipelineStage(stageName);
          setProgressPercent(percent);
        }
      );
      onAnalysisComplete(result);
    } catch (err) {
      console.error('AI verification failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'likely_authentic':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700/60">
            <ShieldCheck className="w-4 h-4" />
            Likely Authentic
          </span>
        );
      case 'potential_manipulation':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-700/60">
            <ShieldAlert className="w-4 h-4" />
            Potential Manipulation
          </span>
        );
      case 'manual_review_required':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700/60">
            <AlertTriangle className="w-4 h-4" />
            Manual Review Required
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Step 4 of 5
          </span>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            AI Deepfake & Integrity Verification
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Multi-spectral analysis evaluating facial boundary continuity, GAN synthesis signatures, and 1:1 biometric cross-matching.
          </p>
        </div>

        {verificationResult && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isAnalyzing}
              onClick={executeAnalysis}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>Re-run Analysis</span>
            </button>
          </div>
        )}
      </div>

      {/* Demo Notice */}
      <div className="p-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 text-[11px] text-blue-800 dark:text-blue-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-500 shrink-0" />
          <span>
            Simulated evaluation results for academic proof-of-concept. Pluggable Python ML model pipeline.
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase font-semibold text-blue-600 dark:text-blue-400">
          Neural Core
        </span>
      </div>

      {/* Blank / Ready State (before analysis is started) */}
      {!isAnalyzing && !verificationResult && (
        <div className="p-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 mx-auto flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Cpu className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Ready for Forensic Analysis
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Execute neural multi-task inspection to cross-match document portrait embeddings against the video-KYC feed and evaluate spatial-temporal deepfake probability.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={executeAnalysis}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-sm shadow-blue-500/25 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Run AI Verification Pipeline</span>
            </button>
          </div>
        </div>
      )}

      {/* Analysis In-Progress State */}
      {isAnalyzing && (
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 mx-auto flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm animate-pulse">
            <Cpu className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Running Neural Forensic Inspection
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
              {pipelineStage}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto space-y-1.5">
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>Evaluating model layers...</span>
              <span>{progressPercent}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Results View */}
      {!isAnalyzing && verificationResult && (
        <div className="space-y-6">
          
          {/* Top Summary Banner: Overall Status, Risk Level, Confidence */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Evaluation Verdict
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(verificationResult.overallStatus)}
                {verificationResult.manipulationType && verificationResult.manipulationType !== 'None' && (
                  <span className="text-xs font-mono text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/40">
                    Pattern: {verificationResult.manipulationType}
                  </span>
                )}
              </div>
            </div>

            {/* Metrics Chips */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center min-w-[100px]">
                <div className="text-[10px] text-slate-500 uppercase font-medium">Model Confidence</div>
                <div className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono">
                  {verificationResult.overallConfidence}%
                </div>
              </div>

              <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center min-w-[100px]">
                <div className="text-[10px] text-slate-500 uppercase font-medium">Risk Score</div>
                <div
                  className={`text-base font-bold font-mono ${
                    verificationResult.riskScore > 60
                      ? 'text-rose-600 dark:text-rose-400'
                      : verificationResult.riskScore > 30
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {verificationResult.riskScore}/100
                </div>
              </div>

              <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center min-w-[100px]">
                <div className="text-[10px] text-slate-500 uppercase font-medium">Inference Time</div>
                <div className="text-base font-bold text-blue-600 dark:text-blue-400 font-mono">
                  {(verificationResult.analysisDurationMs / 1000).toFixed(1)}s
                </div>
              </div>
            </div>
          </div>

          {/* Core Diagnostic Gauges: 3 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Metric 1: 1:1 Face Match */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Biometric Face Match
                </span>
                <span className="text-[10px] font-mono text-slate-400">128-D</span>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                {verificationResult.faceMatchScore}%
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${verificationResult.faceMatchScore}%` }}
                />
              </div>
            </div>

            {/* Metric 2: Liveness Authenticity */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Biometric Liveness
                </span>
                <span className="text-[10px] font-mono text-slate-400">Kinetic</span>
              </div>
              <div
                className={`text-2xl font-bold font-mono ${
                  verificationResult.livenessConfidence > 75
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {verificationResult.livenessConfidence}%
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    verificationResult.livenessConfidence > 75 ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${verificationResult.livenessConfidence}%` }}
                />
              </div>
            </div>

            {/* Metric 3: Media Integrity / Deepfake Probability */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Deepfake Probability
                </span>
                <span className="text-[10px] font-mono text-slate-400">GAN/Swap</span>
              </div>
              <div
                className={`text-2xl font-bold font-mono ${
                  verificationResult.deepfakeProbability > 50
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {verificationResult.deepfakeProbability}%
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    verificationResult.deepfakeProbability > 50 ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${verificationResult.deepfakeProbability}%` }}
                />
              </div>
            </div>

          </div>

          {/* Detailed Forensic Indicators List */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                <span>Forensic Indicator Analysis & Evidence</span>
              </h2>
              <span className="text-[10px] font-mono text-slate-400">
                {verificationResult.indicators.length} Checkpoints Evaluated
              </span>
            </div>

            <div className="space-y-2.5">
              {verificationResult.indicators.map((ind, idx) => {
                const isPassed = ind.status === 'passed';
                const isWarning = ind.status === 'warning';
                const isFailed = ind.status === 'failed';

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="mt-0.5 shrink-0">
                        {isPassed && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        {isWarning && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                        {isFailed && <XCircle className="w-4 h-4 text-rose-500" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                            {ind.name}
                          </span>
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono">
                            {ind.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                          {ind.detail}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2 sm:self-center">
                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                          isPassed
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                            : isWarning
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                        }`}
                      >
                        {ind.score}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back: Video KYC</span>
        </button>

        <button
          type="button"
          disabled={isAnalyzing || !verificationResult}
          onClick={onNext}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-sm shadow-blue-500/25 transition-all hover:translate-x-0.5 cursor-pointer disabled:opacity-50"
        >
          <span>Proceed to Final Decision</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
