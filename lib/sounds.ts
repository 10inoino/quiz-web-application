"use client"

// 音声ファイルを使用した効果音

let quizStartAudio: HTMLAudioElement | null = null
let questionAudio: HTMLAudioElement | null = null
let timerAudio: HTMLAudioElement | null = null
let timerFastAudio: HTMLAudioElement | null = null
let answerAudio: HTMLAudioElement | null = null
let timeUpAudio: HTMLAudioElement | null = null

// 音声ファイルの事前読み込み
export function preloadSounds() {
  if (typeof window === "undefined") return
  
  quizStartAudio = new Audio("/sounds/quiz-start.mp3")
  questionAudio = new Audio("/sounds/question.mp3")
  timerAudio = new Audio("/sounds/timer.mp3")
  timerFastAudio = new Audio("/sounds/timer-fast.mp3")
  answerAudio = new Audio("/sounds/answer.mp3")
  timeUpAudio = new Audio("/sounds/timeup.mp3")
  
  // 事前読み込み
  quizStartAudio.load()
  questionAudio.load()
  timerAudio.load()
  timerFastAudio.load()
  answerAudio.load()
  timeUpAudio.load()
}

// グリッドクリック時の音（クイズ出題2）
export function playQuizStartSound() {
  if (!quizStartAudio) {
    quizStartAudio = new Audio("/sounds/quiz-start.mp3")
  }
  quizStartAudio.currentTime = 0
  quizStartAudio.play().catch(console.error)
}

// 問題PDF表示時の音（出題1）
export function playQuestionSound() {
  if (!questionAudio) {
    questionAudio = new Audio("/sounds/question.mp3")
  }
  questionAudio.currentTime = 0
  questionAudio.play().catch(console.error)
}

// タイマー音（25秒用 - ループ再生）
export function playTimerSound() {
  stopTimerSound()
  if (!timerAudio) {
    timerAudio = new Audio("/sounds/timer.mp3")
  }
  timerAudio.loop = true
  timerAudio.currentTime = 0
  timerAudio.play().catch(console.error)
}

// タイマー倍速音（最後5秒用 - ループ再生）
export function playTimerFastSound() {
  if (!timerFastAudio) {
    timerFastAudio = new Audio("/sounds/timer-fast.mp3")
  }
  timerFastAudio.loop = true
  timerFastAudio.currentTime = 0
  timerFastAudio.play().catch(console.error)
}

// 通常タイマー音のみ停止
export function stopNormalTimerSound() {
  if (timerAudio) {
    timerAudio.loop = false
    timerAudio.pause()
    timerAudio.currentTime = 0
  }
}

// タイマー音をすべて停止
export function stopTimerSound() {
  if (timerAudio) {
    timerAudio.loop = false
    timerAudio.pause()
    timerAudio.currentTime = 0
  }
  if (timerFastAudio) {
    timerFastAudio.loop = false
    timerFastAudio.pause()
    timerFastAudio.currentTime = 0
  }
}

// タイムアップ音
export function playTimeUpSound() {
  if (!timeUpAudio) {
    timeUpAudio = new Audio("/sounds/timeup.mp3")
  }
  timeUpAudio.currentTime = 0
  timeUpAudio.play().catch(console.error)
}

// Answer表示音（クイズ正解2）
export function playAnswerRevealSound() {
  if (!answerAudio) {
    answerAudio = new Audio("/sounds/answer.mp3")
  }
  answerAudio.currentTime = 0
  answerAudio.play().catch(console.error)
}
