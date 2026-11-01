import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  ArrowRight,
  AlertCircle,
  Sparkles,
  FileText
} from 'lucide-react';
import { LoanApplicationData, SampleProfile } from '../../types';
import { SAMPLE_PROFILES } from '../../data/mockData';

interface Step1LoanApplicationProps {
  formData: LoanApplicationData;
  onChange: (updated: LoanApplicationData) => void;
  onNext: () => void;
  onApplyPreset?: (profile: SampleProfile) => void;
  activePresetId?: string;
}

export const Step1LoanApplication: React.FC<Step1LoanApplicationProps> = ({
  formData,
  onChange,
  onNext,
  onApplyPreset
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showQuickFill, setShowQuickFill] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@'))
      newErrors.email = 'Valid email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.loanAmount || formData.loanAmount <= 0)
      newErrors.loanAmount = 'Please enter a valid loan amount';
    if (!formData.loanTenure || formData.loanTenure < 6)
      newErrors.loanTenure = 'Minimum tenure is 6 months';
    if (!formData.loanPurpose.trim())
      newErrors.loanPurpose = 'Purpose of loan is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  const handleInputChange = (field: keyof LoanApplicationData, value: any) => {
    onChange({
      ...formData,
      [field]: value
    });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Screen Title & Academic Demo Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Step 1 of 5
          </span>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Digital Loan Application
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Enter applicant details and loan terms for automated identity assurance.
          </p>
        </div>

        {/* Optional quick fill dropdown if user wants demo data */}
        {onApplyPreset && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowQuickFill(!showQuickFill)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>{showQuickFill ? 'Hide Test Autofill' : 'Optional Test Autofill'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Optional helper only if explicitly toggled */}
      {showQuickFill && onApplyPreset && (
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Click to populate with fictional academic test identity:
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PROFILES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onApplyPreset(p);
                  setShowQuickFill(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-800 dark:text-slate-200 text-xs font-medium cursor-pointer"
              >
                {p.applicant.fullName} ({p.riskLevel} risk)
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Clean Application Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          
          {/* Section A: Personal Information */}
          <div>
            <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-blue-500" />
              <span>Personal Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Legal Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="e.g., Alex Morgan"
                  className={`w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${
                    errors.fullName
                      ? 'border-rose-400 dark:border-rose-500'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-[10px] text-rose-500 mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange('dob', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${
                    errors.dob
                      ? 'border-rose-400 dark:border-rose-500'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                />
                {errors.dob && (
                  <p className="text-[10px] text-rose-500 mt-1">{errors.dob}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="applicant@example.com"
                  className={`w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${
                    errors.email
                      ? 'border-rose-400 dark:border-rose-500'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                />
                {errors.email && (
                  <p className="text-[10px] text-rose-500 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className={`w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${
                    errors.phone
                      ? 'border-rose-400 dark:border-rose-500'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                />
                {errors.phone && (
                  <p className="text-[10px] text-rose-500 mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section B: Loan & Financial Parameters */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
              <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                ₹
              </span>
              <span>Loan Parameters & Purpose (INR)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Loan Amount */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Requested Loan Amount (INR) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-semibold text-xs">₹</span>
                  <input
                    type="number"
                    min="10000"
                    step="5000"
                    value={formData.loanAmount || ''}
                    onChange={(e) => handleInputChange('loanAmount', Number(e.target.value))}
                    placeholder="500000"
                    className={`w-full pl-7 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${
                      errors.loanAmount
                        ? 'border-rose-400 dark:border-rose-500'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  />
                </div>
                {errors.loanAmount && (
                  <p className="text-[10px] text-rose-500 mt-1">{errors.loanAmount}</p>
                )}
              </div>

              {/* Loan Tenure */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Tenure (Months) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.loanTenure || 12}
                  onChange={(e) => handleInputChange('loanTenure', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                >
                  <option value={12}>12 Months (1 Year)</option>
                  <option value={24}>24 Months (2 Years)</option>
                  <option value={36}>36 Months (3 Years)</option>
                  <option value={48}>48 Months (4 Years)</option>
                  <option value={60}>60 Months (5 Years)</option>
                </select>
              </div>

              {/* Loan Purpose */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Loan Purpose <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.loanPurpose}
                  onChange={(e) => handleInputChange('loanPurpose', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                >
                  <option value="">Select loan purpose...</option>
                  <option value="Commercial Equipment Upgrade">Commercial Equipment Upgrade</option>
                  <option value="Unsecured Business Expansion">Unsecured Business Expansion</option>
                  <option value="Debt Consolidation">Debt Consolidation</option>
                  <option value="Home Renovation Credit">Home Renovation Credit</option>
                  <option value="Working Capital Facility">Working Capital Facility</option>
                  <option value="Vehicle Purchase">Vehicle Purchase</option>
                </select>
                {errors.loanPurpose && (
                  <p className="text-[10px] text-rose-500 mt-1">{errors.loanPurpose}</p>
                )}
              </div>

              {/* Employment / Income */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Stated Annual Income (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-semibold text-xs">₹</span>
                  <input
                    type="number"
                    value={formData.annualIncome || ''}
                    onChange={(e) => handleInputChange('annualIncome', Number(e.target.value))}
                    placeholder="1200000"
                    className="w-full pl-7 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-[11px] text-slate-400">
            All fields marked with an asterisk (*) are required.
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-sm shadow-blue-500/25 transition-all hover:translate-x-0.5 cursor-pointer"
          >
            <span>Proceed to Document Upload</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

    </div>
  );
};
