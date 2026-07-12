import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, ShieldCheck, Mail, User, MapPin, CheckCircle2, ArrowRight, Package, Truck, Compass } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onClearCart: () => void;
}

type CheckoutStep = 'FORM' | 'PROCESSING' | 'SUCCESS';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onClearCart,
}: CheckoutModalProps) {
  const [step, setStep] = useState<CheckoutStep>('FORM');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [email, setEmail] = useState('');
  const [shippingName, setShippingName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');

  const [isFlipped, setIsFlipped] = useState(false); // Flip credit card layout when CVV focused

  const subtotal = cartItems.reduce((total, item) => total + item.lighter.price * item.quantity, 0);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formatted = '';
    for (let i = 0; i < value.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += value[i];
    }
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formatted = '';
    if (value.length > 0) {
      formatted += value.slice(0, 2);
      if (value.length > 2) {
        formatted += '/' + value.slice(2, 4);
      }
    }
    setCardExpiry(formatted);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (value.length <= 4) {
      setCardCvv(value);
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !shippingName || !shippingAddress || !shippingCity || !cardNumber || !cardName) return;

    setStep('PROCESSING');
    
    // Simulate real authorization and ledger writing
    setTimeout(() => {
      setStep('SUCCESS');
      onClearCart();
    }, 2800);
  };

  const handleFinish = () => {
    setStep('FORM');
    setCardName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setEmail('');
    setShippingName('');
    setShippingAddress('');
    setShippingCity('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            id="checkout-backdrop-overlay"
            className="fixed inset-0 z-50 bg-[#070809] backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              id="checkout-modal-panel"
              className="w-full max-w-4xl bg-[#0F0F0F] border border-[#222222] rounded-none overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] text-white"
            >
              
              {/* Form & Card Visualizer Layout */}
              {step === 'FORM' && (
                <form onSubmit={handlePaymentSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  
                  {/* Left Column: Input Forms */}
                  <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-[#FF4E00]" />
                        <h3 className="font-sans font-black italic uppercase tracking-tighter text-sm text-white">Carriage Authorization</h3>
                      </div>
                      <button
                        type="button"
                        onClick={onClose}
                        id="close-checkout-modal-btn"
                        className="p-1.5 rounded-none border border-white/5 hover:border-[#FF4E00] text-gray-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Section 1: Customer Details */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block border-b border-[#222222] pb-1">
                        1. Shipping Coordinates
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative">
                          <label htmlFor="checkout-email" className="sr-only">Email Address</label>
                          <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                          <input
                            type="email"
                            id="checkout-email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                            className="w-full bg-black/45 border border-white/10 rounded-none pl-10 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4E00]"
                          />
                        </div>

                        <div className="relative">
                          <label htmlFor="checkout-shipping-name" className="sr-only">Full Name</label>
                          <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            id="checkout-shipping-name"
                            required
                            value={shippingName}
                            onChange={(e) => setShippingName(e.target.value)}
                            placeholder="Full Name"
                            className="w-full bg-black/45 border border-white/10 rounded-none pl-10 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4E00]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="relative sm:col-span-2">
                          <label htmlFor="checkout-address" className="sr-only">Street Address</label>
                          <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            id="checkout-address"
                            required
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            placeholder="Street Address"
                            className="w-full bg-black/45 border border-white/10 rounded-none pl-10 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4E00]"
                          />
                        </div>

                        <div className="relative">
                          <label htmlFor="checkout-city" className="sr-only">City/State</label>
                          <input
                            type="text"
                            id="checkout-city"
                            required
                            value={shippingCity}
                            onChange={(e) => setShippingCity(e.target.value)}
                            placeholder="City, State"
                            className="w-full bg-black/45 border border-white/10 rounded-none px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4E00]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Card Credentials */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block border-b border-[#222222] pb-1">
                        2. Vault Credentials
                      </h4>

                      <div className="relative">
                        <CreditCard className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                        <label htmlFor="checkout-card-name" className="sr-only">Cardholder Name</label>
                        <input
                          type="text"
                          id="checkout-card-name"
                          required
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value.toUpperCase())}
                          placeholder="CARDHOLDER NAME"
                          className="w-full bg-black/45 border border-white/10 rounded-none pl-10 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4E00] tracking-widest"
                        />
                      </div>

                      <div className="relative">
                        <label htmlFor="checkout-card-number" className="sr-only">Card Number</label>
                        <input
                          type="text"
                          id="checkout-card-number"
                          required
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="CARD NUMBER (16 DIGITS)"
                          className="w-full bg-black/45 border border-white/10 rounded-none px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4E00] tracking-widest text-center"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <label htmlFor="checkout-expiry" className="sr-only">Expiration Date</label>
                          <input
                            type="text"
                            id="checkout-expiry"
                            required
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            placeholder="EXP MM/YY"
                            className="w-full bg-black/45 border border-white/10 rounded-none px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4E00] tracking-wider text-center"
                          />
                        </div>

                        <div className="relative">
                          <label htmlFor="checkout-cvv" className="sr-only">Security Code</label>
                          <input
                            type="text"
                            id="checkout-cvv"
                            required
                            value={cardCvv}
                            onFocus={() => setIsFlipped(true)}
                            onBlur={() => setIsFlipped(false)}
                            onChange={handleCvvChange}
                            placeholder="CVV (3-4 DIGITS)"
                            className="w-full bg-black/45 border border-white/10 rounded-none px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4E00] tracking-widest text-center"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      id="submit-payment-btn"
                      className="w-full py-4 bg-[#FF4E00] text-black font-sans font-bold text-xs uppercase tracking-[0.2em] rounded-none hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                    >
                      Process Payment of ${subtotal}
                    </button>
                  </div>

                  {/* Right Column: Interactive Card Mockup & Summary */}
                  <div className="lg:col-span-5 bg-gradient-to-br from-[#121416] to-[#08090a] border-l border-white/5 p-6 sm:p-8 flex flex-col justify-between items-stretch">
                    
                    {/* Dynamic Card Mockup */}
                    <div className="relative h-44 w-full perspective-1000 mt-4 mb-8">
                      <motion.div
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 180 }}
                        className="w-full h-full relative preserve-3d"
                      >
                        {/* Front of Card */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#1c1d1f] to-[#121314] border border-[#FF4E00]/45 rounded-none p-5 flex flex-col justify-between backface-hidden shadow-2xl overflow-hidden">
                          {/* Art Deco Overlay */}
                          <div className="absolute inset-0 bg-radial-gradient from-white/5 via-transparent to-transparent opacity-30 pointer-events-none" />
                          
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] font-mono text-gray-500 tracking-widest uppercase">IGNIS LEDGER</span>
                            {/* Gold chip mockup */}
                            <div className="w-10 h-7 bg-gradient-to-r from-[#FF4E00] to-yellow-600 rounded-none shadow-md" />
                          </div>

                          <div className="font-mono text-base sm:text-lg tracking-[0.15em] text-center text-white/95 my-2">
                            {cardNumber || '•••• •••• •••• ••••'}
                          </div>

                          <div className="flex justify-between items-end text-white/80">
                            <div>
                              <span className="text-[7px] font-mono text-gray-500 block">CARDHOLDER</span>
                              <span className="text-xs font-mono tracking-widest uppercase truncate max-w-[150px] block">
                                {cardName || 'YOUR NAME'}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-[7px] font-mono text-gray-500 block">EXPIRES</span>
                              <span className="text-xs font-mono tracking-widest block">
                                {cardExpiry || 'MM/YY'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Back of Card */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#121314] to-[#0c0d0e] border border-[#FF4E00]/30 rounded-none p-5 flex flex-col justify-between backface-hidden rotateY-180 shadow-2xl">
                          <div className="w-full h-10 bg-black -mx-5 mt-2" />
                          <div className="flex items-center justify-between">
                            <div className="w-2/3 h-8 bg-zinc-700/60 rounded-none flex items-center justify-end px-3">
                              <span className="font-mono text-xs text-white font-semibold italic">Signature Secure</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[7px] font-mono text-gray-500 block">CVV</span>
                              <span className="font-mono text-xs tracking-widest font-bold text-[#FF4E00]">
                                {cardCvv || '•••'}
                              </span>
                            </div>
                          </div>
                          <span className="text-[7px] font-mono text-gray-600 text-center uppercase tracking-widest leading-tight block">
                            256-Bit Cryptographic Vault Authentication Card
                          </span>
                        </div>

                      </motion.div>
                    </div>

                    {/* Order summary stack */}
                    <div className="space-y-4 flex-grow">
                      <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block border-b border-white/5 pb-1">
                        Carriage Manifest
                      </h4>

                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {cartItems.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <div className="truncate max-w-[160px] text-gray-300">
                              {item.lighter.name} <span className="text-gray-500">x{item.quantity}</span>
                            </div>
                            <span className="font-mono text-gray-400">${item.lighter.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-white/5 pt-4 space-y-2">
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>VIP Carriage</span>
                          <span className="text-emerald-400">FREE</span>
                        </div>
                        <div className="flex justify-between items-baseline pt-2">
                          <span className="text-xs font-mono font-bold text-white uppercase">Ledger Sum</span>
                          <span className="text-xl font-mono font-bold text-[#FF4E00]">${subtotal}</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </form>
              )}

              {/* Secure Processing Step */}
              {step === 'PROCESSING' && (
                <div className="p-16 flex flex-col items-center justify-center text-center space-y-6 bg-[#0F0F0F]">
                  <div className="relative w-20 h-20">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                      className="absolute inset-0 rounded-none border-2 border-dashed border-[#FF4E00]"
                    />
                    <div className="absolute inset-4 rounded-none bg-[#FF4E00]/10 flex items-center justify-center text-[#FF4E00]">
                      <Compass className="w-8 h-8 animate-pulse" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-sans font-black italic uppercase tracking-tighter text-lg text-[#FF4E00]">
                      Executing Ledger Transfer
                    </h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto mt-2 leading-relaxed">
                      Authorizing 256-bit bank vault clearing. Standard secure channels are checking cryptographic keys. Please keep this session active.
                    </p>
                  </div>
                </div>
              )}

              {/* Order Placed Success Step */}
              {step === 'SUCCESS' && (
                <div className="p-8 sm:p-12 space-y-8 flex flex-col items-center bg-[#0F0F0F]">
                  
                  {/* Confetti / Sparkle header */}
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-none bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">Carriage Confirmed</span>
                    <h3 className="font-sans font-black italic uppercase tracking-tighter text-2xl md:text-3xl text-white">
                      Bespoke Masterpiece <span className="text-[#FF4E00]">Dispatched</span>
                    </h3>
                    <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                      Your ledger receipt has been compiled. Our packaging salon has received your coordinates and started seal-wrapping your chosen specimens.
                    </p>
                  </div>

                  {/* Simulating carriage routing */}
                  <div className="w-full max-w-xl bg-black/45 border border-[#FF4E00]/15 rounded-none p-6 relative">
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#FF4E00]/35" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#FF4E00]/35" />

                    <h4 className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-6 block border-b border-white/5 pb-2">
                      Logistical Manifest Routing
                    </h4>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="space-y-2">
                        <div className="w-10 h-10 rounded-none bg-[#FF4E00]/15 border border-[#FF4E00]/30 text-[#FF4E00] flex items-center justify-center mx-auto">
                          <Package className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono text-white uppercase block">1. Seal Wrap</span>
                        <p className="text-[9px] text-gray-500 uppercase">In packaging salon</p>
                      </div>

                      <div className="space-y-2 border-x border-[#222222]">
                        <div className="w-10 h-10 rounded-none bg-[#FF4E00]/5 border border-[#FF4E00]/10 text-[#FF4E00] flex items-center justify-center mx-auto">
                          <Truck className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono text-white uppercase block">2. Insured Transit</span>
                        <p className="text-[9px] text-gray-500 uppercase">Aviation priority</p>
                      </div>

                      <div className="space-y-2">
                        <div className="w-10 h-10 rounded-none bg-[#FF4E00]/5 border border-[#FF4E00]/10 text-[#FF4E00] flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono text-white uppercase block">3. In Hand</span>
                        <p className="text-[9px] text-gray-500 uppercase">Signed delivery</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleFinish}
                    id="finish-checkout-btn"
                    className="px-8 py-4 bg-white text-black font-sans font-bold text-xs uppercase tracking-widest rounded-none hover:bg-gray-200 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    Return to Atelier
                    <ArrowRight className="w-4 h-4" />
                  </button>

                </div>
              )}

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
