"use client"

import { useEffect, useState, useRef } from "react"
import { playTimerSound, playTimerFastSound, stopTimerSound, stopNormalTimerSound, playTimeUpSound } from "@/lib/sounds"
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
  const hasPlayedFastSound = useRef(false)
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
      hasPlayedFastSound.current = false
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

    // タイマー開始時に効果音を再生
    if (!hasPlayedTimerSound.current) {
      playTimerSound()
      hasPlayedTimerSound.current = true
    }

    const intervalMs = 100 // 100msごとに更新
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

  // 経過秒数カウント（別のuseEffectで管理）
  useEffect(() => {
    if (!started || !isActive) return

    const secondsTimer = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1
        console.log("[v0] elapsedSeconds:", next)
        return next
      })
    }, 1000)

    return () => clearInterval(secondsTimer)
  }, [started, isActive])

  // しきい値秒数を経過したら倍速タイマー音に切り替え
  useEffect(() => {
    if (started && elapsedSeconds >= QUIZ_CONFIG.FAST_TIMER_THRESHOLD_SECONDS && !hasPlayedFastSound.current) {
      console.log("[v0] Switching to fast timer sound")
      stopNormalTimerSound()
      playTimerFastSound()
      hasPlayedFastSound.current = true
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
