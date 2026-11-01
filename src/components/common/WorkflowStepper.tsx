import React from 'react';
import {
  FileText,
  FileCheck,
  Video,
  Cpu,
  Award,
  Check,
  ChevronRight
} from 'lucide-react';

export interface WorkflowStepInfo {
  number: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
}

export const WORKFLOW_STEPS: WorkflowStepInfo[] = [
  {
    number: 1,
    title: 'Loan Application',
    subtitle: 'Applicant Details & Loan Terms',
    icon: FileText
  },
  {
    number: 2,
    title: 'Document Upload',
    subtitle: 'ID Card / Passport Verification',
    icon: FileCheck
  },
  {
    number: 3,
    title: 'Video KYC',
    subtitle: 'Biometric Stream & Liveness',
    icon: Video
  },
  {
    number: 4,
    title: 'AI Verification',
    subtitle: 'Deepfake & Spectral Analysis',
    icon: Cpu
  },
  {
    number: 5,
    title: 'Decision',
    subtitle: 'Risk Audit & Verification Outcome',
    icon: Award
  }
];

interface WorkflowStepperProps {
  currentStep: number; // 1 to 5
  completedSteps: number[]; // e.g. [1, 2]
  onStepClick: (step: number) => void;
  canNavigateToStep?: (step: number) => boolean;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  currentStep,
  completedSteps,
  onStepClick,
  canNavigateToStep = () => true
}) => {
  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
        
        {/* Header label */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              KYC Flow Pipeline
            </span>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Step {currentStep} of {WORKFLOW_STEPS.length}
            </h2>
          </div>
          <span className="text-xs font-mono font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200/50 dark:border-blue-900/40">
            {Math.round(((completedSteps.length) / WORKFLOW_STEPS.length) * 100)}% Complete
          </span>
        </div>

        {/* Stepper list */}
        <nav aria-label="Verification Steps" className="space-y-1.5">
          {WORKFLOW_STEPS.map((step) => {
            const isActive = currentStep === step.number;
            const isCompleted = completedSteps.includes(step.number);
            const isAccessible = canNavigateToStep(step.number);
            const Icon = step.icon;

            return (
              <button
                key={step.number}
                type="button"
                disabled={!isAccessible}
                onClick={() => onStepClick(step.number)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 group relative ${
                  isActive
                    ? 'bg-blue-500/10 dark:bg-blue-600/15 border border-blue-300 dark:border-blue-500/40 shadow-xs'
                    : isCompleted
                    ? 'hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent cursor-pointer'
                    : isAccessible
                    ? 'hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-transparent opacity-75'
                    : 'opacity-40 cursor-not-allowed border border-transparent'
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute -left-1 top-3 bottom-3 w-1 bg-blue-500 rounded-r-full" />
                )}

                {/* Step badge / icon */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/30'
                      : isCompleted
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-600/40'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {isCompleted && !isActive ? (
                    <Check className="w-4 h-4 text-emerald-500" strokeWidth={2.6} />
                  ) : (
                    <span className="text-xs font-semibold">{step.number}</span>
                  )}
                </div>

                {/* Step details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-xs font-semibold truncate ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {step.title}
                    </p>
                    {isActive && (
                      <span className="text-[10px] font-medium text-blue-500 tracking-tight ml-1 animate-pulse">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {step.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Academic / Security Notice */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-lg p-3 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Inspection Sandbox</span>
            </div>
            <p className="leading-relaxed">
              Step transitions isolate media artifacts to benchmark synthetic face manipulation detection.
            </p>
          </div>
        </div>

      </div>
    </aside>
  );
};
