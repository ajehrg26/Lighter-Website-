import React from 'react';
import { motion } from 'motion/react';
import { 
  Flame, Sparkles, ChevronDown, Check, ArrowRight, ShieldCheck, Mail, 
  Award, Zap, Package, Search, Wrench, Settings, AlertCircle, 
  SlidersHorizontal, BookOpen, Undo2, MessageCircle 
} from 'lucide-react';

import { Lighter, FAQ } from '../types';
import LighterCard from './LighterCard';
import LighterFlicker from './LighterFlicker';
import EngravingTool from './EngravingTool';

// 1. CATALOG PAGE VIEW
interface CatalogPageProps {
  filteredLighters: Lighter[];
  activeCategory: 'All' | 'Luxury' | 'Electric' | 'Windproof' | 'Vintage';
  setActiveCategory: (cat: 'All' | 'Luxury' | 'Electric' | 'Windproof' | 'Vintage') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onAddToCart: (lighter: Lighter) => void;
  onCustomizeClick: (lighter: Lighter) => void;
  onSelectForSimulator: (lighter: Lighter) => void;
  setSelectedSpecLighter: (lighter: Lighter | null) => void;
  setActiveView: (view: 'home' | 'catalog' | 'simulator' | 'engraving' | 'support') => void;
}

export function CatalogPage({
  filteredLighters,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  onAddToCart,
  onCustomizeClick,
  onSelectForSimulator,
  setSelectedSpecLighter,
  setActiveView
}: CatalogPageProps) {
  return (
    <motion.div
      key="catalog"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      {/* Back button option */}
      <div className="mb-8">
        <button
          onClick={() => setActiveView('home')}
          className="text-[#FF4E00] text-xs font-mono uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
        >
          <Undo2 className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-[#222222]/60 pb-8">
        <div>
          <span className="text-[#FF4E00] text-xs font-mono uppercase tracking-[0.3em] block mb-2">Reserve Vault • 24hr Dispatch</span>
          <h2 className="text-3xl md:text-5xl font-sans font-black italic uppercase tracking-tighter text-white">
            The Curated <span className="text-[#FF4E00]">Catalog</span>
          </h2>
          <p className="text-gray-400 max-w-lg mt-2 text-xs sm:text-sm leading-relaxed">
            Unlock direct access to masterfully finished wands. Every lighter is detailed below with complete chassis materials, weights, and dimensions.
          </p>
        </div>

        {/* Premium Live Search Bar */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH RESERVE VAULT..."
            className="w-full bg-[#121212] border border-[#222222] text-xs font-mono uppercase tracking-wider text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4E00] py-3 pl-10 pr-4"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Filter Categories Row */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#121212] border border-[#222222] rounded-none mb-10 w-fit">
        {(['All', 'Luxury', 'Electric', 'Windproof', 'Vintage'] as const).map((tab) => {
          const isActive = activeCategory === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveCategory(tab)}
              className={`px-4 py-2 rounded-none text-[10px] font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-[#FF4E00] text-black font-bold shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Lighter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {filteredLighters
          .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.tagline.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((item) => (
            <div key={item.id} className="relative group bg-black/10 pb-4 border border-[#222222]/20 hover:border-[#FF4E00]/30 transition-all">
              <LighterCard
                lighter={item}
                onAddToCart={onAddToCart}
                onCustomizeClick={onCustomizeClick}
                onSelectForSimulator={onSelectForSimulator}
              />
              {/* Dedicated "Casing Specifications Detail" Button */}
              <div className="px-5">
                <button
                  onClick={() => setSelectedSpecLighter(item)}
                  className="w-full py-2 bg-[#121212] hover:bg-[#222222] border border-white/5 hover:border-[#FF4E00]/30 text-[9px] font-mono uppercase tracking-widest text-gray-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#FF4E00]/60" />
                  View Casing Specs & Logs
                </button>
              </div>
            </div>
        ))}
      </div>
    </motion.div>
  );
}


// 2. SIMULATOR PAGE VIEW
interface SimulatorPageProps {
  selectedLighterForSim: Lighter;
  setSelectedLighterForSim: (lighter: Lighter) => void;
  lightersData: Lighter[];
  onBackToCatalog: () => void;
  onBackToHome: () => void;
}

export function SimulatorPage({
  selectedLighterForSim,
  setSelectedLighterForSim,
  lightersData,
  onBackToCatalog,
  onBackToHome
}: SimulatorPageProps) {
  return (
    <motion.div
      key="simulator"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      {/* Back button option */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="text-[#FF4E00] text-xs font-mono uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
        >
          <Undo2 className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
          Flick Simulator Environment Series-01
        </span>
      </div>

      <div className="text-center mb-10">
        <span className="text-[#FF4E00] text-xs font-mono uppercase tracking-[0.3em] block mb-2">Live Ignition Calibration Bench</span>
        <h2 className="text-3xl md:text-5xl font-sans font-black italic uppercase tracking-tighter text-white">
          Virtual <span className="text-[#FF4E00]">Flick Test-Bench</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
        {/* Left side: Actual Interactive Flicker Simulator */}
        <div className="lg:col-span-8 bg-black/35 border border-[#222222] p-4">
          <LighterFlicker
            selectedLighter={selectedLighterForSim}
            onLighterSelect={setSelectedLighterForSim}
            lightersList={lightersData}
            onBackToCatalog={onBackToCatalog}
            onBackToHome={onBackToHome}
          />
        </div>

        {/* Right side: Engineering Test-Bench Control Desk */}
        <div className="lg:col-span-4 bg-[#121212] border border-[#FF4E00]/20 p-6 space-y-6">
          <div className="border-b border-white/5 pb-4">
            <div className="flex items-center gap-2 text-[#FF4E00] mb-1">
              <Settings className="w-4 h-4 text-[#FF4E00] animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-xs font-mono uppercase tracking-widest font-black">Diagnostics Panel</span>
            </div>
            <p className="text-gray-500 text-[10px] uppercase font-mono">Simulate real-world thermal coefficients & fuel burn limits.</p>
          </div>

          {/* Slider: Flame Height */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider">
              <span className="text-gray-400">Simulated Flame Height</span>
              <span className="text-[#FF4E00] font-bold">120% (High Relief)</span>
            </div>
            <div className="h-1 bg-[#222222] w-full relative">
              <div className="absolute top-0 left-0 h-full w-[80%] bg-[#FF4E00]" />
            </div>
            <span className="text-[8px] font-mono text-gray-500 uppercase block tracking-widest">Adjusts thermal output calibration rating.</span>
          </div>

          {/* Dial: Spark Count Ratio */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider">
              <span className="text-gray-400">Spark Wheel Contact Rate</span>
              <span className="text-amber-400 font-bold">98.4 Hz</span>
            </div>
            <div className="h-1 bg-[#222222] w-full relative">
              <div className="absolute top-0 left-0 h-full w-[95%] bg-amber-400" />
            </div>
            <span className="text-[8px] font-mono text-gray-500 uppercase block tracking-widest">Simulates flint wheel pressure.</span>
          </div>

          {/* Interactive Widget: Fuel Reserve Tank simulation */}
          <div className="bg-black/60 p-4 border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">Fuel Reserve Volume:</span>
              <span className="text-xs font-mono text-emerald-400 font-bold">100% Pressurized</span>
            </div>
            <div className="h-2.5 bg-[#222222] border border-white/5 p-[2px]">
              <div className="h-full bg-emerald-500" style={{ width: '100%' }} />
            </div>
            <div className="flex justify-between gap-2 pt-1">
              <button
                onClick={() => alert('Simulator fuel pressure purged & recalibrated!')}
                className="flex-1 py-1 px-2 bg-[#222222] hover:bg-[#333333] border border-white/5 text-[8px] font-mono uppercase text-gray-300 hover:text-white transition-all cursor-pointer text-center"
              >
                Purge Pressure
              </button>
              <button
                onClick={() => alert('Butane chamber refueled successfully!')}
                className="flex-1 py-1 px-2 bg-[#FF4E00]/10 hover:bg-[#FF4E00]/20 border border-[#FF4E00]/30 text-[8px] font-mono uppercase text-[#FF4E00] hover:text-white transition-all cursor-pointer text-center"
              >
                Refuel Wick
              </button>
            </div>
          </div>

          {/* Environmental simulator settings */}
          <div className="space-y-3 border-t border-white/5 pt-4">
            <span className="text-[9px] font-mono text-gray-500 uppercase block tracking-widest">Chassis Casing Thermals</span>
            <div className="grid grid-cols-2 gap-2 font-mono text-[9px]">
              <div className="bg-black/40 p-2 border border-white/5">
                <span className="text-gray-500 block">CASE TEMP</span>
                <span className="text-white font-bold block">24.5 °C</span>
              </div>
              <div className="bg-black/40 p-2 border border-white/5">
                <span className="text-gray-500 block">WIND SPEED</span>
                <span className="text-amber-400 font-bold block">12 knots (Windproof)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


// 3. CUSTOMIZER PAGE VIEW
interface CustomizerPageProps {
  customizableLighters: Lighter[];
  handleAddCustomizedToCart: (lighter: Lighter, text: string, font: string) => void;
  onBackToCatalog: () => void;
  onBackToHome: () => void;
}

export function CustomizerPage({
  customizableLighters,
  handleAddCustomizedToCart,
  onBackToCatalog,
  onBackToHome
}: CustomizerPageProps) {
  return (
    <motion.div
      key="engraving"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      {/* Back button option */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="text-[#FF4E00] text-xs font-mono uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
        >
          <Undo2 className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
          Atelier Bespoke Engraving Lab
        </span>
      </div>

      <div className="text-center mb-10">
        <span className="text-[#FF4E00] text-xs font-mono uppercase tracking-[0.3em] block mb-2">Artisanal Case Finishing</span>
        <h2 className="text-3xl md:text-5xl font-sans font-black italic uppercase tracking-tighter text-white">
          Bespoke <span className="text-[#FF4E00]">Engraving Desk</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
        {/* Left Column: Core Engraving Tool */}
        <div className="lg:col-span-8 bg-black/35 border border-[#222222] p-4">
          <EngravingTool
            customizableLighters={customizableLighters}
            onAddCustomizedToCart={handleAddCustomizedToCart}
            onBackToCatalog={onBackToCatalog}
            onBackToHome={onBackToHome}
          />
        </div>

        {/* Right Column: Dynamic Casing Relief & Packaging Selection */}
        <div className="lg:col-span-4 bg-[#121212] border border-[#FF4E00]/20 p-6 space-y-6">
          <div className="border-b border-white/5 pb-4">
            <div className="flex items-center gap-2 text-[#FF4E00] mb-1">
              <SlidersHorizontal className="w-4 h-4 text-[#FF4E00]" />
              <span className="text-xs font-mono uppercase tracking-widest font-black">Laser Spec Desk</span>
            </div>
            <p className="text-gray-500 text-[10px] uppercase font-mono">Fine tune depth, box lining, and ribbons for high gifting presentation.</p>
          </div>

          {/* Parameter Selection: Engraving Depth style */}
          <div className="space-y-2">
            <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">Engraving Relief Depth</span>
            <div className="grid grid-cols-3 gap-2 text-[9px] font-mono">
              <button className="py-2 px-1 bg-[#FF4E00] text-black font-bold border border-[#FF4E00] uppercase text-center rounded-none cursor-pointer">
                Deep Relief
              </button>
              <button className="py-2 px-1 bg-black/60 text-gray-400 border border-white/5 uppercase text-center rounded-none hover:border-white/20 hover:text-white transition-all cursor-pointer">
                Diamond Cut
              </button>
              <button className="py-2 px-1 bg-black/60 text-gray-400 border border-white/5 uppercase text-center rounded-none hover:border-white/20 hover:text-white transition-all cursor-pointer">
                Fine Etch
              </button>
            </div>
            <span className="text-[8px] font-mono text-gray-500 uppercase block tracking-widest mt-1">Deep relief cuts 0.4mm into brass casing block.</span>
          </div>

          {/* Packaging Material selections */}
          <div className="space-y-3">
            <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">Luxury Presentation Drawer</span>
            <div className="space-y-2 text-[10px] font-mono">
              <label className="flex items-center justify-between p-2.5 bg-black/40 border border-white/10 hover:border-[#FF4E00]/30 transition-all cursor-pointer">
                <span className="text-white font-bold">Cedar & Felt Box (Standard)</span>
                <span className="text-emerald-400 text-[9px]">INCLUDED</span>
              </label>
              <label className="flex items-center justify-between p-2.5 bg-black/40 border border-white/5 hover:border-[#FF4E00]/30 transition-all cursor-pointer">
                <span className="text-gray-400">Brushed Steel Drawer + Foam</span>
                <span className="text-amber-500 text-[9px]">+$15 USD</span>
              </label>
              <label className="flex items-center justify-between p-2.5 bg-black/40 border border-white/5 hover:border-[#FF4E00]/30 transition-all cursor-pointer">
                <span className="text-gray-400">Carbon Fiber Sealed Tube</span>
                <span className="text-amber-500 text-[9px]">+$25 USD</span>
              </label>
            </div>
          </div>

          {/* Atelier Pledge */}
          <div className="bg-[#181818] p-4 border border-[#FF4E00]/10 text-[10px] leading-relaxed text-gray-400 font-sans space-y-2">
            <span className="text-white font-mono font-bold uppercase tracking-wider block text-[9px]">ATELIER GUARANTEE</span>
            <p>
              Every engraving is individually validated by a master engraver. To preserve weighted pocket-balance symmetry, characters are laser-burned with ultra-high precision, hand-washed, and finished with organic sealants.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


// 4. SUPPORT PAGE VIEW
interface SupportPageProps {
  faqsData: FAQ[];
  faqSearchQuery: string;
  setFaqSearchQuery: (q: string) => void;
  diagnosticCategory: 'all' | 'petrol' | 'plasma' | 'jet';
  setDiagnosticCategory: (cat: 'all' | 'petrol' | 'plasma' | 'jet') => void;
  diagnosticIssue: string | null;
  setDiagnosticIssue: (issue: string | null) => void;
  serialQuery: string;
  setSerialQuery: (q: string) => void;
  serialQueryResult: { found: boolean; message: string } | null;
  setSerialQueryResult: (res: { found: boolean; message: string } | null) => void;
  setActiveView: (view: 'home' | 'catalog' | 'simulator' | 'engraving' | 'support') => void;
}

export function SupportPage({
  faqsData,
  faqSearchQuery,
  setFaqSearchQuery,
  diagnosticCategory,
  setDiagnosticCategory,
  diagnosticIssue,
  setDiagnosticIssue,
  serialQuery,
  setSerialQuery,
  serialQueryResult,
  setSerialQueryResult,
  setActiveView
}: SupportPageProps) {
  return (
    <motion.div
      key="support"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      {/* Back button option */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={() => setActiveView('home')}
          className="text-[#FF4E00] text-xs font-mono uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
        >
          <Undo2 className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
          Ignis Atelier Concierge Support Desk
        </span>
      </div>

      <div className="text-center mb-10">
        <span className="text-[#FF4E00] text-xs font-mono uppercase tracking-[0.3em] block mb-2">Concierge Maintenance Desk</span>
        <h2 className="text-3xl md:text-5xl font-sans font-black italic uppercase tracking-tighter text-white">
          Atelier <span className="text-[#FF4E00]">Support Desk</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
        {/* Left Column: Interactive Diagnostic wizard and search */}
        <div className="lg:col-span-8 bg-[#121212] border border-white/5 p-6 space-y-8">
          
          {/* Dynamic Troubleshooting Tree */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Wrench className="w-4 h-4 text-[#FF4E00]" />
              <span className="text-sm font-sans font-black uppercase tracking-wider text-white">Interactive Diagnostic Tree</span>
            </div>
            
            <p className="text-gray-400 text-xs font-sans leading-relaxed">
              Select your model series below to troubleshoot ignition spark, fuel pressure leaks, or battery management registers:
            </p>

            {/* Level 1 buttons */}
            <div className="grid grid-cols-3 gap-2 font-mono text-[9px]">
              <button
                onClick={() => {
                  setDiagnosticCategory('petrol');
                  setDiagnosticIssue(null);
                }}
                className={`py-3 px-2 border uppercase text-center rounded-none cursor-pointer transition-all ${
                  diagnosticCategory === 'petrol'
                    ? 'bg-[#FF4E00] text-black font-bold border-[#FF4E00]'
                    : 'bg-black/40 border-white/5 text-gray-300 hover:border-white/20'
                }`}
              >
                Petrol Mechanical
              </button>
              <button
                onClick={() => {
                  setDiagnosticCategory('plasma');
                  setDiagnosticIssue(null);
                }}
                className={`py-3 px-2 border uppercase text-center rounded-none cursor-pointer transition-all ${
                  diagnosticCategory === 'plasma'
                    ? 'bg-[#FF4E00] text-black font-bold border-[#FF4E00]'
                    : 'bg-black/40 border-white/5 text-gray-300 hover:border-white/20'
                }`}
              >
                Electric Plasma
              </button>
              <button
                onClick={() => {
                  setDiagnosticCategory('jet');
                  setDiagnosticIssue(null);
                }}
                className={`py-3 px-2 border uppercase text-center rounded-none cursor-pointer transition-all ${
                  diagnosticCategory === 'jet'
                    ? 'bg-[#FF4E00] text-black font-bold border-[#FF4E00]'
                    : 'bg-black/40 border-white/5 text-gray-300 hover:border-white/20'
                }`}
              >
                Butane Jet Torch
              </button>
            </div>

            {/* Level 2 based on Level 1 */}
            {diagnosticCategory === 'petrol' && (
              <div className="bg-black/40 p-4 border border-white/5 space-y-3">
                <span className="text-[10px] font-mono text-[#FF4E00] uppercase tracking-wider block">Common Issues - Petrol Mechanical</span>
                <div className="flex flex-col gap-2 font-mono text-[10px]">
                  <button
                    onClick={() => setDiagnosticIssue('petrol-spark')}
                    className={`text-left p-2 border ${diagnosticIssue === 'petrol-spark' ? 'border-[#FF4E00] text-white bg-[#FF4E00]/10' : 'border-white/5 text-gray-400 hover:text-white'} transition-all cursor-pointer`}
                  >
                    • Spark wheel turns but does not spark (Worn Flint)
                  </button>
                  <button
                    onClick={() => setDiagnosticIssue('petrol-leak')}
                    className={`text-left p-2 border ${diagnosticIssue === 'petrol-leak' ? 'border-[#FF4E00] text-white bg-[#FF4E00]/10' : 'border-white/5 text-gray-400 hover:text-white'} transition-all cursor-pointer`}
                  >
                    • Wick lights but flame is weak (Low petrol or dried wick)
                  </button>
                </div>
              </div>
            )}

            {diagnosticCategory === 'plasma' && (
              <div className="bg-black/40 p-4 border border-white/5 space-y-3">
                <span className="text-[10px] font-mono text-[#FF4E00] uppercase tracking-wider block">Common Issues - Electric Plasma</span>
                <div className="flex flex-col gap-2 font-mono text-[10px]">
                  <button
                    onClick={() => setDiagnosticIssue('plasma-charge')}
                    className={`text-left p-2 border ${diagnosticIssue === 'plasma-charge' ? 'border-[#FF4E00] text-white bg-[#FF4E00]/10' : 'border-white/5 text-gray-400 hover:text-white'} transition-all cursor-pointer`}
                  >
                    • LEDs do not light up on click (Battery dead or safety locked)
                  </button>
                  <button
                    onClick={() => setDiagnosticIssue('plasma-dirt')}
                    className={`text-left p-2 border ${diagnosticIssue === 'plasma-dirt' ? 'border-[#FF4E00] text-white bg-[#FF4E00]/10' : 'border-white/5 text-gray-400 hover:text-white'} transition-all cursor-pointer`}
                  >
                    • Arcs flick but do not cross (Carbon buildup on nodes)
                  </button>
                </div>
              </div>
            )}

            {diagnosticCategory === 'jet' && (
              <div className="bg-black/40 p-4 border border-white/5 space-y-3">
                <span className="text-[10px] font-mono text-[#FF4E00] uppercase tracking-wider block">Common Issues - Butane Jet Torch</span>
                <div className="flex flex-col gap-2 font-mono text-[10px]">
                  <button
                    onClick={() => setDiagnosticIssue('jet-spark')}
                    className={`text-left p-2 border ${diagnosticIssue === 'jet-spark' ? 'border-[#FF4E00] text-white bg-[#FF4E00]/10' : 'border-white/5 text-gray-400 hover:text-white'} transition-all cursor-pointer`}
                  >
                    • High velocity jet hiss is heard but no ignition (Piezo spark misalignment)
                  </button>
                  <button
                    onClick={() => setDiagnosticIssue('jet-height')}
                    className={`text-left p-2 border ${diagnosticIssue === 'jet-height' ? 'border-[#FF4E00] text-white bg-[#FF4E00]/10' : 'border-white/5 text-gray-400 hover:text-white'} transition-all cursor-pointer`}
                  >
                    • Flame sputters or is too high (Butane gas pocket pressure or dial error)
                  </button>
                </div>
              </div>
            )}

            {/* Level 3: Diagnosis Result details */}
            {diagnosticIssue === 'petrol-spark' && (
              <div className="bg-amber-950/20 border border-amber-500/30 p-4 font-sans text-xs text-gray-300 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-500 font-mono font-bold text-[10px] uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Diagnosis: Flint Depleted</span>
                </div>
                <p>
                  Your flint block has worn down to the spring cylinder tip. This triggers safety friction. To replace, simply unscrew the brass coin-slot plug at the base, pull the spring assembly out, insert a standard replacement flint block, and screw the spring back on.
                </p>
              </div>
            )}

            {diagnosticIssue === 'petrol-leak' && (
              <div className="bg-amber-950/20 border border-amber-500/30 p-4 font-sans text-xs text-gray-300 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-500 font-mono font-bold text-[10px] uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Diagnosis: Low Fluid / Evaporation</span>
                </div>
                <p>
                  Unscrew the primary base plug. Lift the cotton felt layer and saturate the interior cotton fibers with 10-15 drops of high-grade lighter fluid petrol. Additionally, if the wick is blackened, pull it out slightly with tweezers and snip off the charred 2mm tip to expose fresh cotton fibers.
                </p>
              </div>
            )}

            {diagnosticIssue === 'plasma-charge' && (
              <div className="bg-amber-950/20 border border-amber-500/30 p-4 font-sans text-xs text-gray-300 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-500 font-mono font-bold text-[10px] uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Diagnosis: Safety Lock / Dead Battery</span>
                </div>
                <p>
                  Connect your electronic lighter to a Type-C charger. Ensure the indicator LEDs blink within 5 seconds. If the device was left in cold storage, allow 10 minutes of trickle charging to warm the premium zinc alloy lithium core. Press the side safety toggle button 3 times rapidly to override the automatic child safety lock.
                </p>
              </div>
            )}

            {diagnosticIssue === 'plasma-dirt' && (
              <div className="bg-amber-950/20 border border-amber-500/30 p-4 font-sans text-xs text-gray-300 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-500 font-mono font-bold text-[10px] uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Diagnosis: Node Contamination</span>
                </div>
                <p>
                  High-frequency plasma arcs generate minimal micro-ash. Over time, ash coats the 4 cross-points. Clean nodes gently with an dry cotton swab dipped in Isopropyl alcohol. Do NOT use metal picks as they will scratch the cerakote coating.
                </p>
              </div>
            )}

            {diagnosticIssue === 'jet-spark' && (
              <div className="bg-amber-950/20 border border-amber-500/30 p-4 font-sans text-xs text-gray-300 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-500 font-mono font-bold text-[10px] uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Diagnosis: Piezo Ignition Gap</span>
                </div>
                <p>
                  The small metal wire inside the windproof chimney should be exactly 3.5mm away from the jet nozzle opening. If it has been bumped, gently nudge the tip 0.5mm closer using a clean wooden toothpick to restore the arc pathway.
                </p>
              </div>
            )}

            {diagnosticIssue === 'jet-height' && (
              <div className="bg-amber-950/20 border border-amber-500/30 p-4 font-sans text-xs text-gray-300 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-500 font-mono font-bold text-[10px] uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Diagnosis: High Altitude Air-Pocket</span>
                </div>
                <p>
                  When refilling butane, air pockets can settle in the tank. Pure gas must be bled. To purge, press the bottom refill nozzle down with a small screwdriver for 2 seconds to release all air-pocket pressure, turn the flame flame height dial to (-), refill with butane, wait 3 minutes, then increase height slowly.
                </p>
              </div>
            )}
          </div>

          {/* Dynamic FAQ Instant Search Panel */}
          <div className="space-y-4 pt-6 border-t border-white/5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4.5 h-4.5 text-[#FF4E00]" />
                <span className="text-sm font-sans font-black uppercase tracking-wider text-white">Instant FAQ Register</span>
              </div>
              
              {/* Local support search */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={faqSearchQuery}
                  onChange={(e) => setFaqSearchQuery(e.target.value)}
                  placeholder="FILTER INQUIRIES..."
                  className="w-full bg-black/60 border border-white/5 text-[9px] font-mono uppercase tracking-wider text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4E00] py-1.5 pl-8 pr-3"
                />
                <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-3">
              {faqsData
                .filter(faq => faq.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(faqSearchQuery.toLowerCase()))
                .map((faq, index) => (
                  <details
                    key={index}
                    className="group p-4 bg-black/45 border border-[#222222] hover:border-[#FF4E00]/40 rounded-none transition-all duration-300 [&_summary::-webkit-details-marker]:hidden cursor-pointer"
                  >
                    <summary className="flex items-center justify-between gap-4 select-none">
                      <span className="font-sans text-xs font-semibold text-white tracking-wide group-hover:text-[#FF4E00] transition-colors">
                        {faq.question}
                      </span>
                      <div className="w-5 h-5 rounded-none bg-black/40 border border-white/5 flex items-center justify-center text-gray-400 group-open:rotate-180 transition-transform shrink-0">
                        <ChevronDown className="w-3 h-3" />
                      </div>
                    </summary>
                    <div className="mt-3 border-t border-white/5 pt-3 text-xs text-gray-400 leading-relaxed pl-1">
                      {faq.answer}
                    </div>
                  </details>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Serial Lifetime Warranty Registry & Carriage Form */}
        <div className="lg:col-span-4 bg-[#121212] border border-[#FF4E00]/20 p-6 space-y-6">
          
          {/* Serial number registry lookup */}
          <div className="space-y-3 border-b border-white/5 pb-5">
            <div className="flex items-center gap-1.5 text-white mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono uppercase tracking-widest font-black">Lifetime Ledger Registry</span>
            </div>
            <p className="text-gray-500 text-[10px] uppercase font-mono">Check if your specimen's casing and serial key are logged.</p>
            
            <div className="space-y-2">
              <input
                type="text"
                value={serialQuery}
                onChange={(e) => {
                  setSerialQuery(e.target.value);
                  setSerialQueryResult(null);
                }}
                placeholder="ENTER SERIAL (E.G. IG-1926-GOLD)..."
                className="w-full bg-black/40 border border-white/5 text-[9px] font-mono uppercase tracking-wider text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4E00] py-2.5 px-3"
              />
              <button
                onClick={() => {
                  if (!serialQuery.trim()) return;
                  const hasMatch = serialQuery.toLowerCase().includes('gold') || serialQuery.toLowerCase().includes('noir') || serialQuery.toLowerCase().includes('chrono');
                  if (hasMatch) {
                    setSerialQueryResult({
                      found: true,
                      message: 'LEDGER VERIFIED: Genuine Ignis Specimen Series-01 recorded. Lifetime mechanical hinge warranty active.'
                    });
                  } else {
                    setSerialQueryResult({
                      found: false,
                      message: 'LEDGER WARNING: Serial coordinate is not active. If bought through our boutique, contact concierge below.'
                    });
                  }
                }}
                className="w-full py-2 bg-[#FF4E00]/10 hover:bg-[#FF4E00]/20 border border-[#FF4E00]/40 text-[#FF4E00] font-mono text-[9px] uppercase tracking-widest transition-all cursor-pointer text-center"
              >
                Query Ledger
              </button>
            </div>

            {serialQueryResult && (
              <div className={`p-3 border text-[9px] font-mono leading-relaxed transition-all ${serialQueryResult.found ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' : 'bg-red-950/20 border-red-500/30 text-red-400'}`}>
                {serialQueryResult.message}
              </div>
            )}
          </div>

          {/* WhatsApp Support Desk */}
          <div className="space-y-4 border-b border-white/5 pb-5">
            <div className="flex items-center gap-1.5 text-white">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono uppercase tracking-widest font-black">Live WhatsApp Desk</span>
            </div>
            <p className="text-gray-400 text-xs font-sans leading-relaxed">
              Have a direct inquiry or need immediate guidance regarding custom spec orders, payments, or vintage inventory? Chat with our specialist.
            </p>
            <a
              href="https://wa.me/918609831662?text=Hello%20Ignis%20Boutique%2C%20I%20have%20an%20inquiry%20about%20your%20lighters."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-emerald-600/95 hover:bg-emerald-500 text-black hover:text-black font-sans font-black uppercase tracking-wider transition-all cursor-pointer text-[10px] text-center flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-black" />
              Direct WhatsApp Inquiry
            </a>
          </div>

          {/* Carriage / Pickup form */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-white">
              <Mail className="w-4 h-4 text-[#FF4E00]" />
              <span className="text-xs font-mono uppercase tracking-widest font-black">Carriage Dispatch Desk</span>
            </div>
            <p className="text-[#FF4E00] text-xs font-sans leading-relaxed">
              Need a mechanical service or carbon cleanup? Submit your address coordinates below to schedule a carriage pick-up.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Carriage pick-up request successfully submitted. A courier tracking tag has been dispatched to your email coordinates.');
              }}
              className="space-y-2 text-[10px] font-mono"
            >
              <input
                type="text"
                required
                placeholder="FULL NAME..."
                className="w-full bg-black/40 border border-white/5 py-2 px-3 focus:outline-none focus:border-[#FF4E00] text-white text-[9px]"
              />
              <input
                type="email"
                required
                placeholder="EMAIL COORDINATES..."
                className="w-full bg-black/40 border border-white/5 py-2 px-3 focus:outline-none focus:border-[#FF4E00] text-white text-[9px]"
              />
              <textarea
                required
                rows={3}
                placeholder="PICKUP ADDRESS & SPECIMEN FAULT DESCRIPTION..."
                className="w-full bg-black/40 border border-white/5 py-2 px-3 focus:outline-none focus:border-[#FF4E00] text-white text-[9px] resize-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-[#FF4E00] hover:bg-white text-black font-sans font-bold uppercase tracking-wider transition-all cursor-pointer text-[9px] text-center"
              >
                Schedule Courier pickup
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
