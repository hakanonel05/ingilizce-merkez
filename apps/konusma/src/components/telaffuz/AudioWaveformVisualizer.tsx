import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Volume2, Sparkles } from "lucide-react";
import { formatDuration } from '../../lib/konusmaSesi';

interface AudioWaveformVisualizerProps {
  audioUrl?: string | null;
  audioBlob?: Blob | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayToggle?: () => void;
  onSeek?: (time: number) => void;
  audioRef?: React.RefObject<HTMLAudioElement | null>;
  compact?: boolean;
}

export const AudioWaveformVisualizer: React.FC<AudioWaveformVisualizerProps> = ({
  audioUrl,
  audioBlob,
  isPlaying,
  currentTime,
  duration,
  onPlayToggle,
  onSeek,
  audioRef,
  compact = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [hoveredTime, setHoveredTime] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [currentLevel, setCurrentLevel] = useState<number>(0);

  // Audio analysis refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const channelDataRef = useRef<Float32Array | null>(null);
  const staticPeaksRef = useRef<number[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Dynamic smoothed values for 60fps wave rendering
  const smoothedEnergyRef = useRef<number>(0);
  const smoothedZcrRef = useRef<number>(0);
  const wavePhaseRef = useRef<number>(0);
  const maxGainRef = useRef<number>(1.0);

  // 1. Load and decode audio data into raw PCM Float32Array
  useEffect(() => {
    let isCancelled = false;

    const loadAndDecodeAudio = async () => {
      if (!audioBlob && !audioUrl) {
        setIsLoaded(false);
        return;
      }

      try {
        let arrayBuffer: ArrayBuffer;
        if (audioBlob) {
          arrayBuffer = await audioBlob.arrayBuffer();
        } else if (audioUrl) {
          const res = await fetch(audioUrl);
          arrayBuffer = await res.arrayBuffer();
        } else {
          return;
        }

        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!audioContextRef.current || audioContextRef.current.state === "closed") {
          audioContextRef.current = new AudioCtx();
        }
        const ctx = audioContextRef.current;

        const decoded = await ctx.decodeAudioData(arrayBuffer.slice(0));
        if (isCancelled) return;

        audioBufferRef.current = decoded;
        const raw = decoded.getChannelData(0);
        channelDataRef.current = raw;

        // Auto-gain calibration: find max peak to amplify quiet voices sensitively
        let maxPeak = 0.05;
        for (let i = 0; i < raw.length; i += 50) {
          const abs = Math.abs(raw[i]);
          if (abs > maxPeak) maxPeak = abs;
        }
        maxGainRef.current = Math.min(6.0, Math.max(1.2, 0.85 / maxPeak));

        // Precompute static waveform overview bars (120 bins)
        const BINS = 100;
        const blockSize = Math.floor(raw.length / BINS);
        const peaks: number[] = [];
        for (let b = 0; b < BINS; b++) {
          const start = b * blockSize;
          let sum = 0;
          let peak = 0;
          for (let j = 0; j < blockSize; j += 4) {
            const v = Math.abs(raw[start + j] || 0);
            if (v > peak) peak = v;
            sum += v * v;
          }
          const rms = Math.sqrt(sum / (blockSize / 4));
          const val = (peak * 0.7 + rms * 0.3) * maxGainRef.current;
          peaks.push(Math.max(0.08, Math.min(1.0, val)));
        }
        staticPeaksRef.current = peaks;
        setIsLoaded(true);
      } catch (err) {
        console.warn("AudioBuffer decode error, using dynamic synthesizer:", err);
      }
    };

    loadAndDecodeAudio();

    return () => {
      isCancelled = true;
    };
  }, [audioBlob, audioUrl]);

  // 2. Continuous 60fps canvas wave renderer directly reading audio samples
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = rect.width;
      const height = rect.height;

      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Determine current precise playback time (reading live from audio element if playing)
      let liveTime = Number.isFinite(currentTime) ? currentTime : 0;
      if (isPlaying && audioRef?.current && !audioRef.current.paused && Number.isFinite(audioRef.current.currentTime)) {
        liveTime = audioRef.current.currentTime;
      }
      const totalDur =
        Number.isFinite(duration) && duration > 0
          ? duration
          : audioBufferRef.current && Number.isFinite(audioBufferRef.current.duration) && audioBufferRef.current.duration > 0
          ? audioBufferRef.current.duration
          : 5;
      const progress = totalDur > 0 ? Math.max(0, Math.min(1, liveTime / totalDur)) : 0;

      // Extract instantaneous real audio energy at this exact millisecond
      let instantaneousEnergy = 0;
      let zeroCrossings = 0;

      const raw = channelDataRef.current;
      const buffer = audioBufferRef.current;

      if (raw && buffer && totalDur > 0 && isPlaying) {
        const sampleRate = buffer.sampleRate;
        const centerSample = Math.floor(liveTime * sampleRate);
        const windowSize = 512; // ~11ms instant acoustic window
        const start = Math.max(0, Math.min(raw.length - windowSize, centerSample - 256));

        let sumSquares = 0;
        let peak = 0;

        for (let i = 0; i < windowSize; i++) {
          const sample = raw[start + i] || 0;
          sumSquares += sample * sample;
          const abs = Math.abs(sample);
          if (abs > peak) peak = abs;

          if (i > 0) {
            const prev = raw[start + i - 1] || 0;
            if ((sample >= 0 && prev < 0) || (sample < 0 && prev >= 0)) {
              zeroCrossings++;
            }
          }
        }

        const rms = Math.sqrt(sumSquares / windowSize);
        // Instantaneous voice activity (plosives, vowels, energy)
        instantaneousEnergy = (peak * 0.7 + rms * 1.8) * maxGainRef.current;
        instantaneousEnergy = Math.max(0, Math.min(1.4, instantaneousEnergy));
      }

      // Fast attack, smooth decay filter for natural fluid wave responsiveness
      const attack = 0.55;
      const decay = 0.15;
      const target = isPlaying ? instantaneousEnergy : 0.05;
      if (target > smoothedEnergyRef.current) {
        smoothedEnergyRef.current += (target - smoothedEnergyRef.current) * attack;
      } else {
        smoothedEnergyRef.current += (target - smoothedEnergyRef.current) * decay;
      }

      const smoothedZcr = zeroCrossings / 512;
      smoothedZcrRef.current += (smoothedZcr - smoothedZcrRef.current) * 0.2;

      // Advance wave phase (moves faster when voice is actively speaking)
      const speedMultiplier = isPlaying ? 0.07 + smoothedEnergyRef.current * 0.14 : 0.025;
      wavePhaseRef.current += speedMultiplier;
      const phase = wavePhaseRef.current;
      const energy = smoothedEnergyRef.current;

      setCurrentLevel(Math.round(energy * 100));

      const centerY = height / 2;

      // -------------------------------------------------------------
      // 1. Draw subtle background static waveform bars (amplitude profile)
      // -------------------------------------------------------------
      const staticPeaks = staticPeaksRef.current;
      if (staticPeaks.length > 0) {
        const barCount = staticPeaks.length;
        const barWidth = width / barCount;
        const currentBarIdx = Math.floor(progress * barCount);

        for (let b = 0; b < barCount; b++) {
          const barPeak = staticPeaks[b];
          const isPassed = b <= currentBarIdx;
          const isPlayhead = Math.abs(b - currentBarIdx) <= 1 && isPlaying;

          // Bars near playhead expand and react dynamically to live energy!
          const dynamicBoost = isPlayhead ? energy * 0.6 : 0;
          const barH = Math.max(4, (barPeak + dynamicBoost) * (height * 0.7));

          const x = b * barWidth + barWidth * 0.2;
          const w = Math.max(1.5, barWidth * 0.6);
          const y = centerY - barH / 2;

          if (isPlayhead) {
            ctx.fillStyle = "rgba(52, 211, 153, 0.9)";
            ctx.shadowColor = "rgba(52, 211, 153, 0.6)";
            ctx.shadowBlur = 6;
          } else if (isPassed) {
            ctx.fillStyle = "rgba(16, 185, 129, 0.35)";
            ctx.shadowBlur = 0;
          } else {
            ctx.fillStyle = "rgba(71, 85, 105, 0.25)";
            ctx.shadowBlur = 0;
          }

          ctx.beginPath();
          ctx.roundRect(x, y, w, barH, 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }

      // -------------------------------------------------------------
      // 2. Draw Multi-Layer Fluid Sinuous Sound Waves (Reactive Bezier)
      // -------------------------------------------------------------
      // Center envelope window: wave is tallest around center / playhead
      const waveHeightMax = height * 0.42;

      // Helper function to draw a smooth organic wave
      const drawSineWave = (
        wavePhase: number,
        freqMultiplier: number,
        harmonicMultiplier: number,
        amplitudeScale: number,
        strokeColor: string,
        fillGradientColors: [string, string] | null,
        lineWidth: number
      ) => {
        ctx.beginPath();
        const step = 2; // pixel step for buttery smooth curves

        const baseAmp = Math.max(6, energy * waveHeightMax * amplitudeScale);

        let firstX = 0;
        let firstY = centerY;

        for (let x = 0; x <= width; x += step) {
          const normX = x / width;
          // Gaussian envelope so wave gently tapers at the extreme edges
          const envelope = Math.sin(normX * Math.PI);

          // Voice texture: when consonants are spoken, higher harmonics appear
          const texture = smoothedZcrRef.current * 4.0;
          const harmonic = Math.sin(normX * 18 + wavePhase * 1.5) * (0.15 + texture * 0.2);

          const y =
            centerY +
            Math.sin(normX * Math.PI * freqMultiplier + wavePhase) * baseAmp * envelope * (1 + harmonic) +
            Math.cos(normX * Math.PI * harmonicMultiplier - wavePhase * 0.7) * (baseAmp * 0.35) * envelope;

          if (x === 0) {
            firstX = x;
            firstY = y;
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        if (fillGradientColors) {
          // Close path to center line for gradient fill
          ctx.lineTo(width, centerY);
          ctx.lineTo(0, centerY);
          ctx.closePath();

          const grad = ctx.createLinearGradient(0, centerY - baseAmp, 0, centerY + baseAmp);
          grad.addColorStop(0, fillGradientColors[0]);
          grad.addColorStop(1, fillGradientColors[1]);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      };

      // Layer 1: Ambient deep cyan wave (lower frequency, wide swell)
      drawSineWave(
        phase * 0.8,
        3.2,
        6.4,
        0.75,
        "rgba(6, 182, 212, 0.45)",
        ["rgba(6, 182, 212, 0.15)", "rgba(6, 182, 212, 0.0)"],
        1.5
      );

      // Layer 2: Secondary Harmonic teal wave
      drawSineWave(
        phase * 1.25 + 1.2,
        4.6,
        8.2,
        0.9,
        "rgba(20, 184, 166, 0.6)",
        ["rgba(20, 184, 166, 0.18)", "rgba(20, 184, 166, 0.0)"],
        2.0
      );

      // Layer 3: Primary Core Emerald Glow Wave (Ultra sensitive to voice volume!)
      ctx.shadowColor = isPlaying && energy > 0.2 ? "rgba(52, 211, 153, 0.8)" : "transparent";
      ctx.shadowBlur = isPlaying ? 8 : 0;
      drawSineWave(
        phase * 1.6 + 2.5,
        5.8,
        11.5,
        1.15,
        isPlaying ? "rgba(52, 211, 153, 0.95)" : "rgba(148, 163, 184, 0.5)",
        ["rgba(52, 211, 153, 0.28)", "rgba(52, 211, 153, 0.0)"],
        2.5
      );
      ctx.shadowBlur = 0;

      // -------------------------------------------------------------
      // 3. Draw Active Playhead Line & Glowing Cursor
      // -------------------------------------------------------------
      const playheadX = progress * width;

      // Vertical playhead beam
      ctx.beginPath();
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, height);
      ctx.strokeStyle = isPlaying ? "rgba(52, 211, 153, 0.8)" : "rgba(148, 163, 184, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Glowing dot at center of playhead
      ctx.beginPath();
      ctx.arc(playheadX, centerY, isPlaying ? 4 + energy * 3 : 4, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(52, 211, 153, 0.9)";
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // -------------------------------------------------------------
      // 4. Hover time line
      // -------------------------------------------------------------
      if (hoveredTime !== null && totalDur > 0) {
        const hoverX = (hoveredTime / totalDur) * width;
        ctx.beginPath();
        ctx.moveTo(hoverX, 0);
        ctx.lineTo(hoverX, height);
        ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying, currentTime, duration, hoveredTime, isLoaded, audioRef]);

  // Click or drag to seek on canvas
  const getSafeTotalDuration = useCallback(() => {
    if (Number.isFinite(duration) && duration > 0) return duration;
    if (audioBufferRef.current && Number.isFinite(audioBufferRef.current.duration) && audioBufferRef.current.duration > 0) {
      return audioBufferRef.current.duration;
    }
    return 5;
  }, [duration]);

  const handleSeekEvent = useCallback(
    (clientX: number) => {
      const canvas = canvasRef.current;
      if (!canvas || !onSeek) return;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = Math.max(0, Math.min(1, x / (rect.width || 1)));
      const totalDur = getSafeTotalDuration();
      const targetTime = pct * totalDur;
      if (Number.isFinite(targetTime)) {
        onSeek(Math.max(0, targetTime));
      }
    },
    [getSafeTotalDuration, onSeek]
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handleSeekEvent(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / (rect.width || 1)));
    const totalDur = getSafeTotalDuration();
    const targetTime = pct * totalDur;
    if (Number.isFinite(targetTime)) {
      setHoveredTime(Math.max(0, targetTime));
    }
  };

  const totalEffectiveDuration = getSafeTotalDuration();

  return (
    <div
      ref={containerRef}
      className="bg-slate-900 rounded-xl border border-slate-800 p-3 sm:p-4 shadow-md text-white flex flex-col gap-2.5 select-none"
    >
      {/* Visualizer Header Bar */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          {onPlayToggle && (
            <button
              type="button"
              onClick={onPlayToggle}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer active:scale-95 shadow-sm ${
                isPlaying
                  ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30"
              }`}
              title={isPlaying ? "Durdur" : "Kaydı Dinle"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
          )}

          {/* Time Display */}
          <div className="flex items-baseline gap-1 font-mono text-xs text-slate-300">
            <span className="font-bold text-white text-sm">{formatDuration(currentTime)}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{formatDuration(totalEffectiveDuration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {isPlaying ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Canlı Ses Dalgaları ({currentLevel}%)</span>
            </div>
          ) : (
            <span className="text-slate-400 text-[11px]">
              İstediğiniz saniyeye atlamak için dalgaya tıklayın
            </span>
          )}

          {onSeek && currentTime > 0 && (
            <button
              type="button"
              onClick={() => onSeek(0)}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Başa Dön"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Real-time Responsive Audio Waves Canvas */}
      <div className="relative w-full h-24 sm:h-28 bg-slate-950 rounded-lg border border-slate-800/80 overflow-hidden cursor-pointer group">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredTime(null)}
        />

        {/* Hover Time Tooltip Marker */}
        {hoveredTime !== null && (
          <div
            className="absolute top-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/90 text-emerald-300 border border-emerald-500/30 pointer-events-none -translate-x-1/2 z-30 shadow-md backdrop-blur-xs"
            style={{
              left: `${(hoveredTime / totalEffectiveDuration) * 100}%`,
            }}
          >
            {formatDuration(hoveredTime)}
          </div>
        )}
      </div>
    </div>
  );
};
