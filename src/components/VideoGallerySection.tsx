import React, { useState, useRef } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Sparkles, 
  Film, 
  Clock, 
  MapPin, 
  CheckCircle2,
  RotateCcw
} from "lucide-react";
import { VIDEO_SHOWCASE } from "../data/constructionData";
import { playClickSound, playChimeSound } from "../utils/sound";

interface VideoGallerySectionProps {
  onOpenAiHelper: (prompt?: string) => void;
  onOpenBookSurvey: () => void;
}

export const VideoGallerySection: React.FC<VideoGallerySectionProps> = ({
  onOpenAiHelper,
  onOpenBookSurvey,
}) => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentVideo = VIDEO_SHOWCASE[activeVideoIndex];

  const handleSelectVideo = (index: number) => {
    playClickSound();
    setActiveVideoIndex(index);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleTogglePlay = () => {
    playClickSound();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleToggleMute = () => {
    playClickSound();
    if (!videoRef.current) return;
    const next = !isMuted;
    videoRef.current.muted = next;
    setIsMuted(next);
  };

  const handleFullScreen = () => {
    playClickSound();
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleReplay = () => {
    playClickSound();
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <section id="video-showcase" className="py-20 px-4 bg-white/60 border-t border-zinc-200/80">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/10 text-amber-600 text-xs font-bold tracking-wider uppercase mb-3 border border-amber-500/20">
            <Film className="w-3.5 h-3.5" />
            <span>Watch Us Build • Real Footage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">
            See Our Construction &amp; Carpentry in Action
          </h2>
          <p className="text-zinc-600 mt-2 text-sm sm:text-base">
            Watch real site building milestones and artisan woodworking craftsmanship underway in Kampala.
          </p>
        </div>

        {/* Video Player & Playlist Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Video Screen (2 columns) */}
          <div className="lg:col-span-2 rounded-none bg-zinc-50 border border-zinc-200 overflow-hidden shadow-2xl shadow-black/10 flex flex-col">
            <div className="relative aspect-video bg-zinc-100 flex items-center justify-center group">
              <video
                ref={videoRef}
                src={currentVideo.videoUrl}
                poster={currentVideo.poster}
                playsInline
                muted={isMuted}
                loop
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full object-cover"
              />

              {/* Big Center Play Overlay when paused */}
              {!isPlaying && (
                <button
                  onClick={handleTogglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-zinc-100/40 hover:bg-zinc-100/30 transition-all backdrop-blur-[2px]"
                  title="Play Video"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black text-white flex items-center justify-center shadow-2xl shadow-black/10 hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 ml-1 fill-stone-950" />
                  </div>
                </button>
              )}

              {/* Custom Controls Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-stone-100/90 via-black/50 to-transparent flex items-center justify-between gap-3 text-black">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleTogglePlay}
                    className="p-2 rounded-sm bg-white/80 hover:bg-black hover:text-white transition-colors"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <button
                    onClick={handleReplay}
                    className="p-2 rounded-sm bg-white/80 hover:bg-zinc-100 text-zinc-600 hover:text-black transition-colors"
                    title="Replay from beginning"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleToggleMute}
                    className="p-2 rounded-sm bg-white/80 hover:bg-zinc-100 text-zinc-600 hover:text-black transition-colors"
                    title={isMuted ? "Unmute Sound" : "Mute Sound"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
                  </button>
                  <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
                    {currentVideo.duration} • {currentVideo.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-amber-600 px-2 py-0.5 rounded bg-white/80 border border-zinc-200 hidden sm:inline">
                    {currentVideo.locationOrCraft}
                  </span>
                  <button
                    onClick={handleFullScreen}
                    className="p-2 rounded-sm bg-white/80 hover:bg-zinc-100 text-zinc-600 hover:text-black transition-colors"
                    title="Full Screen"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Video Metadata Box */}
            <div className="p-5 sm:p-6 bg-zinc-50 border-t border-zinc-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-mono text-amber-600 font-bold uppercase">
                  {currentVideo.category}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-black mt-0.5">
                  {currentVideo.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1 leading-relaxed">
                  {currentVideo.description}
                </p>
              </div>

              <button
                onClick={() => {
                  playChimeSound();
                  onOpenBookSurvey();
                }}
                className="px-4 py-2.5 rounded-sm bg-black hover:bg-amber-600 text-white font-bold text-xs shrink-0 whitespace-nowrap"
              >
                Schedule Site Visit
              </button>
            </div>
          </div>

          {/* Video Playlist Sidebar (1 column) */}
          <div className="space-y-3">
            <div className="text-xs font-bold font-mono text-zinc-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Playlist Episodes</span>
              <span className="text-amber-600">{VIDEO_SHOWCASE.length} Videos</span>
            </div>

            {VIDEO_SHOWCASE.map((item, idx) => {
              const isActive = idx === activeVideoIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectVideo(idx)}
                  className={`cursor-pointer p-3 rounded-sm border transition-all flex gap-3 ${
                    isActive
                      ? "bg-black/10 border-amber-500/60 shadow-lg shadow-amber-500/5"
                      : "bg-zinc-50/80 border-zinc-200 hover:border-zinc-300 hover:bg-white"
                  }`}
                >
                  <div className="relative w-24 h-16 rounded-sm overflow-hidden shrink-0 bg-white">
                    <img
                      src={item.poster}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-zinc-100/40 flex items-center justify-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        isActive ? "bg-black text-white" : "bg-white/90 text-black"
                      }`}>
                        <Play className="w-3 h-3 ml-0.5 fill-current" />
                      </div>
                    </div>
                    <span className="absolute bottom-1 right-1 text-[9px] font-mono bg-zinc-100/80 text-zinc-600 px-1 rounded">
                      {item.duration}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-mono text-amber-600 font-semibold truncate">
                      {item.category}
                    </div>
                    <h4 className="text-xs font-bold text-black truncate mt-0.5">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500 line-clamp-2 mt-0.5 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Quick Consultation Prompt Box */}
            <div className="p-4 rounded-sm bg-zinc-50 border border-zinc-200/80 text-xs space-y-2 mt-4">
              <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Want to see footage of your site type?</span>
              </div>
              <p className="text-zinc-500 text-[11px] leading-relaxed">
                Our team records drone and timelapse site logs for every active project in Kampala.
              </p>
              <button
                onClick={() => {
                  playChimeSound();
                  onOpenAiHelper("Can you explain how Yingo Contractors handles site progress updates, video inspections, and engineer reports?");
                }}
                className="w-full py-2 rounded-sm bg-white hover:bg-zinc-100 text-amber-600 font-bold border border-zinc-200 text-[11px] transition-colors"
              >
                Ask About Progress Monitoring
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
