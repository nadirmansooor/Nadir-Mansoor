
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

export type MaterialType = 'past-papers' | 'quiz' | 'notes';

export interface Paper {
  id: number;
  title: string;
  isAvailable: boolean;
  totalQuestions: number;
  category?: 'competitive' | 'board';
  class?: string;
  board?: string;
  subject?: string;
  type?: MaterialType;
}

export interface QuizState {
  studentName: string;
  cnic: string;
  profilePicture: string | null;
  examCategory: 'competitive' | 'board' | null;
  studentClass: string | null;
  studentBoard: string | null;
  selectedSubject: string | null;
  selectedMaterialType: MaterialType | null;
  hasMultipleAttemptPermission: boolean;
  selectedPaperId: number | null;
  answers: Record<number, number | null>;
  isFinished: boolean;
  timeRemaining: number;
  isStarted: boolean;
}

export interface Result {
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  score: number;
  unattempted: number;
}
