import React from 'react';
import {
  ArrowRight,
  FileText,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Lock,
  ChevronRight,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { AuditRecord, formatINR } from '../../types';

interface HomeScreenProps {
  recentRecords: AuditRecord[];
  onStartNewVerification: () => void;
  onViewReports: () => void;
  onViewRecordDetail: (record: AuditRecord) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  recentRecords,
  onStartNewVerification,
  onViewReports,
  onViewRecordDetail
}) => {
  const total = recentRecords.length;
  const verifiedCount = recentRecords.filter((r) => r.outcome === 'Verified').length;
  const flaggedCount = recentRecords.filter((r) => r.outcome === 'Flagged for Manual Review').length;
  const failedCount = recentRecords.filter((r) => r.outcome === 'Verification Failed').length;
  const passRate = total > 0 ? Math.round((verifiedCount / total) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* Minimal Hero Welcome */}
      <div className="relative rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-8 sm:p-10 shadow-xs">
        <div className="max-w-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/70 dark:border-blue-800/50 text-[11px] font-medium text-blue-600 dark:text-blue-400">
            <Lock className="w-3.5 h-3.5" />
            <span>AI Identity Assurance System</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            VeriLoom
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Detect real-time face-swapping, generative deepfakes, and presentation attacks during digital loan applications and video-KYC.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={onStartNewVerification}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs tracking-wide shadow-md shadow-blue-500/25 transition-all hover:translate-x-0.5 cursor-pointer"
            >
              <span>Start New Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onViewReports}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium transition-colors cursor-pointer"
            >
              <span>View Audit Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real Summary Metrics (Clean, dynamically reflecting actual sessions) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        
        <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
            Total Sessions
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
            {total}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Evaluated records
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
            Verified
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {verifiedCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {total > 0 ? `${passRate}% pass rate` : 'No sessions yet'}
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
            Flagged Review
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
            {flaggedCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Borderline liveness
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
            Failed / Tampered
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
            {failedCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Deepfake detected
          </div>
        </div>

      </div>

      {/* Recent Verifications Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            <span>Recent Verification Activity</span>
          </h2>

          {recentRecords.length > 0 && (
            <button
              onClick={onViewReports}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({recentRecords.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          {recentRecords.length === 0 ? (
            <div className="py-12 px-6 text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                No Verification Sessions Logged Yet
              </div>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Completed applicant verification audits will appear here once you run your first verification process.
              </p>
              <button
                onClick={onStartNewVerification}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-500 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Start First Verification</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentRecords.slice(0, 5).map((record) => {
                const isVerified = record.outcome === 'Verified';
                const isFailed = record.outcome === 'Verification Failed';

                return (
                  <div
                    key={record.id}
                    className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isVerified
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                            : isFailed
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {isVerified ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : isFailed ? (
                          <XCircle className="w-3.5 h-3.5" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {record.applicantName}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {record.referenceId}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {record.keyFlag || record.loanPurpose}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 text-xs shrink-0">
                      <div className="text-right">
                        <div className="font-mono font-medium text-slate-800 dark:text-slate-200">
                          {formatINR(record.loanAmount)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {record.date.slice(5, 16)}
                        </div>
                      </div>

                      <button
                        onClick={() => onViewRecordDetail(record)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium cursor-pointer transition-colors"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
