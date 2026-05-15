import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, setDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { UserWord, ChatMessage } from '../types';

export function useVocabulary() {
  const { user } = useAuth();
  const [words, setWords] = useState<UserWord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'users', user.uid, 'vocabulary'), orderBy('german'));
    const unsub = onSnapshot(q, (snapshot) => {
      const w: UserWord[] = [];
      snapshot.forEach(doc => w.push(doc.data() as UserWord));
      setWords(w);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const addWord = async (word: UserWord) => {
    if (!user) return;
    const wordId = word.german.toLowerCase().replace(/\s+/g, '-');
    await setDoc(doc(db, 'users', user.uid, 'vocabulary', wordId), word);
  };

  const toggleMastered = async (german: string, mastered: boolean) => {
    if (!user) return;
    const wordId = german.toLowerCase().replace(/\s+/g, '-');
    await setDoc(doc(db, 'users', user.uid, 'vocabulary', wordId), { mastered }, { merge: true });
  };

  return { words, loading, addWord, toggleMastered };
}

export function useChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'users', user.uid, 'messages'), orderBy('timestamp', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const m: ChatMessage[] = [];
      snapshot.forEach(doc => m.push(doc.data() as ChatMessage));
      setMessages(m);
    });
    return () => unsub();
  }, [user]);

  const sendMessage = async (m: ChatMessage) => {
    if (!user) return;
    const msgId = m.timestamp.toString();
    await setDoc(doc(db, 'users', user.uid, 'messages', msgId), m);
  };

  const clearChat = async () => {
    if (!user) return;
    // Note: In real app, we'd batch delete, but for simplified logic:
    // This is just a placeholder, users might want to keep history.
  };

  return { messages, sendMessage, clearChat };
}
