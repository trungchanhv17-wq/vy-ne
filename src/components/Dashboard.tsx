import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Trophy, Flame, BookText, TrendingUp, ChevronRight, Languages, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function Dashboard({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const { profile } = useAuth();

  const stats = [
    { label: 'Chuỗi ngày', value: profile?.streak || 0, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Từ vựng', value: profile?.wordsMastered || 0, icon: BookText, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Trình độ', value: profile?.level || 'A1', icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Tiến độ tuần', value: '75%', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
  ];

  const quickActions = [
    { title: 'Dịch thuật AI', desc: 'Thử thách dịch câu Việt - Đức', icon: Languages, color: 'bg-blue-500', tab: 'translation' },
    { title: 'Bài học mới', desc: 'Tạo bài học theo chủ đề mới', icon: Sparkles, color: 'bg-indigo-500', tab: 'lessons' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <header>
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold text-zinc-900 mb-2"
        >
          Hallo, {profile?.displayName}! 👋
        </motion.h2>
        <p className="text-zinc-500 text-lg">Hôm nay bạn muốn học gì?</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-sm hover:shadow-md transition-all rounded-3xl overflow-hidden cursor-pointer" onClick={() => stat.label === 'Từ vựng' && setActiveTab('vocabulary')}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                      <Icon size={24} />
                    </div>
                    {typeof stat.value === 'number' && (
                      <span className="text-zinc-300">
                        <ChevronRight size={20} />
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-500 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-zinc-900">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {quickActions.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              onClick={() => setActiveTab(action.tab)}
              className="flex items-center gap-6 p-6 bg-white rounded-[32px] shadow-sm hover:shadow-md transition-all text-left border border-zinc-100 group"
            >
              <div className={`${action.color} p-4 rounded-2xl text-white shadow-lg rotate-3 group-hover:rotate-0 transition-transform`}>
                <Icon size={28} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-zinc-900 text-lg">{action.title}</h4>
                <p className="text-zinc-500 text-sm">{action.desc}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300 group-hover:text-zinc-900 transition-colors">
                <ChevronRight size={20} />
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl p-8 bg-white">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-zinc-900">Tiến trình trình độ {profile?.level}</h3>
              <p className="text-zinc-500">Bạn đã hoàn thành 64% chương trình</p>
            </div>
            <div className="text-right">
              <span className="text-4xl font-black text-zinc-100">01</span>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-zinc-600">Ngữ pháp</span>
                <span className="text-zinc-900">80%</span>
              </div>
              <Progress value={80} className="h-2 bg-zinc-100" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-zinc-600">Nghe & Nói</span>
                <span className="text-zinc-900">45%</span>
              </div>
              <Progress value={45} className="h-2 bg-zinc-100" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-zinc-600">Từ vựng</span>
                <span className="text-zinc-900">60%</span>
              </div>
              <Progress value={60} className="h-2 bg-zinc-100" />
            </div>
          </div>
        </Card>

        <Card className="border-none shadow-sm rounded-3xl p-8 bg-zinc-900 text-white flex flex-col justify-between">
          <div>
             <h3 className="text-2xl font-bold mb-2">Thách thức AI</h3>
             <p className="text-zinc-400 mb-6">Luyện tập nói tiếng Đức với gia sư AI của chúng tôi và nhận phản hồi ngay lập tức.</p>
          </div>
          <button className="w-full py-4 bg-white text-zinc-900 rounded-2xl font-bold hover:bg-zinc-100 transition-all">
            Bắt đầu trò chuyện
          </button>
        </Card>
      </div>
    </div>
  );
}
