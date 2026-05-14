"use client"

import { useState, useEffect, useCallback } from "react"
import type { QuizPhase, QuizState } from "@/types/quiz"

const STORAGE_KEY = "quiz-used-questions"

export function useQuiz() {
  const [state, setState] = useState<QuizState>({
    currentQuestion: null,
    phase: "grid",
    usedQuestions: [],
    timerComplete: false,
  })

  // ローカルストレージから使用済み問題を読み込み
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setState((prev) => ({ ...prev, usedQuestions: parsed }))
      } catch {
        // パースに失敗した場合は空配列を使用
      }
    }
  }, [])

  // 使用済み問題をローカルストレージに保存
  const saveUsedQuestions = useCallback((questions: number[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions))
  }, [])

  // 問題を選択
  const selectQuestion = useCallback((questionNumber: number) => {
    setState((prev) => ({
      ...prev,
      currentQuestion: questionNumber,
      phase: "opening",
      timerComplete: false,
    }))
  }, [])

  // 次のフェーズへ進む
  const nextPhase = useCallback(() => {
    setState((prev) => {
      const { phase, currentQuestion, usedQuestions, timerComplete } = prev

      switch (phase) {
        case "opening":
          return { ...prev, phase: "question" as QuizPhase }
        case "question":
          return { ...prev, phase: "answer-label" as QuizPhase }
        case "answer-label":
          return { ...prev, phase: "answer" as QuizPhase }
        case "answer":
          // 使用済み問題に追加してグリッドに戻る
          const newUsedQuestions = currentQuestion
            ? [...usedQuestions, currentQuestion]
            : usedQuestions
          saveUsedQuestions(newUsedQuestions)
          return {
            ...prev,
            phase: "grid" as QuizPhase,
            currentQuestion: null,
            usedQuestions: newUsedQuestions,
            timerComplete: false,
          }
        default:
          return prev
      }
    })
  }, [saveUsedQuestions])

  // タイマー完了を設定
  const setTimerComplete = useCallback(() => {
    setState((prev) => ({ ...prev, timerComplete: true }))
  }, [])

  // リセット
  const resetQuiz = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setState({
      currentQuestion: null,
      phase: "grid",
      usedQuestions: [],
      timerComplete: false,
    })
  }, [])

  return {
    ...state,
    selectQuestion,
    nextPhase,
    setTimerComplete,
    resetQuiz,
  }
}
