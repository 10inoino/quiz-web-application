"use client"

import { useState, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"

// PDF.js workerの設定
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PdfViewerProps {
  src: string
  className?: string
  fallbackText?: string
}

export function PdfViewer({ src, className = "", fallbackText }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [windowHeight, setWindowHeight] = useState(800)

  useEffect(() => {
    setWindowHeight(window.innerHeight)
    const handleResize = () => setWindowHeight(window.innerHeight)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setError(null)
  }

  function onDocumentLoadError(err: Error) {
    console.error("[v0] PDF load error:", err)
    setError("PDFの読み込みに失敗しました")
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {error ? (
        <div className="flex flex-col items-center justify-center gap-4 p-8 bg-card rounded-2xl border shadow-lg">
          <div className="text-6xl">📄</div>
          {fallbackText ? (
            <div className="text-3xl font-bold text-foreground text-center max-w-[80vw]">
              {fallbackText}
            </div>
          ) : (
            <div className="text-muted-foreground text-lg text-center">
              PDFファイルを配置してください
              <br />
              <code className="text-sm bg-muted px-2 py-1 rounded mt-2 inline-block">
                {src}
              </code>
            </div>
          )}
        </div>
      ) : (
        <Document
          file={src}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="text-muted-foreground text-xl animate-pulse">読み込み中...</div>
          }
          className="flex items-center justify-center"
        >
          {numPages && (
            <Page
              pageNumber={1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="max-h-[95vh] w-auto"
              height={windowHeight * 0.95}
            />
          )}
        </Document>
      )}
    </div>
  )
}
