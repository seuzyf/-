import React from 'react';
import { SelectedCard } from '../types';
import ParticleEffect from './ParticleEffect';
import { audioManager } from '../utils/audio';

interface SelectedCardsDisplayProps {
  cards: SelectedCard[];
  onReveal: () => void;
  canReveal: boolean;
  isRevealing: boolean;
}

const SelectedCardsDisplay: React.FC<SelectedCardsDisplayProps> = ({ cards, onReveal, canReveal, isRevealing }) => {
  
  return (
    <div className="flex flex-col items-center justify-end w-full pb-4 md:pb-8 relative z-10 transition-all duration-500">
      
      {/* Reveal Button Area - Fixed height to prevent jumping */}
      <div className="h-20 flex items-center justify-center mb-4 relative w-full">
        {canReveal && cards.length === 3 && !isRevealing && (
          <button 
            onClick={() => {
              audioManager.playReveal();
              onReveal();
            }}
            className="px-10 py-3 bg-slate-900/90 border border-amber-500/80 text-amber-100 rounded-full 
                       hover:bg-amber-900/60 hover:scale-105 hover:border-amber-400 transition-all duration-500 
                       font-cinzel tracking-[0.2em] animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.4)] z-50 cursor-pointer backdrop-blur-md"
          >
            ✧ 揭示命运 / REVEAL ✧
          </button>
        )}
        {isRevealing && (
             <div className="flex flex-col items-center gap-2">
                 <div className="text-amber-200 font-cinzel tracking-widest animate-pulse text-lg drop-shadow-md">
                    星辰正在排列...
                 </div>
                 <div className="text-amber-500/60 text-xs tracking-wider">
                    Connecting to the Ether...
                 </div>
             </div>
        )}
      </div>

      <div className="flex gap-4 md:gap-8 lg:gap-12 items-end justify-center w-full px-4 min-h-[320px]">
        {['past', 'present', 'future'].map((pos, idx) => {
          const card = cards.find(c => c.position === pos);
          
          // Determine if this specific card is currently waiting to be revealed during the sequence
          const isPendingReveal = isRevealing && card && !card.isRevealed;

          return (
            <div key={pos} className="relative flex flex-col items-center group">
              {/* Label */}
              <div className={`mb-4 font-cinzel tracking-widest text-[10px] md:text-xs uppercase transition-colors duration-500 
                   ${isPendingReveal ? 'text-amber-300 animate-pulse' : 'text-amber-500/50'}`}>
                {pos === 'past' ? '过去 / The Past' : pos === 'present' ? '现在 / The Present' : '未来 / The Future'}
              </div>

              {/* Card Slot */}
              <div className="relative w-32 h-52 md:w-44 md:h-72 scene">
                
                {!card ? (
                  // Empty Slot
                  <div className="w-full h-full border border-dashed border-slate-700/40 rounded-xl flex items-center justify-center bg-slate-900/20 shadow-inner backdrop-blur-sm transition-all duration-500">
                    <span className="text-slate-700 text-3xl opacity-30 font-serif">?</span>
                  </div>
                ) : (
                  // Filled Card Container
                  // Added 'animate-slide-in' for entry
                  // Added 'animate-glow' when pending reveal
                  // Added 'animate-float' when idle
                  <div className={`relative w-full h-full animate-slide-in 
                       ${!card.isRevealed ? 'animate-float' : ''}`} 
                       style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: 'backwards' }}>
                    
                    <div className={`relative w-full h-full transition-transform duration-[2s] cubic-bezier(0.4, 0, 0.2, 1) transform-style-3d 
                          ${card.isRevealed ? 'rotate-y-180' : ''}`}>
                      
                      {/* Front (Card Back - Face Down) */}
                      <div className={`absolute w-full h-full backface-hidden z-10 rounded-xl overflow-hidden shadow-2xl transition-all duration-500
                                      ${isPendingReveal ? 'animate-glow brightness-125' : ''}`}>
                          
                          {/* Particle Overlay for Face Down Card */}
                          <div className="absolute inset-0 z-20">
                             <ParticleEffect width={window.innerWidth < 768 ? 128 : 176} height={window.innerWidth < 768 ? 208 : 288} active={!card.isRevealed} />
                          </div>
                          
                          {/* Card Back Texture */}
                          <div className="w-full h-full bg-slate-900 border-2 border-amber-700/50 
                                        bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] flex items-center justify-center relative">
                              <div className="absolute inset-2 border border-amber-500/20 rounded-lg"></div>
                              <div className="text-amber-600/80 text-4xl animate-pulse filter drop-shadow-[0_0_10px_rgba(217,119,6,0.5)]">✵</div>
                          </div>
                      </div>

                      {/* Back (Card Face - Face Up) */}
                      <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-xl overflow-hidden border-[3px] border-amber-300/60 shadow-[0_0_50px_rgba(251,191,36,0.2)] bg-black group-hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-shadow duration-500">
                          <img 
                              src={card.image} 
                              alt={card.name} 
                              className={`w-full h-full object-cover transition-transform duration-700 ${card.isReversed ? 'rotate-180' : ''}`} 
                          />
                          
                          {/* Shine Effect Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 animate-pulse pointer-events-none"></div>

                          {/* Text Overlay */}
                          <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black via-black/80 to-transparent z-10">
                              <p className="text-amber-100 font-cinzel text-sm md:text-base tracking-wider text-center drop-shadow-md">{card.name}</p>
                              {card.isReversed && <p className="text-red-400 text-[10px] text-center uppercase tracking-[0.2em] mt-1 border-t border-red-900/50 pt-1">Reverse</p>}
                          </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectedCardsDisplay;