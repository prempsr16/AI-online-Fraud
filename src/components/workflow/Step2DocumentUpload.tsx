import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  FileText,
  Shield,
  Eye,
  RefreshCw,
  Image as ImageIcon,
  Sparkles,
  Fingerprint,
  Globe,
  Car
} from 'lucide-react';
import { DocumentType, DocumentUploadData } from '../../types';
import { uploadIdentityDocument } from '../../services/verificationApi';
import { SAMPLE_PROFILES } from '../../data/mockData';

interface Step2DocumentUploadProps {
  documentData: DocumentUploadData;
  applicantName: string;
  onChange: (updated: DocumentUploadData) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2DocumentUpload: React.FC<Step2DocumentUploadProps> = ({
  documentData,
  applicantName,
  onChange,
  onNext,
  onBack
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const documentTypeOptions: {
    type: DocumentType;
    label: string;
    standard: string;
    icon: React.ElementType;
    description: string;
  }[] = [
    {
      type: 'passport',
      label: 'International Passport',
      standard: 'ICAO 9303 Standard',
      icon: Globe,
      description: 'Machine Readable Passport with 2-line MRZ zone'
    },
    {
      type: 'drivers_license',
      label: 'Driving License',
      standard: 'AAMVA / Real ID',
      icon: CreditCard,
      description: 'State DMV Driver License with PDF417 2D Barcode'
    },
    {
      type: 'aadhaar_card',
      label: 'Aadhaar Card',
      standard: 'UIDAI QR Standard',
      icon: Fingerprint,
      description: '12-Digit Biometric National ID with Secure QR'
    },
    {
      type: 'pan_card',
      label: 'PAN Card',
      standard: 'Income Tax Dept / NSDL',
      icon: FileText,
      description: '10-Digit Alphanumeric Permanent Account Number'
    }
  ];

  const handleTypeSelect = (type: DocumentType) => {
    onChange({
      ...documentData,
      documentType: type
    });
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const result = await uploadIdentityDocument(file, documentData.documentType);
      onChange({
        ...documentData,
        ...result,
        previewUrl: result.previewUrl || documentData.previewUrl,
        fileName: file.name
      });
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const loadSampleDocument = () => {
    const sample = SAMPLE_PROFILES[0].document;
    onChange({
      ...sample,
      documentType: documentData.documentType
    });
  };

  const hasDocument = Boolean(documentData.previewUrl);

  // Dynamic checklist based on chosen document type
  const getDocumentChecklist = () => {
    switch (documentData.documentType) {
      case 'passport':
        return [
          { label: 'Machine Readable Zone (MRZ) Checksum', key: 'mrz' },
          { label: 'Security Hologram & Optical Ghost Watermark', key: 'hologram' },
          { label: 'Passport Expiration Validity', key: 'expiry' },
          { label: 'ICAO Facial Portrait Bounding Box Extracted', key: 'portrait' }
        ];
      case 'drivers_license':
        return [
          { label: 'AAMVA PDF417 2D Barcode & Real ID Star Check', key: 'mrz' },
          { label: 'State DMV Security Hologram & Ghost Image', key: 'hologram' },
          { label: 'Driving License Expiry & Registry Check', key: 'expiry' },
          { label: 'Driver Facial Portrait Bounding Box Extracted', key: 'portrait' }
        ];
      case 'aadhaar_card':
        return [
          { label: 'UIDAI Secure Encrypted QR Code & 12-Digit UID Check', key: 'mrz' },
          { label: 'Anti-Tamper Guilloche Pattern & Microprint', key: 'hologram' },
          { label: 'Demographic Consistency & Issue Date', key: 'expiry' },
          { label: 'Biometric Portrait Bounding Box Extracted', key: 'portrait' }
        ];
      case 'pan_card':
      default:
        return [
          { label: '10-Digit Alphanumeric PAN Checksum (ABCDE1234F)', key: 'mrz' },
          { label: 'Income Tax Hologram & NSDL Signature Strip', key: 'hologram' },
          { label: 'Income Tax Department Registry Alignment', key: 'expiry' },
          { label: 'Photo & Specimen Signature Extracted', key: 'portrait' }
        ];
    }
  };

  const checklistItems = getDocumentChecklist();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Step 2 of 5
          </span>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Identity Document Verification
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Select an accepted identification standard and upload a photo or scan for automated optical validation.
          </p>
        </div>

        {applicantName && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-[11px] text-blue-700 dark:text-blue-300">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Applicant: {applicantName}</span>
          </div>
        )}
      </div>

      {/* Document Type Selector: 4 Options (International Passport, Driving License, Aadhaar Card, PAN Card) */}
      <div>
        <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
          Select Identity Document Category
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {documentTypeOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = documentData.documentType === opt.type;
            return (
              <button
                key={opt.type}
                type="button"
                onClick={() => handleTypeSelect(opt.type)}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-blue-50/90 dark:bg-blue-950/50 border-blue-500 dark:border-blue-500 text-blue-900 dark:text-blue-100 shadow-sm ring-1 ring-blue-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-start justify-between w-full mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </div>

                <div>
                  <div className="text-xs font-bold leading-tight">{opt.label}</div>
                  <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                    {opt.standard}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Document Upload Area & Preview Panel (Two Column) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Upload Box & Technical Checks */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-blue-400 dark:hover:border-slate-700'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />

            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-3">
              {isUploading ? (
                <RefreshCw className="w-6 h-6 animate-spin" />
              ) : (
                <UploadCloud className="w-6 h-6" />
              )}
            </div>

            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {isUploading
                ? 'Processing document...'
                : hasDocument
                ? 'Replace Uploaded Document'
                : `Upload ${documentTypeOptions.find((o) => o.type === documentData.documentType)?.label || 'Document'} Scan`}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Drag & drop image (PNG, JPG) or click to browse files
            </p>

            {hasDocument ? (
              <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300">
                <span>Current file:</span>
                <span className="font-mono font-medium text-blue-600 dark:text-blue-400">
                  {documentData.fileName}
                </span>
              </div>
            ) : (
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    loadSampleDocument();
                  }}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Or load an academic sample document for testing</span>
                </button>
              </div>
            )}
          </div>

          {/* Verification Checklist */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center justify-between">
              <span>Optical Document Checklist</span>
              <span className="text-[10px] font-mono text-blue-500 font-medium">
                {documentTypeOptions.find((o) => o.type === documentData.documentType)?.standard}
              </span>
            </h2>

            <div className="space-y-2.5">
              {checklistItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40"
                >
                  <div className="flex items-center gap-2">
                    {hasDocument ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                    )}
                    <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-mono font-medium text-slate-500">
                    {hasDocument ? 'VALID' : 'PENDING'}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Document Preview Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-blue-500" />
                <span>Extracted Document Specimen</span>
              </h2>
              {documentData.documentNumber && (
                <span className="text-[10px] font-mono text-slate-400">{documentData.documentNumber}</span>
              )}
            </div>

            {hasDocument ? (
              <>
                <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
                  <img
                    src={documentData.previewUrl}
                    alt="Document Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                    <div className="text-white text-xs">
                      <div className="font-semibold">{applicantName || 'Document Holder'}</div>
                      <div className="text-[10px] text-slate-300">
                        Type: {documentTypeOptions.find((o) => o.type === documentData.documentType)?.label}
                      </div>
                    </div>
                  </div>
                </div>

                {documentData.extractedPhotoUrl && (
                  <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-blue-500 shrink-0">
                      <img
                        src={documentData.extractedPhotoUrl}
                        alt="Extracted Facial Portrait"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        Reference Portrait
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        128-d biometric baseline extracted for Step 3 Video KYC.
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-4/3 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-2">
                <ImageIcon className="w-8 h-8 opacity-40" />
                <span className="text-xs font-medium">No Document Uploaded Yet</span>
                <p className="text-[10px] text-slate-500 max-w-xs">
                  Upload an International Passport, Driving License, Aadhaar Card, or PAN Card to inspect extracted metadata and portrait.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back: Loan Application</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-sm shadow-blue-500/25 transition-all hover:translate-x-0.5 cursor-pointer"
        >
          <span>Proceed to Video KYC</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
