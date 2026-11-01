import React, { useRef, useState, useEffect } from 'react';
import {
  Camera,
  Video,
  VideoOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Scan,
  Layers,
  Sparkles,
  Upload
} from 'lucide-react';
import { VideoKycData } from '../../types';
import { SAMPLE_PROFILES } from '../../data/mockData';

interface Step3VideoKycProps {
  kycData: VideoKycData;
  applicantName: string;
  documentPortraitUrl?: string;
  activePresetId?: string;
  onChange: (updated: VideoKycData) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step3VideoKyc: React.FC<Step3VideoKycProps> = ({
  kycData,
  applicantName,
  documentPortraitUrl,
  onChange,
  onNext,
  onBack
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedFlash, setCapturedFlash] = useState<boolean>(false);
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [activeViewMode, setActiveViewMode] = useState<'rgb' | 'landmarks'>('rgb');

  const [blinkDetected, setBlinkDetected] = useState(kycData.blinkDetected);
  const [headTurnDetected, setHeadTurnDetected] = useState(kycData.headTurnDetected);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: false
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraActive(true);
        onChange({
          ...kycData,
          mode: 'webcam',
          faceDetected: true,
          faceCentered: true,
          lightingQuality: 'optimal',
          fps: 30
        });
      } else {
        setCameraError('Webcam API is not available in this browser. You can upload a photo or use a test stream.');
      }
    } catch (err: any) {
      setCameraError('Could not access webcam. You can use a test video stream or upload media.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCaptureFrame = () => {
    setCapturedFlash(true);
    setTimeout(() => setCapturedFlash(false), 250);

    let frameUrl = kycData.capturedFrameUrl || documentPortraitUrl || '';
    if (videoRef.current && isCameraActive) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        frameUrl = canvas.toDataURL('image/jpeg');
      }
    }

    onChange({
      ...kycData,
      capturedFrameUrl: frameUrl,
      faceDetected: true,
      faceCentered: true,
      livenessPassed: blinkDetected && headTurnDetected
    });
  };

  const loadSampleFeed = (sampleProfileId: string) => {
    const preset = SAMPLE_PROFILES.find((p) => p.id === sampleProfileId);
    if (!preset) return;
    stopCamera();
    setBlinkDetected(preset.kyc.blinkDetected);
    setHeadTurnDetected(preset.kyc.headTurnDetected);
    onChange({
      ...preset.kyc,
      mode: 'sample_video'
    });
  };

  const triggerBlinkAction = () => {
    setBlinkDetected(true);
    onChange({ ...kycData, blinkDetected: true, livenessPassed: headTurnDetected });
  };

  const triggerHeadTurnAction = () => {
    setHeadTurnDetected(true);
    onChange({ ...kycData, headTurnDetected: true, livenessPassed: blinkDetected });
  };

  const hasActiveMedia = isCameraActive || Boolean(kycData.capturedFrameUrl || kycData.videoUrl);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Step 3 of 5
          </span>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Live Video-KYC & Biometric Liveness
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Capture real-time biometric video to authenticate human presence and detect digital injection or deepfake tampering.
          </p>
        </div>

        {/* Camera Start / Stop */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={isCameraActive ? stopCamera : startCamera}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              isCameraActive
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
            }`}
          >
            {isCameraActive ? <VideoOff className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
            <span>{isCameraActive ? 'Stop Camera' : 'Start Live Camera'}</span>
          </button>
        </div>
      </div>

      {cameraError && (
        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Main Video Viewport & Status Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Video Viewport & Frame Positioning Reticle */}
        <div className="lg:col-span-8 space-y-3">
          
          <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-lg flex items-center justify-center">
            
            {/* Live Camera Video OR Selected Video/Image */}
            {isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : hasActiveMedia ? (
              <div className="relative w-full h-full">
                <img
                  src={kycData.capturedFrameUrl || kycData.videoUrl}
                  alt="KYC Stream Preview"
                  className="w-full h-full object-cover filter brightness-95"
                />
              </div>
            ) : (
              <div className="text-center p-8 space-y-3 text-slate-400">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-slate-500">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-xs font-semibold text-slate-300">
                  Camera Standby
                </div>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Click 'Start Live Camera' above to initiate your KYC stream.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => loadSampleFeed('marcus_vance')}
                    className="inline-flex items-center gap-1.5 text-[11px] text-blue-400 hover:underline"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Or test with a sample webcam stream</span>
                  </button>
                </div>
              </div>
            )}

            {/* Flash Effect on Capture */}
            {capturedFlash && (
              <div className="absolute inset-0 bg-white z-30 transition-opacity duration-200" />
            )}

            {/* Face Positioning Reticle Overlay when active */}
            {hasActiveMedia && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div
                  className={`w-52 h-64 sm:w-60 sm:h-76 rounded-[50%] border-2 transition-all duration-300 flex items-center justify-center ${
                    kycData.faceCentered
                      ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]'
                      : 'border-blue-400/80 border-dashed'
                  }`}
                />
              </div>
            )}

            {/* Bottom Floating Instructions if active */}
            {hasActiveMedia && (
              <div className="absolute bottom-3 inset-x-4 bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 flex items-center justify-between text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <Scan className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-[11px] font-medium">
                    Align face inside the frame. Keep head upright.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCaptureFrame}
                  className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold cursor-pointer shrink-0 transition-colors"
                >
                  Capture Frame
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Live Quality & Interactive Liveness Challenges */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Stream Sensor Diagnostics */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
            <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
              <span>Stream Sensor Diagnostics</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  hasActiveMedia ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                }`}
              />
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-600 dark:text-slate-400">Stream Status</span>
                <span className="font-mono text-[10px] font-semibold">
                  {hasActiveMedia ? 'ACTIVE' : 'STANDBY'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-600 dark:text-slate-400">Face Positioning</span>
                <span className="font-mono text-[10px] text-slate-500 font-semibold">
                  {hasActiveMedia ? (kycData.faceCentered ? 'CENTERED' : 'ADJUST') : 'AWAITING STREAM'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-600 dark:text-slate-400">Anti-Spoofing Sensors</span>
                <span className="font-mono text-[10px] text-slate-500 font-semibold">
                  {hasActiveMedia ? 'MONITORING' : 'READY'}
                </span>
              </div>
            </div>
          </div>

          {/* Active Interactive Liveness Challenge */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Interactive Liveness Challenge
              </h2>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs space-y-2">
              <div className="text-[11px] text-slate-600 dark:text-slate-300">
                Validate human physical response:
              </div>

              {/* Challenge 1: Blink */}
              <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-700 dark:text-slate-300">
                  1. Eye Blink Detection
                </span>
                {blinkDetected ? (
                  <span className="text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> PASSED
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={triggerBlinkAction}
                    className="text-[10px] px-2 py-0.5 rounded bg-blue-600 text-white font-medium hover:bg-blue-500 cursor-pointer"
                  >
                    Simulate Blink
                  </button>
                )}
              </div>

              {/* Challenge 2: Head Turn */}
              <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-700 dark:text-slate-300">
                  2. Head Turn (Yaw)
                </span>
                {headTurnDetected ? (
                  <span className="text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> PASSED
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={triggerHeadTurnAction}
                    className="text-[10px] px-2 py-0.5 rounded bg-blue-600 text-white font-medium hover:bg-blue-500 cursor-pointer"
                  >
                    Simulate Turn
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => {
            stopCamera();
            onBack();
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back: Document Upload</span>
        </button>

        <button
          type="button"
          onClick={() => {
            stopCamera();
            onNext();
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-sm shadow-blue-500/25 transition-all hover:translate-x-0.5 cursor-pointer"
        >
          <span>Proceed to AI Verification</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
