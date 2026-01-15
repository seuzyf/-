import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TarotCardData, SelectedCard } from '../types';
import { audioManager } from '../utils/audio';

interface TarotDeckProps {
  cards: TarotCardData[];
  onCardSelect: (card: TarotCardData) => void;
  isPicking: boolean;
  deckSpread: boolean;
  setDeckSpread: (spread: boolean) => void;
}

const TarotDeck: React.FC<TarotDeckProps> = ({ 
  cards, 
  onCardSelect, 
  isPicking, 
  deckSpread, 
  setDeckSpread 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle Scroll to Spread
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isPicking) return;
      
      // Threshold to prevent accidental jitters
      if (e.deltaY > 20 && !deckSpread) {
        setDeckSpread(true);
        audioManager.playDraw(); 
      } else if (e.deltaY < -20 && deckSpread) {
        setDeckSpread(false);
        audioManager.playDraw();
      }
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isPicking, deckSpread, setDeckSpread]);

  const handleCardClick = (card: TarotCardData) => {
    if (isPicking && deckSpread) {
      onCardSelect(card);
      audioManager.playHover();
    } else if (isPicking && !deckSpread) {
        // If clicked while closed, spread it
        setDeckSpread(true);
        audioManager.playDraw();
    }
  };

  const getCardStyle = (index: number, total: number) => {
    if (!deckSpread) {
      // Stacked pile in center
      return {
        transform: `translate3d(0, 0, -${index * 0.5}px) rotateZ(${Math.sin(index) * 2}deg)`,
        zIndex: total - index,
        transition: 'all 0.5s ease-in-out'
      };
    } else {
      // Fan spread logic
      const angleStep = 6; // degrees
      const midPoint = (total - 1) / 2;
      const angle = (index - midPoint) * angleStep;
      
      // Arch calculation - adjusted to stay higher
      // Using a parabolic curve for yOffset to keep it cleaner
      const distFromCenter = Math.abs(index - midPoint);
      const yOffset = distFromCenter * distFromCenter * 0.8; // Quadratic curve
      const xOffset = (index - midPoint) * 30; // Spacing

      return {
        transform: `translate3d(${xOffset}px, ${yOffset}px, 0) rotateZ(${angle}deg)`,
        zIndex: index + 1,
        transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        cursor: 'pointer'
      };
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center scene pointer-events-none" ref={containerRef}>
      {cards.map((card, index) => (
        <div
          key={card.id}
          onClick={() => handleCardClick(card)}
          className={`absolute w-28 h-48 lg:w-32 lg:h-56 rounded-lg shadow-2xl border-2 border-slate-700 bg-slate-800 transform-gpu transition-all pointer-events-auto
            ${deckSpread ? 'hover:-translate-y-8 hover:scale-110 hover:z-[100] hover:border-amber-400' : ''}`}
          style={getCardStyle(index, cards.length)}
        >
          {/* Card Back Design */}
          <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-slate-900 flex items-center justify-center overflow-hidden rounded-lg">
             <div className="w-[90%] h-[90%] border border-amber-500/30 rounded-md flex items-center justify-center">
                <div className="text-amber-700 opacity-50 text-4xl">✵</div>
             </div>
          </div>
        </div>
      ))}
      
      {!deckSpread && isPicking && (
        <div className="absolute bottom-10 text-amber-200/50 animate-pulse font-cinzel text-sm pointer-events-none">
          向下滚动展开牌组 / Scroll down to spread
        </div>
      )}
    </div>
  );
};

export default TarotDeck;