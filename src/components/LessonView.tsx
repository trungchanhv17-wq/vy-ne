import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useVocabulary } from '../hooks/useFirebase';
import { generateLesson } from '../services/gemini';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { BookOpen, Sparkles, Plus, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { type Word } from '../types';

export function LessonView() {
  const { profile } = useAuth();
  const { addWord } = useVocabulary();
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [lesson, setLesson] = useState<{ title: string; content: string; vocabulary: Word[] } | null>(null);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const data = await generateLesson(profile?.level || 'A1', topic);
      setLesson(data);
    } catch (error) {
      console.error('Failed to generate lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveWord = async (word: Word) => {
    await addWord({
      ...word,
      mastered: false,
      nextReview: Date.now() + 86400000,
      easeFactor: 2.5,
      interval: 1
    });
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900">Bài học AI</h2>
          <p className="text-zinc-500">Tạo bài học cá nhân hóa cho trình độ của bạn.</p>
        </div>
        <div className="flex items-center gap-2 max-w-md w-full">
          <Input 
            placeholder="Ví dụ: Giới thiệu bản thân, Đi chợ..." 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="rounded-2xl border-zinc-200"
          />
          <Button 
            onClick={handleGenerate} 
            disabled={loading || !topic}
            className="rounded-2xl bg-zinc-900 hover:bg-zinc-800"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Tạo
          </Button>
        </div>
      </header>

      {lesson ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
          <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl overflow-hidden flex flex-col bg-white">
            <CardHeader className="bg-zinc-900 text-white p-8">
              <CardTitle className="text-2xl font-bold">{lesson.title}</CardTitle>
              <Badge variant="secondary" className="w-fit bg-zinc-700 text-white border-none mt-2">
                Trình độ {profile?.level}
              </Badge>
            </CardHeader>
            <ScrollArea className="flex-1 p-8">
              <div className="prose prose-zinc max-w-none prose-headings:font-bold prose-p:text-zinc-600">
                <ReactMarkdown>{lesson.content}</ReactMarkdown>
              </div>
            </ScrollArea>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden flex flex-col bg-white">
            <CardHeader className="p-6 border-b border-zinc-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen size={20} className="text-zinc-500" />
                Từ vựng mới
              </CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                {lesson.vocabulary?.map((word, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-zinc-50 group hover:bg-zinc-100 transition-all border border-transparent hover:border-zinc-200">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-lg text-zinc-900">{word.german}</p>
                      <button 
                        onClick={() => saveWord(word)}
                        className="p-1.5 rounded-lg bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:text-blue-600"
                        title="Lưu từ vựng"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-zinc-600 mb-2">{word.vietnamese}</p>
                    <p className="text-xs italic text-zinc-400">"{word.example}"</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-dashed border-zinc-200">
          <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
            <BookOpen size={40} className="text-zinc-300" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">Chưa có bài học nào</h3>
          <p className="text-zinc-500 max-w-md">Nhập một chủ đề bạn quan tâm ở trên để AI tạo ra bài học tiếng Đức dành riêng cho bạn.</p>
        </div>
      )}
    </div>
  );
}
