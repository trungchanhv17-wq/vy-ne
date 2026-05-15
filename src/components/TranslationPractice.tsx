import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { checkTranslation } from '../services/gemini';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Languages, Send, Loader2, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function TranslationPractice() {
  const { profile } = useAuth();
  const [vietnamese, setVietnamese] = useState('');
  const [german, setGerman] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    status: 'correct' | 'partially_correct' | 'incorrect';
    feedback: string;
    correctVersion: string;
    explanation: string;
  } | null>(null);

  const handleCheck = async () => {
    if (!vietnamese || !german) return;
    setLoading(true);
    try {
      const data = await checkTranslation(vietnamese, german, profile?.level || 'A1');
      setResult(data);
    } catch (error) {
      console.error('Failed to check translation:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'correct': return <CheckCircle2 className="text-green-500" size={24} />;
      case 'partially_correct': return <AlertCircle className="text-yellow-500" size={24} />;
      case 'incorrect': return <XCircle className="text-red-500" size={24} />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'correct': return 'bg-green-50 border-green-200';
      case 'partially_correct': return 'bg-yellow-50 border-yellow-200';
      case 'incorrect': return 'bg-red-50 border-red-200';
      default: return 'bg-zinc-50 border-zinc-200';
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto h-full flex flex-col">
      <header>
        <h2 className="text-3xl font-bold text-zinc-900">Thử thách dịch thuật</h2>
        <p className="text-zinc-500">Viết một câu tiếng Việt và thử dịch sang tiếng Đức.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm rounded-3xl p-6 bg-white space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-semibold text-zinc-500 flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 uppercase">Tiếng Việt</Badge>
            </label>
            <textarea
              placeholder="Nhập câu tiếng Việt của bạn..."
              value={vietnamese}
              onChange={(e) => setVietnamese(e.target.value)}
              className="w-full min-h-[120px] p-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-zinc-900 transition-all resize-none text-zinc-900"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-zinc-500 flex items-center gap-2">
              <Badge variant="outline" className="bg-red-50 text-red-600 border-red-100 uppercase">Tiếng Đức</Badge>
            </label>
            <textarea
              placeholder="Dịch sang tiếng Đức ở đây..."
              value={german}
              onChange={(e) => setGerman(e.target.value)}
              className="w-full min-h-[120px] p-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-zinc-900 transition-all resize-none text-zinc-900 font-medium"
            />
          </div>

          <Button 
            onClick={handleCheck} 
            disabled={loading || !vietnamese || !german}
            className="w-full h-14 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-lg font-bold shadow-lg shadow-zinc-200"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Languages className="mr-2 h-5 w-5" />}
            Kiểm tra kết quả
          </Button>
        </Card>

        <ScrollArea className="h-full">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-8 rounded-[32px] border ${getStatusColor(result.status)} space-y-6`}
              >
                <div className="flex items-center justify-between">
                  {getStatusIcon(result.status)}
                  <Badge className="bg-white/50 text-zinc-900 border-none shadow-sm uppercase tracking-wider">
                    {result.status.replace('_', ' ')}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-1">Góp ý từ giáo viên:</h3>
                  <p className="text-zinc-700 leading-relaxed">{result.feedback}</p>
                </div>

                <div className="p-6 bg-white/40 rounded-2xl border border-white/60">
                  <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2">Phiên bản chính xác:</h3>
                  <p className="text-xl font-bold text-zinc-900">{result.correctVersion}</p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2">Giải thích:</h3>
                  <p className="text-zinc-600 text-sm leading-relaxed">{result.explanation}</p>
                </div>

                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setResult(null);
                    setVietnamese('');
                    setGerman('');
                  }}
                  className="w-full rounded-xl text-zinc-500"
                >
                  Thử câu khác
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-dashed border-zinc-200"
              >
                <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                  <Languages size={40} className="text-zinc-300" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Sẵn sàng sửa lỗi</h3>
                <p className="text-zinc-500 max-w-xs">AI sẽ giúp bạn sửa ngữ pháp, cách dùng từ và các lỗi nhỏ nhất trong câu dịch của bạn.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </div>
    </div>
  );
}
