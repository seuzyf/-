import React, { useState, useEffect } from 'react';
import { MAJOR_ARCANA, shuffleDeck } from './utils/tarotData';
import { SelectedCard, TarotCardData, GameState } from './types';
import TarotDeck from './components/TarotDeck';
import SelectedCardsDisplay from './components/SelectedCardsDisplay';
import { getTarotReading } from './services/geminiService';
import { audioManager } from './utils/audio';

// Icons
const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('input');
  const [question, setQuestion] = useState('');
  const [deck, setDeck] = useState<TarotCardData[]>([]);
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  const [deckSpread, setDeckSpread] = useState(false);
  const [aiReading, setAiReading] = useState('');
  const [loadingReading, setLoadingReading] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  // Initialize deck on mount
  useEffect(() => {
    // Start with a clean deck
    setDeck(MAJOR_ARCANA);
  }, []);

  const handleStart = () => {
    if (!question.trim()) return;
    setGameState('shuffling');
    
    // Simulate shuffle
    const shuffled = shuffleDeck(MAJOR_ARCANA);
    setDeck(shuffled);
    audioManager.playDraw();
    
    setTimeout(() => {
      setGameState('picking');
    }, 1000);
  };

  const handleCardSelect = (card: TarotCardData) => {
    if (selectedCards.length >= 3) return;

    // Remove from deck visuals
    const newDeck = deck.filter(c => c.id !== card.id);
    setDeck(newDeck);

    // Determine position
    const positions: Array<'past' | 'present' | 'future'> = ['past', 'present', 'future'];
    const currentPosition = positions[selectedCards.length];

    // Determine reversal (randomly)
    const isReversed = Math.random() > 0.8; // 20% chance of reversal

    const newSelectedCard: SelectedCard = {
      ...card,
      position: currentPosition,
      isReversed,
      isRevealed: false // Ensure it stays face down initially
    };

    setSelectedCards([...selectedCards, newSelectedCard]);
    audioManager.playDraw();

    if (selectedCards.length + 1 === 3) {
      // Once 3 cards are picked, retract deck automatically to clean up view
      setTimeout(() => setDeckSpread(false), 500); 
    }
  };

  const handleReveal = async () => {
    setIsRevealing(true);
    setLoadingReading(true);
    
    // 1. Start AI Loading in background immediately
    const readingPromise = getTarotReading(question, selectedCards);

    // 2. Sequential Flip Animation
    // We create a sequence where each card glows then flips
    
    // Time constants
    const START_DELAY = 500;
    const FLIP_DURATION = 2000; // Duration of the visual flip
    const INTERVAL = 2500; // Time between starting next card's flip sequence

    // Function to flip a specific index
    const flipCard = (index: number) => {
      setSelectedCards(prev => {
        const next = [...prev];
        if (next[index]) {
            next[index].isRevealed = true;
        }
        return next;
      });
      audioManager.playFlip(); // Sound effect
    };

    // Schedule flips
    setTimeout(() => flipCard(0), START_DELAY);
    setTimeout(() => flipCard(1), START_DELAY + INTERVAL);
    setTimeout(() => flipCard(2), START_DELAY + INTERVAL * 2);

    // 3. Wait for both animation and AI to finish before showing text
    // The total animation time covers 3 intervals. We want to ensure the last flip is fully enjoyed before text appears.
    const ANIMATION_TOTAL_TIME = START_DELAY + INTERVAL * 2 + FLIP_DURATION; 

    const [result] = await Promise.all([
      readingPromise,
      new Promise(resolve => setTimeout(resolve, ANIMATION_TOTAL_TIME))
    ]);

    // Transition to reading view
    setAiReading(result);
    setLoadingReading(false);
    setIsRevealing(false);
    
    // Play a "success" sound when reading appears
    audioManager.playReveal();
    setGameState('reading');
  };

  const resetGame = () => {
    setGameState('input');
    setQuestion('');
    setSelectedCards([]);
    setDeck(MAJOR_ARCANA);
    setDeckSpread(false);
    setAiReading('');
    setIsRevealing(false);
    setLoadingReading(false);
  };

  return (
    <div className="h-screen w-screen bg-slate-950 text-amber-50 relative overflow-hidden flex flex-col">
      
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-slate-950 to-black"></div>

      {/* Header */}
      <header className="z-20 w-full p-4 md:p-6 flex justify-between items-center border-b border-amber-900/30 bg-slate-900/50 backdrop-blur-sm flex-none h-16 md:h-20">
        <h1 className="text-xl md:text-3xl font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">
          <SparklesIcon /> 
          Mystic Tarot
        </h1>
        {gameState !== 'input' && !isRevealing && (
           <button onClick={resetGame} className="text-xs text-slate-400 hover:text-amber-200 underline">
             重新开始 / Restart
           </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-7xl mx-auto flex flex-col items-center relative p-4 overflow-hidden">
        
        {/* INPUT PHASE */}
        {gameState === 'input' && (
          <div className="z-20 w-full h-full flex items-center justify-center">
             <div className="w-full max-w-lg p-8 bg-slate-900/80 border border-amber-800 rounded-xl shadow-2xl backdrop-blur-md transform transition-all animate-slide-in">
              <h2 className="text-xl mb-6 text-center font-cinzel text-amber-100">Consult the Oracle</h2>
              <div className="mb-6">
                <label className="block text-sm font-medium text-amber-500 mb-2">心中默念你的问题 / Focus on your question</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="例如：我最近的职业发展会如何？(E.g., How will my career develop?)"
                  className="w-full h-32 px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-amber-100 placeholder-slate-600 resize-none outline-none transition-all"
                />
              </div>
              <button
                onClick={handleStart}
                disabled={!question.trim()}
                className="w-full py-4 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-cinzel font-bold text-lg rounded-lg shadow-lg border border-amber-500/30 transition-all transform hover:scale-[1.02] flex justify-center items-center"
              >
                <SparklesIcon /> 开始占卜 / Begin Reading
              </button>
            </div>
          </div>
        )}

        {/* SHUFFLING / PICKING PHASE / REVEALING PHASE */}
        {(gameState === 'shuffling' || gameState === 'picking') && (
          <div className="w-full h-full flex flex-col items-center justify-between">
            
            {/* Top: Deck Area (Flexible Space) */}
            {/* Using flex-grow with explicit min-height prevents overlap by forcing the container to take available space but respect bottom element */}
            <div className={`relative flex-grow w-full flex items-center justify-center transition-all duration-1000 ${isRevealing ? 'opacity-0 scale-90 translate-y-[-100px]' : 'opacity-100'}`}>
               {gameState === 'shuffling' ? (
                   <div className="text-amber-200 animate-pulse text-2xl font-cinzel">洗牌中 / Shuffling...</div>
               ) : (
                   <TarotDeck 
                     cards={deck} 
                     onCardSelect={handleCardSelect} 
                     isPicking={selectedCards.length < 3}
                     deckSpread={deckSpread}
                     setDeckSpread={setDeckSpread}
                   />
               )}
            </div>

            {/* Bottom: Hand Area (Fixed or Content-based Height) */}
            <div className="flex-none w-full z-10">
              <SelectedCardsDisplay 
                 cards={selectedCards} 
                 onReveal={handleReveal} 
                 canReveal={selectedCards.length === 3}
                 isRevealing={isRevealing}
              />
            </div>
          </div>
        )}

        {/* READING RESULT PHASE */}
        {gameState === 'reading' && (
          <div className="w-full h-full flex flex-col lg:flex-row gap-6 items-center justify-center pt-2 pb-8 animate-slide-in">
             
             {/* Left: The Cards (Display Mode) */}
             <div className="w-full lg:w-1/3 flex flex-col items-center transform scale-90 lg:scale-100">
                <SelectedCardsDisplay 
                  cards={selectedCards} 
                  onReveal={() => {}} 
                  canReveal={false} 
                  isRevealing={false}
                />
             </div>

             {/* Right: The Interpretation */}
             <div className="w-full lg:w-2/3 h-full max-h-[75vh] p-6 bg-slate-900/90 border border-amber-700/50 rounded-lg shadow-2xl backdrop-blur-md flex flex-col">
                <h3 className="text-xl font-cinzel text-amber-400 mb-4 border-b border-amber-900 pb-2 flex-none">命运启示 / Divine Guidance</h3>
                
                <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
                    {loadingReading ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-4">
                            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-amber-200/70 animate-pulse text-sm">正在连接阿卡西记录... (Connecting to Akasha...)</p>
                        </div>
                    ) : (
                        <div className="prose prose-invert prose-amber max-w-none">
                            <div className="whitespace-pre-wrap leading-relaxed text-amber-100/90 font-serif text-base">
                                {aiReading.split('\n').map((line, i) => {
                                    if (line.startsWith('#') || line.startsWith('**')) {
                                        return <p key={i} className="font-bold text-amber-400 mt-6 mb-3 border-l-2 border-amber-600 pl-3">{line.replace(/#/g, '').replace(/\*\*/g, '')}</p>
                                    }
                                    return <p key={i} className="mb-3">{line}</p>
                                })}
                            </div>
                        </div>
                    )}
                </div>
             </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;