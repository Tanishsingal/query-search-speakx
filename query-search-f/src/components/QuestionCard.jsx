
import { Badge } from "./ui/Badge"
import { Card, CardHeader, CardContent } from "./ui/Card"

export function QuestionCard({ question }) {
  const getTypeColor = (type) => {
    switch (type) {
      case "ANAGRAM":
        return "bg-purple-500"
      case "MCQ":
        return "bg-blue-500"
      case "READ_ALONG":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const renderQuestionPreview = () => {
    switch (question.type) {
      case "ANAGRAM":
        return (
          <div className="mt-2">
            <Badge variant="outline">{question.anagramType}</Badge>
            <div className="mt-2 flex flex-wrap gap-1">
              {question.blocks &&
                question.blocks.slice(0, 5).map((block, index) => (
                  <span key={index} className="inline-block bg-muted px-2 py-1 rounded text-sm">
                    {block.text}
                  </span>
                ))}
              {question.blocks && question.blocks.length > 5 && <span className="text-muted-foreground">...</span>}
            </div>
          </div>
        )
      case "MCQ":
        return (
          <div className="mt-2 space-y-1">
            {question.options &&
              question.options.slice(0, 2).map((option, index) => (
                <div key={index} className="text-sm text-muted-foreground">
                  • {option.text}
                </div>
              ))}
            {question.options && question.options.length > 2 && (
              <div className="text-sm text-muted-foreground">...</div>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Badge className={getTypeColor(question.type)}>{question.type}</Badge>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold">{question.title}</h3>
        {renderQuestionPreview()}
      </CardContent>
    </Card>
  )
}
