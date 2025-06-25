"use client"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Cloud,
  MessageCircle,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Heart,
  Brain,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function EnneagramTestApp() {
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [scores, setScores] = useState({})
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState("")
  const [aiInsight, setAiInsight] = useState("")
  const [loadingAI, setLoadingAI] = useState(false)
  const [loadingError, setLoadingError] = useState(null)

  // Your specific Google Sheet ID
  const SHEET_ID = "12tgm-6KM1w5kUK_stJbLJCnwskiHZQIQTeYvPbmWtgQ"

  // Type mapping with Myanmar translations
  const typeMapping = {
    A: { type: "Type 9", name: "The Peacemaker", myanmar: "ငြိမ်းချမ်းမှုကို ဖန်တီးသူ" },
    B: { type: "Type 6", name: "The Loyalist", myanmar: "သစ္စာရှိသူ" },
    C: { type: "Type 3", name: "The Achiever", myanmar: "ဖြစ်မြောက်အောင် လုပ်နိုင်သူ" },
    D: { type: "Type 1", name: "The Perfectionist", myanmar: "ကောင်းတဲ့ဘက်ကို ပြောင်းလဲဖို့ စိတ်အားထက်သန်သူ" },
    E: { type: "Type 4", name: "The Individualist", myanmar: "ကိုယ့်စိတ်ကူးနဲ့ကိုယ် တမူထူးစွာ နေချင်သူ" },
    F: { type: "Type 2", name: "The Helper", myanmar: "ကူညီဖေးမသူ" },
    G: { type: "Type 8", name: "The Challenger", myanmar: "အခက်အခဲကို ရင်ဆိုင်ကျော်လွှားသူ" },
    H: { type: "Type 5", name: "The Investigator", myanmar: "စူးစမ်းလေ့လာသူ" },
    I: { type: "Type 7", name: "The Enthusiast", myanmar: "စိတ်ဝင်စားမှုများသူ တက်ကြွသူ" },
  }

  // Thought-provoking questions to help users reflect
  const reflectionPrompts = [
    "ဘယ်စာကြောင်းက မိတ်ဆွေရဲ့ နှလုံးသားထဲမှာ ပိုပြီး ပဲ့တင်ထပ်နေသလဲ?",
    "သင့်ရဲ့ အနီးဆုံး မိတ်ဆွေတွေက သင့်ကို ဘယ်လို မြင်မလဲ?",
    "စိတ်ဖိစီးမှု ရှိတဲ့အခါ သင် ဘယ်လို ပြုမူလေ့ရှိသလဲ?",
    "သင့်ရဲ့ အကောင်းဆုံး အချိန်တွေမှာ ဘယ် စာကြောင်းက ပိုမှန်သလဲ?",
    "ဘယ်စာကြောင်းက သင့်ရဲ့ အစစ်အမှန် ကိုယ်ရည်ကိုယ်သွေးကို ပိုဖော်ပြသလဲ?",
    "လူတွေနဲ့ ဆက်ဆံတဲ့အခါ ဘယ်စာကြောင်းက ပိုမှန်သလဲ?",
    "သင့်ရဲ့ အတွင်းစိတ်က ဘယ်စာကြောင်းကို ပိုရွေးချင်နေသလဲ?",
    "ဘယ်စာကြောင်းက သင့်ကို ပိုပြီး သက်တောင့်သက်သာ ခံစားစေသလဲ?",
  ]

  useEffect(() => {
    loadQuestionsFromGoogleSheet()
  }, [])

  // Get a random reflection prompt
  const getReflectionPrompt = () => {
    return reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)]
  }

  // Load questions directly from Google Sheet
  const loadQuestionsFromGoogleSheet = async () => {
    setLoading(true)
    setLoadingError(null)

    try {
      console.log("🎯 Loading questions from Google Sheet...")

      // Check URL parameters first
      const urlParams = new URLSearchParams(window.location.search)
      const sheetIdFromUrl = urlParams.get("sheetId")
      const sheetId = sheetIdFromUrl || SHEET_ID

      const response = await fetch(`/api/load-google-sheet?sheetId=${sheetId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log("✅ Success! Data received:", {
          questionCount: data.questions?.length || 0,
          title: data.title,
          loadedVia: data._loadedVia,
        })

        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions)
          setDataSource(`${data.title || "Enneagram Test"} (${data.questions.length} မေးခွန်း)`)

          // Store in localStorage for future use
          localStorage.setItem("enneagram-questions", JSON.stringify(data))
        } else {
          throw new Error("No questions found in the sheet")
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || "Failed to load from Google Sheets")
      }
    } catch (error) {
      console.error("❌ Failed to load from Google Sheets:", error)
      setLoadingError({
        message: error.message,
        suggestions: [
          "Google Sheet ကို publicly share လုပ်ထားရမယ် ('Anyone with the link can view')",
          "Sheet ID ကို မှန်မှန်ကန်ကန် စစ်ကြည့်ပါ",
          "Column headers တွေက: ID, Statement A, Statement B, Score A, Score B ဖြစ်ရမယ်",
          "Internet connection ကို စစ်ကြည့်ပါ",
        ],
      })
    }

    setLoading(false)
  }

  const handleAnswerSelect = (choice) => {
    const currentQuestion = questions[currentQuestionIndex]
    const selectedScore = choice === "A" ? currentQuestion.scoreA : currentQuestion.scoreB

    setAnswers({
      ...answers,
      [currentQuestion.id]: {
        choice,
        score: selectedScore,
      },
    })
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      calculateResults()
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const calculateResults = () => {
    const scoreCount = {}

    Object.values(answers).forEach((answer) => {
      scoreCount[answer.score] = (scoreCount[answer.score] || 0) + 1
    })

    setScores(scoreCount)
    setShowResults(true)
  }

  const getTopThreeTypes = () => {
    const sortedScores = Object.entries(scores)
      .map(([letter, count]) => ({
        letter,
        count,
        ...typeMapping[letter],
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)

    return sortedScores
  }

  const getAIInsight = async (topTypes) => {
    setLoadingAI(true)
    setAiInsight("")

    try {
      const response = await fetch("/api/ai-insight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topTypes: topTypes,
          language: "myanmar",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setAiInsight(data.insight)
      } else {
        setAiInsight(
          `❌ ${data.error}\n\n💡 AI insights ကို enable လုပ်ဖို့:\n1. Google Gemini API key ရယူပါ: https://makersuite.google.com/app/apikey\n2. GEMINI_API_KEY ကို environment variables မှာ ထည့်ပါ\n3. Application ကို redeploy လုပ်ပါ`,
        )
      }
    } catch (error) {
      console.error("AI Insight Error:", error)
      setAiInsight("🔌 AI service နဲ့ ချိတ်ဆက်မရပါ။ Internet connection ကို စစ်ကြည့်ပြီး ပြန်စမ်းကြည့်ပါ။")
    }

    setLoadingAI(false)
  }

  const resetTest = () => {
    setAnswers({})
    setCurrentQuestionIndex(0)
    setShowResults(false)
    setScores({})
    setAiInsight("")
  }

  const getProgress = () => {
    return Math.round((Object.keys(answers).length / questions.length) * 100)
  }

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center p-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-6"></div>
            <CardTitle className="text-xl mb-2 flex items-center justify-center gap-2">
              <Cloud size={24} />
              Enneagram Test Loading
            </CardTitle>
            <p className="text-muted-foreground mb-1">ထူးခြားသော စိတ်ခံစားမှု နယ်မြေ စစ်ဆေးမှု</p>
            <p className="text-sm text-muted-foreground">Google Sheet မှ မေးခွန်းများ ရယူနေသည်... 🌐</p>
            <div className="mt-4">
              <Progress value={70} className="w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error screen
  if (loadingError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600 flex items-center justify-center gap-2">
              <AlertTriangle size={28} />
              မေးခွန်းများ ရယူ၍ မရပါ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-red-700 font-medium mb-2">Error:</p>
              <p className="text-red-600">{loadingError.message}</p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-800 mb-2">💡 ဖြေရှင်းနည်းများ:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {loadingError.suggestions.map((suggestion, index) => (
                  <li key={index}>• {suggestion}</li>
                ))}
              </ul>
            </div>

            <div className="text-center space-y-4">
              <Button onClick={loadQuestionsFromGoogleSheet} className="flex items-center gap-2">
                <RefreshCw size={16} />
                ပြန်စမ်းကြည့်မယ်
              </Button>

              <div className="text-sm text-muted-foreground">
                <p>Google Sheet ကို ကြည့်ရှုရန်:</p>
                <a
                  href={`https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  သင့် Google Sheet ကို ဖွင့်ပါ <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Results screen
  if (showResults) {
    const topThree = getTopThreeTypes()

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-2">🎉 Enneagram Test Results</CardTitle>
              <p className="text-muted-foreground">
                စုစုပေါင်း မေးခွန်း: {Object.keys(answers).length} / {questions.length}
              </p>
              <Badge variant="secondary">{dataSource}</Badge>
            </CardHeader>
          </Card>

          <div className="space-y-4">
            {topThree.map((result, index) => (
              <Card
                key={result.letter}
                className={`
                border-2 ${
                  index === 0
                    ? "border-yellow-400 bg-yellow-50"
                    : index === 1
                      ? "border-gray-400 bg-gray-50"
                      : "border-orange-400 bg-orange-50"
                }
              `}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                        {result.type} - {result.name}
                      </h3>
                      <p className="text-muted-foreground mb-1">{result.myanmar}</p>
                      <p className="text-muted-foreground">အမှတ်: {result.count} မှတ်</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {Math.round((result.count / Object.keys(answers).length) * 100)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* AI Insights Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-purple-600" size={24} />
                AI စိတ်ခံစားမှု ခွဲခြမ်းစိတ်ဖြာမှု
                <Badge variant="outline" className="ml-auto">
                  Powered by Gemini
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!aiInsight && !loadingAI && (
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-2">🤖 ကိုယ်ပိုင် AI ခွဲခြမ်းစိတ်ဖြာမှု ရယူမယ်</h4>
                    <p className="text-muted-foreground mb-4">သင့်ရဲ့ စိတ်ခံစားမှု အမျိုးအစား အကြောင်း နက်နဲတဲ့ အသိပညာများ ရယူပါ:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-left mb-4">
                      <div>• အဓိက လှုံ့ဆော်မှုများနှင့် ကြောက်ရွံ့မှုများ</div>
                      <div>• ဆက်ဆံရေး ပုံစံများ</div>
                      <div>• အလုပ်အကိုင် အကြံပြုချက်များ</div>
                      <div>• ကြီးထွားမှု အခွင့်အလမ်းများ</div>
                      <div>• စိတ်ဖိစီးမှု ကိုင်တွယ်နည်းများ</div>
                      <div>• ဆက်သွယ်ပုံစံ</div>
                    </div>
                  </div>
                  <Button onClick={() => getAIInsight(topThree)} size="lg" className="flex items-center gap-2">
                    <MessageCircle size={20} />
                    AI ခွဲခြမ်းစိတ်ဖြာမှု ရယူမယ်
                  </Button>
                </div>
              )}

              {loadingAI && (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-2">🧠 သင့်ရဲ့ စိတ်ခံစားမှုကို ခွဲခြမ်းစိတ်ဖြာနေသည်...</p>
                    <p className="text-sm text-muted-foreground">၁၀-၃၀ စက္ကန့် ကြာနိုင်ပါသည်</p>
                  </div>
                </div>
              )}

              {aiInsight && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Sparkles size={12} />
                      AI မှ ထုတ်ပေးသော ခွဲခြမ်းစိတ်ဖြာမှု
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => getAIInsight(topThree)}
                      className="flex items-center gap-1"
                    >
                      <RotateCcw size={14} />
                      ပြန်ထုတ်မယ်
                    </Button>
                  </div>
                  <div className="prose max-w-none">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{aiInsight}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <Button onClick={resetTest} size="lg" className="flex items-center gap-2">
              <RotateCcw size={20} />
              ပြန်စမ်းကြည့်မယ်
            </Button>

            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground text-center">
                  ဒီ test က သင့်ရဲ့ အဓိက Enneagram စိတ်ခံစားမှု အမျိုးအစားကို ဖော်ထုတ်ပေးပါတယ်။ အမြင့်ဆုံး အမှတ်က သင့်ရဲ့ အဓိက အမျိုးအစားကို ညွှန်ပြပြီး၊ ဒုတိယ
                  အမှတ်တွေက သင့်ရဲ့ wings တွေကို ပြပါတယ်။
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const currentAnswer = answers[currentQuestion?.id]
  const reflectionPrompt = getReflectionPrompt()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Enneagram Personality Test</CardTitle>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  မေးခွန်း {currentQuestionIndex + 1} / {questions.length}
                </div>
                <Badge variant="outline" className="text-xs">
                  {dataSource}
                </Badge>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={getProgress()} className="w-full" />
              <div className="text-xs text-muted-foreground">
                {getProgress()}% ပြီးပါပြီ ({Object.keys(answers).length} ဖြေပြီး)
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Reflection Prompt */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Brain className="text-indigo-600" size={24} />
              <h3 className="font-semibold text-indigo-800">စဉ်းစားကြည့်ပါ</h3>
            </div>
            <p className="text-indigo-700 text-lg leading-relaxed">{reflectionPrompt}</p>
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="mb-8">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Heart className="text-pink-500" size={20} />
                  <h2 className="text-xl font-semibold text-gray-800">သင့်ကို အကောင်းဆုံး ဖော်ပြတဲ့ စာကြောင်းကို ရွေးပါ</h2>
                  <Heart className="text-pink-500" size={20} />
                </div>
                <p className="text-sm text-muted-foreground">နှလုံးသားနဲ့ ဖြေကြည့်ပါ - မှန်သမျှကို ရွေးပါ</p>
              </div>

              <div className="space-y-6">
                {/* Statement A */}
                <button
                  onClick={() => handleAnswerSelect("A")}
                  className={`w-full p-8 rounded-xl border-2 text-left transition-all duration-300 transform hover:scale-[1.02] ${
                    currentAnswer?.choice === "A"
                      ? "border-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 shadow-lg"
                      : "border-gray-200 hover:border-purple-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`
                      w-8 h-8 rounded-full border-3 flex items-center justify-center mt-1 transition-all duration-200 ${
                        currentAnswer?.choice === "A"
                          ? "border-purple-500 bg-purple-500 shadow-lg"
                          : "border-gray-300 hover:border-purple-400"
                      }
                    `}
                    >
                      {currentAnswer?.choice === "A" && <div className="w-3 h-3 bg-white rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-800 text-lg leading-relaxed font-medium">
                        {currentQuestion.statementA}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Divider */}
                <div className="flex items-center justify-center py-4">
                  <div className="flex-1 border-t border-gray-200"></div>
                  <div className="px-4 text-sm text-muted-foreground font-medium">သို့မဟုတ်</div>
                  <div className="flex-1 border-t border-gray-200"></div>
                </div>

                {/* Statement B */}
                <button
                  onClick={() => handleAnswerSelect("B")}
                  className={`w-full p-8 rounded-xl border-2 text-left transition-all duration-300 transform hover:scale-[1.02] ${
                    currentAnswer?.choice === "B"
                      ? "border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`
                      w-8 h-8 rounded-full border-3 flex items-center justify-center mt-1 transition-all duration-200 ${
                        currentAnswer?.choice === "B"
                          ? "border-blue-500 bg-blue-500 shadow-lg"
                          : "border-gray-300 hover:border-blue-400"
                      }
                    `}
                    >
                      {currentAnswer?.choice === "B" && <div className="w-3 h-3 bg-white rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-800 text-lg leading-relaxed font-medium">
                        {currentQuestion.statementB}
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-gray-100">
              <Button
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
              >
                <ChevronLeft size={20} />
                ရှေ့သို့
              </Button>

              <Button
                onClick={goToNextQuestion}
                disabled={!currentAnswer}
                size="lg"
                className={`flex items-center gap-2 ${
                  currentAnswer
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    : ""
                }`}
              >
                {currentQuestionIndex === questions.length - 1 ? "ပြီးပါပြီ" : "နောက်သို့"}
                <ChevronRight size={20} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 text-amber-800">💡 လမ်းညွှန်ချက်များ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-amber-700">
              <div>• ဖော်ပြချက်နှစ်ခုလုံးကို အေးအေးဆေးဆေး ဖတ်ကြည့်ပါ</div>
              <div>• မိတ်ဆွေရဲ့ နှလုံးသားက ဘယ်ဟာကို ရွေးချင်နေသလဲဆိုတာကို နားထောင်ပါ</div>
              <div>• "ရှိသင့် ဖြစ်သင့်တဲ့" အဖြေမဟုတ်ပဲ "ကိုယ်နဲ့အကိုက်ညီဆုံး" ကိုရွေးကြည့်ပါ</div>
              <div>• ရှေ့က ဖြေခဲ့တဲ့ အဖြေတွေကို ပြန်ပြင်လို့ ရပါတယ်</div>
              <div>• အချိန်ယူပြီး သေချာ စဉ်းစားကြည့်ပါ</div>
              <div>• စိတ်မှာ ပထမဆုံး ဖြစ်ပေါ်လာတဲ့ ခံစားချက်ကို ယုံကြည်ပါ</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
