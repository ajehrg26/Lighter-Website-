import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Plus, Minus, Trash2, ShieldCheck, Truck } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number, engravingText?: string) => void;
  onRemoveItem: (productId: string, engravingText?: string) => void;
  onCheckoutClick: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckoutClick,
}: CartDrawerProps) {
  const subtotal = cartItems.reduce((total, item) => total + item.lighter.price * item.quantity, 0);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            id="cart-backdrop-overlay"
            className="fixed inset-0 z-50 bg-[#070809] backdrop-blur-sm"
          />

          {/* Drawer Body panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            id="cart-drawer-panel"
            className="fixed top-0 bottom-0 right-0 w-full max-w-md bg-[#0F0F0F] border-l border-[#222222] z-50 flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.95)]"
          >
            {/* Header section with Art Deco linear pattern */}
            <div className="p-6 border-b border-[#222222] flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#FF4E00]" />
                <div>
                  <h3 className="font-sans font-black italic uppercase tracking-tighter text-sm text-white">Shopping Bag</h3>
                  <p className="text-[10px] font-mono text-gray-500 uppercase">{totalItems} Reserve Pieces</p>
                </div>
              </div>
              <button
                onClick={onClose}
                id="close-cart-drawer-btn"
                className="p-1.5 rounded-none border border-white/5 hover:border-[#FF4E00] text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List scroll section */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4 scrollbar-thin">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-none border border-white/5 flex items-center justify-center text-gray-600 bg-black/25">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Bag is Empty</h4>
                    <p className="text-xs text-gray-600 mt-1 max-w-[220px]">
                      Select an engineering masterpiece from our collection to begin.
                    </p>
                  </div>
                </div>
              ) : (
                cartItems.map((item, idx) => {
                  const uniqueKey = `${item.lighter.id}-${item.engravingText || 'no-engraving'}`;
                  return (
                    <div
                      key={uniqueKey}
                      id={`cart-item-row-${idx}`}
                      className="p-4 bg-black/30 border border-[#222222] rounded-none flex gap-4 relative overflow-hidden group"
                    >
                      {/* Product Thumbnail */}
                      <img
                        src={item.lighter.imageUrl}
                        alt={item.lighter.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 object-cover rounded-none border border-white/5"
                      />

                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-sans text-xs font-black uppercase text-white tracking-wide truncate max-w-[160px]">
                              {item.lighter.name}
                            </h4>
                            <span className="text-xs font-mono text-[#FF4E00] font-bold">
                              ${item.lighter.price * item.quantity}
                            </span>
                          </div>

                          <span className="text-[10px] font-mono text-gray-500 uppercase block mt-0.5">
                            Unit Price: ${item.lighter.price}
                          </span>

                          {/* Personal Engraving Details */}
                          {item.engravingText && (
                            <div className="mt-2 p-1.5 bg-[#1A1A1A] border border-[#FF4E00]/20 rounded-none text-[10px]">
                              <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Engraved Monogram:</span>
                              <span className="text-[#FF4E00] font-mono tracking-wider block font-bold uppercase">
                                "{item.engravingText}"
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Adjust / Remove Group */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center bg-black/60 border border-[#222222] rounded-none p-0.5">
                            <button
                              onClick={() => onUpdateQuantity(item.lighter.id, -1, item.engravingText)}
                              id={`cart-minus-${idx}`}
                              className="p-1 text-gray-400 hover:text-white transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-mono text-white">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.lighter.id, 1, item.engravingText)}
                              id={`cart-plus-${idx}`}
                              className="p-1 text-gray-400 hover:text-white transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.lighter.id, item.engravingText)}
                            id={`cart-remove-${idx}`}
                            className="p-1.5 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Subtotals & Actions Bottom panel */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-black/60 border-t border-[#222222] space-y-4">
                
                {/* Shipping prompt */}
                <div className="flex items-center gap-3 p-3 bg-zinc-950/40 border border-[#222222] rounded-none text-zinc-400">
                  <Truck className="w-4 h-4 shrink-0 text-[#FF4E00]" />
                  <span className="text-[10px] font-mono uppercase tracking-wider">
                    Eligible for FREE insured priority delivery
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono text-gray-400 uppercase">
                    <span>Reserve Subtotal</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono text-gray-400 uppercase">
                    <span>VIP Secured Carriage</span>
                    <span className="text-[#FF4E00]">FREE</span>
                  </div>
                  <div className="border-t border-[#222222] my-2 pt-2 flex justify-between items-baseline">
                    <span className="text-xs font-mono text-white uppercase font-bold">Estimated Total</span>
                    <span className="text-xl font-mono text-[#FF4E00] font-bold">${subtotal}</span>
                  </div>
                </div>

                <button
                  onClick={onCheckoutClick}
                  id="checkout-trigger-btn"
                  className="w-full py-4 bg-[#FF4E00] text-black font-sans font-bold text-xs uppercase tracking-widest rounded-none hover:bg-white transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,78,0,0.15)] cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Secure Checkout
                </button>

                <div className="text-[9px] font-mono text-center text-gray-600 uppercase">
                  Fully Insured 256-Bit SSL Encrypted Carriage
                </div>
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
