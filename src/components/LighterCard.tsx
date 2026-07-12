import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Sliders, ShoppingCart, Info, Flame } from 'lucide-react';
import { Lighter } from '../types';

interface LighterCardProps {
  key?: string;
  lighter: Lighter;
  onAddToCart: (lighter: Lighter) => void;
  onCustomizeClick: (lighter: Lighter) => void;
  onSelectForSimulator: (lighter: Lighter) => void;
}

export default function LighterCard({
  lighter,
  onAddToCart,
  onCustomizeClick,
  onSelectForSimulator,
}: LighterCardProps) {
  const isLowStock = lighter.stock <= 5;

  return (
    <motion.div
      id={`lighter-card-${lighter.id}`}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-[#121212] border border-[#222222] hover:border-[#FF4E00]/65 rounded-none overflow-hidden flex flex-col justify-between transition-all duration-300 relative group shadow-[0_4px_25px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_30px_rgba(255,78,0,0.08)]"
    >
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/10 group-hover:border-[#FF4E00]/40 pointer-events-none transition-colors" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/10 group-hover:border-[#FF4E00]/40 pointer-events-none transition-colors" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/10 group-hover:border-[#FF4E00]/40 pointer-events-none transition-colors" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/10 group-hover:border-[#FF4E00]/40 pointer-events-none transition-colors" />

      {/* Image Block */}
      <div className="relative h-64 overflow-hidden bg-black/40">
        <img
          src={lighter.imageUrl}
          alt={lighter.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-95"
        />

        {/* Categories / Badges Panel */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider bg-black/90 text-[#FF4E00] rounded-none border border-[#FF4E00]/30">
            {lighter.category}
          </span>

          {isLowStock ? (
            <span className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider bg-red-950/95 text-red-400 rounded-none border border-red-500/20">
              Only {lighter.stock} left
            </span>
          ) : (
            <span className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider bg-zinc-950/95 text-zinc-400 rounded-none border border-white/10">
              In Stock
            </span>
          )}
        </div>

        {/* Clickable Quick Action: Send to Simulator overlay */}
        <div className="absolute inset-0 bg-[#0F0F0F]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
          <span className="text-[#FF4E00] text-xs font-mono uppercase tracking-widest mb-1.5 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 animate-pulse" /> Ignition Mode
          </span>
          <p className="text-gray-300 text-[11px] text-center max-w-[200px] mb-4">
            Test the {lighter.fuelType} spark in our interactive 3D simulation deck.
          </p>
          <button
            onClick={() => onSelectForSimulator(lighter)}
            id={`simulate-btn-${lighter.id}`}
            className="px-4 py-1.5 border border-[#FF4E00] text-[#FF4E00] bg-transparent hover:bg-[#FF4E00] hover:text-black transition-colors rounded-none text-[11px] font-mono uppercase tracking-widest"
          >
            Launch in Simulator
          </button>
        </div>
      </div>

      {/* Text Details Block */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">
                {lighter.fuelType} • {lighter.material}
              </span>
              <h3 className="font-sans font-black text-lg tracking-tight uppercase text-white">
                {lighter.name}
              </h3>
            </div>
            <span className="text-[#FF4E00] font-mono font-bold text-lg">
              ${lighter.price}
            </span>
          </div>

          <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">
            {lighter.description}
          </p>

          {/* Bulleted Specifications */}
          <ul className="space-y-1.5 mb-6">
            {lighter.features.slice(0, 3).map((feat, index) => (
              <li key={index} className="flex items-center gap-2 text-[11px] text-gray-400">
                <div className="w-1.5 h-1.5 bg-[#FF4E00]/60" />
                <span className="line-clamp-1">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Buttons Action Group */}
        <div className="grid grid-cols-12 gap-2 border-t border-[#222222] pt-4">
          {lighter.isCustomizable ? (
            <>
              <button
                onClick={() => onCustomizeClick(lighter)}
                id={`customize-action-${lighter.id}`}
                className="col-span-6 px-3 py-2 border border-white/10 text-white hover:border-[#FF4E00] hover:text-[#FF4E00] rounded-none transition-all text-[11px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                Customize
              </button>

              <button
                onClick={() => onAddToCart(lighter)}
                id={`add-cart-action-${lighter.id}`}
                className="col-span-6 px-3 py-2 bg-[#FF4E00] text-black hover:bg-white rounded-none transition-all text-[11px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 font-bold cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Add Cart
              </button>
            </>
          ) : (
            <button
              onClick={() => onAddToCart(lighter)}
              id={`add-cart-action-only-${lighter.id}`}
              className="col-span-12 px-4 py-2 bg-[#FF4E00] text-black hover:bg-white rounded-none transition-all text-[11px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 font-bold cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
