export type QuizPhase = 
  | "grid"           // 6x5グリッド表示
  | "opening"        // 問題番号表示（Q1, Q2...）
  | "question"       // 問題PDF表示
  | "answer-label"   // "Answer"文字表示
  | "answer"         // 答えPDF表示

export interface QuizState {
  currentQuestion: number | null
  phase: QuizPhase
  usedQuestions: number[]
  timerComplete: boolean
}
