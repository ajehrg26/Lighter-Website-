import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Sparkles, Zap, RotateCcw, ArrowLeft, ArrowUp } from 'lucide-react';
import { Lighter } from '../types';

interface LighterFlickerProps {
  selectedLighter: Lighter;
  onLighterSelect: (lighter: Lighter) => void;
  lightersList: Lighter[];
  onBackToCatalog?: () => void;
  onBackToHome?: () => void;
}

export default function LighterFlicker({
  selectedLighter,
  onLighterSelect,
  lightersList,
  onBackToCatalog,
  onBackToHome,
}: LighterFlickerProps) {
  const [isIgnited, setIsIgnited] = useState(false);
  const [isSparking, setIsSparking] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize Web Audio API for synthetic mechanical sounds
  const playIgnitionSound = (type: string) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // 1. Spark Sound (Short high-frequency snap)
      const sparkOsc = ctx.createOscillator();
      const sparkGain = ctx.createGain();
      sparkOsc.type = 'triangle';
      sparkOsc.frequency.setValueAtTime(3000, now);
      sparkOsc.frequency.exponentialRampToValueAtTime(100, now + 0.15);

      sparkGain.gain.setValueAtTime(0.3, now);
      sparkGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      sparkOsc.connect(sparkGain);
      sparkGain.connect(ctx.destination);
      sparkOsc.start(now);
      sparkOsc.stop(now + 0.15);

      // 2. Flame / Arc Sound (Continuous hum or hiss)
      if (type === 'USB Rechargeable') {
        // High frequency electric zap
        const arcOsc1 = ctx.createOscillator();
        const arcOsc2 = ctx.createOscillator();
        const arcGain = ctx.createGain();

        arcOsc1.type = 'sawtooth';
        arcOsc1.frequency.setValueAtTime(110, now); // Buzz hum
        arcOsc2.type = 'sine';
        arcOsc2.frequency.setValueAtTime(15000, now); // Ultrasonic whine (lower dynamic volume)

        arcGain.gain.setValueAtTime(0.08, now);
        arcGain.gain.linearRampToValueAtTime(0.05, now + 0.1);

        arcOsc1.connect(arcGain);
        arcOsc2.connect(arcGain);
        arcGain.connect(ctx.destination);

        arcOsc1.start(now);
        arcOsc2.start(now);

        // Keep track of node to stop when un-ignited
        return {
          stop: () => {
            try {
              arcGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
              arcOsc1.stop(ctx.currentTime + 0.1);
              arcOsc2.stop(ctx.currentTime + 0.1);
            } catch (e) {}
          }
        };
      } else if (type === 'Butane Jet') {
        // Jet high-pressure hiss (White noise-ish)
        const bufferSize = ctx.sampleRate * 1.5; // 1.5 seconds of noise
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = buffer;
        noiseNode.loop = true;

        // Bandpass filter to make it sound like high pressure gas
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2500, now);
        filter.Q.setValueAtTime(1.5, now);

        const gasGain = ctx.createGain();
        gasGain.gain.setValueAtTime(0.12, now);

        noiseNode.connect(filter);
        filter.connect(gasGain);
        gasGain.connect(ctx.destination);
        noiseNode.start(now);

        return {
          stop: () => {
            try {
              gasGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
              noiseNode.stop(ctx.currentTime + 0.1);
            } catch (e) {}
          }
        };
      } else {
        // Classic yellow candle flame (Very soft rumbling fire sound)
        const bufferSize = ctx.sampleRate * 1.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const fireNode = ctx.createBufferSource();
        fireNode.buffer = buffer;
        fireNode.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(150, now);

        const flameGain = ctx.createGain();
        flameGain.gain.setValueAtTime(0.1, now);

        fireNode.connect(filter);
        filter.connect(flameGain);
        flameGain.connect(ctx.destination);
        fireNode.start(now);

        return {
          stop: () => {
            try {
              flameGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
              fireNode.stop(ctx.currentTime + 0.12);
            } catch (e) {}
          }
        };
      }
    } catch (err) {
      console.warn('Audio synthesis failed or is unsupported:', err);
      return null;
    }
  };

  const activeSoundRef = useRef<{ stop: () => void } | null>(null);

  const handleFlick = () => {
    if (isIgnited) {
      // Turn off
      if (activeSoundRef.current) {
        activeSoundRef.current.stop();
        activeSoundRef.current = null;
      }
      setIsIgnited(false);
      return;
    }

    setIsSparking(true);
    setTimeout(() => {
      setIsSparking(false);
      setIsIgnited(true);
      const sound = playIgnitionSound(selectedLighter.fuelType);
      if (sound) {
        activeSoundRef.current = sound as any;
      }
    }, 250);
  };

  // Turn off flame on product change
  useEffect(() => {
    if (activeSoundRef.current) {
      activeSoundRef.current.stop();
      activeSoundRef.current = null;
    }
    setIsIgnited(false);
  }, [selectedLighter]);

  // Clean up sound on unmount
  useEffect(() => {
    return () => {
      if (activeSoundRef.current) {
        activeSoundRef.current.stop();
      }
    };
  }, []);

  // Visual variables based on lighter fuel types
  const getFlameClass = () => {
    switch (selectedLighter.fuelType) {
      case 'USB Rechargeable':
        return 'bg-gradient-to-t from-violet-600 via-indigo-500 to-fuchsia-400 shadow-[0_0_15px_rgba(139,92,246,0.8)]';
      case 'Butane Jet':
        return 'bg-gradient-to-t from-blue-700 via-cyan-400 to-blue-200 shadow-[0_0_20px_rgba(14,165,233,0.8)] w-4 h-24 rounded-full';
      default:
        return 'bg-gradient-to-t from-[#FF4E00] via-[#FF4E00] to-yellow-300 shadow-[0_0_25px_rgba(255,78,0,0.8)] rounded-[50%_50%_20%_20%/_60%_60%_40%_40%]';
    }
  };

  return (
    <section id="flicker-simulator" className="py-20 relative overflow-hidden bg-[#0F0F0F] border-y border-[#222222]">
      {/* Decorative Art Deco Framing Lines */}
      <div className="absolute inset-x-0 top-0 h-4 bg-[linear-gradient(90deg,#0F0F0F_0%,#FF4E00_50%,#0F0F0F_100%)] opacity-10" />
      <div className="absolute top-10 left-10 bottom-10 w-[1px] bg-[#FF4E00]/10 hidden lg:block" />
      <div className="absolute top-10 right-10 bottom-10 w-[1px] bg-[#FF4E00]/10 hidden lg:block" />

      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        {/* Navigation / Back Options */}
        {(onBackToCatalog || onBackToHome) && (
          <div className="flex items-center justify-between border-b border-[#222222] pb-6 mb-8">
            {onBackToCatalog ? (
              <button
                onClick={onBackToCatalog}
                id="simulator-back-to-catalog"
                className="text-[10px] font-mono uppercase tracking-widest text-[#FF4E00]/80 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Catalog
              </button>
            ) : <div />}
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                id="simulator-back-to-home"
                className="text-[10px] font-mono uppercase tracking-widest text-gray-500 hover:text-[#FF4E00] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                Back to Home
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        <div className="text-center mb-12">
          <span className="text-[#FF4E00] text-xs font-mono uppercase tracking-[0.3em] block mb-2">Artisanal Engineering</span>
          <h2 className="text-3xl md:text-5xl font-sans font-black italic uppercase tracking-tighter text-white">
            Virtual <span className="text-[#FF4E00]">Ignition</span> Simulator
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-4 text-sm md:text-base">
            Select a piece from our reserve collection below, then click the ignition trigger or wheel to experience the distinctive flame dynamics and synthesized mechanical feedback of our systems.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Lighter Select Panel */}
          <div className="lg:col-span-4 space-y-4 order-2 lg:order-1">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-gray-500 mb-3 block">Reserve Catalog Selection</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {lightersList.map((item) => {
                const isSelected = item.id === selectedLighter.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onLighterSelect(item)}
                    id={`select-lighter-${item.id}`}
                    className={`w-full text-left p-4 rounded-none border transition-all duration-300 relative overflow-hidden ${
                      isSelected
                        ? 'bg-[#1A1A1A] border-[#FF4E00] text-white shadow-[0_4px_20px_rgba(255,78,0,0.08)]'
                        : 'bg-black/60 border-white/5 text-gray-400 hover:border-white/15 hover:text-white'
                    }`}
                  >
                    {/* Tiny Art Deco gold bar highlight when active */}
                    {isSelected && (
                      <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-[#FF4E00]" />
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-mono text-gray-500 block mb-0.5">{item.category}</span>
                        <h4 className="font-sans font-medium text-sm tracking-wide">{item.name}</h4>
                      </div>
                      <span className="text-xs font-mono text-[#FF4E00]">${item.price}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Interactive Visual Simulator Frame */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center order-1 lg:order-2 bg-[#050505] border border-[#222222] p-8 md:p-12 rounded-none relative shadow-[inset_0_4px_30px_rgba(0,0,0,0.9)] h-[500px]">
            {/* Geometrical Art Deco Background Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none flex items-center justify-center">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="artdeco" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 60 30 L 30 60 L 0 30 Z" fill="none" stroke="#FF4E00" strokeWidth="1" />
                    <circle cx="30" cy="30" r="10" fill="none" stroke="#FF4E00" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#artdeco)" />
              </svg>
            </div>

            {/* Simulated Ignite Window */}
            <div className="relative flex flex-col items-center justify-end h-72 w-64 mb-8">
              
              {/* FLAME & SPARK DISPLAY */}
              <AnimatePresence mode="popLayout">
                {isSparking && (
                  <motion.div
                    key="spark"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1.3 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-40 z-20"
                  >
                    <div className="relative">
                      <Sparkles className="w-8 h-8 text-[#FF4E00] animate-spin" />
                      <div className="absolute inset-0 bg-[#FF4E00] blur-md rounded-full opacity-50" />
                    </div>
                  </motion.div>
                )}

                {isIgnited && (
                  <motion.div
                    key="flame"
                    initial={{ opacity: 0, y: 15, scaleY: 0.2 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scaleY: [1, 1.08, 0.95, 1.05, 1],
                      scaleX: [1, 0.92, 1.06, 0.95, 1],
                    }}
                    exit={{ opacity: 0, y: 20, scaleY: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 15,
                      scaleY: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' },
                      scaleX: { repeat: Infinity, duration: 1.4, ease: 'easeInOut' }
                    }}
                    className="absolute bottom-[145px] z-10 flex flex-col items-center"
                  >
                    {/* High-frequency Plasma Arc representation */}
                    {selectedLighter.fuelType === 'USB Rechargeable' ? (
                      <div className="relative h-16 w-8 flex items-center justify-center">
                        {/* Two contact terminals */}
                        <div className="absolute left-[-8px] bottom-0 w-1.5 h-6 bg-gray-600 rounded-none" />
                        <div className="absolute right-[-8px] bottom-0 w-1.5 h-6 bg-gray-600 rounded-none" />
                        {/* Plasma Arc Core */}
                        <div className="w-[3px] h-12 bg-indigo-200 shadow-[0_0_15px_rgba(139,92,246,1)] rounded-none animate-pulse relative">
                          <Zap className="absolute inset-0 w-4 h-4 text-fuchsia-300 -translate-x-1.5 animate-bounce" />
                        </div>
                        {/* Outer Glow */}
                        <div className="absolute w-12 h-16 bg-violet-600/20 blur-xl rounded-full" />
                      </div>
                    ) : selectedLighter.fuelType === 'Butane Jet' ? (
                      <div className="relative flex flex-col items-center">
                        {/* Inner high temperature core */}
                        <div className="w-2.5 h-20 bg-gradient-to-t from-white via-cyan-300 to-transparent rounded-none shadow-[0_0_12px_rgba(34,211,238,1)] z-10" />
                        {/* Outer jet exhaust flame */}
                        <div className="absolute bottom-0 w-5 h-24 bg-gradient-to-t from-blue-600/80 via-indigo-500/40 to-transparent blur-[2px] rounded-none" />
                        <div className="absolute bottom-[-10px] w-8 h-8 bg-blue-500/10 blur-xl rounded-full" />
                      </div>
                    ) : (
                      // Classic soft yellow flame
                      <div className="relative w-10 h-28 flex flex-col items-center">
                        {/* Core flame shape */}
                        <div className={`w-8 h-20 ${getFlameClass()}`} />
                        {/* Innermost blue oxygenated core */}
                        <div className="absolute bottom-2 w-4 h-8 bg-[#FF4E00]/60 rounded-full blur-[1px] opacity-80" />
                        {/* Ambient heat aura */}
                        <div className="absolute w-20 h-20 bg-[#FF4E00]/10 blur-2xl rounded-full top-4" />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* LIGHTER HARDWARE VISUALIZATION */}
              <div className="relative w-28 h-40 flex flex-col justify-end">
                {/* Lighter Lid (swung open or shut) */}
                <motion.div
                  animate={{
                    rotate: isIgnited ? -115 : 0,
                    x: isIgnited ? -12 : 0,
                    y: isIgnited ? 4 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="absolute left-0 top-[18px] w-full h-10 bg-gradient-to-r from-[#777] via-[#AAA] to-[#444] rounded-t-none border-x border-t border-[#888] shadow-lg z-10 origin-bottom-left flex items-center px-4"
                  style={{ transformOrigin: '0% 100%' }}
                >
                  {/* Art Deco linear panel on Lid */}
                  <div className="w-full h-2 border-y border-white/20 opacity-30" />
                </motion.div>

                {/* Main Body (Precision-Machined Aerospace Titanium Finish with Red Glow) */}
                <div className="w-full h-28 bg-gradient-to-b from-[#888] via-[#CCC] to-[#444] rounded-b-none border-x border-b border-[#AAA] relative shadow-[0_0_50px_rgba(255,78,0,0.08)] z-0 overflow-hidden">
                  
                  {/* Vertical Grooves or Patterning (Art Deco lines) */}
                  <div className="absolute inset-0 flex justify-between px-3 pointer-events-none opacity-25">
                    <div className="w-[1px] h-full bg-black" />
                    <div className="w-[1px] h-full bg-black" />
                    <div className="w-[1px] h-full bg-black" />
                    <div className="w-[1px] h-full bg-black" />
                    <div className="w-[1px] h-full bg-black" />
                  </div>

                  {/* Highlight sheen overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[50%] skew-x-12 animate-pulse" />

                  {/* Engraving plate or subtle logo on lighter */}
                  <div className="absolute inset-x-4 top-10 bottom-6 border border-white/10 flex flex-col items-center justify-center rounded-none bg-black/30">
                    <span className="text-[9px] font-black tracking-[0.2em] text-[#FF4E00] uppercase italic">IGNIS</span>
                    <span className="text-[7px] font-mono text-white/60 font-semibold mt-1">FLUX-PRO</span>
                  </div>
                </div>

                {/* The Chimney, Flint Wheel & Spark hardware (inside/behind the lid gap) */}
                <div className="absolute top-[2px] left-3 right-3 h-8 bg-gradient-to-b from-zinc-700 to-zinc-900 rounded-t-none border-x border-t border-zinc-600/30 flex items-end justify-between px-2 pb-0.5">
                  {/* Vent holes of chimney */}
                  <div className="flex gap-1 mb-1">
                    <div className="w-1 h-3 bg-black/40 rounded-none" />
                    <div className="w-1 h-3 bg-black/40 rounded-none" />
                    <div className="w-1 h-3 bg-black/40 rounded-none" />
                  </div>

                  {/* flint wheel button triggers flick on click */}
                  <motion.button
                    onClick={handleFlick}
                    id="spark-flint-wheel"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ rotate: 180 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-6 h-6 rounded-none bg-zinc-600 border border-zinc-500 shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)] flex items-center justify-center cursor-pointer z-20 mr-1 group"
                  >
                    {/* Knurled steel lines */}
                    <div className="w-3.5 h-3.5 rounded-none border border-dashed border-zinc-400 group-hover:border-[#FF4E00]" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Core Interaction Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 z-10">
              <button
                onClick={handleFlick}
                id="ignite-trigger-btn"
                className={`px-8 py-4 rounded-none font-sans font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-md ${
                  isIgnited
                    ? 'bg-rose-950 border border-rose-500/40 text-rose-200 hover:bg-rose-900'
                    : 'bg-[#FF4E00] text-black hover:bg-white hover:text-black shadow-[0_4px_15px_rgba(255,78,0,0.3)]'
                }`}
              >
                {isIgnited ? 'Extinguish Flame' : 'Flick & Ignite'}
              </button>

              <button
                onClick={() => {
                  if (activeSoundRef.current) activeSoundRef.current.stop();
                  setIsIgnited(false);
                }}
                id="reset-simulator-btn"
                className="px-4 py-2 border border-[#222] bg-black hover:bg-[#1A1A1A] text-gray-400 hover:text-white rounded-none flex items-center gap-1.5 transition-all text-xs font-mono"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Model
              </button>
            </div>

            {/* Live Specs Ribbon */}
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-[10px] font-mono text-gray-500 border-t border-[#222] pt-3">
              <span>TYPE: {selectedLighter.fuelType.toUpperCase()}</span>
              <span>STATE: {isIgnited ? 'IGNITED' : 'IDLE'}</span>
              <span>PRESSURE: {selectedLighter.fuelType === 'Butane Jet' ? 'HIGH-JET' : 'STABLE'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
