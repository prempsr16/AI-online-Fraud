import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  Printer,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Shield,
  RefreshCw,
  X,
  ExternalLink,
  Plus
} from 'lucide-react';
import { AuditRecord, formatDocumentType, formatINR } from '../../types';

interface ReportsScreenProps {
  records: AuditRecord[];
  onRefresh: () => void;
  selectedRecordFromHome?: AuditRecord | null;
  onClearSelectedRecord?: () => void;
  onStartNewVerification?: () => void;
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({
  records,
  onRefresh,
  selectedRecordFromHome,
  onClearSelectedRecord,
  onStartNewVerification
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Verified' | 'Flagged for Manual Review' | 'Verification Failed'>('all');
  const [riskFilter, setRiskFilter] = useState<'all' | 'low' | 'moderate' | 'high' | 'critical'>('all');
  const [inspectRecord, setInspectRecord] = useState<AuditRecord | null>(selectedRecordFromHome || null);

  // Sync if selected from home
  React.useEffect(() => {
    if (selectedRecordFromHome) {
      setInspectRecord(selectedRecordFromHome);
    }
  }, [selectedRecordFromHome]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchSearch =
        r.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.loanPurpose.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'all' || r.outcome === statusFilter;
      const matchRisk = riskFilter === 'all' || r.riskLevel === riskFilter;

      return matchSearch && matchStatus && matchRisk;
    });
  }, [records, searchQuery, statusFilter, riskFilter]);

  const handleExportCsv = () => {
    const headers = [
      'Reference ID',
      'Applicant Name',
      'Date',
      'Loan Amount (INR)',
      'Loan Purpose',
      'Document Type',
      'Outcome',
      'Risk Level',
      'Confidence (%)',
      'Deepfake Pattern',
      'Key Forensic Flag'
    ];

    const rows = filteredRecords.map((r) => [
      `"${r.referenceId}"`,
      `"${r.applicantName}"`,
      `"${r.date}"`,
      r.loanAmount,
      `"${r.loanPurpose}"`,
      `"${r.documentType}"`,
      `"${r.outcome}"`,
      `"${r.riskLevel}"`,
      r.confidence,
      `"${r.deepfakeType || 'None'}"`,
      `"${r.keyFlag || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `veriloom-audit-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Compliance & Forensic Audit
          </span>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Verification History & Audit Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Log of digital loan applicants evaluated against generative deepfake models.
          </p>
        </div>

        {/* Action Buttons: CSV & Print */}
        <div className="flex items-center gap-2">
          {records.length > 0 && (
            <>
              <button
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-500" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>Print Report</span>
              </button>
            </>
          )}

          {onStartNewVerification && (
            <button
              onClick={onStartNewVerification}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Start Verification</span>
            </button>
          )}
        </div>
      </div>

      {records.length > 0 && (
        /* Filter & Search Bar */
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by applicant name, reference ID, or purpose..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">
              Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            >
              <option value="all">All Outcomes</option>
              <option value="Verified">Verified</option>
              <option value="Flagged for Manual Review">Flagged for Review</option>
              <option value="Verification Failed">Failed</option>
            </select>
          </div>

          {/* Risk Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">
              Risk:
            </span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="moderate">Moderate Risk</option>
              <option value="high">High Risk</option>
              <option value="critical">Critical Risk</option>
            </select>
          </div>

        </div>
      )}

      {/* Table Container */}
      <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {records.length === 0 ? (
          <div className="py-16 px-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No Verification Records Yet
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Completed applicant verification audits will appear here once you run your first verification workflow.
            </p>
            {onStartNewVerification && (
              <div className="pt-2">
                <button
                  onClick={onStartNewVerification}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-sm shadow-blue-500/25 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Start Verification</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/90 text-slate-500 dark:text-slate-400 font-medium">
                    <th className="py-3 px-4">Reference ID</th>
                    <th className="py-3 px-4">Applicant</th>
                    <th className="py-3 px-4">Loan Amount (INR)</th>
                    <th className="py-3 px-4">Evaluation Date</th>
                    <th className="py-3 px-4">Outcome</th>
                    <th className="py-3 px-4">Risk Level</th>
                    <th className="py-3 px-4">Key Detection Signal</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        No records matched the search filters.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((r) => {
                      const isVerified = r.outcome === 'Verified';
                      const isFailed = r.outcome === 'Verification Failed';

                      return (
                        <tr
                          key={r.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-mono font-medium text-slate-600 dark:text-slate-300">
                            {r.referenceId}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900 dark:text-slate-100">
                              {r.applicantName}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                              {r.loanPurpose}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-mono font-medium text-slate-800 dark:text-slate-200">
                            {formatINR(r.loanAmount)}
                          </td>

                          <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                            {r.date}
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                isVerified
                                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400'
                                  : isFailed
                                  ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400'
                                  : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400'
                              }`}
                            >
                              {isVerified ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : isFailed ? (
                                <XCircle className="w-3 h-3" />
                              ) : (
                                <AlertTriangle className="w-3 h-3" />
                              )}
                              <span>{r.outcome}</span>
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[10px] uppercase font-mono font-bold ${
                                r.riskLevel === 'low'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : r.riskLevel === 'critical'
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-amber-600 dark:text-amber-400'
                              }`}
                            >
                              {r.riskLevel}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 text-[11px] max-w-xs truncate">
                            {r.deepfakeType && r.deepfakeType !== 'None' ? (
                              <span className="font-semibold text-rose-600 dark:text-rose-400 mr-1">
                                [{r.deepfakeType}]
                              </span>
                            ) : null}
                            {r.keyFlag}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setInspectRecord(r)}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium cursor-pointer transition-colors"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Showing {filteredRecords.length} of {records.length} records</span>
              <span>Audit Ledger Sync</span>
            </div>
          </>
        )}
      </div>

      {/* Inspect Single Record Drawer / Modal */}
      {inspectRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Verification Detail Record
                </h3>
                <p className="text-[10px] font-mono text-slate-400">{inspectRecord.referenceId}</p>
              </div>
              <button
                onClick={() => {
                  setInspectRecord(null);
                  if (onClearSelectedRecord) onClearSelectedRecord();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {inspectRecord.applicantName}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Loan Facility:</span>
                <span className="font-mono text-slate-900 dark:text-slate-100">
                  {formatINR(inspectRecord.loanAmount)} ({inspectRecord.loanPurpose})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Document Type:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {formatDocumentType(inspectRecord.documentType)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Verdict:</span>
                <span className="font-bold">{inspectRecord.outcome}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Calculated Risk:</span>
                <span className="uppercase font-mono font-bold">{inspectRecord.riskLevel}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Model Confidence:</span>
                <span className="font-mono">{inspectRecord.confidence}%</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300">
                <span className="font-semibold block mb-1">Key Forensic Evidence Flag:</span>
                {inspectRecord.keyFlag}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setInspectRecord(null);
                  if (onClearSelectedRecord) onClearSelectedRecord();
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
