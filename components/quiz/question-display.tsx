"use client"

import { useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { TimerBar } from "./timer-bar"

const PdfViewer = dynamic(() => import("./pdf-viewer").then((m) => m.PdfViewer), { ssr: false })
import type { QuizPhase } from "@/types/quiz"
import { playQuestionSound, stopTimerSound, playAnswerRevealSound } from "@/lib/sounds"
import { QUIZ_CONFIG } from "@/lib/config"

interface QuestionDisplayProps {
  questionNumber: number
  phase: QuizPhase
  onNextPhase: () => void
  onTimerComplete: () => void
  timerComplete: boolean
}

export function QuestionDisplay({
  questionNumber,
  phase,
  onNextPhase,
  onTimerComplete,
  timerComplete,
}: QuestionDisplayProps) {
  const hasPlayedQuestionSound = useRef(false)
  const hasPlayedAnswerSound = useRef(false)

  // 問題表示時に効果音を再生
  useEffect(() => {
    if (phase === "question" && !hasPlayedQuestionSound.current) {
      playQuestionSound()
      hasPlayedQuestionSound.current = true
    }
    if (phase === "answer-label" && !hasPlayedAnswerSound.current) {
      stopTimerSound()
      playAnswerRevealSound()
      hasPlayedAnswerSound.current = true
    }
    // openingフェーズに戻ったらリセット
    if (phase === "opening") {
      hasPlayedQuestionSound.current = false
      hasPlayedAnswerSound.current = false
    }
  }, [phase])

  // コンポーネントのアンマウント時にタイマー音を停止
  useEffect(() => {
    return () => {
      stopTimerSound()
    }
  }, [])

  const handleClick = () => {
    // クリックで次のフェーズへ進む
    onNextPhase()
  }

  return (
    <div
      onClick={handleClick}
      className="h-screen w-screen flex flex-col items-center justify-center bg-background cursor-pointer relative overflow-hidden"
    >
      {/* タイマーバー */}
      <TimerBar
        duration={QUIZ_CONFIG.ANSWER_DURATION_SECONDS}
        delay={QUIZ_CONFIG.TIMER_DELAY_SECONDS}
        onComplete={onTimerComplete}
        isActive={phase === "question" && !timerComplete}
      />

      {/* コンテンツ */}
      <div className="flex-1 flex items-center justify-center w-full p-8">
        {phase === "opening" && (
          <div className="animate-in zoom-in-50 duration-700">
            <h1 className="text-[20vw] font-black text-primary tracking-tight">
              Q{questionNumber}
            </h1>
          </div>
        )}

        {phase === "question" && (
          <div className="w-full h-full flex items-center justify-center">
            <PdfViewer
              src={`/questions/${questionNumber}/question.pdf`}
              className="w-full h-full"
            />
          </div>
        )}

        {phase === "answer-label" && (
          <div className="animate-in zoom-in-50 duration-700">
            <h1 className="text-[15vw] font-black text-primary tracking-tight">
              Answer
            </h1>
          </div>
        )}

        {phase === "answer" && (
          <div className="w-full h-full flex items-center justify-center">
            <PdfViewer
              src={`/questions/${questionNumber}/answer.pdf`}
              className="w-full h-full"
            />
          </div>
        )}
      </div>

      {/* 下部のヒント */}
      <div className="absolute bottom-8 text-muted-foreground text-sm">
        <span>クリックで次へ</span>
      </div>
    </div>
  )
}
