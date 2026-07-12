import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Type, Sparkles, Sliders, Check, ShoppingCart, ArrowLeft, ArrowUp } from 'lucide-react';
import { Lighter } from '../types';

interface EngravingToolProps {
  customizableLighters: Lighter[];
  onAddCustomizedToCart: (lighter: Lighter, text: string, font: string) => void;
  onBackToCatalog?: () => void;
  onBackToHome?: () => void;
}

const FONTS_PRESET = [
  { id: 'font-deco', name: 'Art Deco Geometric', cssClass: 'font-sans uppercase tracking-[0.2em] font-light' },
  { id: 'font-cursive', name: 'Royal Script Cursive', cssClass: 'font-serif italic tracking-wide font-normal' },
  { id: 'font-vintage', name: 'Vintage Engraved Serif', cssClass: 'font-serif uppercase tracking-widest font-semibold' },
  { id: 'font-mono', name: 'Industrial Monospace', cssClass: 'font-mono tracking-widest uppercase font-light' }
];

export default function EngravingTool({
  customizableLighters,
  onAddCustomizedToCart,
  onBackToCatalog,
  onBackToHome,
}: EngravingToolProps) {
  const [selectedLighter, setSelectedLighter] = useState<Lighter>(customizableLighters[0] || null);
  const [engravingText, setEngravingText] = useState('');
  const [selectedFont, setSelectedFont] = useState(FONTS_PRESET[0]);
  const [isAddedSuccessfully, setIsAddedSuccessfully] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    if (text.length <= 20) {
      setEngravingText(text);
    }
  };

  const handleAddToCart = () => {
    if (!selectedLighter || !engravingText.trim()) return;
    onAddCustomizedToCart(selectedLighter, engravingText.trim(), selectedFont.name);
    setIsAddedSuccessfully(true);
    setTimeout(() => {
      setIsAddedSuccessfully(false);
      setEngravingText('');
    }, 2000);
  };

  if (!selectedLighter) return null;

  return (
    <section id="engraving-tool" className="py-20 relative bg-[#0F0F0F] border-b border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation / Back Options */}
        {(onBackToCatalog || onBackToHome) && (
          <div className="flex items-center justify-between border-b border-[#222222] pb-6 mb-8">
            {onBackToCatalog ? (
              <button
                onClick={onBackToCatalog}
                id="engraving-back-to-catalog"
                className="text-[10px] font-mono uppercase tracking-widest text-[#FF4E00]/80 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Catalog
              </button>
            ) : <div />}
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                id="engraving-back-to-home"
                className="text-[10px] font-mono uppercase tracking-widest text-gray-500 hover:text-[#FF4E00] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                Back to Home
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
        
        <div className="text-center mb-16">
          <span className="text-[#FF4E00] text-xs font-mono uppercase tracking-[0.3em] block mb-2">Bespoke Personalization</span>
          <h2 className="text-3xl md:text-5xl font-sans font-black italic uppercase tracking-tighter text-white">
            Custom <span className="text-[#FF4E00]">Engraving</span> Atelier
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-4 text-sm md:text-base">
            Breathe permanent soul into your lighter casing. Select an eligible model below and design a signature typographic mark, carved in deep metal relief.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Controls & Configuration Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 bg-[#121212] border border-[#222222] p-8 rounded-none relative">
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#FF4E00]/40" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#FF4E00]/40" />

            <div className="space-y-6">
              {/* Lighter selector */}
              <div>
                <label className="text-xs font-mono text-gray-500 uppercase tracking-widest block mb-3">
                  1. Select Casing Model
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {customizableLighters.map((item) => {
                    const isSel = item.id === selectedLighter.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedLighter(item)}
                        id={`engraving-select-${item.id}`}
                        className={`text-left p-3 rounded-none border transition-all text-xs ${
                          isSel
                            ? 'bg-[#1A1A1A] border-[#FF4E00] text-white'
                            : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/10 hover:text-white'
                        }`}
                      >
                        <span className="block font-semibold truncate">{item.name}</span>
                        <span className="block text-[10px] text-[#FF4E00] mt-0.5">${item.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Text Input */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label htmlFor="engraving-input-field" className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                    2. Inscribe Text (Max 20 chars)
                  </label>
                  <span className="text-[10px] font-mono text-gray-600">{engravingText.length}/20</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="engraving-input-field"
                    value={engravingText}
                    onChange={handleTextChange}
                    placeholder="ENTER MONOGRAM..."
                    className="w-full bg-black/50 border border-white/10 rounded-none px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4E00] text-sm font-sans tracking-widest text-center"
                  />
                </div>
              </div>

              {/* Typography Presets */}
              <div>
                <label className="text-xs font-mono text-gray-500 uppercase tracking-widest block mb-3">
                  3. Select Typographic Mark
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FONTS_PRESET.map((fnt) => {
                    const isSel = fnt.id === selectedFont.id;
                    return (
                      <button
                        key={fnt.id}
                        onClick={() => setSelectedFont(fnt)}
                        id={`font-preset-${fnt.id}`}
                        className={`p-3 rounded-none border text-left transition-all ${
                          isSel
                            ? 'bg-[#1A1A1A] border-[#FF4E00] text-white'
                            : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/10'
                        }`}
                      >
                        <span className="text-[10px] font-mono text-gray-500 block mb-1">Preset</span>
                        <span className={`text-xs ${fnt.cssClass} text-white truncate block`}>
                          {fnt.name.split(' ')[0]} Mark
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Checkout Row */}
            <div className="border-t border-[#222222] pt-6 mt-6">
              <button
                disabled={!engravingText.trim()}
                onClick={handleAddToCart}
                id="add-customized-cart-btn"
                className={`w-full py-4 rounded-none text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 font-bold transition-all duration-300 ${
                  !engravingText.trim()
                    ? 'bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed'
                    : isAddedSuccessfully
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#FF4E00] text-black hover:bg-white hover:text-black shadow-[0_4px_20px_rgba(255,78,0,0.15)]'
                }`}
              >
                {isAddedSuccessfully ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Atelier Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" /> Commit Bespoke Order
                  </>
                )}
              </button>
              <span className="text-[10px] font-mono text-gray-500 text-center block mt-3">
                No additional cost for bespoke deep-groove engraving.
              </span>
            </div>

          </div>

          {/* Interactive Golden Rendering Preview Column */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-black border border-[#222222] rounded-none p-8 relative min-h-[450px] shadow-[inset_0_4px_30px_rgba(0,0,0,0.9)] overflow-hidden">
            {/* Soft Ambient fire-orange Spotlight */}
            <div className="absolute inset-0 bg-radial-gradient from-[#FF4E00]/10 via-transparent to-transparent pointer-events-none" />

            {/* Studio Plate details */}
            <div className="absolute top-4 left-6 right-6 flex items-center justify-between text-[10px] font-mono text-gray-600">
              <span>CASING PREVIEW</span>
              <span>COMPOSITION: {selectedLighter.material.toUpperCase()}</span>
            </div>

            {/* Lighter Engraving Render Canvas */}
            <div className="relative w-56 h-80 flex flex-col items-center justify-end scale-105">
              
              {/* Lighter Structure Drawing */}
              <div className="w-40 h-56 rounded-none relative overflow-hidden flex flex-col">
                
                {/* Lighter Cap Block */}
                <div className={`w-full h-16 border-b border-[#0F0F0F]/80 relative flex items-center justify-center ${
                  selectedLighter.id === 'gatsby-gold' 
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600' 
                    : selectedLighter.id === 'heritage-silver'
                    ? 'bg-gradient-to-r from-zinc-300 via-zinc-100 to-zinc-400'
                    : 'bg-gradient-to-r from-neutral-300 via-zinc-200 to-neutral-400'
                }`}>
                  {/* Subtle hinge line */}
                  <div className="absolute bottom-1 left-2 w-2 h-2 rounded-none bg-black/40" />
                  <div className="w-full h-full opacity-10 flex justify-between px-3">
                    <div className="w-[1px] bg-black h-full" />
                    <div className="w-[1px] bg-black h-full" />
                    <div className="w-[1px] bg-black h-full" />
                  </div>
                </div>

                {/* Lighter Body Block */}
                <div className={`w-full h-40 relative flex flex-col items-center justify-center ${
                  selectedLighter.id === 'gatsby-gold' 
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)]' 
                    : selectedLighter.id === 'heritage-silver'
                    ? 'bg-gradient-to-r from-zinc-300 via-zinc-100 to-zinc-400 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6)]'
                    : 'bg-gradient-to-r from-neutral-300 via-zinc-200 to-neutral-400 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5)]'
                }`}>
                  
                  {/* Embossed metal plate */}
                  <div className={`w-32 h-20 border flex items-center justify-center rounded-none p-1 text-center relative shadow-inner ${
                    selectedLighter.id === 'gatsby-gold'
                      ? 'border-amber-700/30 bg-amber-600/10'
                      : 'border-zinc-500/30 bg-zinc-400/15'
                  }`}>
                    {/* Live engraving text preview with active font styling */}
                    <AnimatePresence mode="wait">
                      {engravingText ? (
                        <motion.span
                          key={engravingText + selectedFont.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className={`text-base tracking-widest break-all select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)] ${selectedFont.cssClass} ${
                            selectedLighter.id === 'gatsby-gold'
                              ? 'text-amber-950 font-bold'
                              : 'text-zinc-900 font-bold'
                          }`}
                        >
                          {engravingText}
                        </motion.span>
                      ) : (
                        <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-black/35 select-none italic">
                          Preview Space
                        </span>
                      )}
                    </AnimatePresence>
                  </div>
 
                  {/* Highlights and metal sheens */}
                  <div className="absolute top-0 bottom-0 left-4 w-4 bg-white/20 blur-[2px] opacity-60 pointer-events-none" />
                  <div className="absolute top-0 bottom-0 right-10 w-2 bg-white/10 blur-[1px] opacity-40 pointer-events-none" />
                </div>

              </div>

              {/* Decorative base shadow */}
              <div className="w-44 h-4 bg-black/60 rounded-full blur-md -mt-2 pointer-events-none" />
            </div>

            {/* Instruction badge */}
            <div className="mt-8 text-center text-xs font-mono text-gray-500">
              FONT PREVIEW STYLE: <span className="text-[#FF4E00]">{selectedFont.name.toUpperCase()}</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
