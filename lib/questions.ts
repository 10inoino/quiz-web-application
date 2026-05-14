/**
 * 問題ディレクトリの読み取りとバリデーション（サーバー専用）
 *
 * このモジュールは Node.js の fs モジュールを使用するため、
 * サーバーコンポーネントまたは API ルートからのみ呼び出してください。
 * クライアントコンポーネント（"use client"）では使用できません。
 */
import fs from "fs"
import path from "path"
import { QUIZ_CONFIG } from "@/lib/config"

const QUESTIONS_DIR = path.join(process.cwd(), "public", "questions")

/**
 * public/questions/ 配下のディレクトリ名から問題番号一覧を取得する。
 * 数値として解釈できないディレクトリは無視する。
 *
 * @throws {Error} 問題数がグリッドのセル数（GRID_COLS × GRID_ROWS）を超えている場合
 * @returns 問題番号の昇順配列（例: [1, 2, 3, ...]）
 */
export function getQuestionNumbers(): number[] {
  const gridCapacity = QUIZ_CONFIG.GRID_COLS * QUIZ_CONFIG.GRID_ROWS

  const entries = fs.readdirSync(QUESTIONS_DIR, { withFileTypes: true })

  const questionNumbers = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => Number(entry.name))
    .filter((n) => Number.isInteger(n) && n > 0)
    .sort((a, b) => a - b)

  if (questionNumbers.length > gridCapacity) {
    throw new Error(
      `問題数（${questionNumbers.length}）がグリッドの最大収容数（${QUIZ_CONFIG.GRID_COLS} 列 × ${QUIZ_CONFIG.GRID_ROWS} 行 = ${gridCapacity}）を超えています。` +
        `lib/config.ts の GRID_COLS・GRID_ROWS を増やすか、問題ディレクトリの数を減らしてください。`
    )
  }

  return questionNumbers
}
