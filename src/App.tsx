/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { tarotCards, TarotCard } from './tarotData';
import { Sparkles, Calendar, User, ChevronRight, RotateCcw, Heart, Briefcase, History, BookOpen, X, Trash2, Share2, Copy, Check } from 'lucide-react';

type Screen = 'landing' | 'shuffling' | 'selection' | 'reading' | 'history' | 'library';
type ReadingType = 'general' | 'love' | 'career';

interface SavedReading {
  id: string;
  date: string;
  userName: string;
  readingType: ReadingType;
  cards: TarotCard[];
  interpretation: string;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [readingType, setReadingType] = useState<ReadingType>('general');
  const [userData, setUserData] = useState({ name: '', birthDate: '' });
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [shuffledCards, setShuffledCards] = useState<TarotCard[]>([]);
  const [history, setHistory] = useState<SavedReading[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<SavedReading | null>(null);
  const [isCopying, setIsCopying] = useState(false);

  // StarDust Background Component
  const StarDust = () => {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: [null, Math.random() * -100 - 50],
              opacity: [null, 0],
              scale: [null, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 20
            }}
            className="absolute w-1 h-1 bg-[#d4af37] rounded-full blur-[1px]"
          />
        ))}
      </div>
    );
  };

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('tarot_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("History load error", e);
      }
    }
  }, []);

  const saveReading = (cards: TarotCard[], interpretation: string) => {
    const newReading: SavedReading = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      userName: userData.name,
      readingType,
      cards,
      interpretation
    };
    const updatedHistory = [newReading, ...history].slice(0, 20); // Keep last 20
    setHistory(updatedHistory);
    localStorage.setItem('tarot_history', JSON.stringify(updatedHistory));
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('tarot_history', JSON.stringify(updated));
  };

  const calculateLifePathNumber = (dateStr: string) => {
    const digits = dateStr.replace(/\D/g, '');
    let sum = digits.split('').reduce((acc, d) => acc + parseInt(d), 0);
    
    while (sum > 9 && sum !== 11 && sum !== 22) {
      sum = sum.toString().split('').reduce((acc, d) => acc + parseInt(d), 0);
    }
    return sum;
  };

  const lifePathNumber = useMemo(() => {
    if (!userData.birthDate) return null;
    return calculateLifePathNumber(userData.birthDate);
  }, [userData.birthDate]);

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
      setScreen('shuffling');
      setTimeout(() => {
        setShuffledCards([...tarotCards].sort(() => Math.random() - 0.5));
        setScreen('selection');
      }, 3000);
    }
  };

  const handleShare = async () => {
    const text = `Mistik Kehanet'te fal baktırdım! 🌟\n\nKartlarım: ${selectedCards.map(c => c.name).join(', ')}\n\nSen de kaderini öğrenmek ister misin?`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mistik Kehanet Tarot Falı',
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Sharing failed', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      setIsCopying(true);
      setTimeout(() => setIsCopying(false), 2000);
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
    setReadingType('general');
  };

  const localReading = useMemo(() => {
    if (selectedCards.length < 3 || !zodiac) return null;

    const [c1, c2, c3] = selectedCards;
    
    const intros = {
      general: [
        `Sevgili ${userData.name}, ${zodiac.name} burcunun ${zodiac.element} enerjisi bugün seninle çok güçlü bir bağ kuruyor.`,
        `Kozmik akışta ${userData.name}, ${zodiac.element} elementinin rehberliğinde ruhun derin bir yolculuğa çıkıyor.`,
        `${zodiac.name} burcunun bilgeliğiyle ${userData.name}, evrenin sana fısıldadığı bu kadim mesajlara kulak ver.`
      ],
      love: [
        `Aşkın kozmik frekansında ${userData.name}, kalbinin sesini ${zodiac.element} elementinin duyarlılığıyla dinliyoruz.`,
        `Gönül işlerinde ${zodiac.name} burcunun tutkusu ve ${zodiac.element} enerjisi senin için birleşiyor.`,
        `Sevgi yolculuğunda ${userData.name}, yıldızlar kalbindeki en derin arzuları aydınlatıyor.`
      ],
      career: [
        `Başarı ve kariyer yolunda ${userData.name}, ${zodiac.name} burcunun azmi senin en büyük rehberin.`,
        `İş hayatının karmaşasında ${zodiac.element} elementinin dengeleyici gücü sana yön veriyor.`,
        `Hedeflerine giden yolda ${userData.name}, evrenin stratejik fısıltılarını dinleme zamanı.`
      ]
    };

    const connections = {
      general: [
        `Geçmişten gelen ${c1.name} enerjisi, şu anki ${c2.name} durumunu şekillendirmiş görünüyor.`,
        `${c1.name} kartının bıraktığı izler, bugün ${c2.name} ile yeni bir anlam kazanıyor.`,
        `Ruhun ${c1.name} ile olgunlaşırken, şimdi ${c2.name} ile gerçek gücünü keşfediyor.`
      ],
      love: [
        `Kalbindeki ${c1.name} hissi, şu anki ilişkinizde ${c2.name} olarak tezahür ediyor.`,
        `Duygusal geçmişindeki ${c1.name}, bugün partnerinle arandaki ${c2.name} bağını güçlendiriyor.`,
        `Aşk hayatında ${c1.name} ile başlayan döngü, şimdi ${c2.name} ile yeni bir boyuta evriliyor.`
      ],
      career: [
        `Mesleki geçmişindeki ${c1.name} tecrübesi, şu anki projelerinde ${c2.name} olarak sana ışık tutuyor.`,
        `Kariyer basamaklarındaki ${c1.name} adımı, bugün seni ${c2.name} zirvesine hazırlıyor.`,
        `İş dünyasında ${c1.name} ile kurduğun temel, şimdi ${c2.name} ile meyvelerini veriyor.`
      ]
    };

    const futureInsights = {
      general: [
        `Gelecekte beliren ${c3.name}, ${zodiac.name} burcunun ışığıyla birleşerek hayatında mucizevi bir dönüşüm başlatacak.`,
        `${c3.name} kartı, önündeki yolda sana yepyeni kapılar açacak ve ${zodiac.element} elementinin gücüyle seni destekleyecek.`,
        `Bu kozmik dizilim, ${c3.name} ile hayallerine giden yolda sana rehberlik edecek.`
      ],
      love: [
        `Aşkın geleceğinde ${c3.name} parlıyor; bu kart kalbindeki tüm soruların cevabı olacak.`,
        `Sevgi dolu günlerin müjdecisi ${c3.name}, ilişkinizde yepyeni bir baharın habercisi.`,
        `Gelecekteki ${c3.name} enerjisi, ruh eşinle olan bağını ebedi bir huzura taşıyacak.`
      ],
      career: [
        `Kariyerinin zirvesinde ${c3.name} seni bekliyor; emeklerinin karşılığını alma vaktin yaklaşıyor.`,
        `İş hayatındaki geleceğin ${c3.name} ile aydınlanıyor; büyük bir başarı kapıda.`,
        `Gelecekteki ${c3.name} vizyonu, seni mesleğinde arzuladığın o saygın noktaya ulaştıracak.`
      ]
    };

    const randomIdx = (arr: any[]) => Math.floor(Math.random() * arr.length);

    return (
      <div className="space-y-6">
        <p>{intros[readingType][randomIdx(intros[readingType])]}</p>
        <p>{connections[readingType][randomIdx(connections[readingType])]}</p>
        <p>{futureInsights[readingType][randomIdx(futureInsights[readingType])]}</p>
        <div className="pt-6 border-t border-[#d4af37]/20">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37]/60 mb-2 font-bold">Numerolojik Rehberlik</p>
          <p className="text-base text-[#f3e8ff]/80 italic">
            Hayat Yolu Sayın olan <span className="text-[#d4af37] font-bold">{lifePathNumber}</span>, bu dönemde sana {
              lifePathNumber === 1 ? 'liderlik etmen ve kendi yolunu çizmen gerektiğini' :
              lifePathNumber === 2 ? 'işbirliği yapmanın ve uyumu yakalamanın önemini' :
              lifePathNumber === 3 ? 'yaratıcılığını konuşturman ve kendini ifade etmen gerektiğini' :
              lifePathNumber === 4 ? 'disiplinli olman ve sağlam temeller atman gerektiğini' :
              lifePathNumber === 5 ? 'özgürlüğüne sahip çıkman ve değişime açık olman gerektiğini' :
              lifePathNumber === 6 ? 'sorumluluk almanın ve sevdiklerine odaklanmanın vaktini' :
              lifePathNumber === 7 ? 'içsel yolculuğuna çıkman ve derinleşmen gerektiğini' :
              lifePathNumber === 8 ? 'gücünü eline alman ve bolluğu kucaklaman gerektiğini' :
              lifePathNumber === 9 ? 'tamamlanma sürecinde olduğunu ve şifalanman gerektiğini' :
              lifePathNumber === 11 ? 'sezgilerine güvenmen ve ilham vermen gerektiğini' :
              'büyük vizyonlar kurman ve insanlığa hizmet etmen gerektiğini'
            } fısıldıyor.
          </p>
        </div>
        <p className="pt-4 border-t border-white/5 text-[#d4af37] font-bold italic">
          Günün Tavsiyesi: {zodiac.element === 'Ateş' ? 'Cesaretini topla ve harekete geç.' : 
                           zodiac.element === 'Su' ? 'Duygularının sesini dinle ve akışta kal.' : 
                           zodiac.element === 'Toprak' ? 'Sabırlı ol ve temellerini sağlamlaştır.' : 
                           'Zihnini özgür bırak ve yeni fikirlere açık ol.'}
        </p>
      </div>
    );
  }, [selectedCards, zodiac, userData.name, readingType, lifePathNumber]);

  // Save to history when reading is revealed
  useEffect(() => {
    if (revealed && screen === 'reading' && selectedCards.length === 3 && localReading) {
      const textContent = `Sevgili ${userData.name}, bu fal senin için özel olarak yorumlandı.`;
      saveReading(selectedCards, textContent);
    }
  }, [revealed]);

  return (
    <div className="min-h-screen bg-[#050208] text-[#f3e8ff] font-serif selection:bg-[#d4af37]/30 overflow-x-hidden">
      <StarDust />
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#2e1065] blur-[150px] opacity-30" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#7e22ce] blur-[180px] opacity-20" />
        <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] rounded-full bg-[#d4af37] blur-[200px] opacity-5" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        {/* Navigation Bar */}
        <div className="fixed top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl z-50">
          <button 
            onClick={() => setScreen('landing')}
            className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${screen === 'landing' ? 'bg-[#d4af37] text-[#1a0b2e]' : 'text-[#d4af37]/60 hover:text-[#d4af37]'}`}
          >
            Ana Sayfa
          </button>
          <button 
            onClick={() => setScreen('history')}
            className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${screen === 'history' ? 'bg-[#d4af37] text-[#1a0b2e]' : 'text-[#d4af37]/60 hover:text-[#d4af37]'}`}
          >
            Geçmiş
          </button>
          <button 
            onClick={() => setScreen('library')}
            className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${screen === 'library' ? 'bg-[#d4af37] text-[#1a0b2e]' : 'text-[#d4af37]/60 hover:text-[#d4af37]'}`}
          >
            Kütüphane
          </button>
        </div>

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

              <form onSubmit={handleStart} className="space-y-6">
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

                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37]/50 ml-1 font-bold">Açılım Türü</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'general', icon: Sparkles, label: 'Genel' },
                      { id: 'love', icon: Heart, label: 'Aşk' },
                      { id: 'career', icon: Briefcase, label: 'İş' }
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setReadingType(type.id as ReadingType)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                          readingType === type.id 
                            ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]' 
                            : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                        }`}
                      >
                        <type.icon className="w-5 h-5" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">{type.label}</span>
                      </button>
                    ))}
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

          {screen === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl w-full"
            >
              <div className="text-center mb-12">
                <History className="w-12 h-12 text-[#d4af37] mx-auto mb-4" />
                <h2 className="text-4xl font-bold text-[#d4af37]">Geçmiş Kehanetler</h2>
                <p className="text-white/40 mt-2">Ruhunun daha önce geçtiği yollar...</p>
              </div>

              {history.length === 0 ? (
                <div className="text-center p-20 glass-panel rounded-[40px] border border-white/10">
                  <p className="text-white/20 italic">Henüz bir kehanet kaydedilmedi.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {history.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -5 }}
                      onClick={() => setSelectedHistoryItem(item)}
                      className="glass-panel p-6 rounded-3xl border border-white/10 cursor-pointer group relative"
                    >
                      <button 
                        onClick={(e) => deleteHistoryItem(item.id, e)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 flex items-center justify-center">
                          {item.readingType === 'love' ? <Heart className="w-6 h-6 text-[#d4af37]" /> : 
                           item.readingType === 'career' ? <Briefcase className="w-6 h-6 text-[#d4af37]" /> : 
                           <Sparkles className="w-6 h-6 text-[#d4af37]" />}
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold">{item.readingType === 'love' ? 'Aşk Falı' : item.readingType === 'career' ? 'İş Falı' : 'Genel Fal'}</p>
                          <p className="text-white/40 text-xs">{item.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mb-4">
                        {item.cards.map((card, i) => (
                          <div key={i} className="w-10 h-14 rounded-lg overflow-hidden border border-white/10">
                            <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                      <p className="text-white/60 text-sm line-clamp-2 italic">"{item.cards.map(c => c.name).join(', ')}"</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {screen === 'library' && (
            <motion.div
              key="library"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl w-full"
            >
              <div className="text-center mb-12">
                <BookOpen className="w-12 h-12 text-[#d4af37] mx-auto mb-4" />
                <h2 className="text-4xl font-bold text-[#d4af37]">Bilgelik Kütüphanesi</h2>
                <p className="text-white/40 mt-2">Kadim sembollerin derin anlamları...</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {tarotCards.map((card) => (
                  <motion.div
                    key={card.id}
                    whileHover={{ y: -10 }}
                    className="glass-panel p-4 rounded-3xl border border-white/10 group"
                  >
                    <div className="aspect-[2/3] rounded-2xl overflow-hidden mb-4 border border-white/5">
                      <img src={card.image} alt={card.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <h4 className="text-[#d4af37] font-bold text-sm mb-1">{card.name}</h4>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest leading-tight">{card.meaning}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {selectedHistoryItem && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050208]/90 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full glass-panel p-10 rounded-[48px] border border-[#d4af37]/30 relative max-h-[90vh] overflow-y-auto"
              >
                <button 
                  onClick={() => setSelectedHistoryItem(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="text-center mb-8">
                  <p className="text-[10px] uppercase tracking-[0.5em] text-[#d4af37] font-black mb-2">{selectedHistoryItem.date}</p>
                  <h3 className="text-3xl font-bold text-white">Geçmiş Kehanet</h3>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {selectedHistoryItem.cards.map((card, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 mb-2">
                        <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-[10px] text-[#d4af37] font-bold uppercase text-center">{card.name}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-4 text-white/70 italic text-lg leading-relaxed text-center">
                  <p>{selectedHistoryItem.interpretation}</p>
                  <p className="text-sm text-white/40 mt-6">Bu kehanet ruhunun o anki enerjisini yansıtmaktadır.</p>
                </div>
              </motion.div>
            </div>
          )}

          {screen === 'shuffling' && (
            <motion.div
              key="shuffling"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="relative w-64 h-96 mx-auto mb-12">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      rotate: [i * 10, i * 10 + 360],
                      x: [0, Math.sin(i) * 50, 0],
                      y: [0, Math.cos(i) * 50, 0],
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: i * 0.2
                    }}
                    className="absolute inset-0 bg-[#1a0b2e] border-2 border-[#d4af37]/20 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.1)]"
                  >
                    <div className="w-full h-full border border-[#d4af37]/5 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-[#d4af37]/10" />
                    </div>
                  </motion.div>
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-[#d4af37] font-bold uppercase tracking-[0.5em] text-xs"
                  >
                    Karıştırılıyor...
                  </motion.div>
                </div>
              </div>
              <h2 className="text-3xl font-light italic text-[#d4af37] mb-4">Enerjin Kartlara Aktarılıyor</h2>
              <p className="text-white/40 max-w-xs mx-auto">Zihnini boşalt ve sadece niyetine odaklan. Evren senin için hazırlanıyor.</p>
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
                  
                  <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap items-center justify-center gap-6">
                    <button
                      onClick={reset}
                      className="inline-flex items-center gap-3 text-[#d4af37] hover:text-white transition-all uppercase tracking-[0.3em] text-[10px] font-black group"
                    >
                      <RotateCcw className="w-4 h-4 group-hover:rotate-[-180deg] transition-transform duration-700" />
                      Yeni Bir Yolculuğa Başla
                    </button>
                    <button
                      onClick={handleShare}
                      className="inline-flex items-center gap-3 text-[#d4af37] hover:text-white transition-all uppercase tracking-[0.3em] text-[10px] font-black group"
                    >
                      {isCopying ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                      {isCopying ? 'Kopyalandı!' : 'Kehaneti Paylaş'}
                    </button>
                    <button
                      onClick={() => setScreen('history')}
                      className="inline-flex items-center gap-3 text-white/40 hover:text-[#d4af37] transition-all uppercase tracking-[0.3em] text-[10px] font-black group"
                    >
                      <History className="w-4 h-4" />
                      Geçmişe Göz At
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
