"use client"

import { useEffect, useState, useRef } from "react"
import { playTimerSound, playTimerFastSound, stopTimerSound, playTimeUpSound } from "@/lib/sounds"
import { QUIZ_CONFIG } from "@/lib/config"

interface TimerBarProps {
  duration: number // 秒
  delay: number // 開始までの遅延（秒）
  onComplete: () => void
  isActive: boolean
}

export function TimerBar({ duration, delay, onComplete, isActive }: TimerBarProps) {
  const [progress, setProgress] = useState(100)
  const [started, setStarted] = useState(false)
  const [delayRemaining, setDelayRemaining] = useState(delay)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const hasPlayedTimerSound = useRef(false)
  const currentSpeedRef = useRef<1 | 2>(1)
  const onCompleteRef = useRef(onComplete)

  // onCompleteの最新値を保持
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // リセット処理
  useEffect(() => {
    if (!isActive) {
      setProgress(100)
      setStarted(false)
      setDelayRemaining(delay)
      setElapsedSeconds(0)
      hasPlayedTimerSound.current = false
      currentSpeedRef.current = 1
      stopTimerSound()
    }
  }, [isActive, delay])

  // 遅延カウントダウン
  useEffect(() => {
    if (!isActive || delayRemaining <= 0) return

    const delayTimer = setInterval(() => {
      setDelayRemaining((prev) => {
        if (prev <= 1) {
          setStarted(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(delayTimer)
  }, [isActive, delayRemaining])

  // メインタイマー（プログレスバー）
  useEffect(() => {
    if (!started || !isActive) return

    if (!hasPlayedTimerSound.current) {
      playTimerSound()
      hasPlayedTimerSound.current = true
    }

    const intervalMs = 100
    const decrement = 100 / (duration * 10)
    let currentProgress = 100

    const timer = setInterval(() => {
      currentProgress -= decrement
      if (currentProgress <= 0) {
        currentProgress = 0
        clearInterval(timer)
        setProgress(0)
        stopTimerSound()
        playTimeUpSound()
        onCompleteRef.current()
      } else {
        setProgress(currentProgress)
      }
    }, intervalMs)

    return () => clearInterval(timer)
  }, [started, isActive, duration])

  // 経過秒数カウント
  useEffect(() => {
    if (!started || !isActive) return

    const secondsTimer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(secondsTimer)
  }, [started, isActive])

  // 経過秒数に応じてタイマー音ファイルを切り替え（等倍 → 2倍速 → 4倍速）
  useEffect(() => {
    if (!started) return

    if (elapsedSeconds >= QUIZ_CONFIG.TIMER_SPEED_2X_THRESHOLD_SECONDS && currentSpeedRef.current < 2) {
      playTimerFastSound()
      currentSpeedRef.current = 2
    }
  }, [started, elapsedSeconds])

  if (!isActive) return null

  return (
    <div className="absolute top-0 left-0 right-0 h-6 bg-muted overflow-hidden">
      <div
        className={`h-full transition-all duration-100 ease-linear ${
          started ? "bg-destructive" : "bg-primary"
        }`}
        style={{ width: `${started ? progress : 100}%` }}
      />
      {!started && delayRemaining > 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary-foreground">
          {delayRemaining}
        </div>
      )}
    </div>
  )
}
