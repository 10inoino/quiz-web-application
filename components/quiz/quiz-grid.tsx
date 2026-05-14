"use client"

import { cn } from "@/lib/utils"
import { playQuizStartSound } from "@/lib/sounds"
import { QUIZ_CONFIG } from "@/lib/config"

interface QuizGridProps {
  /** サーバーサイドで取得した問題番号の一覧 */
  questions: number[]
  usedQuestions: number[]
  onSelectQuestion: (questionNumber: number) => void
  onReset: () => void
}

export function QuizGrid({ questions, usedQuestions, onSelectQuestion, onReset }: QuizGridProps) {

  return (
    <div className="h-screen w-screen bg-background p-4 flex flex-col items-center justify-center gap-4">
      <div
        className="grid gap-2 w-full h-full max-w-[1600px] max-h-[850px]"
        style={{
          gridTemplateColumns: `repeat(${QUIZ_CONFIG.GRID_COLS}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${QUIZ_CONFIG.GRID_ROWS}, minmax(0, 1fr))`,
        }}
      >
        {questions.map((num) => {
          const isUsed = usedQuestions.includes(num)
          return (
            <button
              key={num}
              onClick={() => {
                if (!isUsed) {
                  playQuizStartSound()
                  onSelectQuestion(num)
                }
              }}
              disabled={isUsed}
              className={cn(
                "relative flex items-center justify-center rounded-lg text-4xl md:text-5xl lg:text-6xl font-bold transition-all duration-300",
                isUsed
                  ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                  : "bg-blue-800 text-white hover:bg-blue-700 hover:scale-105 hover:shadow-xl cursor-pointer active:scale-95"
              )}
            >
              {num}
            </button>
          )
        })}
      </div>
      <button
        onClick={onReset}
        className="px-4 py-2 bg-sky-200 hover:bg-sky-300 text-sky-700 text-sm rounded-md transition-colors"
      >
        リセット
      </button>
    </div>
  )
}
