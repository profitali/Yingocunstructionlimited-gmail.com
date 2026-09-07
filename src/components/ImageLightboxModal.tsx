import React from "react";
import { X, Download, ExternalLink, ZoomIn } from "lucide-react";
import { playClickSound } from "../utils/sound";

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  imageAlt?: string;
  onInquire?: (title: string) => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  imageAlt = "Project Image",
  onInquire,
}) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-100/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => {
        playClickSound();
        onClose();
      }}
    >
      <div 
        className="relative max-w-4xl w-full max-h-[90vh] bg-zinc-50 border border-zinc-200 rounded-none overflow-hidden shadow-2xl shadow-black/10 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white/90 px-4 py-3 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ZoomIn className="w-4 h-4 text-amber-600" />
            <h4 className="text-xs sm:text-sm font-bold text-black truncate max-w-md">
              {imageAlt}
            </h4>
          </div>

          <div className="flex items-center gap-2">
            {onInquire && (
              <button
                onClick={() => {
                  playClickSound();
                  onInquire(imageAlt);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-sm bg-black hover:bg-amber-600 text-white text-xs font-bold transition-colors"
              >
                Inquire About This
              </button>
            )}
            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="p-1.5 rounded-sm bg-zinc-100 hover:bg-stone-200 text-zinc-600 hover:text-black transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Full Image */}
        <div className="flex-1 overflow-hidden bg-zinc-100 flex items-center justify-center p-2">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="max-h-[75vh] w-auto object-contain rounded-sm"
          />
        </div>

        {/* Footer */}
        <div className="bg-white/80 px-4 py-2 border-t border-zinc-200 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Yingo Contractors • Uganda High-Resolution Portfolio</span>
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 hover:underline flex items-center gap-1"
          >
            <span>Open Original</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
