#!/usr/bin/env node
/**
 * split-quiz-pdf.mjs
 *
 * 使い方:
 *   npm run split-pdf
 *
 * 概要:
 *   プロジェクトルートの questions.pdf を読み込み、
 *   奇数ページを question.pdf、偶数ページを answer.pdf として
 *   public/questions/<問題番号>/ に振り分けます。
 *
 *   ページペア例（PDF が 10 ページの場合）:
 *     ページ 1（奇数） → public/questions/1/question.pdf
 *     ページ 2（偶数） → public/questions/1/answer.pdf
 *     ページ 3（奇数） → public/questions/2/question.pdf
 *     ページ 4（偶数） → public/questions/2/answer.pdf
 *     ...
 *
 *   前提:
 *     - プロジェクトルートに questions.pdf が存在すること
 *     - PDF の総ページ数は偶数であること（奇数の場合はエラー）
 *     - public/questions/ 配下の既存ディレクトリはすべて削除されます
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { PDFDocument } from "pdf-lib"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, "..")
const QUESTIONS_DIR = path.join(PROJECT_ROOT, "public", "questions")
const INPUT_PDF = path.join(PROJECT_ROOT, "questions.pdf")

async function main() {
  const resolvedInput = INPUT_PDF

  if (!fs.existsSync(resolvedInput)) {
    console.error(`エラー: プロジェクトルートに questions.pdf が見つかりません。`)
    console.error(`  期待するパス: ${resolvedInput}`)
    process.exit(1)
  }

  // PDF を読み込む
  const pdfBytes = fs.readFileSync(resolvedInput)
  const srcDoc = await PDFDocument.load(pdfBytes)
  const totalPages = srcDoc.getPageCount()

  console.log(`入力 PDF: ${resolvedInput}`)
  console.log(`総ページ数: ${totalPages}`)

  if (totalPages % 2 !== 0) {
    console.error(
      `エラー: PDF の総ページ数が奇数（${totalPages}）です。` +
        `奇数ページ=問題、偶数ページ=答え のペア構造を期待しています。`
    )
    process.exit(1)
  }

  const questionCount = totalPages / 2
  console.log(`問題数: ${questionCount}`)

  // public/questions/ 配下を一度クリア
  console.log(`\npublic/questions/ を初期化中...`)
  if (fs.existsSync(QUESTIONS_DIR)) {
    fs.rmSync(QUESTIONS_DIR, { recursive: true, force: true })
    console.log("  既存ディレクトリを削除しました。")
  }
  fs.mkdirSync(QUESTIONS_DIR, { recursive: true })

  // ページを振り分けて書き出す
  console.log(`\n各問題ディレクトリへの振り分けを開始...`)
  for (let i = 0; i < questionCount; i++) {
    const questionNumber = i + 1
    const questionPageIndex = i * 2       // 0-indexed: 奇数ページ（1, 3, 5...）
    const answerPageIndex = i * 2 + 1     // 0-indexed: 偶数ページ（2, 4, 6...）

    const dir = path.join(QUESTIONS_DIR, String(questionNumber))
    fs.mkdirSync(dir, { recursive: true })

    // question.pdf
    const questionDoc = await PDFDocument.create()
    const [questionPage] = await questionDoc.copyPages(srcDoc, [questionPageIndex])
    questionDoc.addPage(questionPage)
    fs.writeFileSync(
      path.join(dir, "question.pdf"),
      await questionDoc.save()
    )

    // answer.pdf
    const answerDoc = await PDFDocument.create()
    const [answerPage] = await answerDoc.copyPages(srcDoc, [answerPageIndex])
    answerDoc.addPage(answerPage)
    fs.writeFileSync(
      path.join(dir, "answer.pdf"),
      await answerDoc.save()
    )

    console.log(`  Q${questionNumber}: ページ ${questionPageIndex + 1} → question.pdf, ページ ${answerPageIndex + 1} → answer.pdf`)
  }

  console.log(`\n完了: ${questionCount} 問を public/questions/ に展開しました。`)
}

main().catch((err) => {
  console.error("予期しないエラーが発生しました:", err)
  process.exit(1)
})
