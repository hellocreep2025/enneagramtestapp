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
  BookOpen,
  Shield,
  Mail,
  Info,
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
  const [testStarted, setTestStarted] = useState(false)

  // Your specific Google Sheet ID
  const SHEET_ID = "12tgm-6KM1w5kUK_stJbLJCnwskiHZQIQTeYvPbmWtgQ"

  // Type mapping with Myanmar translations
  const typeMapping = {
    A: { type: "Type 9", name: "The Peacemaker", myanmar: "ငြိမ်းချမ်းမှုကို ဖန်တီးသူ" },
    B: { type: "Type 6", name: "The Loyalist", myanmar: "သစ္စာရှိသူ" },
    C: { type: "Type 3", name: "The Achiever", myanmar: "ဖြစ်မြောက်အောင် လုပ်နိုင်သူ" },
    D: { type: "Type 1", name: "The Perfectionist", myanmar: "ကောင်းတဲ့ဘက်ကို ပြောင်းလဲဖို့ စိတ်အားထက်သန်သူ" },
    E: { type: "Type 4", name: "The Individualist", myanmar: "ကိုယ့်စိတ်ကူးနဲ့ကိုယ် တမူထူးစွာ နေချင်သူ" },
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
    setTestStarted(false)
  }

  const startTest = () => {
    setTestStarted(true)
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

  // Welcome screen with disclaimer (before test starts)
  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Main Title */}
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-4xl mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                🌟 Enneagram Personality Test 🌟
              </CardTitle>
              <p className="text-xl text-muted-foreground">Enneagram နည်းဖြင့် စရိုက်လက္ခဏာ ကိုယ်ရည်ကိုယ်သွေး စမ်းသပ် စစ်ဆေး ဖော်ထုတ်ခြင်း</p>
              <Badge variant="secondary" className="mt-2">
                {dataSource}
              </Badge>
            </CardHeader>
          </Card>

          {/* Disclaimer */}
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Info size={24} />
                အရေးကြီးသော သတင်းအချက်အလက်များ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Book Attribution */}
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <BookOpen className="text-blue-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">📚 မေးခွန်းများ၏ ရင်းမြစ်</h4>
                    <p className="text-blue-700 mb-2">
                      ဒီ application မှာ ပါဝင်တဲ့ မေးခွန်း ၁၄၄ ခုကို <strong>ဆရာတော်ဦးဇောတိက</strong> နှင့်{" "}
                      <strong>ဆရာမ ထက်ထက်ထွန်း (Waterfall)</strong> တို့ရေးသားတဲ့ <strong>"ငါ ဘာသူလဲ"</strong> ဆိုတဲ့ စာအုပ်ကနေ
                      ရယူထားပါတယ်။
                    </p>
                    <p className="text-blue-600 text-sm">
                      💡 Enneagram အကြောင်း အသေးစိတ်သိချင်ရင် ဒီစာအုပ်ကို ဖတ်ကြည့်ဖို့ အထူးတိုက်တွန်းပါတယ်။
                    </p>
                  </div>
                </div>
              </div>

              {/* Purpose */}
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <Heart className="text-green-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">🎯 ရည်ရွယ်ချက်</h4>
                    <p className="text-green-700">
                      ဒီ application က <strong>စီးပွားဖြစ် ရည်ရွယ်ချက်မရှိပါ</strong>။ Enneagram Test လုပ်ချင်တဲ့သူတွေအတွက် အကူအညီ အထောက်အပံ့
                      ရစေလိုတဲ့ ရည်ရွယ်ချက်နဲ့သာ ဖန်တီးထားတာဖြစ်ပါတယ်။
                    </p>
                  </div>
                </div>
              </div>

              {/* Privacy */}
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <div className="flex items-start gap-3">
                  <Shield className="text-purple-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">🔒 ကိုယ်ရေးကိုယ်တာ လုံခြုံမှု</h4>
                    <p className="text-purple-700">
                      သင့်ရဲ့ <strong>မည်သည့် ဒေတာမှ မှတ်ထား သိမ်းထားခြင်း မရှိပါ</strong>။ Test ရလဒ်တွေ၊ အဖြေတွေ၊ ကိုယ်ရေးကိုယ်တာ အချက်အလက်တွေ ဘာမှ
                      server မှာ သိမ်းမထားပါဘူး။ အားလုံး သင့် browser ထဲမှာပဲ ယာယီ သိမ်းထားပါတယ်။
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white p-4 rounded-lg border border-orange-200">
                <div className="flex items-start gap-3">
                  <Mail className="text-orange-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-2">📧 အကြံပြုချက်များ</h4>
                    <p className="text-orange-700 mb-2">
                      Application ကို ပိုကောင်းအောင် လုပ်ဖို့ အကြံပြုချက်တွေ ရှိရင် ကျေးဇူးပြု၍ အီးမေးပေးပို့ပါ:
                    </p>
                    <a
                      href="mailto:hello@radiances.net"
                      className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-800 font-medium"
                    >
                      <Mail size={16} />
                      hello@radiances.net
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">🧭 Test အကြောင်း</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{questions.length}</div>
                  <div className="text-sm text-purple-700">မေးခွန်းများ</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">15-20</div>
                  <div className="text-sm text-blue-700">မိနစ်ခန့် ကြာမည်</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">9</div>
                  <div className="text-sm text-green-700">Personality Types</div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">💡 Test လုပ်ရာတွင် သတိပြုရန်:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• နှလုံးသားနဲ့ ရိုးရိုးသားသား ဖြေကြည့်ပါ</li>
                  <li>• "ရှိသင့် ဖြစ်သင့်တဲ့" အဖြေမဟုတ်ပဲ "ကိုယ်နဲ့အကိုက်ညီဆုံး" ကို ရွေးပါ</li>
                  <li>• အချိန်ယူပြီး စဉ်းစားကြည့်ပါ</li>
                  <li>• ရှေ့က ဖြေခဲ့တဲ့ အဖြေတွေကို ပြန်ပြင်လို့ ရပါတယ်</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Start Button */}
          <div className="text-center">
            <Button
              onClick={startTest}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
            >
              🚀 Test စတင်မယ်
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Results screen
  if (showResults) {
    const allTypes = Object.entries(typeMapping)
      .map(([letter, info]) => ({
        letter,
        count: scores[letter] || 0,
        ...info,
      }))
      .sort((a, b) => b.count - a.count)

    const topThree = allTypes.slice(0, 3)

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

          {/* All 9 Types Results */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">📊 သင့်ရဲ့ Enneagram Profile အပြည့်အစုံ</CardTitle>
              <p className="text-muted-foreground">Type 9 ခုလုံးရဲ့ ရမှတ်များ (ကြီးစဥ်ငယ်လိုက်)</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {allTypes.map((result, index) => (
                  <div
                    key={result.letter}
                    className={`
                    p-4 rounded-lg border-2 transition-all duration-200 ${
                      index === 0
                        ? "border-yellow-400 bg-gradient-to-r from-yellow-50 to-yellow-100 shadow-lg"
                        : index === 1
                          ? "border-gray-400 bg-gradient-to-r from-gray-50 to-gray-100 shadow-md"
                          : index === 2
                            ? "border-orange-400 bg-gradient-to-r from-orange-50 to-orange-100 shadow-md"
                            : "border-gray-200 bg-white hover:bg-gray-50"
                    }
                  `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`}
                        </div>
                        <div>
                          <h3 className={`text-lg font-semibold ${index < 3 ? "text-gray-800" : "text-gray-600"}`}>
                            {result.type} - {result.name}
                          </h3>
                          <p className={`text-sm ${index < 3 ? "text-gray-600" : "text-gray-500"}`}>{result.myanmar}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${index < 3 ? "text-gray-800" : "text-gray-600"}`}>
                          {result.count} မှတ်
                        </div>
                        <div className={`text-sm ${index < 3 ? "text-gray-600" : "text-gray-500"}`}>
                          {Math.round((result.count / Object.keys(answers).length) * 100)}%
                        </div>
                      </div>
                    </div>

                    {/* Progress bar for each type */}
                    <div className="mt-3">
                      <Progress
                        value={(result.count / Math.max(...allTypes.map((t) => t.count))) * 100}
                        className={`h-2 ${
                          index === 0
                            ? "bg-yellow-200"
                            : index === 1
                              ? "bg-gray-200"
                              : index === 2
                                ? "bg-orange-200"
                                : "bg-gray-100"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top 3 Summary */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-xl">🏆 သင့်ရဲ့ အဓိက Personality Types</CardTitle>
              <p className="text-muted-foreground">အမှတ်အများဆုံး ၃ ခု - ဒါတွေက သင့်ရဲ့ core personality ကို ဖော်ပြပါတယ်</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topThree.map((result, index) => (
                  <div
                    key={result.letter}
                    className={`
                    p-4 rounded-lg text-center border-2 ${
                      index === 0
                        ? "border-yellow-400 bg-yellow-50"
                        : index === 1
                          ? "border-gray-400 bg-gray-50"
                          : "border-orange-400 bg-orange-50"
                    }
                  `}
                  >
                    <div className="text-3xl mb-2">{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</div>
                    <h4 className="font-semibold text-gray-800 mb-1">{result.type}</h4>
                    <p className="text-sm text-gray-600 mb-2">{result.name}</p>
                    <p className="text-xs text-gray-500 mb-2">{result.myanmar}</p>
                    <div className="text-lg font-bold text-gray-800">{result.count} မှတ်</div>
                    <div className="text-sm text-gray-600">
                      {Math.round((result.count / Object.keys(answers).length) * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Interpretation Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📖 ရလဒ် အဓိပ္ပါယ်ဖွင့်ဆိုချက်</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-500">🥇</span>
                  <div>
                    <strong>Primary Type (အဓိက အမျိုးအစား):</strong> သင့်ရဲ့ core personality type ဖြစ်ပါတယ်။ ဒါက သင့်ရဲ့ အဓိက
                    motivations, fears, နှင့် behavioral patterns တွေကို ညွှန်ပြပါတယ်။
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-500">🥈</span>
                  <div>
                    <strong>Secondary Type (ဒုတိယ အမျိုးအစား):</strong> သင့်ရဲ့ "wing" သို့မဟုတ် secondary influence ဖြစ်နိုင်ပါတယ်။
                    Primary type နဲ့ ရောနှောပြီး သင့်ရဲ့ personality ကို ပိုမို ရှုပ်ထွေးစေပါတယ်။
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-500">🥉</span>
                  <div>
                    <strong>Third Type (တတိယ အမျိုးအစား):</strong> stress သို့မဟုတ် growth direction မှာ ပေါ်လာနိုင်တဲ့ characteristics
                    တွေကို ညွှန်ပြနိုင်ပါတယ်။
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg mt-4">
                  <p className="text-blue-800">
                    <strong>💡 သတိပြုရန်:</strong> Enneagram က dynamic system တစ်ခုဖြစ်ပါတယ်။ သင့်ရဲ့ primary type က အဓိကဖြစ်ပေမယ့်၊
                    အခြား types တွေရဲ့ characteristics တွေလည်း အချိန်အခါ အလိုက် ပေါ်လာနိုင်ပါတယ်။
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

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
                    <p className="text-muted-foreground mb-4">သင့်ရဲ့ top 3 types အပေါ်အခြေခံပြီး နက်နဲတဲ့ အသိပညာများ ရယူပါ:</p>
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
                  ဒီ test က သင့်ရဲ့ Enneagram personality profile အပြည့်အစုံကို ပြပေးပါတယ်။ Primary type က သင့်ရဲ့ အဓိက အမျိုးအစားဖြစ်ပြီး၊
                  secondary နှင့် third types တွေက သင့်ရဲ့ wings နှင့် growth/stress directions တွေကို ညွှန်ပြပါတယ်။
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
                <p className="text-sm text-muted-foreground">နှလုံးသားနဲ့ ဖြေကြည့်ပါ - မှန်သမျှကို ရွေးပါ</p>
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
              <div>• ဖော်ပြချက်နှစ်ခုလုံးကို အေးအေးဆေးဆေး ဖတ်ကြည့်ပါ</div>
              <div>• မိတ်ဆွေရဲ့ နှလုံးသားက ဘယ်ဟာကို ရွေးချင်နေသလဲဆိုတာကို နားထောင်ပါ</div>
              <div>• "ရှိသင့် ဖြစ်သင့်တဲ့" အဖြေမဟုတ်ပဲ "ကိုယ်နဲ့အကိုက်ညီဆုံး" ကိုရွေးကြည့်ပါ</div>
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
