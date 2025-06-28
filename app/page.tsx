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
    A: { type: 9, name: "The Peacemaker", myanmar: "ငြိမ်းချမ်းရေးဆောင်ကြဉ်းသူ" },
    B: { type: 6, name: "The Loyalist", myanmar: "သစ္စာရှိသူ" },
    C: { type: 3, name: "The Achiever", myanmar: "အောင်မြင်သူ" },
    D: { type: 1, name: "The Perfectionist", myanmar: "ပြီးပြည့်စုံမှုရှာသူ" },
    E: { type: 4, name: "The Individualist", myanmar: "ကိုယ်ပိုင်လမ်းသွားသူ" },
    F: { type: 2, name: "The Helper", myanmar: "ကူညီသူ" },
    G: { type: 8, name: "The Challenger", myanmar: "စိန်ခေါ်သူ" },
    H: { type: 5, name: "The Investigator", myanmar: "စုံစမ်းသူ" },
    I: { type: 7, name: "The Enthusiast", myanmar: "စိတ်အားထက်သန်သူ" },
  }

  // Detailed type descriptions
  const typeDescriptions = {
    1: {
      name: "The Perfectionist",
      myanmar: "ပြီးပြည့်စုံမှုရှာသူ",
      description: "စံထားချက်မြင့်မားပြီး အမှန်တရားကို ရှာဖွေသူ",
      traits: ["စံထားချက်မြင့်", "တာဝန်သိ", "စည်းကမ်းရှိ", "အမှန်တရားရှာ"],
    },
    2: {
      name: "The Helper",
      myanmar: "ကူညီသူ",
      description: "အခြားသူများကို ကူညီရန် စိတ်အားထက်သန်သူ",
      traits: ["စာနာမှုရှိ", "ကူညီချင်", "ဆက်ဆံရေးကောင်း", "အခြားသူဦးစား"],
    },
    3: {
      name: "The Achiever",
      myanmar: "အောင်မြင်သူ",
      description: "ရည်မှန်းချက်များကို အောင်မြင်အောင် လုပ်ဆောင်သူ",
      traits: ["ရည်မှန်းချက်ရှိ", "အောင်မြင်ချင်", "လုပ်ဆောင်ရည်မြင့်", "ခေါင်းဆောင်မှု"],
    },
    4: {
      name: "The Individualist",
      myanmar: "ကိုယ်ပိုင်လမ်းသွားသူ",
      description: "ကိုယ်ပိုင်ဝိသေသလက္ခဏာကို ရှာဖွေသူ",
      traits: ["ဖန်တီးမှုရှိ", "ခံစားမှုနက်", "ကိုယ်ပိုင်စတိုင်", "အနုပညာစိတ်"],
    },
    5: {
      name: "The Investigator",
      myanmar: "စုံစမ်းသူ",
      description: "ဗဟုသုတနှင့် နားလည်မှုကို စုဆောင်းသူ",
      traits: ["စုံစမ်းလေ့လာ", "လွတ်လပ်ချင်", "ပုဂ္ဂလိကရေး", "ဉာဏ်ပညာရှာ"],
    },
    6: {
      name: "The Loyalist",
      myanmar: "သစ္စာရှိသူ",
      description: "လုံခြုံမှုနှင့် ယုံကြည်စိတ်ချရမှုကို ရှာဖွေသူ",
      traits: ["သစ္စာရှိ", "တာဝန်သိ", "ဂရုစိုက်", "အဖွဲ့လိုက်လုပ်"],
    },
    7: {
      name: "The Enthusiast",
      myanmar: "စိတ်အားထက်သန်သူ",
      description: "အတွေ့အကြုံအသစ်များကို ရှာဖွေသူ",
      traits: ["စိတ်အားထက်သန်", "ပျော်ရွှင်", "စွန့်စားမှု", "အပြုသဘော"],
    },
    8: {
      name: "The Challenger",
      myanmar: "စိန်ခေါ်သူ",
      description: "ခွန်အားနှင့် ထိန်းချုပ်မှုကို အသုံးပြုသူ",
      traits: ["ခေါင်းဆောင်မှု", "ခွန်အားရှိ", "တရားမျှတမှု", "ကာကွယ်မှု"],
    },
    9: {
      name: "The Peacemaker",
      myanmar: "ငြိမ်းချမ်းရေးဆောင်ကြဉ်းသူ",
      description: "သဟဇာတနှင့် ငြိမ်းချမ်းမှုကို ရှာဖွေသူ",
      traits: ["ငြိမ်းချမ်း", "လက်ခံနိုင်", "စာနာမှု", "ညှိနှိုင်းမှု"],
    },
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
    const response = await fetch(`/api/load-google-sheet?sheetId=${sheetId}`)
    if (!response.ok) {
      throw new Error(`Google Sheets API failed: ${response.status}`)
    }
    const data = await response.json()
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
    if (onboardingStep < 6) {
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

  // Landing Pages / Onboarding Flow
  if (!testStarted) {
    // Welcome Page
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

    // Disclaimer Page
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
                      ရိုးရှင်းစွာ ဖြေကြားပါ။ "ကောင်းသော" အဖြေရှာရန် မကြိုးစားပါနှင့်။ သင့်ရဲ့ ပထမဆုံး စိတ်ကူးကို ယုံကြည်ပါ။
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

    // 9 Types Overview
    if (onboardingStep === 2) {
      return (
        <div className={`min-h-screen ${focusGradient} flex items-center justify-center p-4`}>
          <div className={`${cardStyle} p-8 rounded-2xl max-w-6xl w-full`}>
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🎭</div>
              <h2 className={`text-3xl font-bold ${textStyle} mb-4`}>Enneagram ၉ မျိုး အမျိုးအစားများ</h2>
              <p className={`${textStyle} opacity-90`}>သင့်ရဲ့ ကိုယ်ရည်ကိုယ်သွေး အမျိုးအစားကို ရှာဖွေရန် အောက်ပါ ၉ မျိုးထဲမှ တစ်ခုဖြစ်မည်</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {Object.entries(typeDescriptions).map(([typeNum, info]) => (
                <div key={typeNum} className={`${cardStyle} p-4 rounded-xl`}>
                  <div className="text-center mb-3">
                    <div className={`text-2xl font-bold ${textStyle} mb-1`}>Type {typeNum}</div>
                    <div className={`text-lg ${textStyle} font-semibold mb-1`}>{info.myanmar}</div>
                    <div className={`text-sm ${textStyle} opacity-80 mb-2`}>{info.name}</div>
                  </div>
                  <p className={`text-sm ${textStyle} opacity-90 mb-3 text-center`}>{info.description}</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {info.traits.map((trait, index) => (
                      <span key={index} className="bg-white/20 text-white text-xs px-2 py-1 rounded">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
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

    // Instructions Page
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
                      မေးခွန်းတစ်ခုစီတွင် ရွေးချယ်စရာ နှစ်ခုပါရှိသည်။ သင့်နှင့် အကြိုက်ညီဆုံးသော အဖြေကို ရွေးချယ်ပါ။
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className={`font-semibold ${textStyle} mb-2`}>ပထမဆုံး စိတ်ကူးကို ယုံကြည်ပါ</h4>
                    <p className={`${textStyle} opacity-80`}>အများကြီး မတွေးတောဘဲ ပထမဆုံး စိတ်ကူးပေါက်သော အဖြေကို ရွေးပါ။</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className={`font-semibold ${textStyle} mb-2`}>မှန်သော အဖြေမရှိပါ</h4>
                    <p className={`${textStyle} opacity-80`}>
                      ဤစမ်းသပ်မှုတွင် မှန်သော သို့မဟုတ် မှားသော အဖြေမရှိပါ။ သင့်ရဲ့ စစ်မှန်သော ခံစားချက်ကိုသာ ဖြေကြားပါ။
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
                      အလျင်အမြန် မဖြေကြားပါနှင့်။ မေးခွန်းတစ်ခုစီကို ဂရုတစိုက် ဖတ်ပြီး ဖြေကြားပါ။
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
                ရှေ့သို့ →
              </button>
            </div>
          </div>
        </div>
      )
    }

    // Test Info Page
    if (onboardingStep === 4) {
      return (
        <div className={`min-h-screen ${focusGradient} flex items-center justify-center p-4`}>
          <div className={`${cardStyle} p-8 rounded-2xl max-w-2xl w-full`}>
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">📊</div>
              <h2 className={`text-3xl font-bold ${textStyle} mb-4`}>စမ်းသပ်မှု အချက်အလက်များ</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className={`${cardStyle} p-6 rounded-xl text-center`}>
                <div className={`text-3xl font-bold ${textStyle} mb-2`}>{questions.length}</div>
                <div className={`text-sm ${textStyle} opacity-80`}>မေးခွန်းများ</div>
              </div>
              <div className={`${cardStyle} p-6 rounded-xl text-center`}>
                <div className={`text-3xl font-bold ${textStyle} mb-2`}>~{Math.ceil(questions.length / 2)}</div>
                <div className={`text-sm ${textStyle} opacity-80`}>မိနစ်ခန့်</div>
              </div>
              <div className={`${cardStyle} p-6 rounded-xl text-center`}>
                <div className={`text-3xl font-bold ${textStyle} mb-2`}>9</div>
                <div className={`text-sm ${textStyle} opacity-80`}>ကိုယ်ရည်ကိုယ်သွေး အမျိုးအစား</div>
              </div>
            </div>

            <div className={`${cardStyle} p-6 rounded-xl mb-8`}>
              <h3 className={`text-lg font-semibold ${textStyle} mb-4`}>🎯 သင် ရရှိမည့်အရာများ</h3>
              <ul className={`${textStyle} opacity-90 space-y-2`}>
                <li>• သင့်ရဲ့ အဓိက ကိုယ်ရည်ကိုယ်သွေး အမျိုးအစား (Top 3)</li>
                <li>• အားသာချက်များနှင့် ဖွံ့ဖြိုးတိုးတက်ရမည့် နယ်ပယ်များ</li>
                <li>• AI မှ ပေးသော အသေးစိတ် ထိုးထွင်းသိမြင်မှုများ (မြန်မာဘာသာဖြင့်)</li>
                <li>• ကိုယ်ရေးကိုယ်တာ ဖွံ့ဖြိုးတိုးတက်မှုအတွက် အကြံပြုချက်များ</li>
                <li>• ရလဒ်များကို PNG/PDF အဖြစ် သိမ်းဆည်းနိုင်မှု</li>
              </ul>
            </div>

            <div className={`${cardStyle} p-6 rounded-xl mb-8`}>
              <h3 className={`text-lg font-semibold ${textStyle} mb-4`}>📈 Data Source</h3>
              <div className={`${textStyle} opacity-90 space-y-2`}>
                <p>
                  <strong>ရင်းမြစ်:</strong> {dataSource}
                </p>
                <p>
                  <strong>မေးခွန်းအရေအတွက်:</strong> {questions.length} ခု
                </p>
                <p>
                  <strong>ဘာသာစကား:</strong> မြန်မာ
                </p>
                <p>
                  <strong>AI ပံ့ပိုးမှု:</strong> Google Gemini
                </p>
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
                ရှေ့သို့ →
              </button>
            </div>
          </div>
        </div>
      )
    }

    // Privacy & Features
    if (onboardingStep === 5) {
      return (
        <div className={`min-h-screen ${focusGradient} flex items-center justify-center p-4`}>
          <div className={`${cardStyle} p-8 rounded-2xl max-w-3xl w-full`}>
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🔐</div>
              <h2 className={`text-3xl font-bold ${textStyle} mb-4`}>လုံခြုံမှုနှင့် Features များ</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className={`${cardStyle} p-6 rounded-xl`}>
                <h3 className={`text-lg font-semibold ${textStyle} mb-4`}>🔒 ကိုယ်ရေးကိုယ်တာ လုံခြုံမှု</h3>
                <ul className={`${textStyle} opacity-90 space-y-2 text-sm`}>
                  <li>• သင့်အဖြေများ သိမ်းဆည်းခြင်း မရှိပါ</li>
                  <li>• Server တွင် data မကျန်ရှိပါ</li>
                  <li>• Local browser တွင်သာ လုပ်ဆောင်သည်</li>
                  <li>• ကိုယ်ရေးကိုယ်တာ အချက်အလက် မတောင်းခံပါ</li>
                </ul>
              </div>

              <div className={`${cardStyle} p-6 rounded-xl`}>
                <h3 className={`text-lg font-semibold ${textStyle} mb-4`}>🚀 အထူး Features များ</h3>
                <ul className={`${textStyle} opacity-90 space-y-2 text-sm`}>
                  <li>• AI ထိုးထွင်းသိမြင်မှု (မြန်မာဘာသာ)</li>
                  <li>• PNG/PDF Export လုပ်���ောင်ချက်</li>
                  <li>• Real-time Progress Tracking</li>
                  <li>• Mobile-friendly Design</li>
                </ul>
              </div>
            </div>

            <div className={`${cardStyle} p-6 rounded-xl mb-8`}>
              <h3 className={`text-lg font-semibold ${textStyle} mb-4`}>⚡ စမ်းသပ်မှု လုပ်ငန်းစဉ်</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mx-auto mb-2">
                    1
                  </div>
                  <div className={`text-sm ${textStyle} opacity-90`}>မေးခွန်းများ ဖြေကြားခြင်း</div>
                </div>
                <div className="text-center">
                  <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mx-auto mb-2">
                    2
                  </div>
                  <div className={`text-sm ${textStyle} opacity-90`}>အမှတ်များ တွက်ချက်ခြင်း</div>
                </div>
                <div className="text-center">
                  <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mx-auto mb-2">
                    3
                  </div>
                  <div className={`text-sm ${textStyle} opacity-90`}>ရလဒ်များ ပြသခြင်း</div>
                </div>
                <div className="text-center">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mx-auto mb-2">
                    4
                  </div>
                  <div className={`text-sm ${textStyle} opacity-90`}>AI ထိုးထွင်းသိမြင်မှု</div>
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
                ရှေ့သို့ →
              </button>
            </div>
          </div>
        </div>
      )
    }

    // Ready to Start Page
    if (onboardingStep === 6) {
      return (
        <div className={`min-h-screen ${focusGradient} flex items-center justify-center p-4`}>
          <div className={`${cardStyle} p-8 rounded-2xl text-center max-w-2xl w-full`}>
            <div className="mb-8">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className={`text-3xl font-bold ${textStyle} mb-4`}>စမ်းသပ်မှု စတင်ရန် အသင့်ဖြစ်ပါပြီ!</h2>
              <p className={`text-lg ${textStyle} opacity-90 mb-6`}>
                သင့်ရဲ့ စစ်မှန်သော ကိုယ်ရည်ကိုယ်သွေးကို ရှာဖွေရန် အသင့်ဖြစ်ပါပြီ။ အချိန်ယူပြီး ရိုးရှင်းစွာ ဖြေကြားပါ။
              </p>
            </div>

            <div className={`${cardStyle} p-6 rounded-xl mb-8`}>
              <h3 className={`text-lg font-semibold ${textStyle} mb-4`}>💡 နောက်ဆုံး အကြံပြုချက်များ</h3>
              <div className="space-y-3">
                <p className={`${textStyle} opacity-90 text-sm`}>
                  ✨ <strong>စိတ်ငြိမ်ငြိမ်ထားပါ:</strong> အလျင်အမြန် မဖြေကြားပါနှင့်
                </p>
                <p className={`${textStyle} opacity-90 text-sm`}>
                  🎯 <strong>ပထမဆုံး စိတ်ကူးကို ယုံကြည်ပါ:</strong> အများကြီး မတွေးတောပါနှင့်
                </p>
                <p className={`${textStyle} opacity-90 text-sm`}>
                  💭 <strong>ရိုးရှင်းစွာ ဖြေကြားပါ:</strong> "ကောင်းသော" အဖြေရှာရန် မကြိုးစားပါနှင့်
                </p>
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

            {/* All Scores */}
            <div className="bg-gray-50 p-6 rounded-xl mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 အမှတ်စုစုပေါင်း</h3>
              <div className="grid grid-cols-3 md:grid-cols-9 gap-3">
                {Object.entries(typeMapping).map(([key, type]) => (
                  <div key={key} className="text-center">
                    <div className="bg-white p-3 rounded-lg shadow">
                      <div className="text-lg font-bold text-gray-800">Type {type.type}</div>
                      <div className="text-2xl font-bold text-blue-600">{scores[key] || 0}</div>
                      <div className="text-xs text-gray-500">{type.myanmar}</div>
                    </div>
                  </div>
                ))}
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
                      "AI ထိုးထွင်းသိမြင်မှု ရယူမည်"
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
                {isExporting ? "Exporting..." : "📸 PNG ဖိုင်အဖြစ် သိမ်းမည်"}
              </button>
              <button
                onClick={exportToPDF}
                disabled={isExporting}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                {isExporting ? "Exporting..." : "📄 PDF ဖိုင်အဖြစ် သိမ်းမည်"}
              </button>
              <button
                onClick={restartTest}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200"
              >
                🔄 ပြန်လည်စမ်းသပ်မည်
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
            အောက်ပါ ဖော်ပြချက် နှစ်ခုထဲမှ သင်နဲ့ အကြိုက်ညီဆုံး အဖြေကို ရွေးချယ်ပါ
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
