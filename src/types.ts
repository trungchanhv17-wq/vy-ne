export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  streak: number;
  lastActive: number; // timestamp
  wordsMastered: number;
}

export interface Lesson {
  id: string;
  title: string;
  topic: string;
  level: string;
  content: string; // Markdown
  vocabulary: Word[];
}

export interface Word {
  german: string;
  vietnamese: string;
  example: string;
  level: string;
}

export interface UserWord {
  german: string;
  vietnamese: string;
  example: string;
  mastered: boolean;
  nextReview: number; // timestamp
  easeFactor: number;
  interval: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}
