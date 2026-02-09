
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of options
  category: string;
}

export interface QuizState {
  studentName: string;
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
