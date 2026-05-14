"use client"

import { useEffect, useState, useCallback } from "react"
import { Maximize2, Minimize2 } from "lucide-react"
import { useQuiz } from "@/hooks/use-quiz"
import { QuizGrid } from "./quiz-grid"
import { QuestionDisplay } from "./question-display"

interface QuizAppProps {
  /** サーバーサイドで取得した問題番号の一覧 */
  questions: number[]
}

export function QuizApp({ questions }: QuizAppProps) {
  const {
    currentQuestion,
    phase,
    usedQuestions,
    timerComplete,
    selectQuestion,
    nextPhase,
    setTimerComplete,
    resetQuiz,
  } = useQuiz()

  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }, [])

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", onFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange)
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") toggleFullscreen()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [toggleFullscreen])

  return (
    <div className="relative">
      {/* グリッド表示 */}
      {phase === "grid" && (
        <QuizGrid
          questions={questions}
          usedQuestions={usedQuestions}
          onSelectQuestion={selectQuestion}
          onReset={resetQuiz}
        />
      )}

      {/* 問題表示 */}
      {phase !== "grid" && currentQuestion && (
        <QuestionDisplay
          questionNumber={currentQuestion}
          phase={phase}
          onNextPhase={nextPhase}
          onTimerComplete={setTimerComplete}
          timerComplete={timerComplete}
        />
      )}

      {/* 進捗表示（グリッド画面のみ表示） */}
      {phase === "grid" && (
        <div className="fixed bottom-4 left-4 text-muted-foreground text-sm">
          使用済み: {usedQuestions.length} / {questions.length}
        </div>
      )}

      {/* フルスクリーンボタン */}
      <button
        onClick={toggleFullscreen}
        className="fixed top-4 right-4 p-2 rounded-md bg-background/60 hover:bg-background/90 text-muted-foreground hover:text-foreground transition-colors z-50"
        title={isFullscreen ? "全画面解除 (F)" : "全画面表示 (F)"}
      >
        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
      </button>
    </div>
  )
}
