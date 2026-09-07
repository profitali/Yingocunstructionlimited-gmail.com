import React, { useState, useRef, useEffect } from "react";
import { 
  Camera, 
  X, 
  RotateCw, 
  Check, 
  AlertCircle, 
  Sparkles,
  Zap,
  Image as ImageIcon
} from "lucide-react";
import { playClickSound, playChimeSound } from "../utils/sound";

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Data: string, mimeType: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [flashActive, setFlashActive] = useState(false);

  // Stop media stream tracks
  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Start camera stream
  const startCamera = async () => {
    stopStream();
    setError(null);
    setIsStarting(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported on this browser or device.");
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("Camera permission was denied. Please allow camera permissions in your browser settings to inspect your site or furniture.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setError("No camera hardware detected on this device. You can upload a photo from your gallery instead.");
      } else {
        setError(err.message || "Failed to initialize camera.");
      }
    } finally {
      setIsStarting(false);
    }
  };

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    } else {
      stopStream();
    }

    return () => {
      stopStream();
    };
  }, [isOpen, facingMode]);

  const handleFlipCamera = () => {
    playClickSound();
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const handleTakeSnapshot = () => {
    playClickSound();
    if (!videoRef.current) return;

    // Trigger visual shutter flash
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 200);

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setCapturedImage(dataUrl);
      stopStream();
      playChimeSound();
    }
  };

  const handleRetake = () => {
    playClickSound();
    setCapturedImage(null);
    startCamera();
  };

  const handleConfirmPhoto = () => {
    if (!capturedImage) return;
    playClickSound();
    // Extract base64 without prefix
    const [header, base64] = capturedImage.split(",");
    const mimeType = header.match(/:(.*?);/)?.[1] || "image/jpeg";
    onCapture(base64, mimeType);
    handleClose();
  };

  const handleClose = () => {
    playClickSound();
    stopStream();
    setCapturedImage(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-100/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-50 border border-zinc-200 rounded-none w-full max-w-lg overflow-hidden shadow-2xl shadow-black/10 flex flex-col">
        {/* Header */}
        <div className="bg-white px-4 py-3 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-black/20 border border-amber-500/40 flex items-center justify-center text-amber-600">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-black flex items-center gap-2">
                Site &amp; Timber Camera
                <span className="text-[10px] font-mono text-amber-600 bg-black/15 border border-amber-500/30 px-1.5 py-0.5 rounded">
                  AI Vision
                </span>
              </h3>
              <p className="text-[11px] text-zinc-500">
                Snap site terrain, cracks, room spaces, or hardwood samples for Yingo engineers
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-sm bg-zinc-100 hover:bg-stone-200 text-zinc-500 hover:text-black transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder Canvas / Video */}
        <div className="relative aspect-[4/3] bg-white flex items-center justify-center overflow-hidden">
          {flashActive && (
            <div className="absolute inset-0 bg-white z-20 animate-out fade-out duration-200" />
          )}

          {error ? (
            <div className="p-6 text-center max-w-xs space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">{error}</p>
              <button
                onClick={startCamera}
                className="px-5 py-3 rounded-none uppercase tracking-widest text-[11px] bg-zinc-100 hover:bg-stone-200 text-amber-600 text-xs font-semibold border border-zinc-300"
              >
                Retry Camera
              </button>
            </div>
          ) : capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured Site Snapshot"
              className="w-full h-full object-contain bg-zinc-50"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Camera Grid Overlay */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20 border border-white/20">
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-white" />
                <div className="border-r border-white" />
                <div />
              </div>

              {/* Live Status Badge */}
              <div className="absolute top-3 left-3 bg-zinc-100/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-mono text-zinc-900 uppercase tracking-wide">
                  Live Viewfinder
                </span>
              </div>
            </>
          )}

          {/* Hidden Canvas for capture processing */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls Bar */}
        <div className="p-4 bg-white border-t border-zinc-200 flex items-center justify-between">
          {capturedImage ? (
            <>
              <button
                onClick={handleRetake}
                className="px-4 py-2.5 rounded-sm bg-zinc-100 hover:bg-stone-200 text-zinc-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RotateCw className="w-4 h-4" />
                <span>Retake</span>
              </button>

              <button
                onClick={handleConfirmPhoto}
                className="px-5 py-2.5 rounded-sm bg-black hover:bg-amber-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Attach to Consultation</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleFlipCamera}
                disabled={Boolean(error) || isStarting}
                className="p-2.5 rounded-sm bg-zinc-100 hover:bg-stone-200 disabled:opacity-40 text-zinc-600 hover:text-black transition-colors"
                title="Flip Camera (Rear/Front)"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Shutter Button */}
              <button
                onClick={handleTakeSnapshot}
                disabled={Boolean(error) || isStarting}
                className="w-14 h-14 rounded-full bg-black hover:bg-amber-600 disabled:opacity-40 p-1 border-4 border-stone-900 shadow-xl shadow-black/5 flex items-center justify-center transition-transform active:scale-95"
                title="Snap Photo"
              >
                <div className="w-full h-full rounded-full bg-zinc-50/20 border-2 border-white/60 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </button>

              <div className="w-10" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
