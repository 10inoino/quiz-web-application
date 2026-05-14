import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import fs from 'fs'
import path from 'path'

const QUESTIONS_DIR = './public/questions'

async function generatePDF(text, fontSize = 72) {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([800, 600])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  
  const textWidth = font.widthOfTextAtSize(text, fontSize)
  const textHeight = fontSize
  
  page.drawText(text, {
    x: (800 - textWidth) / 2,
    y: (600 - textHeight) / 2 + textHeight / 4,
    size: fontSize,
    font,
    color: rgb(0.1, 0.1, 0.1),
  })
  
  return await pdfDoc.save()
}

async function main() {
  console.log('Generating test PDFs...')
  
  for (let i = 1; i <= 30; i++) {
    const dir = path.join(QUESTIONS_DIR, String(i))
    
    // ディレクトリが存在しない場合は作成
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    // Question PDF
    const questionPdf = await generatePDF(`Question ${i}`, 64)
    fs.writeFileSync(path.join(dir, 'question.pdf'), questionPdf)
    
    // Answer PDF
    const answerPdf = await generatePDF(`Answer ${i}`, 64)
    fs.writeFileSync(path.join(dir, 'answer.pdf'), answerPdf)
    
    console.log(`Created PDFs for question ${i}`)
  }
  
  console.log('Done! All test PDFs generated.')
}

main().catch(console.error)
