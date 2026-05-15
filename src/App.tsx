import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { LessonView } from './components/LessonView';
import { TranslationPractice } from './components/TranslationPractice';
import { Flashcards } from './components/Flashcards';
import { Tutor } from './components/Tutor';
import { motion, AnimatePresence } from 'framer-motion';

function AppContent() {
  const { user, loading, signIn } = useAuth();
  const [activeTab, setActiveTab ] = React.useState('dashboard');

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-50 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-zinc-200 text-center"
        >
          <div className="w-20 h-20 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 shadow-lg">
            <span className="text-white text-4xl font-bold">DE</span>
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Deutsch Meister</h1>
          <p className="text-zinc-600 mb-8">Nâng tầm tiếng Đức của bạn với AI trợ giúp.</p>
          <button 
            onClick={signIn}
            className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-semibold hover:bg-zinc-800 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            Bắt đầu với Google
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
          {activeTab === 'lessons' && <LessonView />}
          {activeTab === 'translation' && <TranslationPractice />}
          {activeTab === 'vocabulary' && <Flashcards />}
          {activeTab === 'tutor' && <Tutor />}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
