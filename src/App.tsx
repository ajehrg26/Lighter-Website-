import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, Sparkles, ChevronDown, Check, ArrowRight, ShieldCheck, Mail, 
  Award, Zap, Package, ArrowUp, Search, Wrench, Settings, AlertCircle, 
  SlidersHorizontal, BookOpen, Undo2, MessageCircle 
} from 'lucide-react';

import { lightersData, reviewsData, faqsData } from './data';
import { Lighter, CartItem } from './types';

// Custom components
import Header from './components/Header';
import LighterFlicker from './components/LighterFlicker';
import LighterCard from './components/LighterCard';
import EngravingTool from './components/EngravingTool';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import { CatalogPage, SimulatorPage, CustomizerPage, SupportPage } from './components/SubPages';

export default function App() {
  // Cart & checkout states with dynamic local storage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ignis_boutique_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedLighterForSim, setSelectedLighterForSim] = useState<Lighter>(lightersData[0]);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Luxury' | 'Electric' | 'Windproof' | 'Vintage'>('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeView, setActiveView] = useState<'home' | 'catalog' | 'simulator' | 'engraving' | 'support'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecLighter, setSelectedSpecLighter] = useState<Lighter | null>(null);
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [diagnosticCategory, setDiagnosticCategory] = useState<'all' | 'petrol' | 'plasma' | 'jet'>('all');
  const [diagnosticIssue, setDiagnosticIssue] = useState<string | null>(null);
  const [serialQuery, setSerialQuery] = useState('');
  const [serialQueryResult, setSerialQueryResult] = useState<{ found: boolean; message: string } | null>(null);

  // Sync cart state with LocalStorage
  useEffect(() => {
    localStorage.setItem('ignis_boutique_cart', JSON.stringify(cart));
  }, [cart]);

  // Scroll monitoring for the floating Back to Home button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle addition to shopping cart
  const handleAddToCart = (lighter: Lighter, engravingText?: string, engravingFont?: string) => {
    setCart((prevCart) => {
      // Find matches with both the identical ID and IDENTICAL engraving content
      const existingIdx = prevCart.findIndex(
        (item) => item.lighter.id === lighter.id && item.engravingText === engravingText
      );

      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += 1;
        return updated;
      } else {
        return [...prevCart, { lighter, quantity: 1, engravingText, engravingFont }];
      }
    });

    // Automatically trigger cart drawer animation so client sees confirmation
    setIsCartOpen(true);
  };

  // Callback wrapper for the customization atelier
  const handleAddCustomizedToCart = (lighter: Lighter, text: string, font: string) => {
    handleAddToCart(lighter, text, font);
  };

  // Adjust quantity from within the cart drawer
  const handleUpdateQuantity = (productId: string, delta: number, engravingText?: string) => {
    setCart((prevCart) => {
      const idx = prevCart.findIndex(
        (item) => item.lighter.id === productId && item.engravingText === engravingText
      );
      if (idx === -1) return prevCart;

      const updated = [...prevCart];
      const newQty = updated[idx].quantity + delta;

      if (newQty <= 0) {
        updated.splice(idx, 1);
      } else {
        updated[idx].quantity = newQty;
      }
      return updated;
    });
  };

  // Remove an item entirely from the cart drawer
  const handleRemoveItem = (productId: string, engravingText?: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.lighter.id === productId && item.engravingText === engravingText))
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Interactive smooth scrolling helper targeting specific section wrappers or changing view
  const handleScrollToSection = (elementId: string) => {
    if (elementId === 'hero-section' || elementId === 'home') {
      setActiveView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (elementId === 'catalog-section' || elementId === 'catalog') {
      setActiveView('catalog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (elementId === 'flicker-simulator' || elementId === 'simulator') {
      setActiveView('simulator');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (elementId === 'engraving-tool' || elementId === 'engraving') {
      setActiveView('engraving');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (elementId === 'support-faq' || elementId === 'support') {
      setActiveView('support');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Filters the product catalog list based on selected category tab
  const filteredLighters = lightersData.filter((lighter) => {
    if (activeCategory === 'All') return true;
    return lighter.category === activeCategory;
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 2500);
    }
  };

  // Gather lighters eligible for personal engravings
  const customizableLighters = lightersData.filter((item) => item.isCustomizable);

  const totalCartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white font-sans antialiased selection:bg-[#FF4E00] selection:text-black">
      
      {/* 1. BRAND NAVIGATION HEADER */}
      <Header
        cartCount={totalCartItemsCount}
        onCartClick={() => setIsCartOpen(true)}
        onScrollTo={handleScrollToSection}
        activeView={activeView}
      />

      {/* VIEW ROUTING SYSTEM */}
      <AnimatePresence mode="wait">
        {activeView === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {/* 2. MAJESTIC ART DECO HERO SECTION */}
            <section 
              id="hero-section" 
              className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden"
            >
              {/* Abstract Gold Ray Background Pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none select-none flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="720" y1="400" x2="0" y2="0" stroke="#FF4E00" strokeWidth="1.5" />
                  <line x1="720" y1="400" x2="360" y2="0" stroke="#FF4E00" strokeWidth="1" />
                  <line x1="720" y1="400" x2="720" y2="0" stroke="#FF4E00" strokeWidth="2.5" />
                  <line x1="720" y1="400" x2="1080" y2="0" stroke="#FF4E00" strokeWidth="1" />
                  <line x1="720" y1="400" x2="1440" y2="0" stroke="#FF4E00" strokeWidth="1.5" />
                  <line x1="720" y1="400" x2="0" y2="800" stroke="#FF4E00" strokeWidth="1" />
                  <line x1="720" y1="400" x2="1440" y2="800" stroke="#FF4E00" strokeWidth="1" />
                  <circle cx="720" cy="400" r="150" fill="none" stroke="#FF4E00" strokeWidth="2" strokeDasharray="5 5" />
                  <circle cx="720" cy="400" r="280" fill="none" stroke="#FF4E00" strokeWidth="1" />
                </svg>
              </div>

              {/* Ambient Warm Golden Glow behind hero text */}
              <div className="absolute w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full bg-gradient-to-r from-amber-500/5 via-[#FF4E00]/5 to-transparent blur-3xl pointer-events-none" />

              <div className="max-w-4xl mx-auto space-y-6 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="flex items-center justify-center gap-2 text-xs font-mono tracking-[0.4em] uppercase text-[#FF4E00]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Est. 1926 • Hand-Finished Reserve</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.1 }}
                  className="text-4xl sm:text-6xl lg:text-7xl font-sans font-black italic uppercase tracking-tighter text-white leading-[1.1]"
                >
                  The Symphony of <br />
                  <span className="text-[#FF4E00]">Spark & Metal</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.2 }}
                  className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base md:text-lg font-light leading-relaxed pt-2"
                >
                  Welcome to the sanctuary of elite fire craft. We list and deliver masterfully balanced mechanical, electronic plasma, and heavy windproof pocket wands, custom-engraved in deep metal casing relief.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
                >
                  <button
                    onClick={() => handleScrollToSection('catalog')}
                    id="hero-explore-catalog-btn"
                    className="w-full sm:w-auto px-8 py-4 bg-[#FF4E00] text-black font-sans font-bold text-xs uppercase tracking-widest rounded-none hover:bg-white transition-all flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(255,78,0,0.25)] cursor-pointer"
                  >
                    Explore Reserve Catalog
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleScrollToSection('simulator')}
                    id="hero-flick-sim-btn"
                    className="w-full sm:w-auto px-8 py-4 bg-[#121212]/90 border border-white/5 hover:border-[#FF4E00]/35 text-gray-300 hover:text-white rounded-none transition-all text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Flick Simulator
                    <Flame className="w-4 h-4 text-[#FF4E00]" />
                  </button>
                </motion.div>
              </div>

              {/* Floating Downwards Indicator */}
              <div 
                onClick={() => handleScrollToSection('catalog')}
                className="absolute bottom-8 cursor-pointer flex flex-col items-center gap-1.5 animate-bounce group"
                id="scroll-helper"
              >
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 group-hover:text-white transition-colors">
                  Scroll to Reserve
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-[#FF4E00]" />
              </div>
            </section>

            {/* 3. RESERVE PRODUCT CATALOG PREVIEW */}
            <section id="catalog-section" className="py-20 bg-[#0F0F0F] border-t border-[#222222]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                  <div>
                    <span className="text-[#FF4E00] text-xs font-mono uppercase tracking-[0.3em] block mb-2">Curated Inventory</span>
                    <h2 className="text-3xl md:text-5xl font-sans font-black italic uppercase tracking-tighter text-white">
                      Reserve <span className="text-[#FF4E00]">Collection</span>
                    </h2>
                    <p className="text-gray-400 max-w-lg mt-2 text-xs sm:text-sm">
                      Each casing model is selected for outstanding weighted hand balance, custom material longevity, and mechanical ignition precision.
                    </p>
                  </div>

                  {/* Filter Tabs Row */}
                  <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#121212] border border-[#222222] rounded-none self-start">
                    {(['All', 'Luxury', 'Electric', 'Windproof', 'Vintage'] as const).map((tab) => {
                      const isActive = activeCategory === tab;
                      return (
                        <button
                          key={tab}
                          onClick={() => setActiveCategory(tab)}
                          id={`catalog-filter-${tab}`}
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
                </div>

                {/* Lighter Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredLighters.slice(0, 3).map((item) => (
                    <LighterCard
                      key={item.id}
                      lighter={item}
                      onAddToCart={(lighter) => handleAddToCart(lighter)}
                      onCustomizeClick={(lighter) => {
                        setSelectedLighterForSim(lighter);
                        setActiveView('engraving');
                      }}
                      onSelectForSimulator={(lighter) => {
                        setSelectedLighterForSim(lighter);
                        setActiveView('simulator');
                      }}
                    />
                  ))}
                </div>
                
                <div className="text-center pt-10">
                  <button
                    onClick={() => setActiveView('catalog')}
                    className="px-6 py-3 border border-[#FF4E00]/30 hover:border-[#FF4E00] text-[#FF4E00] hover:text-white font-mono text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                  >
                    View Entire Reserve Catalog ({filteredLighters.length} Models)
                  </button>
                </div>
              </div>
            </section>

            {/* 6. TRUST & BRAND VALUES SECTION */}
            <section className="py-20 bg-[#0F0F0F] relative overflow-hidden border-t border-[#222222]">
              <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
                <div className="w-[1000px] h-[1000px] border border-[#FF4E00] rounded-none rotate-45" />
              </div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="space-y-4 text-center md:text-left">
                    <div className="w-12 h-12 rounded-none border border-[#FF4E00]/30 bg-[#121212] flex items-center justify-center text-[#FF4E00] mx-auto md:mx-0 shadow-lg">
                      <Award className="w-5 h-5" />
                    </div>
                    <h3 className="font-sans font-black uppercase tracking-wider text-xs text-white">Lifetime Warranty</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      We craft our casings to survive generations. Our mechanical components, flint springs, and hinges carry an unconditional lifetime mechanical warranty.
                    </p>
                  </div>

                  <div className="space-y-4 text-center md:text-left border-y md:border-y-0 md:border-x border-[#222222] py-8 md:py-0 md:px-8">
                    <div className="w-12 h-12 rounded-none border border-[#FF4E00]/30 bg-[#121212] flex items-center justify-center text-[#FF4E00] mx-auto md:mx-0 shadow-lg">
                      <Package className="w-5 h-5" />
                    </div>
                    <h3 className="font-sans font-black uppercase tracking-wider text-xs text-white">Gift-Box Sealed Delivery</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Every reserve specimen is hand-polished, nested in protective black foam blocks, and encased inside an elegant raw-metal presentation drawer.
                    </p>
                  </div>

                  <div className="space-y-4 text-center md:text-left">
                    <div className="w-12 h-12 rounded-none border border-[#FF4E00]/30 bg-[#121212] flex items-center justify-center text-[#FF4E00] mx-auto md:mx-0 shadow-lg">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h3 className="font-sans font-black uppercase tracking-wider text-xs text-white">Secure Global Carriage</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      We utilize fully insured priority cargo wands. All orders are wrapped in heavy protective seals, packaged completely, and dispatched with high clearance.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. CUSTOMER TESTIMONIALS BENTO GRID */}
            <section id="reviews-testimonials" className="py-20 bg-[#0F0F0F] border-t border-[#222222]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <span className="text-[#FF4E00] text-xs font-mono uppercase tracking-[0.3em] block mb-2">Verified Ledger Logs</span>
                  <h2 className="text-3xl md:text-5xl font-sans font-black italic uppercase tracking-tighter text-white">
                    Collector <span className="text-[#FF4E00]">Acclamations</span>
                  </h2>
                  <p className="text-gray-400 max-w-2xl mx-auto mt-4 text-xs sm:text-sm">
                    Read authentic feedback compiled directly from our secure order registers, celebrating exceptional finishes and heft.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {reviewsData.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-6 rounded-none bg-black/45 border border-[#222222] relative overflow-hidden flex flex-col justify-between"
                    >
                      <div className="absolute top-4 right-4 text-xs font-mono text-[#FF4E00]/30">★ ★ ★ ★ ★</div>
                      <div className="space-y-4">
                        <p className="text-gray-300 text-xs leading-relaxed italic">
                          "{rev.comment}"
                        </p>
                      </div>
                      <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6">
                        <div>
                          <h4 className="font-sans text-xs font-semibold text-white tracking-wide">{rev.name}</h4>
                          <span className="text-[10px] font-mono text-gray-500 block mt-0.5">{rev.date}</span>
                        </div>
                        {rev.verified && (
                          <span className="text-[9px] font-mono uppercase tracking-wider text-[#FF4E00] bg-[#FF4E00]/10 border border-[#FF4E00]/20 px-2 py-0.5 rounded-none">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {/* 3. DEDICATED VAULT CATALOG VIEW */}
        {activeView === 'catalog' && (
          <CatalogPage
            filteredLighters={filteredLighters}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAddToCart={handleAddToCart}
            onCustomizeClick={(lighter) => {
              setSelectedLighterForSim(lighter);
              setActiveView('engraving');
            }}
            onSelectForSimulator={(lighter) => {
              setSelectedLighterForSim(lighter);
              setActiveView('simulator');
            }}
            setSelectedSpecLighter={setSelectedSpecLighter}
            setActiveView={setActiveView}
          />
        )}

        {/* 4. DEDICATED FLICK IGNITION SIMULATOR */}
        {activeView === 'simulator' && (
          <SimulatorPage
            selectedLighterForSim={selectedLighterForSim}
            setSelectedLighterForSim={setSelectedLighterForSim}
            lightersData={lightersData}
            onBackToCatalog={() => setActiveView('catalog')}
            onBackToHome={() => setActiveView('home')}
          />
        )}

        {/* 5. DEDICATED INTERACTIVE ENGRAVING ATELIER */}
        {activeView === 'engraving' && (
          <CustomizerPage
            customizableLighters={customizableLighters}
            handleAddCustomizedToCart={handleAddCustomizedToCart}
            onBackToCatalog={() => setActiveView('catalog')}
            onBackToHome={() => setActiveView('home')}
          />
        )}

        {/* 8. DEDICATED CONCIERGE & MAINTENANCE HELP DESK */}
        {activeView === 'support' && (
          <SupportPage
            faqsData={faqsData}
            faqSearchQuery={faqSearchQuery}
            setFaqSearchQuery={setFaqSearchQuery}
            diagnosticCategory={diagnosticCategory}
            setDiagnosticCategory={setDiagnosticCategory}
            diagnosticIssue={diagnosticIssue}
            setDiagnosticIssue={setDiagnosticIssue}
            serialQuery={serialQuery}
            setSerialQuery={setSerialQuery}
            serialQueryResult={serialQueryResult}
            setSerialQueryResult={setSerialQueryResult}
            setActiveView={setActiveView}
          />
        )}
      </AnimatePresence>

      {/* 9. VIP NEWSLETTER FOOTER */}
      <section className="py-20 bg-[#0F0F0F] border-t border-[#FF4E00]/15 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[1px] bg-[linear-gradient(90deg,#0c0d0e_0%,#FF4E00_50%,#0c0d0e_100%)] opacity-30" />

        <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
          <div className="space-y-3">
            <span className="text-[#FF4E00] text-xs font-mono uppercase tracking-[0.3em] block">Exclusive Communications</span>
            <h2 className="text-2xl md:text-3xl font-sans font-black italic uppercase tracking-tighter text-white">
              The Ignis <span className="text-[#FF4E00]">Journal</span>
            </h2>
            <p className="text-gray-400 max-w-sm mx-auto text-xs sm:text-sm leading-relaxed">
              Register below to receive early notifications on limited editions, custom materials, and private vintage releases.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex items-center gap-2 p-1.5 bg-black/50 border border-[#222222] rounded-none">
            <label htmlFor="newsletter-email-input" className="sr-only">Enter Email Address</label>
            <input
              type="email"
              id="newsletter-email-input"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="ENTER EMAIL COORDINATES..."
              className="flex-grow bg-transparent text-xs text-white placeholder-gray-600 focus:outline-none px-4 tracking-wider"
              disabled={newsletterSubscribed}
            />
            <button
              type="submit"
              id="newsletter-submit-btn"
              className={`px-5 py-3 rounded-none text-[10px] font-mono uppercase tracking-widest transition-all ${
                newsletterSubscribed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#FF4E00] text-black hover:bg-white font-bold'
              }`}
              disabled={newsletterSubscribed}
            >
              {newsletterSubscribed ? <Check className="w-3.5 h-3.5 mx-auto" /> : 'Register'}
            </button>
          </form>

          {newsletterSubscribed && (
            <span className="text-xs text-emerald-400 block animate-pulse">
              VIP Credentials verified. Welcome to the Inner Journal.
            </span>
          )}

          <div className="pt-12 border-t border-white/5 text-[10px] font-mono text-gray-500 uppercase flex flex-col sm:flex-row items-center justify-between gap-4">
            <span>© 2026 Ignis Boutique. All Rights Secured.</span>
            <div className="flex gap-6">
              <span className="hover:text-white transition-colors cursor-pointer">TERMS OF CARRIAGE</span>
              <span className="hover:text-white transition-colors cursor-pointer">PRIVACY SYSTEM</span>
              <span className="hover:text-white transition-colors cursor-pointer">VIP ACCESS</span>
            </div>
          </div>
        </div>
      </section>

      {/* 10. PERSISTENT SHOPPING CART SIDEBAR DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckoutClick={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 11. PERSISTENT CHECKOUT FLOW MODAL */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onClearCart={handleClearCart}
      />

      {/* 13. SPEC DETAILS MODAL OVERLAY */}
      <AnimatePresence>
        {selectedSpecLighter && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSpecLighter(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#121212] border border-[#FF4E00]/30 max-w-2xl w-full relative z-10 overflow-hidden shadow-[0_10px_50px_rgba(255,78,0,0.15)]"
            >
              <div className="h-1 bg-gradient-to-r from-amber-500 via-[#FF4E00] to-amber-500" />
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[#FF4E00] text-[9px] font-mono uppercase tracking-[0.3em] block mb-1">Casing Reference: {selectedSpecLighter.id.toUpperCase()}</span>
                    <h3 className="text-2xl font-sans font-black italic uppercase tracking-tighter text-white">{selectedSpecLighter.name}</h3>
                    <p className="text-gray-400 text-xs italic mt-0.5">{selectedSpecLighter.tagline}</p>
                  </div>
                  <button
                    onClick={() => setSelectedSpecLighter(null)}
                    className="p-1 rounded-none border border-white/5 text-gray-500 hover:text-white hover:border-[#FF4E00]/40 transition-all text-xs font-mono cursor-pointer"
                  >
                    CLOSE [X]
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="relative aspect-square overflow-hidden border border-white/5 bg-[#0A0A0A]">
                      <img
                        src={selectedSpecLighter.imageUrl}
                        alt={selectedSpecLighter.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover grayscale opacity-90"
                      />
                      <div className="absolute inset-2 border border-white/[0.03] pointer-events-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-[#151515] p-2 border border-white/5">
                        <span className="text-[8px] font-mono text-gray-500 block uppercase tracking-wider">Weight</span>
                        <span className="text-xs font-mono font-bold text-white">{selectedSpecLighter.weight}</span>
                      </div>
                      <div className="bg-[#151515] p-2 border border-white/5">
                        <span className="text-[8px] font-mono text-gray-500 block uppercase tracking-wider">Dimensions</span>
                        <span className="text-[10px] font-mono font-bold text-white">{selectedSpecLighter.dimensions}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 text-xs font-mono">
                    <div className="border-b border-white/5 pb-2">
                      <span className="text-[9px] text-[#FF4E00] block uppercase tracking-wider mb-1">Engineering Spec Sheet</span>
                      <div className="space-y-1.5 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Chassis Material:</span>
                          <span className="text-white text-right font-bold">{selectedSpecLighter.material}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Fuel Infrastructure:</span>
                          <span className="text-white font-bold">{selectedSpecLighter.fuelType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Category Grade:</span>
                          <span className="text-[#FF4E00] font-bold">{selectedSpecLighter.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Engraving Status:</span>
                          <span className={selectedSpecLighter.isCustomizable ? "text-emerald-400 font-bold" : "text-gray-500"}>
                            {selectedSpecLighter.isCustomizable ? "Custom Eligible" : "Standard Relief"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Current Stock Level:</span>
                          <span className="text-amber-400 font-bold">{selectedSpecLighter.stock} units left</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#FF4E00] block uppercase tracking-wider mb-1.5">Design Assembly & History</span>
                      <p className="text-gray-400 leading-relaxed text-[11px] font-sans">
                        {selectedSpecLighter.description}
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#FF4E00] block uppercase tracking-wider mb-1">Key Features</span>
                      <ul className="space-y-1 text-[10px]">
                        {selectedSpecLighter.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#FF4E00]">•</span>
                            <span className="text-gray-300">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-[#181818] p-4 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <span className="text-[8px] font-mono text-gray-500 uppercase block tracking-wider">Acquisition Pricing</span>
                    <span className="text-2xl font-sans font-black italic text-[#FF4E00]">${selectedSpecLighter.price} USD</span>
                  </div>
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        handleAddToCart(selectedSpecLighter);
                        setSelectedSpecLighter(null);
                      }}
                      className="flex-grow px-4 py-3 bg-[#FF4E00] text-black font-sans font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-all cursor-pointer text-center"
                    >
                      Acquire Specimen
                    </button>
                    {selectedSpecLighter.isCustomizable && (
                      <button
                        onClick={() => {
                          setSelectedLighterForSim(selectedSpecLighter);
                          setActiveView('engraving');
                          setSelectedSpecLighter(null);
                        }}
                        className="px-4 py-3 bg-transparent border border-white/10 hover:border-[#FF4E00] text-gray-300 hover:text-white font-sans text-[10px] uppercase tracking-widest transition-all cursor-pointer text-center"
                      >
                        Engrave Casing
                      </button>
                    )}
                    <a
                      href={`https://wa.me/918609831662?text=${encodeURIComponent(`Hello Ignis Boutique, I am writing to inquire about the specimen "${selectedSpecLighter.name}" (Ref: ${selectedSpecLighter.id}).`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 bg-transparent border border-emerald-500/40 hover:border-emerald-500 text-emerald-400 hover:text-white font-sans text-[10px] uppercase tracking-widest transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Inquire
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 12. FLOATING BACK TO HOME ACTION BUTTON */}
      <AnimatePresence>
        {(showScrollTop || activeView !== 'home') && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => handleScrollToSection('hero-section')}
            id="floating-back-to-home"
            className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-[#121212] border border-[#FF4E00] text-[#FF4E00] hover:bg-[#FF4E00] hover:text-black transition-all duration-300 font-mono text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-[0_4px_20px_rgba(255,78,0,0.25)] cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 14. FLOATING WHATSAPP INQUIRY ACTION BUTTON */}
      <div className="fixed bottom-6 left-6 z-40">
        <a
          href="https://wa.me/918609831662?text=Hello%20Ignis%20Boutique%2C%20I%20have%20an%20inquiry%20about%20your%20lighters."
          target="_blank"
          rel="noopener noreferrer"
          id="floating-whatsapp-inquiry"
          className="px-4 py-3 bg-[#121212]/95 border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all duration-300 font-mono text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-[0_4px_20px_rgba(16,185,129,0.25)] cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-emerald-500" />
          <span>WhatsApp Inquiry</span>
        </a>
      </div>

    </div>
  );
}
