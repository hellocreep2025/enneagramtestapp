"use client"

import { useState, useRef, useEffect } from "react"

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
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Refs
  const resultsRef = useRef(null)

  // Your specific Google Sheet ID
  const SHEET_ID = "12tgm-6KM1w5kUK_stJbLJCnwskiHZQIQTeYvPbmWtgQ"

  // Enneagram type mappings
  const typeMapping = {
    A: { type: 9, name: "The Peacemaker", myanmar: "ငြိမ်းချမ်းမှုကို ဖန်တီးသူ" },
    B: { type: 6, name: "The Loyalist", myanmar: "သစ္စာရှိသူ" },
    C: { type: 3, name: "The Achiever", myanmar: "ဖြစ်မြောက်အောင်လုပ်နိုင်သူ" },
    D: { type: 1, name: "The Perfectionist", myanmar: "ကောင်းတဲ့ဘက်ကို ပြောင်းလဲဖို့ စိတ်အားထက်သန်သူ" },
    E: { type: 4, name: "The Individualist", myanmar: "ကိုယ့်စိတ်ကူးနဲ့ကိုယ် တမူထူးစွာနေချင်သူ" },
    F: { type: 2, name: "The Helper", myanmar: "ကူညီဖေးမတတ်သူ" },
    G: { type: 8, name: "The Challenger", myanmar: "အခက်အခဲကို ရင်ဆိုင်ကျော်လွှားသူ" },
    H: { type: 5, name: "The Investigator", myanmar: "စူးစမ်းလေ့လာသူ" },
    I: { type: 7, name: "The Enthusiast", myanmar: "စိတ်ဝင်စားမှုများသူ တက်ကြွသူ" },
  }

  // Load questions on component mount
  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    setLoading(true)
    setLoadingError(null)

    try {
      console.log("🎯 Starting question loading process...")

      // Try multiple loading strategies
      const strategies = [
        () => loadFromGoogleSheet(SHEET_ID),
        () => loadFromLocalStorage(),
        () => loadFromPublicJSON(),
        () => loadFallbackQuestions(),
      ]

      let questionsData = null
      let source = ""

      for (let i = 0; i < strategies.length; i++) {
        try {
          console.log(`🔄 Trying strategy ${i + 1}...`)
          const result = await strategies[i]()
          if (result && result.questions && result.questions.length > 0) {
            questionsData = result
            source = result._source || `Strategy ${i + 1}`
            console.log(`✅ Success with ${source}: ${result.questions.length} questions`)

            // Additional validation for the loaded questions
            const expectedCount = 144
            const actualCount = result.questions.length

            if (actualCount !== expectedCount) {
              console.warn(`⚠️ Question count mismatch! Expected: ${expectedCount}, Got: ${actualCount}`)
              console.warn(`📊 Missing: ${expectedCount - actualCount} questions`)
            }

            break
          }
        } catch (error) {
          console.log(`❌ Strategy ${i + 1} failed:`, error.message)
          continue
        }
      }

      if (questionsData && questionsData.questions) {
        setQuestions(questionsData.questions)
        setDataSource(source)
        console.log(`🎉 Final result: ${questionsData.questions.length} questions loaded from ${source}`)

        // Show warning if not 144 questions
        if (questionsData.questions.length !== 144) {
          console.warn(`⚠️ WARNING: Expected 144 questions but got ${questionsData.questions.length}`)
        }
      } else {
        throw new Error("All loading strategies failed")
      }
    } catch (error) {
      console.error("❌ Failed to load questions:", error)
      setLoadingError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const loadFromGoogleSheet = async (sheetId) => {
    console.log(`🔄 Loading from Google Sheet: ${sheetId}`)
    const response = await fetch(`/api/load-google-sheet?sheetId=${sheetId}`)
    if (!response.ok) {
      throw new Error(`Google Sheets API failed: ${response.status}`)
    }
    const data = await response.json()

    // Add detailed logging about the loaded data
    console.log(`📊 Raw data from Google Sheets:`, {
      title: data.title,
      totalQuestions: data.totalQuestions,
      actualQuestions: data.questions?.length || 0,
      loadedVia: data._loadedVia,
    })

    // Check for any missing or invalid questions
    if (data.questions) {
      const validQuestions = data.questions.filter((q) => q.id && q.statementA && q.statementB && q.scoreA && q.scoreB)
      const invalidQuestions = data.questions.filter(
        (q) => !q.id || !q.statementA || !q.statementB || !q.scoreA || !q.scoreB,
      )

      console.log(`✅ Valid questions: ${validQuestions.length}`)
      console.log(`❌ Invalid questions: ${invalidQuestions.length}`)

      if (invalidQuestions.length > 0) {
        console.log(`🔍 Invalid questions details:`, invalidQuestions.slice(0, 5))
      }

      // Check for duplicate IDs
      const ids = data.questions.map((q) => q.id)
      const uniqueIds = [...new Set(ids)]
      if (ids.length !== uniqueIds.length) {
        console.warn(`⚠️ Found duplicate question IDs. Total: ${ids.length}, Unique: ${uniqueIds.length}`)
      }

      // Check for missing IDs in sequence
      const sortedIds = ids.sort((a, b) => a - b)
      const missingIds = []
      for (let i = 1; i <= 144; i++) {
        if (!sortedIds.includes(i)) {
          missingIds.push(i)
        }
      }

      if (missingIds.length > 0) {
        console.warn(
          `⚠️ Missing question IDs: ${missingIds.slice(0, 10).join(", ")}${missingIds.length > 10 ? "..." : ""}`,
        )
        console.warn(`📊 Total missing: ${missingIds.length} questions`)
      }
    }

    return { ...data, _source: "Google Sheets" }
  }

  const loadFromLocalStorage = () => {
    const stored = localStorage.getItem("enneagram-questions")
    if (stored) {
      const data = JSON.parse(stored)
      return { ...data, _source: "Local Storage" }
    }
    throw new Error("No data in local storage")
  }

  const loadFromPublicJSON = async () => {
    const response = await fetch("/sample-questions.json")
    if (!response.ok) {
      throw new Error("Failed to load sample questions")
    }
    const data = await response.json()
    return { ...data, _source: "Sample Questions" }
  }

  const loadFallbackQuestions = () => {
    const fallbackData = {
      title: "Enneagram Test - Myanmar (Fallback)",
      questions: [
        {
          id: 1,
          statementA: "ငါဟာ စိတ်ကူးလည်းယဥ်တတ်တယ်​။ စိတ်ကူးစိတ်သန်းလည်းကောင်းတယ်",
          statementB: "ငါဟာလက်တွေ့ကျတယ် ။ ကြွားကြွားဝါဝါ မနေဘူး ။ လိုတာထက်ပိုပြီး ပြောလေ့မရှိဘူး။",
          scoreA: "E",
          scoreB: "B",
        },
        {
          id: 2,
          statementA: "ငါဟာပြဿနာကို ထိပ်တိုက်ရင်ဆိုင်လေ့ရှိတယ်",
          statementB: "ငါဟာ ပြဿနာကို ရှောင်လေ့ရှိတယ်",
          scoreA: "G",
          scoreB: "A",
        },
        {
          id: 3,
          statementA: "ငါဟာ အဆင်ပြေအောင် ကြည့်ပြောတတ်တယ်။ နှစ်သက်အောင် ပြောတတ်တယ်။",
          statementB: "ငါဟာ ပရိယာယ် မသုံးတတ်ဘူး ။ ထုံးတမ်းစဥ်လာအတိုင်းပဲလုပ်တယ်။",
          scoreA: "C",
          scoreB: "D",
        },
        {
          id: 4,
          statementA: "ငါဟာ အာရုံစူးစိုက်တယ်။ အားသွန်ခွန်စိုက်လုပ်တတ်တယ်",
          statementB: "ငါဟာ စိတ်ကူးပေါက်တာ လုပ်တတ်တယ်။ ပျော်ပျော်နေတတ်တယ်",
          scoreA: "H",
          scoreB: "I",
        },
        {
          id: 5,
          statementA: "ငါဟာ ဖော်ရွေတယ် ။ ကိုယ့်ဘဝထဲကို မိတ်သစ် ဆွေသစ်တွေ ရောက်လာတာကို ဖိတ်ခေါ်တတ်တယ်။",
          statementB: "ငါဟာ သီးသီးသန့်သန့်နေတတ်တယ်။ လူအများနဲ့ သိပ်ရောလေ့မရှိဘူး။",
          scoreA: "F",
          scoreB: "E",
        },
      ],
      _source: "Fallback Questions",
    }
    return fallbackData
  }

  const handleAnswer = (choice) => {
    if (isTransitioning) return

    const currentQuestion = questions[currentQuestionIndex]
    const newAnswers = { ...answers, [currentQuestion.id]: choice }
    setAnswers(newAnswers)

    setIsTransitioning(true)
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        calculateResults(newAnswers)
      }
      setIsTransitioning(false)
    }, 300)
  }

  const calculateResults = (finalAnswers) => {
    const scoreCount = {}

    Object.entries(finalAnswers).forEach(([questionId, choice]) => {
      const question = questions.find((q) => q.id === Number.parseInt(questionId))
      if (question) {
        const scoreKey = choice === "A" ? question.scoreA : question.scoreB
        scoreCount[scoreKey] = (scoreCount[scoreKey] || 0) + 1
      }
    })

    setScores(scoreCount)
    setShowResults(true)
  }

  const getTopTypes = () => {
    return Object.entries(scores)
      .map(([key, count]) => ({
        ...typeMapping[key],
        count,
        key,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
  }

  const generateAIInsight = async () => {
    setLoadingAI(true)
    try {
      const topTypes = getTopTypes()
      const response = await fetch("/api/ai-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topTypes, language: "myanmar" }),
      })

      if (response.ok) {
        const data = await response.json()
        setAiInsight(data.insight)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate AI insight")
      }
    } catch (error) {
      console.error("AI Insight Error:", error)
      setAiInsight(`AI ထိုးထွင်းသိမြင်မှု ရယူရာတွင် အမှားရှိပါသည်: ${error.message}`)
    } finally {
      setLoadingAI(false)
    }
  }

  const exportToPNG = async () => {
    setIsExporting(true)
    try {
      const html2canvas = (await import("html2canvas")).default
      const canvas = await html2canvas(resultsRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      })

      const link = document.createElement("a")
      link.download = "enneagram-results.png"
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error("Export error:", error)
      alert("Export failed. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const exportToPDF = async () => {
    setIsExporting(true)
    try {
      const html2canvas = (await import("html2canvas")).default
      const jsPDF = (await import("jspdf")).default

      const canvas = await html2canvas(resultsRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF()
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save("enneagram-results.pdf")
    } catch (error) {
      console.error("PDF export error:", error)
      alert("PDF export failed. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const restartTest = () => {
    setCurrentQuestionIndex(0)
    setAnswers({})
    setShowResults(false)
    setScores({})
    setAiInsight("")
    setTestStarted(false)
    setOnboardingStep(0)
  }

  const nextOnboardingStep = () => {
    if (onboardingStep < 3) {
      // Changed from 7 to 3 (only 4 steps now: 0,1,2,3)
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

  // Focus Mode is now the default design
  const focusGradient = "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
  const cardStyle = "backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl"
  const textStyle = "text-white"
  const buttonStyle = "bg-white/20 hover:bg-white/30 text-white border-white/30"

  if (loading) {
    return (
      <div className={`min-h-screen ${focusGradient} flex items-center justify-center p-4`}>
        <div className={`${cardStyle} p-8 rounded-2xl text-center max-w-md w-full`}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className={`text-xl font-semibold ${textStyle} mb-2`}>မေးခွန်းများ ရယူနေသည်...</h2>
          <p className={`${textStyle} opacity-80`}>ခဏစောင့်ပါ</p>
        </div>
      </div>
    )
  }

  if (loadingError) {
    return (
      <div className={`min-h-screen ${focusGradient} flex items-center justify-center p-4`}>
        <div className={`${cardStyle} p-8 rounded-2xl text-center max-w-md w-full`}>
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <h2 className={`text-xl font-semibold ${textStyle} mb-4`}>မေးခွန်းများ ရယူ၍မရပါ</h2>
          <p className={`${textStyle} opacity-80 mb-6`}>{loadingError}</p>
          <button onClick={loadQuestions} className={`px-6 py-3 rounded-lg ${buttonStyle} transition-all duration-200`}>
            ပြန်လည်ကြိုးစားမည်
          </button>
        </div>
      </div>
    )
  }

  // Landing Pages / Onboarding Flow - Now only 4 steps (0,1,2,3)
  if (!testStarted) {
    // Welcome Page (Step 0)
    if (onboardingStep === 0) {
      return (
        <div className={`min-h-screen ${focusGradient} flex items-center justify-center p-4`}>
          <div className={`${cardStyle} p-8 rounded-2xl text-center max-w-2xl w-full`}>
            <div className="mb-8">
              <div className="text-6xl mb-4">🧠</div>
              <h1 className={`text-4xl font-bold ${textStyle} mb-4`}>Enneagram ကိုယ်ရည်ကိုယ်သွေး စမ်းသပ်မှု</h1>
              <p className={`text-xl ${textStyle} opacity-90 mb-6`}>သင့်ရဲ့ စစ်မှန်သော ကိုယ်ရည်ကိုယ်သွေးကို ရှာဖွေလိုက်ပါ</p>
            </div>

            <div className={`${cardStyle} p-6 rounded-xl mb-8`}>
              <h3 className={`text-lg font-semibold ${textStyle} mb-4`}>🌟 Enneagram ဆိုတာ ဘာလဲ?</h3>
              <p className={`${textStyle} opacity-90 leading-relaxed`}>
                Enneagram သည် လူသားတို့၏ ကိုယ်ရည်ကိုယ်သွေးကို ၉ မျိုးခွဲခြားထားသော စနစ်တစ်ခုဖြစ်သည်။ သင့်ရဲ့ အပြုအမူ၊ လှုံ့ဆော်မှု၊ ကြောက်ရွံ့မှုများကို နားလည်းစေပြီး
                ကိုယ်ရေးကိုယ်တာ ဖွံ့ဖြိုးတိုးတက်မှုအတွက် အထောက်အကူပြုပါသည်။
              </p>
            </div>

            <button
              onClick={nextOnboardingStep}
              className={`w-full py-4 px-8 text-xl font-semibold rounded-xl ${buttonStyle} transition-all duration-300 transform hover:scale-105`}
            >
              စတင်လိုက်ပါ 🚀
            </button>

            <div className={`text-sm ${textStyle} opacity-70 mt-4`}>
              Data source: {dataSource} | {questions.length} questions loaded
            </div>
          </div>
        </div>
      )
    }

    // Disclaimer Page (Step 1)
    if (onboardingStep === 1) {
      return (
        <div className={`min-h-screen ${focusGradient} flex items-center justify-center p-4`}>
          <div className={`${cardStyle} p-8 rounded-2xl max-w-3xl w-full`}>
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">⚠️</div>
              <h2 className={`text-3xl font-bold ${textStyle} mb-4`}>အရေးကြီးသော သတိပေးချက်</h2>
            </div>

            <div className={`${cardStyle} p-6 rounded-xl mb-8 space-y-4`}>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-yellow-400 text-xl">📋</div>
                  <div>
                    <h4 className={`font-semibold ${textStyle} mb-2`}>ဤစမ်းသပ်မှုသည်</h4>
                    <p className={`${textStyle} opacity-90 text-sm`}>
                      ကိုယ်ရေးကိုယ်တာ ဖွံ့ဖြိုးတိုးတက်မှုနှင့် မိမိကိုယ်ကို နားလည်းရန်အတွက်သာ ဖြစ်သည်။ ဆေးဘက်ဆိုင်ရာ ရောဂါရှာဖွေမှု မဟုတ်ပါ။
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="text-blue-400 text-xl">🎯</div>
                  <div>
                    <h4 className={`font-semibold ${textStyle} mb-2`}>ရလဒ်များသည်</h4>
                    <p className={`${textStyle} opacity-90 text-sm`}>
                      လမ်းညွှန်မှုသာဖြစ်ပြီး ပြီးပြည့်စုံသော ကိုယ်ရည်ကိုယ်သွေး ခွဲခြမ်းစိတ်ဖြာမှု မဟုတ်ပါ။ ကျွမ်းကျင်သူများနှင့် တိုင်ပင်ရန် အကြံပြုပါသည်။
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="text-green-400 text-xl">🔒</div>
                  <div>
                    <h4 className={`font-semibold ${textStyle} mb-2`}>ကိုယ်ရေးကိုယ်တာ လုံခြုံမှု</h4>
                    <p className={`${textStyle} opacity-90 text-sm`}>
                      သင့်ရဲ့ အဖြေများကို ကျွန်ုပ်တို့ သိမ်းဆည်းခြင်း မရှိပါ။ ရလဒ်များကို သင်ကိုယ်တိုင်သာ မြင်ရမည်ဖြစ်သည်။
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="text-purple-400 text-xl">💡</div>
                  <div>
                    <h4 className={`font-semibold ${textStyle} mb-2`}>အကြံပြုချက်</h4>
                    <p className={`${textStyle} opacity-90 text-sm`}>
                      ရိုးရှင်းစွာ ဖြေကြားပါ။ "ကောင်းသော" အဖြေရှာရန် မကြိုးစားပါနဲ့။ သင့်ရဲ့ ပထမဆုံး စိတ်ကူးကို ယုံကြည်ပါ။
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={prevOnboardingStep}
                className={`flex-1 py-3 px-6 rounded-lg ${buttonStyle} transition-all duration-200`}
              >
                ← နောက်သို့
              </button>
              <button
                onClick={nextOnboardingStep}
                className={`flex-1 py-3 px-6 rounded-lg ${buttonStyle} transition-all duration-200`}
              >
                နားလည်ပြီ →
              </button>
            </div>
          </div>
        </div>
      )
    }

    // Reference Book & Questions Source (Step 2)
    if (onboardingStep === 2) {
      return (
        <div className={`min-h-screen ${focusGradient} flex items-center justify-center p-4`}>
          <div className={`${cardStyle} p-8 rounded-2xl max-w-3xl w-full`}>
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">📚</div>
              <h2 className={`text-3xl font-bold ${textStyle} mb-4`}>မေးခွန်းများ၏ ရင်းမြစ်</h2>
              <p className={`${textStyle} opacity-90`}>ဤစမ်းသပ်မှုတွင် အသုံးပြုထားသော မေးခွန်းများ၏ မူလရင်းမြစ်</p>
            </div>

            <div className="flex flex-col items-center space-y-6 mb-8">
              <img
                src="/images/book-cover.jpg"
                alt="ငါ ဘယ်သူလဲ စာအုပ်မျက်နှာဖုံး"
                className="w-48 h-auto rounded-lg shadow-2xl"
              />

              <div className={`${cardStyle} p-6 rounded-xl text-center max-w-lg`}>
                <h3 className={`text-2xl font-bold ${textStyle} mb-3`}>"ငါ ဘယ်သူလဲ"</h3>
                <div className={`${textStyle} opacity-90 space-y-2`}>
                  <p>
                    <strong>စာရေးသူများ:</strong>
                  </p>
                  <p>ဆရာတော် ဦးဇောတိက</p>
                  <p>ဆရာမ ထက်ထက်ထွန်း (Waterfall)</p>
                  <p className="pt-3 border-t border-white/20">
                    <strong>မေးခွန်းအရေအတွက်:</strong> {questions.length} ခု
                  </p>
                  <p>
                    <strong>ဘာသာစကား:</strong> မြန်မာ
                  </p>
                </div>
              </div>
            </div>

            <div className={`${cardStyle} p-6 rounded-xl mb-8 text-center`}>
              <p className={`${textStyle} opacity-90 leading-relaxed`}>
                ဒီစမ်းစစ်ချက်လေးက ကိုယ်ရည်ကိုယ်သွေး နားလည်မှုနှင့် ကိုယ်ရေးကိုယ်တာ ဖွံ့ဖြိုးတိုးတက်မှုအတွက် ရေးသားထားသော "ငါ ဘယ်သူလဲ" စာအုပ်မှ
                မေးခွန်းများကို အခြေခံ၍ ပြုလုပ်ထားပါတယ်။
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={prevOnboardingStep}
                className={`flex-1 py-3 px-6 rounded-lg ${buttonStyle} transition-all duration-200`}
              >
                ← နောက်သို့
              </button>
              <button
                onClick={nextOnboardingStep}
                className={`flex-1 py-3 px-6 rounded-lg ${buttonStyle} transition-all duration-200`}
              >
                ရှေ့သို့ →
              </button>
            </div>
          </div>
        </div>
      )
    }

    // Instructions Page (Step 3 - Final step)
    if (onboardingStep === 3) {
      return (
        <div className={`min-h-screen ${focusGradient} flex items-center justify-center p-4`}>
          <div className={`${cardStyle} p-8 rounded-2xl max-w-2xl w-full`}>
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">📋</div>
              <h2 className={`text-3xl font-bold ${textStyle} mb-4`}>လမ်းညွှန်ချက်များ</h2>
            </div>

            <div className={`${cardStyle} p-6 rounded-xl mb-8`}>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className={`font-semibold ${textStyle} mb-2`}>ရိုးရှင်းစွာ ဖြေကြားပါ</h4>
                    <p className={`${textStyle} opacity-80`}>
                      မေးခွန်းတစ်ခုစီမှာ ရွေးချယ်စရာ နှစ်ခုပါရှိတယ်။ သင်နဲ့ အကိုက်ညီဆုံးသော အဖြေကို ရွေးချယ်ပါ။
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className={`font-semibold ${textStyle} mb-2`}>ပထမဆုံး ပေါ်လာတဲ့ စိတ်ကူးကို ယုံကြည်ပါ</h4>
                    <p className={`${textStyle} opacity-80`}>အများကြီး မတွေးဘဲ ပထမဆုံး စိတ်ထဲထင်ရှားတဲ့ အဖြေကို ရွေးပါ။</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className={`font-semibold ${textStyle} mb-2`}>မှန်သော အဖြေမရှိပါ</h4>
                    <p className={`${textStyle} opacity-80`}>
                      မှန်တာ ၊ မှားတာ မရှိပါ။ သင့်ရဲ့ စစ်မှန်သော ခံစားချက်အတိုင်းသာ ဖြေကြည့်နော်။
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className={`font-semibold ${textStyle} mb-2`}>အချိန်ယူပါ</h4>
                    <p className={`${textStyle} opacity-80`}>
                      အလျင်စလို မဖြေကြားပါနဲ့။ မေးခွန်းတစ်ခုစီကို ဂရုတစိုက် ဖတ်ပြီး ဖြေတာပိုကောင်းတယ်။
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={prevOnboardingStep}
                className={`flex-1 py-3 px-6 rounded-lg ${buttonStyle} transition-all duration-200`}
              >
                ← နောက်သို့
              </button>
              <button
                onClick={nextOnboardingStep}
                className={`flex-1 py-4 px-8 text-xl font-semibold rounded-xl ${buttonStyle} transition-all duration-300 transform hover:scale-105`}
              >
                စမ်းသပ်မှု စတင်မည် 🚀
              </button>
            </div>
          </div>
        </div>
      )
    }
  }

  if (showResults) {
    const topTypes = getTopTypes()

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div ref={resultsRef} className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">🎉 သင့်ရဲ့ Enneagram ရလဒ်များ</h1>
              <p className="text-gray-600">{questions.length} မေးခွန်းမှ ရရှိသော သင့်ရဲ့ ကိုယ်ရည်ကိုယ်သွေး ခွဲခြမ်းစိတ်ဖြာမှု</p>
            </div>

            {/* Top 3 Types */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {topTypes.map((type, index) => (
                <div
                  key={type.key}
                  className={`bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border-2 ${
                    index === 0 ? "border-yellow-400 ring-2 ring-yellow-200" : "border-gray-200"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Type {type.type}</h3>
                    <p className="text-lg text-purple-600 font-semibold mb-2">{type.myanmar}</p>
                    <p className="text-sm text-gray-600 mb-3">{type.name}</p>
                    <div className="text-2xl font-bold text-blue-600">{type.count} အမှတ်</div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          index === 0
                            ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                            : index === 1
                              ? "bg-gradient-to-r from-gray-400 to-gray-500"
                              : "bg-gradient-to-r from-orange-400 to-red-500"
                        }`}
                        style={{ width: `${(type.count / questions.length) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.round((type.count / questions.length) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Complete Ranking - All 9 Types */}
            <div className="bg-gray-50 p-6 rounded-xl mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 အမှတ်များ အပြည့်အစုံ (ကြီးစဥ်ငယ်လိုက်)</h3>

              {/* Top 3 Highlighted */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-700 mb-3">🏆 ထိပ်တန်း ၃ ခု</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {topTypes.map((type, index) => (
                    <div
                      key={type.key}
                      className={`p-4 rounded-lg border-2 ${
                        index === 0
                          ? "bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-400"
                          : index === 1
                            ? "bg-gradient-to-r from-gray-100 to-gray-200 border-gray-400"
                            : "bg-gradient-to-r from-orange-100 to-red-100 border-orange-400"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</div>
                        <div className="text-lg font-bold text-gray-800">Type {type.type}</div>
                        <div className="text-sm text-purple-600 font-semibold">{type.myanmar}</div>
                        <div className="text-xl font-bold text-blue-600 mt-2">{type.count} အမှတ်</div>
                        <div className="text-xs text-gray-500">
                          {Math.round((type.count / questions.length) * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Complete Ranking List */}
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-3">📋 အမှတ်များ အပြည့်အစုံ</h4>
                <div className="space-y-2">
                  {Object.entries(typeMapping)
                    .map(([key, type]) => ({
                      ...type,
                      key,
                      count: scores[key] || 0,
                    }))
                    .sort((a, b) => b.count - a.count)
                    .map((type, index) => (
                      <div
                        key={type.key}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          index < 3
                            ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                              index === 0
                                ? "bg-yellow-500"
                                : index === 1
                                  ? "bg-gray-500"
                                  : index === 2
                                    ? "bg-orange-500"
                                    : "bg-gray-400"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">
                              Type {type.type} - {type.myanmar}
                            </div>
                            <div className="text-sm text-gray-600">{type.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-600">{type.count}</div>
                          <div className="text-xs text-gray-500">
                            {Math.round((type.count / questions.length) * 100)}%
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Progress Bars for All Types */}
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-700 mb-3">📈 အမှတ်များ ဂရပ်ဖ်</h4>
                <div className="space-y-3">
                  {Object.entries(typeMapping)
                    .map(([key, type]) => ({
                      ...type,
                      key,
                      count: scores[key] || 0,
                    }))
                    .sort((a, b) => b.count - a.count)
                    .map((type, index) => {
                      const percentage = (type.count / questions.length) * 100
                      return (
                        <div key={type.key} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">
                              Type {type.type} - {type.myanmar}
                            </span>
                            <span className="text-sm text-gray-600">{type.count} အမှတ်</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all duration-1000 ${
                                index === 0
                                  ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                                  : index === 1
                                    ? "bg-gradient-to-r from-gray-400 to-gray-500"
                                    : index === 2
                                      ? "bg-gradient-to-r from-orange-400 to-red-500"
                                      : "bg-gradient-to-r from-blue-400 to-blue-500"
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 text-right">{Math.round(percentage)}%</div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>

            {/* AI Insight Section */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">🤖 AI ထိုးထွင်းသိမြင်မှု</h3>
              {aiInsight ? (
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">{aiInsight}</div>
              ) : (
                <div className="text-center">
                  <button
                    onClick={generateAIInsight}
                    disabled={loadingAI}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {loadingAI ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                        AI ခွဲခြမ်းစိတ်ဖြာနေသည်...
                      </>
                    ) : (
                      "AI ထိုးထွင်းသိမြင်မှု ရယူမယ်"
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={exportToPNG}
                disabled={isExporting}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                {isExporting ? "Exporting..." : "📸 PNG ဖိုင်အဖြစ် သိမ်းမယ်"}
              </button>
              <button
                onClick={exportToPDF}
                disabled={isExporting}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                {isExporting ? "Exporting..." : "📄 PDF ဖိုင်အဖြစ် သိမ်းမယ်"}
              </button>
              <button
                onClick={restartTest}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200"
              >
                🔄 ပြန်လည်စမ်းသပ်မယ်
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className={`min-h-screen ${focusGradient} flex items-center justify-center p-4`}>
      <div className={`${cardStyle} p-8 rounded-2xl max-w-4xl w-full`}>
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm ${textStyle} opacity-80`}>
              မေးခွန်း {currentQuestionIndex + 1} / {questions.length}
            </span>
            <span className={`text-sm ${textStyle} opacity-80`}>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="text-center mb-8">
          <h2 className={`text-2xl font-semibold ${textStyle} mb-8 leading-relaxed`}>
            ဖော်ပြချက် နှစ်ခုထဲကနေ သင်နဲ့ အကိုက်ညီဆုံး အဖြေကို ရွေးချယ်ပါ
          </h2>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => handleAnswer("A")}
            disabled={isTransitioning}
            className={`${cardStyle} p-8 rounded-xl text-left transition-all duration-300 transform hover:scale-105 hover:bg-white/20 disabled:opacity-50 group`}
          >
            <div className="flex items-start space-x-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 group-hover:bg-blue-400 transition-colors">
                A
              </div>
              <p className={`text-lg ${textStyle} leading-relaxed`}>{currentQuestion.statementA}</p>
            </div>
          </button>

          <button
            onClick={() => handleAnswer("B")}
            disabled={isTransitioning}
            className={`${cardStyle} p-8 rounded-xl text-left transition-all duration-300 transform hover:scale-105 hover:bg-white/20 disabled:opacity-50 group`}
          >
            <div className="flex items-start space-x-4">
              <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 group-hover:bg-purple-400 transition-colors">
                B
              </div>
              <p className={`text-lg ${textStyle} leading-relaxed`}>{currentQuestion.statementB}</p>
            </div>
          </button>
        </div>

        {/* Navigation hint */}
      </div>
    </div>
  )
}
