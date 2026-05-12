import { useState, useRef, useEffect } from 'react';
import { CanvasVisualizer } from '@/components/CanvasVisualizer';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { Play, Pause, Volume2 } from 'lucide-react';

export default function Home() {
  const audioEngine = useAudioEngine();
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [themeColor, setThemeColor] = useState<string>('oklch(0.6 0.2 260)');
  const [showUI, setShowUI] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uiTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('audio/')) {
      alert('Please select an audio file');
      return;
    }

    setFileName(file.name);
    audioEngine.loadAudioFile(file);
    setThemeColor('oklch(0.6 0.2 260)');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  useEffect(() => {
    if (audioEngine.isPlaying) {
      setShowUI(false);
      if (uiTimeoutRef.current) clearTimeout(uiTimeoutRef.current);
    } else {
      setShowUI(true);
    }
  }, [audioEngine.isPlaying]);

  useEffect(() => {
    const handleMouseMove = () => {
      if (audioEngine.isPlaying) {
        setShowUI(true);
        if (uiTimeoutRef.current) clearTimeout(uiTimeoutRef.current);
        uiTimeoutRef.current = setTimeout(() => {
          setShowUI(false);
        }, 3000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [audioEngine.isPlaying]);

  const isDraggingClass = isDragging
    ? 'border-primary bg-primary/5'
    : 'border-primary/30 hover:border-primary/60 bg-primary/2';

  const showUIClass = showUI ? 'opacity-100' : 'opacity-0 pointer-events-none';

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      <CanvasVisualizer
        frequency={audioEngine.frequency}
        waveform={audioEngine.waveform}
        isPlaying={audioEngine.isPlaying}
        themeColor={themeColor}
        bassFrequency={audioEngine.bassFrequency}
        midFrequency={audioEngine.midFrequency}
        trebleFrequency={audioEngine.trebleFrequency}
        averageFrequency={audioEngine.averageFrequency}
      />

      {!audioEngine.isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-foreground mb-4 sm:mb-6 tracking-tight">
              Visualize your music.
            </h1>
            <p className="font-body text-base sm:text-lg md:text-xl text-foreground/80 mb-8 sm:mb-12 leading-relaxed">
              Immerse yourself in the architecture of music. Drag an MP3 file to begin.
            </p>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-lg p-8 sm:p-12 cursor-pointer transition-all duration-300 active:scale-95 ${isDraggingClass}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileInput}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-body text-foreground font-medium">
                    Drag an audio file here
                  </p>
                  <p className="font-body text-foreground/60 text-sm mt-1">
                    or click to browse
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className={`absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-background via-background/80 to-transparent p-4 sm:p-8 transition-all duration-300 ${showUIClass}`}
      >
        <div className="max-w-md mx-auto">
          <p className="font-body text-foreground/60 text-xs sm:text-sm mb-3 sm:mb-4 truncate">
            {fileName}
          </p>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={audioEngine.togglePlayPause}
              className="w-14 h-14 sm:w-12 sm:h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 touch-none"
              aria-label={audioEngine.isPlaying ? 'Pause' : 'Play'}
            >
              {audioEngine.isPlaying ? (
                <Pause className="w-7 h-7 sm:w-6 sm:h-6" />
              ) : (
                <Play className="w-7 h-7 sm:w-6 sm:h-6 ml-0.5" />
              )}
            </button>

            <div className="flex-1 flex items-center gap-2 sm:gap-3">
              <Volume2 className="w-5 h-5 text-foreground/60 flex-shrink-0" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={audioEngine.volume}
                onChange={(e) => audioEngine.setVolume(parseFloat(e.target.value))}
                className="flex-1 h-2 sm:h-1 bg-primary/20 rounded-full appearance-none cursor-pointer accent-primary touch-none"
                aria-label="Volume"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`absolute top-4 right-4 sm:top-8 sm:right-8 z-20 transition-all duration-300 ${showUIClass}`}
      >
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-body text-xs sm:text-sm transition-all duration-200 hover:scale-105 active:scale-95 touch-none"
          aria-label="Upload new audio file"
        >
          Upload New
        </button>
      </div>
    </div>
  );
}