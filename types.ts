
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

export interface Paper {
  id: number;
  title: string;
  isAvailable: boolean;
  totalQuestions: number;
}

export interface QuizState {
  studentName: string;
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
