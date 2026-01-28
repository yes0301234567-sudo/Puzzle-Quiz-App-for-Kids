export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export enum Operator {
  Add = '+',
  Subtract = '-',
  Multiply = '×',
  Divide = '÷',
}

export interface Puzzle {
  id: string;
  question: string;
  correctAnswer: number;
  options: number[];
  operator: Operator;
}

export interface GameStats {
  score: number;
  correctCount: number;
  incorrectCount: number;
  highScore: number;
}

export type ScreenName = 'HOME' | 'GAME' | 'SETTINGS' | 'RESULT';
