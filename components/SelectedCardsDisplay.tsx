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
      
      {/* Reveal Button Area */}
      <div className="h-16 flex items-center justify-center mb-2">
        {canReveal && cards.length === 3 && !isRevealing && (
          <button 
            onClick={() => {
              audioManager.playReveal();
              onReveal();
            }}
            className="px-8 py-3 bg-slate-900/80 border border-amber-500 text-amber-100 rounded-full 
                       hover:bg-amber-900/50 hover:scale-105 transition-all duration-500 font-cinzel tracking-widest animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.3)] z-50 cursor-pointer"
          >
            揭示命运 / REVEAL DESTINY
          </button>
        )}
        {isRevealing && (
             <div className="text-amber-200 font-cinzel tracking-widest animate-pulse">
                命运正在显现... / Destiny is unfolding...
             </div>
        )}
      </div>

      <div className="flex gap-4 md:gap-8 lg:gap-16 items-center justify-center w-full px-4">
        {['past', 'present', 'future'].map((pos, idx) => {
          const card = cards.find(c => c.position === pos);
          
          return (
            <div key={pos} className="relative flex flex-col items-center group">
              {/* Label */}
              <div className="mb-3 text-amber-500/60 font-cinzel tracking-widest text-[10px] md:text-xs uppercase">
                {pos === 'past' ? '过去 / Past' : pos === 'present' ? '现在 / Present' : '未来 / Future'}
              </div>

              {/* Card Slot */}
              <div className="relative w-28 h-44 md:w-40 md:h-64 lg:w-48 lg:h-72 scene">
                
                {!card ? (
                  // Empty Slot
                  <div className="w-full h-full border border-dashed border-slate-700/50 rounded-lg flex items-center justify-center bg-slate-900/20 shadow-inner">
                    <span className="text-slate-700 text-2xl opacity-20 font-serif">?</span>
                  </div>
                ) : (
                  // Filled Card Container
                  // Added 'animate-slide-in' for entry and 'animate-float' for idle
                  <div className={`relative w-full h-full animate-slide-in ${!card.isRevealed ? 'animate-float' : ''}`} style={{ animationDelay: `${idx * 0.2}s` }}>
                    <div className={`relative w-full h-full transition-transform duration-[1.5s] transform-style-3d 
                          ${card.isRevealed ? 'rotate-y-180' : ''}`}>
                      
                      {/* Front (Card Back) */}
                      <div className="absolute w-full h-full backface-hidden z-10 rounded-lg overflow-hidden shadow-2xl">
                          {/* Particle Overlay */}
                          <div className="absolute inset-0">
                             <ParticleEffect width={window.innerWidth < 768 ? 112 : 192} height={window.innerWidth < 768 ? 176 : 288} active={true} />
                          </div>
                          
                          <div className="w-full h-full bg-slate-800 border-2 border-amber-600/40 
                                        bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] flex items-center justify-center">
                              <div className="text-amber-500 text-3xl animate-pulse filter drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">✵</div>
                          </div>
                      </div>

                      {/* Back (Card Face) */}
                      <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-lg overflow-hidden border-2 border-amber-300/80 shadow-[0_0_30px_rgba(251,191,36,0.2)] bg-black">
                          <img 
                              src={card.image} 
                              alt={card.name} 
                              className={`w-full h-full object-cover transition-transform duration-700 ${card.isReversed ? 'rotate-180' : ''}`} 
                          />
                          {/* Mystic Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 pointer-events-none"></div>
                          
                          <div className="absolute bottom-0 w-full p-3 text-center z-10">
                              <p className="text-amber-100 font-cinzel text-xs md:text-sm tracking-wide text-shadow">{card.name}</p>
                              {card.isReversed && <p className="text-red-400 text-[10px] uppercase tracking-widest mt-1">Reverse</p>}
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