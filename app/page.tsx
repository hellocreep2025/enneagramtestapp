"use client"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  MessageCircle,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Brain,
  BookOpen,
  Shield,
  Mail,
  Info,
  Target,
  CheckCircle,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

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
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [testStarted, setTestStarted] = useState(false)

  // Your specific Google Sheet ID
  const SHEET_ID = "12tgm-6KM1w5kUK_stJbLJCnwskiHZQIQTeYvPbmWtgQ"

  // Onboarding steps
  const onboardingSteps = [
    {
      id: "welcome",
      title: "Enneagram Test",
      subtitle: "စိတ်ခံစားမှု စစ်ဆေးခြင်း",
      icon: <div className="text-6xl">🌟</div>,
      content: (
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">ကြိုဆိုပါတယ်</h2>
            <p className="text-gray-600">သင့်ရဲ့ ကိုယ်ရည်ကိုယ်သွေးကို ရှာဖွေကြည့်ရအောင်</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
            <div className="text-4xl mb-3">🧭</div>
            <p className="text-gray-700 text-lg font-medium">9 မျိုးသော Personality Types</p>
            <p className="text-gray-600 text-sm mt-2">သင်က ဘယ်အမျိုးအစားလဲ?</p>
          </div>
        </div>
      ),
    },
    {
      id: "source",
      title: "📚 မေးခွန်းများ၏ အရင်းအမြစ်",
      subtitle: "ဘယ်ကနေ ရယူထားသလဲ?",
      icon: <BookOpen className="text-blue-600" size={48} />,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3">စာအုပ်အချက်အလက်</h4>
            <div className="space-y-2 text-blue-700">
              <p>
                <strong>စာအုပ်အမည်:</strong> "ငါ ဘာသူလဲ"
              </p>
              <p>
                <strong>ရေးသားသူများ:</strong>
              </p>
              <p className="ml-4">• ဆရာတော်ဦးဇောတိက</p>
              <p className="ml-4">• ဆရာမ ထက်ထက်ထွန်း (Waterfall)</p>
              <p>
                <strong>မေးခွန်းအရေအတွက်:</strong> ၁၄၄ ခု
              </p>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-yellow-800 text-sm">
              💡 <strong>အကြံပြုချက်:</strong> Enneagram အကြောင်း အသေးစိတ်သိချင်ရင် ဒီစာအုပ်ကို ဝယ်ဖတ်ကြည့်ဖို့ အထူးတိုက်တွန်းပါတယ်။
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "purpose",
      title: "🎯 ရည်ရွယ်ချက်",
      subtitle: "ဘာကြောင့် ဖန်တီးထားသလဲ?",
      icon: <Target className="text-green-600" size={48} />,
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 p-6 rounded-xl border border-green-200">
            <div className="space-y-3 text-green-700">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <span>
                  <strong>စီးပွားဖြစ် ရည်ရွယ်ချက် မရှိပါ</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <span>Enneagram Test လုပ်ချင်သူတွေအတွက် အကူအညီ</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <span>အခမဲ့ အသုံးပြုနိုင်ပါတယ်</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <span>ကိုယ့်ကိုယ်ကို နားလည်ဖို့ အထောက်အပံ့</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "privacy",
      title: "🔒 ကိုယ်ရေးကိုယ်တာ လုံခြုံမှု",
      subtitle: "သင့်ဒေတာ ဘယ်လို ကိုင်တွယ်သလဲ?",
      icon: <Shield className="text-purple-600" size={48} />,
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
            <div className="space-y-3 text-purple-700">
              <div className="flex items-center gap-3">
                <Shield className="text-purple-600" size={20} />
                <span>
                  <strong>မည်သည့် ဒေတာမှ မသိမ်းထားပါ</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="text-purple-600" size={20} />
                <span>Test ရလဒ်တွေ server မှာ မသိမ်းပါ</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="text-purple-600" size={20} />
                <span>အဖြေတွေ browser ထဲမှာပဲ ယာယီ သိမ်းထားတယ်</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="text-purple-600" size={20} />
                <span>ကိုယ်ရေးကိုယ်တာ အချက်အလက် မတောင်းပါ</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "contact",
      title: "📧 အကြံပြုချက်များ",
      subtitle: "ဆက်သွယ်ရန်",
      icon: <Mail className="text-orange-600" size={48} />,
      content: (
        <div className="space-y-4">
          <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
            <div className="text-center space-y-4">
              <p className="text-orange-700">Application ကို ပိုကောင်းအောင် လုပ်ဖို့ အကြံပြုချက်တွေ ရှိရင် ကျေးဇူးပြု၍ အီးမေးပေးပို့ပါ</p>
              <a
                href="mailto:hello@radiances.net"
                className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Mail size={20} />
                hello@radiances.net
              </a>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "about",
      title: "ℹ️ Test အကြောင်း",
      subtitle: "ဘာတွေ မျှော်လင့်ရမလဲ?",
      icon: <Info className="text-indigo-600" size={48} />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 text-center">
              <div className="text-2xl font-bold text-indigo-600">{questions.length || 144}</div>
              <div className="text-sm text-indigo-700">မေးခွန်းများ</div>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 text-center">
              <div className="text-2xl font-bold text-indigo-600">15-20</div>
              <div className="text-sm text-indigo-700">မိနစ်ခန့် ကြာမည်</div>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 text-center">
              <div className="text-2xl font-bold text-indigo-600">9</div>
              <div className="text-sm text-indigo-700">Personality Types</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "instructions",
      title: "💡 Test လုပ်ရာတွင် သတိပြုရန်",
      subtitle: "ဘယ်လို ဖြေရမလဲ?",
      icon: <Brain className="text-pink-600" size={48} />,
      content: (
        <div className="space-y-4">
          <div className="bg-pink-50 p-6 rounded-xl border border-pink-200">
            <div className="space-y-3 text-pink-700">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  1
                </div>
                <span>နှလုံးသားနဲ့ ရိုးရိုးသားသား ဖြေကြည့်ပါ</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  2
                </div>
                <span>"ရှိသင့် ဖြစ်သင့်တဲ့" အဖြေမဟုတ်ပဲ "ကိုယ်နဲ့အကိုက်ညီဆုံး" ကို ရွေးပါ</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  3
                </div>
                <span>အချိန်ယူပြီး စဉ်းစားကြည့်ပါ</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  4
                </div>
                <span>ရှေ့က ဖြေခဲ့တဲ့ အဖြေတွေကို ပြန်ပြင်လို့ ရပါတယ်</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  5
                </div>
                <span>စိတ်မှာ ပထမဆုံး ဖြစ်ပေါ်လာတဲ့ ခံစားချက်ကို ယုံကြည်ပါ</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

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

  useEffect(() => {
    loadQuestionsFromGoogleSheet()
  }, [])

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
          `❌ ${data.error}\n\n💡 AI insights ကို enable လুပ်ဖို့:\n1. Google Gemini API key ရယူပါ: https://makersuite.google.com/app/apikey\n2. GEMINI_API_KEY ကို environment variables မှာ ထည့်ပါ\n3. Application ကို redeploy လုပ်ပါ`,
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
    setOnboardingStep(0)
  }

  const nextOnboardingStep = () => {
    if (onboardingStep < onboardingSteps.length - 1) {
      setOnboardingStep(onboardingStep + 1)
    } else {
      setTestStarted(true)
    }
  }

  const prevOnboardingStep = () => {
    if (onboardingStep > 0) {
      setOnboardingStep(onboardingStep - 1)
    }
  }

  const getProgress = () => {
    return Math.round((Object.keys(answers).length / questions.length) * 100)
  }

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-sm w-full">
          <CardContent className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Loading...</h3>
            <p className="text-sm text-muted-foreground">မေးခွန်းများ ရယူနေသည်...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error screen
  if (loadingError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-red-600 flex items-center justify-center gap-2">
              <AlertTriangle size={24} />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-red-600 text-sm">{loadingError.message}</p>
            </div>
            <Button onClick={loadQuestionsFromGoogleSheet} className="w-full">
              <RefreshCw size={16} className="mr-2" />
              ပြန်စမ်းကြည့်မယ်
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Onboarding flow (step-by-step)
  if (!testStarted) {
    const currentStep = onboardingSteps[onboardingStep]
    const isLastStep = onboardingStep === onboardingSteps.length - 1

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          {/* Progress indicator */}
          <div className="text-center">
            <div className="flex justify-center space-x-2 mb-4">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= onboardingStep ? "bg-purple-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {onboardingStep + 1} / {onboardingSteps.length}
            </p>
          </div>

          {/* Main card */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                {/* Icon */}
                <div className="flex justify-center">{currentStep.icon}</div>

                {/* Title */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">{currentStep.title}</h1>
                  <p className="text-gray-600">{currentStep.subtitle}</p>
                </div>

                {/* Content */}
                <div className="text-left">{currentStep.content}</div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button onClick={prevOnboardingStep} disabled={onboardingStep === 0} variant="outline" size="sm">
              <ChevronLeft size={16} className="mr-1" />
              ရှေ့သို့
            </Button>

            <Button
              onClick={nextOnboardingStep}
              className={`${
                isLastStep ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" : ""
              }`}
            >
              {isLastStep ? (
                <>
                  Test စတင်မယ် <ArrowRight size={16} className="ml-1" />
                </>
              ) : (
                <>
                  နောက်သို့ <ChevronRight size={16} className="ml-1" />
                </>
              )}
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
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">🎉 Test Results</CardTitle>
              <p className="text-muted-foreground">
                {Object.keys(answers).length} / {questions.length} မေးခွန်း
              </p>
            </CardHeader>
          </Card>

          {/* Top 3 Results */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🏆 သင့်ရဲ့ အဓိက Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topThree.map((result, index) => (
                  <div
                    key={result.letter}
                    className={`
                    p-4 rounded-lg border-2 ${
                      index === 0
                        ? "border-yellow-400 bg-yellow-50"
                        : index === 1
                          ? "border-gray-400 bg-gray-50"
                          : "border-orange-400 bg-orange-50"
                    }
                  `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-xl">{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</div>
                        <div>
                          <h3 className="font-semibold">{result.type}</h3>
                          <p className="text-sm text-muted-foreground">{result.myanmar}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{result.count}</div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round((result.count / Object.keys(answers).length) * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-purple-600" size={20} />
                AI ခွဲခြမ်းစိတ်ဖြာမှု
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!aiInsight && !loadingAI && (
                <div className="text-center">
                  <Button onClick={() => getAIInsight(topThree)} className="w-full">
                    <MessageCircle size={16} className="mr-2" />
                    AI ခွဲခြမ်းစိတ်ဖြာမှု ရယူမယ်
                  </Button>
                </div>
              )}

              {loadingAI && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-muted-foreground">ခွဲခြမ်းစိတ်ဖြာနေသည်...</p>
                </div>
              )}

              {aiInsight && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{aiInsight}</div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => getAIInsight(topThree)} className="w-full">
                    <RotateCcw size={14} className="mr-2" />
                    ပြန်ထုတ်မယ်
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center">
            <Button onClick={resetTest} variant="outline">
              <RotateCcw size={16} className="mr-2" />
              ပြန်စမ်းကြည့်မယ်
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Test questions (ultra-minimalist version)
  const currentQuestion = questions[currentQuestionIndex]
  const currentAnswer = answers[currentQuestion?.id]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-lg mx-auto space-y-4">
        {/* Minimal Header */}
        <div className="text-center space-y-2">
          <div className="text-sm text-muted-foreground">
            {currentQuestionIndex + 1} / {questions.length}
          </div>
          <Progress value={getProgress()} className="w-full h-2" />
        </div>

        {/* Question Card - Ultra Clean */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Statement A */}
              <button
                onClick={() => handleAnswerSelect("A")}
                className={`w-full p-5 rounded-xl text-left transition-all duration-200 ${
                  currentAnswer?.choice === "A"
                    ? "bg-purple-100 border-2 border-purple-400 shadow-md"
                    : "bg-gray-50 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                }`}
              >
                <div className="text-gray-800 leading-relaxed font-medium">{currentQuestion.statementA}</div>
              </button>

              {/* Simple Divider */}
              <div className="text-center">
                <div className="text-xs text-muted-foreground font-medium">သို့မဟုတ်</div>
              </div>

              {/* Statement B */}
              <button
                onClick={() => handleAnswerSelect("B")}
                className={`w-full p-5 rounded-xl text-left transition-all duration-200 ${
                  currentAnswer?.choice === "B"
                    ? "bg-blue-100 border-2 border-blue-400 shadow-md"
                    : "bg-gray-50 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                <div className="text-gray-800 leading-relaxed font-medium">{currentQuestion.statementB}</div>
              </button>
            </div>

            {/* Minimal Navigation */}
            <div className="flex justify-between pt-6 mt-6 border-t border-gray-100">
              <Button onClick={goToPreviousQuestion} disabled={currentQuestionIndex === 0} variant="ghost" size="sm">
                <ChevronLeft size={16} />
              </Button>

              <Button
                onClick={goToNextQuestion}
                disabled={!currentAnswer}
                size="sm"
                className={currentAnswer ? "bg-purple-600 hover:bg-purple-700" : ""}
              >
                {currentQuestionIndex === questions.length - 1 ? "ပြီးပါပြီ" : <ChevronRight size={16} />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
