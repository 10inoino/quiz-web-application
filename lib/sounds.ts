"use client"

// -------------------------
// AudioContext（シングルトン）
// -------------------------

let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  // ブラウザのAutoplay Policyで suspended になっている場合に再開
  if (audioContext.state === "suspended") {
    audioContext.resume()
  }
  return audioContext
}

// -------------------------
// AudioBuffer キャッシュ
// Web Audio API でループする音源はバッファとして保持し、
// AudioBufferSourceNode.loop = true で隙間なしループを実現する
// -------------------------

const audioBufferCache = new Map<string, AudioBuffer>()

async function loadAudioBuffer(url: string): Promise<AudioBuffer> {
  if (audioBufferCache.has(url)) {
    return audioBufferCache.get(url)!
  }
  const ctx = getAudioContext()
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
  audioBufferCache.set(url, audioBuffer)
  return audioBuffer
}

// 現在再生中のタイマーループ用ソースノード
let timerSource: AudioBufferSourceNode | null = null

// -------------------------
// 単発再生用（HTMLAudioElement）
// -------------------------

let quizStartAudio: HTMLAudioElement | null = null
let questionAudio: HTMLAudioElement | null = null
let answerAudio: HTMLAudioElement | null = null
let timeUpAudio: HTMLAudioElement | null = null

function getOrCreateAudio(
  ref: HTMLAudioElement | null,
  src: string
): HTMLAudioElement {
  if (!ref) {
    ref = new Audio(src)
  }
  return ref
}

// -------------------------
// 各効果音
// -------------------------

export function playQuizStartSound() {
  quizStartAudio = getOrCreateAudio(quizStartAudio, "/sounds/quiz-start.mp3")
  quizStartAudio.currentTime = 0
  quizStartAudio.play().catch(console.error)
}

export function playQuestionSound() {
  questionAudio = getOrCreateAudio(questionAudio, "/sounds/question.mp3")
  questionAudio.currentTime = 0
  questionAudio.play().catch(console.error)
}

export function playAnswerRevealSound() {
  answerAudio = getOrCreateAudio(answerAudio, "/sounds/answer.mp3")
  answerAudio.currentTime = 0
  answerAudio.play().catch(console.error)
}

export function playTimeUpSound() {
  timeUpAudio = getOrCreateAudio(timeUpAudio, "/sounds/timeup.mp3")
  timeUpAudio.currentTime = 0
  timeUpAudio.play().catch(console.error)
}

// -------------------------
// タイマー音（Web Audio API でシームレスループ）
// 速度ごとに別ファイルを使うことでピッチを保ったまま速度を切り替える。
//   timer.mp3     : 等倍速
//   timer-fast.mp3: 2倍速（同ピッチ）
//   timer-3x.mp3  : 3倍速（同ピッチ）
// AudioBufferSourceNode は一度しか start() できないため、
// 切り替え時は stop → 新しいノードで start する。
// -------------------------

async function startTimerLoop(url: string): Promise<void> {
  stopTimerSound()
  try {
    const ctx = getAudioContext()
    const buffer = await loadAudioBuffer(url)
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true
    source.connect(ctx.destination)
    source.start()
    timerSource = source
  } catch (err) {
    console.error("Failed to play timer sound:", err)
  }
}

export function playTimerSound() {
  startTimerLoop("/sounds/timer.mp3")
}

export function playTimerFastSound() {
  startTimerLoop("/sounds/timer-fast.mp3")
}


export function stopTimerSound() {
  if (timerSource) {
    try {
      timerSource.stop()
    } catch {
      // すでに停止済みの場合は無視
    }
    timerSource.disconnect()
    timerSource = null
  }
}

// 音声バッファの事前読み込み（任意・呼び出せばキャッシュを温める）
export function preloadSounds() {
  if (typeof window === "undefined") return
  loadAudioBuffer("/sounds/timer.mp3").catch(console.error)
  loadAudioBuffer("/sounds/timer-fast.mp3").catch(console.error)
}
