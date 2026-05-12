import { useEffect, useRef, useState } from 'react';

interface AudioEngineState {
  isPlaying: boolean;
  volume: number;
  frequency: Uint8Array | null;
  waveform: Uint8Array | null;
  averageFrequency: number;
  bassFrequency: number;
  midFrequency: number;
  trebleFrequency: number;
}

export const useAudioEngine = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [state, setState] = useState<AudioEngineState>({
    isPlaying: false,
    volume: 0.5,
    frequency: null,
    waveform: null,
    averageFrequency: 0,
    bassFrequency: 0,
    midFrequency: 0,
    trebleFrequency: 0,
  });

  // Initialize audio context
  const initializeAudioContext = () => {
    if (audioContextRef.current) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const gainNode = audioContext.createGain();

    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.85;
    gainNode.connect(analyser);
    analyser.connect(audioContext.destination);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    gainNodeRef.current = gainNode;

    return audioContext;
  };

  // Load and play audio file
  const loadAudioFile = async (file: File) => {
    const audioContext = initializeAudioContext();
    if (!audioContext || !gainNodeRef.current || !analyserRef.current) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Stop previous playback
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
      }

      // Create new source
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(gainNodeRef.current);

      // Handle playback end
      source.onended = () => {
        setState((prev) => ({ ...prev, isPlaying: false }));
      };

      audioSourceRef.current = source;
      source.start(0);
      setState((prev) => ({ ...prev, isPlaying: true }));

      // Resume audio context if suspended
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
    } catch (error) {
      console.error('Error loading audio file:', error);
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    if (state.isPlaying && audioSourceRef.current) {
      audioSourceRef.current.stop();
      setState((prev) => ({ ...prev, isPlaying: false }));
    } else if (!state.isPlaying && audioSourceRef.current) {
      // Note: Web Audio API doesn't support pause/resume on BufferSource
      // For now, we'll just stop. A full implementation would need to track time.
      setState((prev) => ({ ...prev, isPlaying: true }));
    }
  };

  // Set volume
  const setVolume = (volume: number) => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
    setState((prev) => ({ ...prev, volume }));
  };

  // Update frequency data
  useEffect(() => {
    let animationFrameId: number;

    const updateFrequencyData = () => {
      if (analyserRef.current) {
        const frequencyData = new Uint8Array(analyserRef.current.frequencyBinCount);
        const waveformData = new Uint8Array(analyserRef.current.frequencyBinCount);

        analyserRef.current.getByteFrequencyData(frequencyData);
        analyserRef.current.getByteTimeDomainData(waveformData);

        // Calculate frequency bands
        const dataLength = frequencyData.length;
        const bassEnd = Math.floor(dataLength * 0.1);
        const midEnd = Math.floor(dataLength * 0.5);

        const bassFrequency =
          frequencyData.slice(0, bassEnd).reduce((a, b) => a + b, 0) / bassEnd;
        const midFrequency =
          frequencyData.slice(bassEnd, midEnd).reduce((a, b) => a + b, 0) /
          (midEnd - bassEnd);
        const trebleFrequency =
          frequencyData.slice(midEnd).reduce((a, b) => a + b, 0) /
          (dataLength - midEnd);
        const averageFrequency =
          frequencyData.reduce((a, b) => a + b, 0) / dataLength;

        setState((prev) => ({
          ...prev,
          frequency: frequencyData,
          waveform: waveformData,
          averageFrequency,
          bassFrequency,
          midFrequency,
          trebleFrequency,
        }));
      }

      animationFrameId = requestAnimationFrame(updateFrequencyData);
    };

    animationFrameId = requestAnimationFrame(updateFrequencyData);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return {
    ...state,
    loadAudioFile,
    togglePlayPause,
    setVolume,
  };
};
