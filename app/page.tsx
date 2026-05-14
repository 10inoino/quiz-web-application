import { QuizApp } from "@/components/quiz/quiz-app"
import { getQuestionNumbers } from "@/lib/questions"

export default function Page() {
  const questions = getQuestionNumbers()
  return <QuizApp questions={questions} />
}
