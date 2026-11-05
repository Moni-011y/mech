import { useState, useRef, useEffect } from 'react';

interface HelicalGearVideoPlayerProps {
  className?: string;
  onSwitchToDiagram?: () => void;
  showDiagramToggle?: boolean;
}

export default function HelicalGearVideoPlayer({
  className = 'w-full h-full min-h-[170px]',
  onSwitchToDiagram,
  showDiagramToggle = true,
}: HelicalGearVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const controlsTimeoutRef = useRef<number | null>(null);

  const videoSrc = '/gemini_generated_video_f483b3f1.mp4';

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration || 0);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const time = parseFloat(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const restartVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => {});
  };

  const cycleSpeed = () => {
    if (!videoRef.current) return;
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    videoRef.current.playbackRate = nextSpeed;
    setPlaybackSpeed(nextSpeed);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const formatTime = (timeInSec: number) => {
    const min = Math.floor(timeInSec / 60);
    const sec = Math.floor(timeInSec % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2800);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={`relative group bg-[#0D1117] overflow-hidden flex items-center justify-center select-none ${className}`}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        onClick={togglePlay}
        className="w-full h-full object-cover cursor-pointer"
      />

      {/* Subtle Dark Vignette & Industrial Scanline Layer */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/90 via-transparent to-background/50" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.25)_51%)] bg-[size:100%_4px] opacity-15" />

      {/* Top HUD Overlay */}
      <div
        className={`absolute top-0 inset-x-0 p-2 sm:p-3 flex items-center justify-between gap-2 transition-opacity duration-300 pointer-events-auto ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-2 bg-surface/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-accent/40 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_#16B8A6]" />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold tracking-wider text-text-primary uppercase flex items-center gap-1">
              <span>⚙️</span> Helical Gear Simulation
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {showDiagramToggle && onSwitchToDiagram && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSwitchToDiagram();
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-surface/90 hover:bg-surface-elevated text-text-secondary hover:text-text-primary border border-border text-[10px] font-semibold backdrop-blur-md transition shadow-md"
              title="Switch to 2D Schematic Diagram"
            >
              <span>📐</span>
              <span className="hidden sm:inline">2D Diagram</span>
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            className="p-1 rounded-lg bg-surface/90 hover:bg-surface-elevated text-text-secondary hover:text-text-primary border border-border text-xs backdrop-blur-md transition shadow-md"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Big Center Play Icon (shown when paused) */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-accent/90 hover:bg-accent text-background flex items-center justify-center shadow-[0_0_20px_rgba(22,184,166,0.6)] transition-transform hover:scale-110"
          aria-label="Play video"
        >
          <svg className="w-6 h-6 sm:w-7 sm:h-7 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      )}

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 inset-x-0 p-2 sm:p-3 bg-gradient-to-t from-background via-background/85 to-transparent flex flex-col gap-1.5 transition-opacity duration-300 pointer-events-auto ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar Scrubber */}
        <div className="relative w-full flex items-center group/bar">
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.01"
            value={currentTime}
            onChange={handleSeek}
            onClick={(e) => e.stopPropagation()}
            className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-accent focus:outline-none transition"
            style={{
              background: `linear-gradient(to right, #16B8A6 ${progressPercent}%, rgba(48, 54, 61, 0.8) ${progressPercent}%)`,
            }}
          />
        </div>

        {/* Buttons & Indicators */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="p-1 rounded-md bg-surface/90 hover:bg-surface-elevated text-accent hover:text-white border border-border transition"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                restartVideo();
              }}
              className="p-1 rounded-md bg-surface/90 hover:bg-surface-elevated text-text-secondary hover:text-white border border-border transition"
              title="Restart Video"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              className="p-1 rounded-md bg-surface/90 hover:bg-surface-elevated text-text-secondary hover:text-white border border-border transition"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                cycleSpeed();
              }}
              className="px-1.5 py-0.5 rounded-md bg-surface/90 hover:bg-surface-elevated text-accent font-mono text-[9px] font-bold border border-border transition"
              title="Change Playback Speed"
            >
              {playbackSpeed}x
            </button>

            <span className="font-mono text-[10px] text-text-secondary hidden sm:inline">
              <span className="text-accent font-bold">{formatTime(currentTime)}</span> / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 rounded text-[8px] font-mono uppercase bg-accent/20 text-accent border border-accent/40 font-bold">
              HELICAL VIDEO
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

