/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { tarotCards, TarotCard } from './tarotData';
import { Sparkles, Calendar, User, ChevronRight, RotateCcw } from 'lucide-react';

type Screen = 'landing' | 'selection' | 'reading';

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [userData, setUserData] = useState({ name: '', birthDate: '' });
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [shuffledCards, setShuffledCards] = useState<TarotCard[]>([]);

  const getZodiacSign = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { name: "Koç", element: "Ateş" };
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { name: "Boğa", element: "Toprak" };
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { name: "İkizler", element: "Hava" };
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { name: "Yengeç", element: "Su" };
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { name: "Aslan", element: "Ateş" };
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { name: "Başak", element: "Toprak" };
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { name: "Terazi", element: "Hava" };
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { name: "Akrep", element: "Su" };
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { name: "Yay", element: "Ateş" };
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { name: "Oğlak", element: "Toprak" };
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { name: "Kova", element: "Hava" };
    return { name: "Balık", element: "Su" };
  };

  const zodiac = useMemo(() => {
    if (!userData.birthDate) return null;
    return getZodiacSign(userData.birthDate);
  }, [userData.birthDate]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (userData.name && userData.birthDate) {
      // Shuffle cards every time we start selection
      setShuffledCards([...tarotCards].sort(() => Math.random() - 0.5));
      setScreen('selection');
    }
  };

  const handleCardSelect = (card: TarotCard) => {
    if (selectedCards.length < 3 && !selectedCards.find(c => c.id === card.id)) {
      const newSelection = [...selectedCards, card];
      setSelectedCards(newSelection);
      
      if (newSelection.length === 3) {
        setTimeout(() => {
          setScreen('reading');
          setTimeout(() => setRevealed(true), 500);
        }, 800);
      }
    }
  };

  const reset = () => {
    setScreen('landing');
    setSelectedCards([]);
    setRevealed(false);
    setUserData({ name: '', birthDate: '' });
    setShuffledCards([]);
  };

  const localReading = useMemo(() => {
    if (selectedCards.length < 3 || !zodiac) return null;

    const [past, present, future] = selectedCards;
    
    const intros = [
      `Sevgili ${userData.name}, ${zodiac.name} burcunun ${zodiac.element} enerjisi bugün seninle çok güçlü bir bağ kuruyor.`,
      `Kozmik akışta ${userData.name}, ${zodiac.element} elementinin rehberliğinde ruhun derin bir yolculuğa çıkıyor.`,
      `${zodiac.name} burcunun bilgeliğiyle ${userData.name}, evrenin sana fısıldadığı bu kadim mesajlara kulak ver.`
    ];

    const connections = [
      `Geçmişten gelen ${past.name} enerjisi, şu anki ${present.name} durumunu şekillendirmiş görünüyor.`,
      `${past.name} kartının bıraktığı izler, bugün ${present.name} ile yeni bir anlam kazanıyor.`,
      `Ruhun ${past.name} ile olgunlaşırken, şimdi ${present.name} ile gerçek gücünü keşfediyor.`
    ];

    const futureInsights = [
      `Gelecekte beliren ${future.name}, ${zodiac.name} burcunun ışığıyla birleşerek hayatında mucizevi bir dönüşüm başlatacak.`,
      `${future.name} kartı, önündeki yolda sana yepyeni kapılar açacak ve ${zodiac.element} elementinin gücüyle seni destekleyecek.`,
      `Bu kozmik dizilim, ${future.name} ile hayallerine giden yolda sana rehberlik edecek.`
    ];

    const randomIdx = (arr: any[]) => Math.floor(Math.random() * arr.length);

    return (
      <div className="space-y-6">
        <p>{intros[randomIdx(intros)]}</p>
        <p>{connections[randomIdx(connections)]}</p>
        <p>{futureInsights[randomIdx(futureInsights)]}</p>
        <p className="pt-4 border-t border-white/5 text-[#d4af37] font-bold italic">
          Günün Tavsiyesi: {zodiac.element === 'Ateş' ? 'Cesaretini topla ve harekete geç.' : 
                           zodiac.element === 'Su' ? 'Duygularının sesini dinle ve akışta kal.' : 
                           zodiac.element === 'Toprak' ? 'Sabırlı ol ve temellerini sağlamlaştır.' : 
                           'Zihnini özgür bırak ve yeni fikirlere açık ol.'}
        </p>
      </div>
    );
  }, [selectedCards, zodiac, userData.name]);

  return (
    <div className="min-h-screen bg-[#050208] text-[#f3e8ff] font-serif selection:bg-[#d4af37]/30 overflow-x-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#2e1065] blur-[150px] opacity-30" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#7e22ce] blur-[180px] opacity-20" />
        <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] rounded-full bg-[#d4af37] blur-[200px] opacity-5" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {screen === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="max-w-md w-full glass-panel p-10 rounded-[40px] border border-[#d4af37]/20 backdrop-blur-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />
              
              <div className="text-center mb-10">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 0.95, 1]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block mb-6"
                >
                  <div className="relative">
                    <Sparkles className="w-16 h-16 text-[#d4af37] relative z-10" />
                    <div className="absolute inset-0 bg-[#d4af37] blur-xl opacity-20 animate-pulse" />
                  </div>
                </motion.div>
                <h1 className="text-5xl font-bold tracking-tighter mb-3 bg-gradient-to-b from-[#f3e8ff] to-[#d4af37] bg-clip-text text-transparent">
                  Mistik Kehanet
                </h1>
                <p className="text-[10px] text-[#d4af37]/60 uppercase tracking-[0.4em] font-bold">Yıldızların Rehberliği</p>
              </div>

              <form onSubmit={handleStart} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37]/50 ml-1 font-bold">Ruhun Adı</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]/30 group-focus-within:text-[#d4af37] transition-colors" />
                    <input
                      required
                      type="text"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      placeholder="İsim ve Soyisim..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-4 focus:outline-none focus:border-[#d4af37]/40 transition-all placeholder:text-white/10 text-lg"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37]/50 ml-1 font-bold">Kozmik Doğum</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]/30 group-focus-within:text-[#d4af37] transition-colors" />
                    <input
                      required
                      type="date"
                      value={userData.birthDate}
                      onChange={(e) => setUserData({ ...userData, birthDate: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-4 focus:outline-none focus:border-[#d4af37]/40 transition-all text-white/40"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:from-[#f1c40f] hover:to-[#d4af37] text-[#1a0b2e] font-black py-5 rounded-2xl transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)] flex items-center justify-center gap-3 group uppercase tracking-widest text-sm"
                >
                  Kapıları Arala
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </motion.div>
          )}

          {screen === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -50 }}
              className="w-full max-w-6xl"
            >
              <div className="text-center mb-16">
                <h2 className="text-4xl font-light mb-4 italic text-[#d4af37]">Kaderini Seç</h2>
                <p className="text-[#f3e8ff]/40 max-w-md mx-auto">Zihnindeki gürültüyü sustur ve ruhunla rezonansa giren 3 kartı belirle.</p>
                <div className="mt-8 flex justify-center gap-4">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={selectedCards.length >= i ? { scale: [1, 1.2, 1], backgroundColor: "#d4af37" } : {}}
                      className={`w-4 h-4 rounded-full border-2 border-[#d4af37]/30 ${
                        selectedCards.length >= i ? 'bg-[#d4af37] shadow-[0_0_10px_#d4af37]' : 'bg-transparent'
                      } transition-all duration-500`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
                {shuffledCards.map((card, idx) => {
                  const isSelected = selectedCards.find(c => c.id === card.id);
                  return (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      whileHover={!isSelected && selectedCards.length < 3 ? { y: -15, scale: 1.05 } : {}}
                      onClick={() => handleCardSelect(card)}
                      className={`aspect-[2/3] rounded-2xl cursor-pointer relative overflow-hidden border-2 transition-all duration-700 group ${
                        isSelected 
                          ? 'border-[#d4af37] shadow-[0_0_25px_rgba(212,175,55,0.6)] scale-90 opacity-40' 
                          : 'border-white/5 hover:border-[#d4af37]/50'
                      }`}
                    >
                      {/* Card Back Design */}
                      <div className="absolute inset-0 bg-[#1a0b2e] flex items-center justify-center p-3">
                        <div className="w-full h-full border-2 border-[#d4af37]/10 rounded-xl flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#d4af37] via-transparent to-transparent" />
                          <div className="w-16 h-16 rounded-full border border-[#d4af37]/20 flex items-center justify-center relative z-10">
                            <Sparkles className="w-6 h-6 text-[#d4af37]/20 group-hover:text-[#d4af37]/60 transition-colors" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {screen === 'reading' && (
            <motion.div
              key="reading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-6xl"
            >
              <div className="text-center mb-20">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="inline-block mb-6 px-6 py-2 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20"
                >
                  <p className="text-[10px] uppercase tracking-[0.5em] text-[#d4af37] font-black">
                    {zodiac?.name} Burcu &bull; {zodiac?.element} Elementi
                  </p>
                </motion.div>
                <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-[#d4af37] to-white bg-clip-text text-transparent">
                  Ruhun Yansıması
                </h2>
                <p className="text-[#f3e8ff]/50 max-w-2xl mx-auto text-lg italic">
                  "{userData.name}, evrenin kadim sembolleri senin için bir araya geldi. İşte yolunu aydınlatacak mesajlar..."
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-12 mb-24">
                {selectedCards.map((card, idx) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 100, rotateY: 180 }}
                    animate={revealed ? { 
                      opacity: 1, 
                      y: 0, 
                      rotateY: 0,
                    } : {}}
                    transition={{ 
                      duration: 1.5, 
                      delay: idx * 0.5,
                      type: "spring",
                      stiffness: 30
                    }}
                    className="flex flex-col items-center group"
                  >
                    <div className="w-full aspect-[2/3] rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 mb-8 relative">
                      <motion.img 
                        src={card.image} 
                        alt={card.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.15 }}
                        transition={{ duration: 1 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050208] via-transparent to-transparent opacity-90" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-[1px] flex-1 bg-gradient-to-r from-[#d4af37] to-transparent" />
                          <p className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] font-black">
                            {idx === 0 ? 'Geçmiş' : idx === 1 ? 'Şimdi' : 'Gelecek'}
                          </p>
                        </div>
                        <h3 className="text-3xl font-bold tracking-tight text-white">{card.name}</h3>
                      </div>
                      
                      {/* Magical Glow Overlay */}
                      <div className="absolute inset-0 bg-[#d4af37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    </div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={revealed ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: idx * 0.5 + 1 }}
                      className="text-center space-y-4 px-4"
                    >
                      <div className="inline-block px-4 py-1 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-[#d4af37] font-bold text-xs uppercase tracking-widest">{card.meaning}</p>
                      </div>
                      <p className="text-[#f3e8ff]/70 text-base leading-relaxed font-light italic">"{card.interpretation}"</p>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {revealed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 3 }}
                  className="max-w-3xl mx-auto glass-panel p-12 rounded-[48px] border border-[#d4af37]/20 text-center relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
                  <Sparkles className="w-10 h-10 text-[#d4af37]/40 mx-auto mb-6" />
                  <h3 className="text-3xl font-light mb-8 italic text-[#d4af37]">Kozmik Yorum</h3>
                  <div className="space-y-6 text-[#f3e8ff]/80 text-lg leading-relaxed font-light">
                    <div className="whitespace-pre-wrap text-left">
                      {localReading}
                    </div>
                  </div>
                  
                  <div className="mt-12 pt-8 border-t border-white/5">
                    <button
                      onClick={reset}
                      className="inline-flex items-center gap-3 text-[#d4af37] hover:text-white transition-all uppercase tracking-[0.3em] text-[10px] font-black group"
                    >
                      <RotateCcw className="w-4 h-4 group-hover:rotate-[-180deg] transition-transform duration-700" />
                      Yeni Bir Yolculuğa Başla
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 py-12 text-center text-[#d4af37]/20 text-[10px] tracking-[0.5em] uppercase font-bold">
        &copy; 2026 Mistik Kehanet &bull; Kadim Bilgelik Yolu
      </footer>

      <style>{`
        .glass-panel {
          background: rgba(26, 11, 46, 0.4);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.8) sepia(1) saturate(5) hue-rotate(10deg);
          opacity: 0.5;
          cursor: pointer;
        }
        ::selection {
          background: rgba(212, 175, 55, 0.3);
          color: white;
        }
      `}</style>
    </div>
  );
}
