import React, { useState } from 'react';
import { ShoppingBag, Flame, Sparkles, Sliders, FileQuestion, Menu, X, MessageCircle } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onScrollTo: (elementId: string) => void;
  activeView?: 'home' | 'catalog' | 'simulator' | 'engraving' | 'support';
}

export default function Header({ cartCount, onCartClick, onScrollTo, activeView = 'home' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    onScrollTo(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0F0F0F]/95 backdrop-blur-md border-b border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand Frame */}
          <div 
            onClick={() => handleNavClick('hero-section')} 
            className="flex items-center gap-2.5 cursor-pointer group"
            id="brand-logo"
          >
            {/* Geometric Art Deco Icon */}
            <div className="relative w-10 h-10 border border-[#FF4E00] flex items-center justify-center rounded-none bg-black/60 shadow-[0_0_15px_rgba(255,78,0,0.15)] group-hover:shadow-[0_0_20px_rgba(255,78,0,0.3)] transition-all duration-300">
              <Flame className="w-5 h-5 text-[#FF4E00] animate-pulse" />
              {/* Outer decorative square */}
              <div className="absolute inset-[2px] border border-[#FF4E00]/30 pointer-events-none" />
            </div>
            
            <div className="flex flex-col">
              <span className="font-sans font-black text-lg tracking-tighter uppercase italic text-white leading-none">
                IGNIS <span className="text-[#FF4E00]">&bull; STEEL</span>
              </span>
              <span className="text-[8px] font-mono tracking-[0.3em] text-[#FF4E00]/70 uppercase mt-1 leading-none">
                SERIES 01 &bull; EST. 1926
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-sans uppercase tracking-[0.2em] font-medium text-gray-400">
            <button 
              onClick={() => onScrollTo('hero-section')}
              id="nav-home" 
              className={`hover:text-[#FF4E00] transition-all duration-300 cursor-pointer flex items-center gap-1.5 pb-1 ${
                activeView === 'home' ? 'text-[#FF4E00] font-bold border-b-2 border-[#FF4E00]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF4E00]/60" />
              Home
            </button>
            <button 
              onClick={() => onScrollTo('catalog-section')}
              id="nav-catalog" 
              className={`hover:text-[#FF4E00] transition-all duration-300 cursor-pointer flex items-center gap-1.5 pb-1 ${
                activeView === 'catalog' ? 'text-[#FF4E00] font-bold border-b-2 border-[#FF4E00]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#FF4E00]/60" />
              Catalog
            </button>
            <button 
              onClick={() => onScrollTo('flicker-simulator')}
              id="nav-simulator" 
              className={`hover:text-[#FF4E00] transition-all duration-300 cursor-pointer flex items-center gap-1.5 pb-1 ${
                activeView === 'simulator' ? 'text-[#FF4E00] font-bold border-b-2 border-[#FF4E00]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#FF4E00]/60" />
              Simulator
            </button>
            <button 
              onClick={() => onScrollTo('engraving-tool')}
              id="nav-customizer" 
              className={`hover:text-[#FF4E00] transition-all duration-300 cursor-pointer flex items-center gap-1.5 pb-1 ${
                activeView === 'engraving' ? 'text-[#FF4E00] font-bold border-b-2 border-[#FF4E00]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-[#FF4E00]/60" />
              Customize
            </button>
            <button 
              onClick={() => onScrollTo('support-faq')}
              id="nav-support" 
              className={`hover:text-[#FF4E00] transition-all duration-300 cursor-pointer flex items-center gap-1.5 pb-1 ${
                activeView === 'support' ? 'text-[#FF4E00] font-bold border-b-2 border-[#FF4E00]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileQuestion className="w-3.5 h-3.5 text-[#FF4E00]/60" />
              Support
            </button>
            <a 
              href="https://wa.me/918609831662?text=Hello%20Ignis%20Boutique%2C%20I%20have%20an%20inquiry%20about%20your%20lighters."
              target="_blank"
              rel="noopener noreferrer"
              id="nav-inquiry" 
              className="hover:text-[#FF4E00] transition-all duration-300 cursor-pointer flex items-center gap-1.5 pb-1 text-gray-400 hover:text-white"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-500/80" />
              Inquiry
            </a>
          </nav>

          {/* Cart Icon & Mobile Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onCartClick}
              id="header-cart-btn"
              className="relative p-2.5 rounded-none border border-[#FF4E00]/15 hover:border-[#FF4E00] hover:bg-white/[0.02] transition-all group flex items-center justify-center cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              
              {cartCount > 0 && (
                <div className="absolute -top-1.5 -right-1.5 bg-[#FF4E00] text-black font-sans font-bold text-[10px] w-5 h-5 rounded-none flex items-center justify-center shadow-lg border border-black animate-bounce">
                  {cartCount}
                </div>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              id="header-mobile-menu-btn"
              className="md:hidden relative p-2.5 rounded-none border border-white/5 hover:border-[#FF4E00] hover:bg-white/[0.02] transition-all flex items-center justify-center text-gray-300 hover:text-[#FF4E00] cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Micro Art Deco Accent Bar */}
            <div className="h-8 w-[1px] bg-[#222] hidden md:block" />
            <div className="text-[9px] font-mono text-gray-500 hidden lg:block uppercase tracking-wider">
              Free Express Shipping
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 border-b border-[#222222] px-4 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => handleNavClick('hero-section')}
              id="mobile-nav-home" 
              className={`w-full text-left py-2.5 px-4 text-xs font-mono uppercase tracking-widest transition-all flex items-center gap-3 cursor-pointer ${
                activeView === 'home'
                  ? 'bg-[#FF4E00]/10 border border-[#FF4E00] text-[#FF4E00] font-bold'
                  : 'bg-[#121212] border border-white/5 hover:border-[#FF4E00]/40 text-gray-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#FF4E00]" />
              Home
            </button>
            <button 
              onClick={() => handleNavClick('catalog-section')}
              id="mobile-nav-catalog" 
              className={`w-full text-left py-2.5 px-4 text-xs font-mono uppercase tracking-widest transition-all flex items-center gap-3 cursor-pointer ${
                activeView === 'catalog'
                  ? 'bg-[#FF4E00]/10 border border-[#FF4E00] text-[#FF4E00] font-bold'
                  : 'bg-[#121212] border border-white/5 hover:border-[#FF4E00]/40 text-gray-300 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-[#FF4E00]" />
              Catalog Collection
            </button>
            <button 
              onClick={() => handleNavClick('flicker-simulator')}
              id="mobile-nav-simulator" 
              className={`w-full text-left py-2.5 px-4 text-xs font-mono uppercase tracking-widest transition-all flex items-center gap-3 cursor-pointer ${
                activeView === 'simulator'
                  ? 'bg-[#FF4E00]/10 border border-[#FF4E00] text-[#FF4E00] font-bold'
                  : 'bg-[#121212] border border-white/5 hover:border-[#FF4E00]/40 text-gray-300 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4 text-[#FF4E00]" />
              Flick Simulator
            </button>
            <button 
              onClick={() => handleNavClick('engraving-tool')}
              id="mobile-nav-customizer" 
              className={`w-full text-left py-2.5 px-4 text-xs font-mono uppercase tracking-widest transition-all flex items-center gap-3 cursor-pointer ${
                activeView === 'engraving'
                  ? 'bg-[#FF4E00]/10 border border-[#FF4E00] text-[#FF4E00] font-bold'
                  : 'bg-[#121212] border border-white/5 hover:border-[#FF4E00]/40 text-gray-300 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4 text-[#FF4E00]" />
              Bespoke Engraving
            </button>
            <button 
              onClick={() => handleNavClick('support-faq')}
              id="mobile-nav-support" 
              className={`w-full text-left py-2.5 px-4 text-xs font-mono uppercase tracking-widest transition-all flex items-center gap-3 cursor-pointer ${
                activeView === 'support'
                  ? 'bg-[#FF4E00]/10 border border-[#FF4E00] text-[#FF4E00] font-bold'
                  : 'bg-[#121212] border border-white/5 hover:border-[#FF4E00]/40 text-gray-300 hover:text-white'
              }`}
            >
              <FileQuestion className="w-4 h-4 text-[#FF4E00]" />
              Atelier Support
            </button>
            <a 
              href="https://wa.me/918609831662?text=Hello%20Ignis%20Boutique%2C%20I%20have%20an%20inquiry%20about%20your%20lighters."
              target="_blank"
              rel="noopener noreferrer"
              id="mobile-nav-inquiry" 
              className="w-full text-left py-2.5 px-4 text-xs font-mono uppercase tracking-widest transition-all flex items-center gap-3 cursor-pointer bg-[#121212] border border-white/5 hover:border-[#FF4E00]/40 text-gray-300 hover:text-white"
            >
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              WhatsApp Inquiry
            </a>
          </div>
          <div className="pt-4 border-t border-[#222222] text-center">
            <span className="text-[8px] font-mono uppercase tracking-widest text-gray-500">
              Free Premium Express Carriage
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
