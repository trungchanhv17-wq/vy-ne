import React, { useState } from 'react';
import { useVocabulary } from '../hooks/useFirebase';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle2, RotateCcw, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Flashcards() {
  const { words, toggleMastered } = useVocabulary();
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentWord = words[index];

  const handleNext = () => {
    setIsFlipped(false);
    setIndex((prev) => (prev + 1) % words.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setIndex((prev) => (prev - 1 + words.length) % words.length);
  };

  if (words.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl shadow-sm">
        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
          <RotateCcw size={40} className="text-zinc-300" />
        </div>
        <h3 className="text-xl font-bold text-zinc-900 mb-2">Danh sách từ vựng trống</h3>
        <p className="text-zinc-500 max-w-md">Hãy đi tới phần "Bài học AI" để thêm từ vựng mới vào bộ sưu tập của bạn.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 h-full flex flex-col items-center justify-center max-w-2xl mx-auto">
      <header className="w-full flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900">Thẻ từ vựng</h2>
          <p className="text-zinc-500">Bạn đã lưu {words.length} từ vựng.</p>
        </div>
        <div className="text-zinc-400 font-mono text-sm">
          {index + 1} / {words.length}
        </div>
      </header>

      <div className="relative w-full h-[400px] perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, rotateY: -10 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 10 }}
            className="w-full h-full cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              className="relative w-full h-full preserve-3d"
            >
              {/* Front side */}
              <Card className="absolute inset-0 w-full h-full backface-hidden border-none shadow-xl rounded-[40px] flex flex-col items-center justify-center p-12 bg-white ring-1 ring-zinc-100">
                <Badge variant="outline" className="mb-8 border-zinc-200">Deutsch</Badge>
                <h3 className="text-5xl font-black text-zinc-900 mb-4">{currentWord.german}</h3>
                <button className="text-zinc-300 hover:text-zinc-900 transition-all">
                  <Volume2 size={24} />
                </button>
                <p className="absolute bottom-12 text-zinc-400 text-sm italic">Chạm để lật</p>
              </Card>

              {/* Back side */}
              <Card className="absolute inset-0 w-full h-full backface-hidden border-none shadow-xl rounded-[40px] flex flex-col items-center justify-center p-12 bg-zinc-900 text-white rotate-y-180">
                <Badge variant="outline" className="mb-8 border-white/20 text-white">Vietnamesisch</Badge>
                <h3 className="text-4xl font-bold mb-6 text-center">{currentWord.vietnamese}</h3>
                <div className="max-w-md text-center">
                  <p className="text-zinc-400 text-sm mb-1 uppercase tracking-widest font-semibold">Ví dụ</p>
                  <p className="text-zinc-200 italic">"{currentWord.example}"</p>
                </div>
                
                <div className="mt-12 flex gap-4">
                   <Button 
                    variant="outline" 
                    className={`rounded-xl border-white/20 hover:bg-white hover:text-zinc-900 transition-all ${currentWord.mastered ? 'bg-white text-zinc-900' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMastered(currentWord.german, !currentWord.mastered);
                    }}
                  >
                    <CheckCircle2 size={18} className="mr-2" />
                    {currentWord.mastered ? 'Đã thuộc' : 'Chưa thuộc'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-4 items-center">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handlePrev}
          className="h-14 w-14 rounded-2xl border-zinc-200 bg-white hover:bg-zinc-50"
        >
          <ChevronLeft />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleNext}
          className="h-14 w-14 rounded-2xl border-zinc-200 bg-white hover:bg-zinc-50"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
