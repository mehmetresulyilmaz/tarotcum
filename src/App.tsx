/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { tarotCards, TarotCard } from './tarotData';
import { Sparkles, History, BookOpen, X, Trash2, Share2, Check, ChevronRight, RotateCcw, Home, Menu, Moon, Sun, Star, MessageCircle } from 'lucide-react';

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
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Theme detection and handling
  useEffect(() => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const savedTheme = localStorage.getItem('tarot_theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('tarot_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Subtle Star Background
  const StarField = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40 dark:opacity-100">
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            opacity: Math.random() * 0.2,
            scale: Math.random() * 0.2 + 0.1
          }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-1 h-1 bg-accent rounded-full"
        />
      ))}
    </div>
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  useEffect(() => {
    const saved = localStorage.getItem('tarot_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { console.error("History load error", e); }
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
    const updatedHistory = [newReading, ...history].slice(0, 20);
    setHistory(updatedHistory);
    localStorage.setItem('tarot_history', JSON.stringify(updatedHistory));
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('tarot_history', JSON.stringify(updated));
  };

  const clearHistory = () => {
    if (window.confirm("Tüm geçmişi silmek istediğinize emin misiniz?")) {
      setHistory([]);
      localStorage.removeItem('tarot_history');
    }
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
      }, 2500);
    }
  };

  const handleShare = async () => {
    const text = `Mistik Kehanet'te fal baktırdım! 🌟\n\nKartlarım: ${selectedCards.map(c => c.name).join(', ')}\n\n${readingText}\n\nSen de kaderini öğrenmek ister misin?`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Mistik Kehanet Tarot Falı', text: text, url: window.location.href }); } catch (err) { console.log('Sharing failed', err); }
    } else {
      navigator.clipboard.writeText(text + "\n\n" + window.location.href);
      setIsCopying(true);
      setTimeout(() => setIsCopying(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    const text = `Mistik Kehanet'te fal baktırdım! 🌟\n\nKartlarım: ${selectedCards.map(c => c.name).join(', ')}\n\n${readingText}\n\nSen de kaderini öğrenmek ister misin?\n\n${window.location.href}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCardSelect = (card: TarotCard) => {
    if (selectedCards.length < 3 && !selectedCards.find(c => c.id === card.id)) {
      const newSelection = [...selectedCards, card];
      setSelectedCards(newSelection);
      if (newSelection.length === 3) {
        setTimeout(() => {
          setScreen('reading');
          setTimeout(() => setRevealed(true), 500);
        }, 600);
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

  const readingText = useMemo(() => {
    if (selectedCards.length < 3 || !zodiac) return "";
    const [c1, c2, c3] = selectedCards;
    return `Sevgili ${userData.name},\n\nGök kubbenin altında, ${zodiac.name} burcunun ${zodiac.element} elementinden gelen kadim bir enerjiyle sarmalanmış durumdasın. Geçmişin derinliklerinde yankılanan ${c1.name}, bugünkü ${c2.name} durumunun tohumlarını ekmiş.\n\nŞu anki kozmik frekansın, ${c2.meaning} temasını hayatının merkezine alıyor. ${zodiac.element} elementinin dengeleyici gücüyle, içsel pusulanı yeniden ayarlama vaktin geldi.\n\nGeleceğin ufkunda parlayan ${c3.name}, sana yepyeni bir kader yolu çiziyor. Hayat Yolu sayın olan ${lifePathNumber} ile uyumlu bir şekilde, yıldızlar senin için büyük bir dönüşümü müjdeliyor.`;
  }, [selectedCards, zodiac, userData.name, lifePathNumber]);

  const localReading = useMemo(() => {
    if (selectedCards.length < 3 || !zodiac) return null;
    const [c1, c2, c3] = selectedCards;
    return (
      <div className="space-y-6 text-text-bright/80 text-sm leading-relaxed font-light">
        <p className="text-lg font-serif text-accent italic">Sevgili {userData.name},</p>
        <p>
          Gök kubbenin altında, {zodiac.name} burcunun {zodiac.element} elementinden gelen kadim bir enerjiyle sarmalanmış durumdasın. 
          Geçmişin derinliklerinde yankılanan <span className="text-accent font-medium">{c1.name}</span>, bugünkü <span className="text-accent font-medium">{c2.name}</span> durumunun tohumlarını ekmiş.
        </p>
        <p>
          Şu anki kozmik frekansın, {c2.meaning} temasını hayatının merkezine alıyor. {zodiac.element} elementinin dengeleyici gücüyle, 
          içsel pusulanı yeniden ayarlama vaktin geldi.
        </p>
        <p>
          Geleceğin ufkunda parlayan <span className="text-accent font-medium">{c3.name}</span>, sana yepyeni bir kader yolu çiziyor. 
          Hayat Yolu sayın olan <span className="text-accent font-medium">{lifePathNumber}</span> ile uyumlu bir şekilde, 
          yıldızlar senin için büyük bir dönüşümü müjdeliyor.
        </p>
        <div className="pt-6 border-t border-border italic text-xs text-text-dim">
          "Kader, yıldızların arasında yazılıdır; ancak onu okumak senin ruhunun bilgeliğidir."
        </div>
      </div>
    );
  }, [selectedCards, zodiac, userData.name, readingType, lifePathNumber]);

  useEffect(() => {
    if (revealed && screen === 'reading' && selectedCards.length === 3 && localReading) {
      saveReading(selectedCards, `Sevgili ${userData.name}, bu fal senin için özel olarak yorumlandı.`);
    }
  }, [revealed]);

  const NavItem = ({ id, icon: Icon, label }: { id: Screen, icon: any, label: string }) => (
    <button
      onClick={() => setScreen(id)}
      className={`flex flex-col items-center gap-1 transition-all ${
        screen === id ? 'text-accent' : 'text-text-dim hover:text-accent/60'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-[9px] uppercase tracking-wider font-semibold">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-bg text-text-bright font-sans selection:bg-accent/20 overflow-x-hidden pb-24 md:pb-0">
      <StarField />
      
      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 left-0 w-full h-16 items-center justify-between px-12 z-50 bg-bg/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3 cursor-pointer" onClick={reset}>
          <Moon className="w-5 h-5 text-accent" />
          <div className="text-lg font-serif font-bold tracking-widest text-accent">Mistik Kehanet</div>
        </div>
        <nav className="flex items-center gap-8">
          <button onClick={() => setScreen('landing')} className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-all ${screen === 'landing' ? 'text-accent' : 'text-text-dim hover:text-accent'}`}>Kehanet</button>
          <button onClick={() => setScreen('history')} className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-all ${screen === 'history' ? 'text-accent' : 'text-text-dim hover:text-accent'}`}>Geçmiş</button>
          <button onClick={() => setScreen('library')} className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-all ${screen === 'library' ? 'text-accent' : 'text-text-dim hover:text-accent'}`}>Kütüphane</button>
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface transition-colors text-text-dim hover:text-accent">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </nav>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-bg/90 backdrop-blur-md border-t border-border z-50 flex items-center justify-around px-4">
        <NavItem id="landing" icon={Sparkles} label="Kehanet" />
        <NavItem id="history" icon={History} label="Geçmiş" />
        <NavItem id="library" icon={BookOpen} label="Bilgi" />
        <button
          onClick={toggleTheme}
          className="flex flex-col items-center gap-1 text-text-dim hover:text-accent/60 transition-all"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="text-[9px] uppercase tracking-wider font-semibold">{theme === 'dark' ? 'Gündüz' : 'Gece'}</span>
        </button>
      </nav>

      <main className="relative z-10 pt-16 md:pt-32 px-6 md:px-12 max-w-6xl mx-auto min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {screen === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col items-center justify-start md:justify-center text-center space-y-12 pt-8 md:pt-0"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <Moon className="w-10 h-10 text-accent mx-auto mb-6 opacity-60" />
                  <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-text-bright">
                    Kozmik <span className="italic text-accent">Rehberin</span>
                  </h1>
                </motion.div>
                <p className="text-text-dim text-base md:text-lg font-light italic max-w-md mx-auto leading-relaxed">
                  "Yıldızların kadim bilgeliğiyle ruhunun derinliklerine bir yolculuğa çık. Kaderin fısıltılarını dinleme vakti."
                </p>
              </div>

              <form onSubmit={handleStart} className="w-full max-w-sm card-minimal p-8 md:p-10 space-y-8">
                <div className="space-y-6">
                  <div className="text-left space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-accent font-bold ml-1">Ruhun Kimliği</label>
                    <input
                      required
                      type="text"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      placeholder="İsim ve Soyisim"
                      className="input-minimal w-full"
                    />
                  </div>
                  
                  <div className="text-left space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-accent font-bold ml-1">Kozmik Doğum</label>
                    <input
                      required
                      type="date"
                      value={userData.birthDate}
                      onChange={(e) => setUserData({ ...userData, birthDate: e.target.value })}
                      className="input-minimal w-full text-text-dim"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {['general', 'love', 'career'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setReadingType(type as ReadingType)}
                        className={`py-2.5 rounded-lg text-[9px] uppercase tracking-wider font-bold border transition-all ${
                          readingType === type 
                            ? 'bg-accent border-accent text-bg' 
                            : 'bg-transparent border-border text-text-dim hover:border-accent/30'
                        }`}
                      >
                        {type === 'general' ? 'Genel' : type === 'love' ? 'Aşk' : 'İş'}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 group">
                  Ritüeli Başlat
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </motion.div>
          )}

          {screen === 'shuffling' && (
            <motion.div
              key="shuffling"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-12"
            >
              <div className="relative w-40 h-60">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ rotate: [i * 10, i * 10 + 360], scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                    className="absolute inset-0 bg-surface border border-border rounded-xl flex items-center justify-center"
                  >
                    <Star className="w-6 h-6 text-accent/10" />
                  </motion.div>
                ))}
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-serif italic text-accent animate-pulse">Kartlar Karılıyor...</h2>
                <p className="text-text-dim text-sm font-light italic">"Enerjin evrenin frekansıyla uyumlanıyor."</p>
              </div>
            </motion.div>
          )}

          {screen === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12 py-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-serif font-bold">Kaderini <span className="italic text-accent">Belirle</span></h2>
                <div className="flex items-center justify-center gap-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 ${selectedCards.length >= i ? 'bg-accent scale-125' : 'bg-border'}`} />
                  ))}
                </div>
                <p className="text-text-dim text-[10px] uppercase tracking-widest font-bold">3 Kart Seçerek Ritüeli Tamamla</p>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
                {shuffledCards.map((card, idx) => {
                  const isSelected = selectedCards.find(c => c.id === card.id);
                  return (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      whileHover={!isSelected && selectedCards.length < 3 ? { y: -5 } : {}}
                      onClick={() => handleCardSelect(card)}
                      className={`aspect-[2/3] rounded-lg cursor-pointer relative overflow-hidden border transition-all duration-500 ${
                        isSelected ? 'border-accent opacity-30 scale-95' : 'border-border hover:border-accent/40 bg-surface/50'
                      }`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Moon className="w-4 h-4 text-accent/5" />
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
              className="space-y-12 pb-20"
            >
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Cards Section */}
                <div className="space-y-8">
                  <div className="grid grid-cols-3 gap-4">
                    {selectedCards.map((card, idx) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 20, rotateY: 180 }}
                        animate={revealed ? { opacity: 1, y: 0, rotateY: 0 } : {}}
                        transition={{ duration: 1, delay: idx * 0.3 }}
                        className="space-y-3"
                      >
                        <div className="aspect-[2/3] rounded-xl overflow-hidden border border-border shadow-lg relative group">
                          <img src={card.image} alt={card.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-40" />
                        </div>
                        <div className="text-center">
                          <p className="text-[9px] uppercase tracking-wider text-accent font-bold mb-1">
                            {idx === 0 ? 'Geçmiş' : idx === 1 ? 'Şimdi' : 'Gelecek'}
                          </p>
                          <h4 className="text-[10px] font-serif font-bold truncate">{card.name}</h4>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {revealed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="card-minimal p-6 space-y-5"
                    >
                      {selectedCards.map((card, idx) => (
                        <div key={idx} className="flex gap-4 items-start">
                          <div className="w-6 h-6 rounded-full border border-accent/30 flex items-center justify-center shrink-0 text-accent font-serif font-bold text-[10px]">
                            {idx + 1}
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-accent uppercase tracking-wider">{card.name}</p>
                            <p className="text-xs text-text-dim italic">"{card.interpretation}"</p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Interpretation Section */}
                <div className="space-y-8">
                  {revealed ? (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.5 }}
                      className="card-minimal p-8 md:p-10 space-y-8"
                    >
                      <div className="space-y-2">
                        <p className="text-[9px] uppercase tracking-[0.4em] text-accent font-bold">Kozmik Analiz</p>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">
                          Kaderin <span className="italic text-accent">Fısıltısı</span>
                        </h2>
                        <div className="w-10 h-[1px] bg-accent/40" />
                      </div>

                      <div className="prose prose-invert max-w-none">
                        {localReading}
                      </div>

                      <div className="pt-8 flex flex-wrap gap-3">
                        <button onClick={reset} className="btn-secondary flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4">
                          <RotateCcw className="w-4 h-4" /> Yeniden Başla
                        </button>
                        <button onClick={handleWhatsAppShare} className="btn-primary flex-1 min-w-[180px] flex items-center justify-center gap-2 bg-[#25D366] border-[#25D366] hover:bg-[#128C7E] hover:border-[#128C7E] text-white px-4">
                          <MessageCircle className="w-4 h-4" /> WhatsApp'ta Paylaş
                        </button>
                        <button onClick={handleShare} className="btn-secondary flex-1 min-w-[180px] flex items-center justify-center gap-2 px-4">
                          {isCopying ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />} {isCopying ? 'Kopyalandı' : 'Bağlantıyı Kopyala'}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-24 opacity-20">
                      <Sparkles className="w-10 h-10 text-accent animate-spin" />
                      <p className="text-lg font-serif italic">Gökler Okunuyor...</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {screen === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12 py-12"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="text-center md:text-left space-y-3">
                  <h2 className="text-4xl font-serif font-bold">Geçmiş <span className="italic text-accent">Kehanetler</span></h2>
                  <p className="text-text-dim text-sm italic font-light">"Kaderinin izlerini burada takip et."</p>
                </div>
                {history.length > 0 && (
                  <button 
                    onClick={clearHistory}
                    className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest font-bold text-red-500/60 hover:text-red-500 transition-colors py-2 px-4 border border-red-500/10 hover:border-red-500/30 rounded-lg"
                  >
                    <Trash2 className="w-3 h-3" />
                    Geçmişi Temizle
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="py-24 text-center card-minimal border-dashed">
                  <p className="text-text-dim/40 italic text-sm">Henüz bir kozmik iz bırakılmadı.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {history.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -4 }}
                      onClick={() => setSelectedHistoryItem(item)}
                      className="card-minimal p-6 cursor-pointer group relative overflow-hidden"
                    >
                      <button 
                        onClick={(e) => deleteHistoryItem(item.id, e)}
                        className="absolute top-4 right-4 p-1.5 rounded-full bg-red-500/5 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          <p className="text-[9px] uppercase tracking-widest text-accent font-bold">
                            {item.readingType === 'love' ? 'Aşk' : item.readingType === 'career' ? 'İş' : 'Genel'}
                          </p>
                          <p className="text-[9px] text-text-dim font-mono">{item.date}</p>
                        </div>
                      </div>

                      <div className="flex -space-x-3 mb-4">
                        {item.cards.map((card, i) => (
                          <div key={i} className="w-10 h-16 rounded-lg overflow-hidden border border-bg shadow-lg">
                            <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>

                      <p className="text-text-dim text-[10px] italic line-clamp-1">
                        {item.cards.map(c => c.name).join(', ')}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {screen === 'library' && (
            <motion.div
              key="library"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12 py-12"
            >
              <div className="text-center space-y-3">
                <h2 className="text-4xl font-serif font-bold">Bilgelik <span className="italic text-accent">Kütüphanesi</span></h2>
                <p className="text-text-dim text-sm italic font-light">"Her sembol bir anahtar, her kart evrenin bir fısıltısıdır."</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {tarotCards.map((card) => (
                  <motion.div key={card.id} whileHover={{ y: -4 }} className="space-y-3 group">
                    <div className="aspect-[2/3] rounded-xl overflow-hidden border border-border shadow-lg">
                      <img src={card.image} alt={card.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                    <div className="text-center space-y-1">
                      <h4 className="text-text-bright font-serif text-xs font-bold group-hover:text-accent transition-colors">{card.name}</h4>
                      <p className="text-[8px] text-accent uppercase tracking-widest font-bold">{card.meaning}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {selectedHistoryItem && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bg/95 backdrop-blur-xl">
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl w-full card-minimal p-10 md:p-12 rounded-[40px] relative max-h-[90vh] overflow-y-auto"
              >
                <button onClick={() => setSelectedHistoryItem(null)} className="absolute top-8 right-8 p-2 rounded-full bg-surface text-text-dim hover:text-text-bright transition-all">
                  <X className="w-6 h-6" />
                </button>
                
                <div className="space-y-10">
                  <div className="text-center space-y-2">
                    <p className="text-accent text-[10px] uppercase tracking-widest font-bold">{selectedHistoryItem.date}</p>
                    <h3 className="text-3xl md:text-4xl font-serif font-bold">Geçmiş <span className="italic text-accent">Kehanet</span></h3>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {selectedHistoryItem.cards.map((card, i) => (
                      <div key={i} className="space-y-3">
                        <div className="aspect-[2/3] rounded-xl overflow-hidden border border-border">
                          <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[9px] text-accent font-bold uppercase text-center">{card.name}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8 border-t border-border text-text-bright/70 italic text-base leading-relaxed text-center max-w-2xl mx-auto font-light">
                    {selectedHistoryItem.interpretation}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 py-12 text-center text-text-dim/30 text-[10px] tracking-widest uppercase font-medium space-y-2">
        <p>&copy; {new Date().getFullYear()} Mistik Kehanet &bull; Kozmik Rehberlik</p>
        <p>
          Created by{" "}
          <a 
            href="https://fuzulimedya.netlify.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-accent hover:text-accent/80 transition-colors"
          >
            FuzuliMedya
          </a>
        </p>
      </footer>
    </div>
  );
}
