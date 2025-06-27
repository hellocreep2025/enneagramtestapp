"use client"

import { useState } from "react"

const ChildEnneagramAssessment = () => {
  const [currentStep, setCurrentStep] = useState("setup")
  const [childProfile, setChildProfile] = useState({
    age: "",
    observerRole: "",
    observationPeriod: "",
  })
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  // Complete 25-question assessment
  const questions = [
    // Social Behavior (5 questions)
    {
      id: 1,
      category: "Social Behavior",
      question: "သူငယ်ချင်းအသစ်နှင့် တွေ့သည့်အခါ ကလေးက ဘယ်လိုပြုမူလေ့ရှိလဲ?",
      statementA: "အမြန်စကားပြောပြီး ပေါင်းသင်းတယ်၊ ဂိမ်းတွေ ခေါ်ကစားတယ်",
      statementB: "ဂရုတစိုက်စောင့်ကြည့်ပြီး သူများပြောတာကို နားထောင်ရင်း တဖြည်းဖြည်းပေါင်းသင်းတယ်",
      scoresA: { 7: 3, 2: 2, 3: 1 },
      scoresB: { 9: 3, 5: 2, 4: 1 },
    },
    {
      id: 2,
      category: "Social Behavior",
      question: "အုပ်စုလုပ်ဆောင်ချက်များတွင် ကလေးက ဘယ်လို role ယူလေ့ရှိလဲ?",
      statementA: "Leader အဖြစ် ကစားနည်းများ စီစဥ်ပေးတာ နှစ်သက်တယ်",
      statementB: "အများနှင့် ပူးပေါင်းလုပ်ဆောင်ရတာ ပိုကြိုက်တယ်၊ လူတိုင်း ပျော်ရွှင်အောင် လုပ်တယ်",
      scoresA: { 8: 3, 3: 2, 1: 1 },
      scoresB: { 9: 3, 2: 2, 6: 1 },
    },
    {
      id: 3,
      category: "Social Behavior",
      question: "သူငယ်ချင်းများနှင့် အငြင်းပွားသည့်အခါ ကလေးက ဘယ်လိုတုံ့ပြန်လေ့ရှိလဲ?",
      statementA: "ကိုယ့်အမြင်ကို ရှင်းပြပြီး ပြဿနာကို ဖြေရှင်းချင်တယ်",
      statementB: "အငြင်းပွားမှု ရပ်စေချင်ပြီး အများ စိတ်ပျက်မှာ စိုးရိမ်တယ်",
      scoresA: { 8: 3, 1: 2, 3: 1 },
      scoresB: { 9: 3, 2: 2, 6: 1 },
    },
    {
      id: 4,
      category: "Social Behavior",
      question: "လူအများရဲ့ အာရုံစိုက်မှုကို ရချင်သည့်အခါ ကလေးက ဘယ်လိုလုပ်လေ့ရှိလဲ?",
      statementA: "စကားများများ ပြောပြီး ရွှင်လန်းတဲ့ လှုပ်ရှားမှုများ လုပ်တယ်",
      statementB: "ထူးခြားသော အပြုအမူများ သို့မဟုတ် တိတ်ဆိတ်စွာ စောင့်ကြည့်တယ်",
      scoresA: { 7: 3, 3: 2, 2: 1 },
      scoresB: { 4: 3, 5: 2, 1: 1 },
    },
    {
      id: 5,
      category: "Social Behavior",
      question: "အသစ်သော ပတ်ဝန်းကျင်တွင် ကလေးက ဘယ်လိုအပြုမူ ပြလေ့ရှိလဲ?",
      statementA: "တုံ့ပြန်မှုမရှိ၊ စောင့်ကြည့်ပြီး လုံခြုံမှန်း သေချာအောင် ကြိုးစားတယ်",
      statementB: "ရဲရဲတင်းတင်း လှုပ်လှုပ်ရှားရှား စူးစမ်းလေ့လာတယ်",
      scoresA: { 6: 3, 5: 2, 9: 1 },
      scoresB: { 7: 3, 8: 2, 3: 1 },
    },
    // Emotional Responses (5 questions)
    {
      id: 6,
      category: "Emotional Responses",
      question: "စိတ်မကောင်းဖြစ်သည့်အခါ ကလေးက ဘယ်လိုတုံ့ပြန်လေ့ရှိလဲ?",
      statementA: "တိတ်တဆိတ်နေပြီး တစ်ယောက်တည်းကို အချိန်ပေးချင်တယ်",
      statementB: "သူများကို လာကူညီစေချင်တယ်၊ နှစ်သိမ့်ခံချင်တယ်",
      scoresA: { 4: 3, 5: 2, 9: 1 },
      scoresB: { 2: 3, 6: 2, 7: 1 },
    },
    {
      id: 7,
      category: "Emotional Responses",
      question: "ရှုံးနိမ့်သည့်အခါ ကလေးက ဘယ်လိုတုံ့ပြန်လေ့ရှိလဲ?",
      statementA: "ဒေါသထွက်ပြီး ထပ်မံကြိုးစားချင်တယ်",
      statementB: "ဝမ်းနည်းပြီး တိတ်ဆိတ်နေတယ်၊ နှစ်သိမ့်ခံချင်တယ်",
      scoresA: { 8: 3, 3: 2, 1: 1 },
      scoresB: { 4: 3, 9: 2, 2: 1 },
    },
    {
      id: 8,
      category: "Emotional Responses",
      question: "စိတ်လှုပ်ရှားဖွယ် သတင်းကောင်းကြားရင် ကလေးက ဘယ်လိုတုံ့ပြန်လေ့ရှိလဲ?",
      statementA: "အားလုံးကို ပြောပြချင်တယ်၊ ချက်ချင်း plan များ ချမှတ်ချင်တယ်",
      statementB: "အတွင်းပိုင်းမှာ ပျော်ရွှင်သော်လည်း တည်ငြိမ်စွာ လက်ခံတယ်",
      scoresA: { 7: 3, 3: 2, 2: 1 },
      scoresB: { 5: 3, 1: 2, 9: 1 },
    },
    {
      id: 9,
      category: "Emotional Responses",
      question: "အမှားလုပ်မိသည့်အခါ ကလေးက ဘယ်လိုပြုမူလေ့ရှိလဲ?",
      statementA: "နောင်တရပြီး ချက်ချင်း ပြန်လည်ပြုပြင်ချင်တယ်",
      statementB: "ကိုယ့်ကို ကာကွယ်ပြီး အခြားသူများကို အပြစ်လွှဲတတ်တယ်",
      scoresA: { 1: 3, 2: 2, 6: 1 },
      scoresB: { 8: 3, 7: 2, 3: 1 },
    },
    {
      id: 10,
      category: "Emotional Responses",
      question: "စိတ်ခံစားမှုကို ဖော်ပြသည့်အခါ ကလေးက ဘယ်လိုလုပ်လေ့ရှိလဲ?",
      statementA: "ရှင်းလင်းစွာ ပြောပြတယ်၊ အခြားသူများ နားလည်ရန် ကြိုးစားတယ်",
      statementB: "သင်္ကေတများနှင့် ပုံဖော်တယ်၊ နားလည်ပေးမှ သာလျှင် ပြောတယ်",
      scoresA: { 3: 3, 2: 2, 7: 1 },
      scoresB: { 4: 3, 5: 2, 9: 1 },
    },
    // Learning & Problem Solving (5 questions)
    {
      id: 11,
      category: "Learning & Problem Solving",
      question: "ခက်ခဲသော စာရင်းများ ကြုံရင် ကလေးက ဘယ်လိုချဉ်းကပ်လေ့ရှိလဲ?",
      statementA: "မှန်ကန်သော နည်းလမ်းကို ရှာဖွေပြီး စနစ်တကျ လုပ်ချင်တယ်",
      statementB: "ပျော်စရာ နည်းလမ်းများ စမ်းချင်တယ်၊ မတူညီသော approach များ လုပ်ကြည့်တယ်",
      scoresA: { 1: 3, 5: 2, 6: 1 },
      scoresB: { 7: 3, 4: 2, 9: 1 },
    },
    {
      id: 12,
      category: "Learning & Problem Solving",
      question: "အကူအညီ လိုအပ်သည့်အခါ ကလေးက ဘယ်လိုပြုမူလေ့ရှိလဲ?",
      statementA: "ကိုယ့်ဘာသာ ဖြေရှင်းဖို့ ကြိုးစားပြီး လွယ်လွယ်နှင့် အကူအညီ မတောင်းဘူး",
      statementB: "သူများကို အကူအညီတောင်းရတာ သဘာဝကျပြီး ပူးပေါင်းလုပ်ရတာ ကြိုက်တယ်",
      scoresA: { 5: 3, 1: 2, 4: 1 },
      scoresB: { 2: 3, 6: 2, 9: 1 },
    },
    {
      id: 13,
      category: "Learning & Problem Solving",
      question: "အသစ်သင်ယူသည့်အခါ ကလေးက ဘယ်လိုချဉ်းကပ်လေ့ရှိလဲ?",
      statementA: "အသေးစိတ်များကို စေ့စေ့စပ်စပ် နားလည်ချင်တယ်",
      statementB: "မြန်မြန်ဆန်ဆန် သင်ယူပြီး လက်တွေ့ လုပ်ကြည့်ချင်တယ်",
      scoresA: { 5: 3, 1: 2, 4: 1 },
      scoresB: { 7: 3, 8: 2, 3: 1 },
    },
    {
      id: 14,
      category: "Learning & Problem Solving",
      question: "မေးခွန်းမေးသည့်ပုံစံ ကလေးက ဘယ်လိုမျိုးလဲ?",
      statementA: "ဘာကြောင့်လဲ၊ ဘယ်လိုလုပ်တာလဲ စသော နက်ရှိုင်းသော မေးခွန်းများ မေးတယ်",
      statementB: "ချက်ချင်း သုံးနိုင်မည့် လက်တွေ့ကျသော အဖြေများ ရှာတယ်",
      scoresA: { 5: 3, 4: 2, 1: 1 },
      scoresB: { 3: 3, 8: 2, 7: 1 },
    },
    {
      id: 15,
      category: "Learning & Problem Solving",
      question: "အလုပ်ပြီးအောင် လုပ်သည့်ပုံစံ ကလေးက ဘယ်လိုမျိုးလဲ?",
      statementA: "စုံစုံလင်လင်နဲ့ အမှားအယွင်းကင်းအောင် လုပ်ချင်တယ်",
      statementB: "အနှစ်သာရကို ရရှိပြီး ရပ်တန့်ချင်တယ်၊ ဝေးဝေးမလုပ်ဘူး",
      scoresA: { 1: 3, 3: 2, 6: 1 },
      scoresB: { 7: 3, 9: 2, 8: 1 },
    },
    // Daily Routines & Authority (5 questions)
    {
      id: 16,
      category: "Daily Routines & Authority",
      question: "နံနက်ပိုင်း routine ကို ကလေးက ဘယ်လိုကိုင်တွယ်လေ့ရှိလဲ?",
      statementA: "စနစ်တကျ ပုံသေ လုပ်ရတာ ကြိုက်တယ်၊ အချိန်မီရှိဖို့ အရေးကြီးတယ်",
      statementB: "လွတ်လပ်ပြီး ခံစားချက်အလိုက် လုပ်ရတာ ပိုကြိုက်တယ်",
      scoresA: { 1: 3, 6: 2, 3: 1 },
      scoresB: { 7: 3, 4: 2, 9: 1 },
    },
    {
      id: 17,
      category: "Daily Routines & Authority",
      question: "အပတ်စဉ်ပြောင်းလဲမှုများကို ကလေးက ဘယ်လိုတုံ့ပြန်လေ့ရှိလဲ?",
      statementA: "ကြိုတင်စီစဉ်ထားသော အစီအစဉ်များ ပြောင်းလဲရင် စိတ်အနှောက်အယှက်ဖြစ်တယ်",
      statementB: "ရုတ်တရက် ပြောင်းလဲမှုများကို စိတ်လှုပ်ရှားစွာ လက်ခံတယ်",
      scoresA: { 1: 3, 6: 2, 5: 1 },
      scoresB: { 7: 3, 8: 2, 9: 1 },
    },
    {
      id: 18,
      category: "Daily Routines & Authority",
      question: "စည်းမျဉ်းများနှင့် ပတ်သက်၍ ကလေးက ဘယ်လိုသဘောထားလေ့ရှိလဲ?",
      statementA: "စည်းမျဉ်းများကို လိုက်နာရတာ အရေးကြီးပြီး မှန်ကန်တယ်လို့ ယုံကြည်တယ်",
      statementB: "စည်းမျဉ်းများကို မေးခွန်းထုတ်တတ်ပြီး ကိုယ့်နည်းကိုယ့်ဟန် လုပ်ချင်တယ်",
      scoresA: { 1: 3, 6: 2, 2: 1 },
      scoresB: { 8: 3, 4: 2, 7: 1 },
    },
    {
      id: 19,
      category: "Daily Routines & Authority",
      question: "အကြီးအကဲများက ပြောသည့်အခါ ကလေးက ဘယ်လိုတုံ့ပြန်လေ့ရှိလဲ?",
      statementA: "လိုက်နာပြီး လေးစားစွာ ပြုမူတယ်",
      statementB: "ကိုယ့်အမြင်နှင့် ကွဲပြားရင် မေးခွန်းထုတ်တတ်တယ်",
      scoresA: { 6: 3, 9: 2, 2: 1 },
      scoresB: { 8: 3, 5: 2, 4: 1 },
    },
    {
      id: 20,
      category: "Daily Routines & Authority",
      question: "အားလပ်ချိန်တွင် ကလေးက ဘယ်လို activities တွေ ကြိုက်လေ့ရှိလဲ?",
      statementA: "တိတ်ဆိတ်သော လုပ်ဆောင်ချက်များ (စာဖတ်ခြင်း၊ ပုံဆွဲခြင်း)",
      statementB: "လှုပ်ရှားမှုများ၊ သူငယ်ချင်းများနှင့် ကစားခြင်း",
      scoresA: { 5: 3, 4: 2, 1: 1 },
      scoresB: { 7: 3, 2: 2, 8: 1 },
    },
    // Advanced Questions (Ages 10+) (5 questions)
    {
      id: 21,
      category: "Advanced",
      question: "ရည်မှန်းချက်များနှင့် ပတ်သက်၍ ကလေးက ဘယ်လိုချဉ်းကပ်လေ့ရှိလဲ?",
      statementA: "ရေရှည် ရည်မှန်းချက်များ ချမှတ်ပြီး စနစ်တကျ လုပ်ဆောင်ချင်တယ်",
      statementB: "လက်ရှိအခိုက်အတန့်မှာ ပျော်ရွှင်မှုကို ရှာဖွေ၍ ပြောင်းလွယ်ပြင်လွယ် နေချင်တယ်",
      scoresA: { 1: 3, 3: 2, 6: 1 },
      scoresB: { 7: 3, 9: 2, 4: 1 },
    },
    {
      id: 22,
      category: "Advanced",
      question: "မိတ်ဆွေများနှင့် ဆက်ဆံရေးမှာ ကလေးက ဘယ်လို approach လုပ်လေ့ရှိလဲ?",
      statementA: "အတူတူရှိနေပြီး အရာရာကို မျှဝေချင်တယ်",
      statementB: "လွတ်လပ်မှုကို လေးစားပြီး တစ်ခါတရံ တစ်ယောက်တည်း နေချင်တယ်",
      scoresA: { 2: 3, 6: 2, 9: 1 },
      scoresB: { 5: 3, 4: 2, 8: 1 },
    },
    {
      id: 23,
      category: "Advanced",
      question: "အနာဂတ်အတွက် စိုးရိမ်ပူပန်မှု ကလေးမှာ ဘယ်လိုရှိလေ့လဲ?",
      statementA: "အရာရာကို ကြိုတင်စီစဉ်ပြီး ဘေးကင်းရေးကို သေချာစေချင်တယ်",
      statementB: "အခက်အခဲများ ပေါ်လာမှ ရင်ဆိုင်မယ်၊ အခုက ပျော်ရွှင်ချင်တယ်",
      scoresA: { 6: 3, 1: 2, 5: 1 },
      scoresB: { 7: 3, 9: 2, 8: 1 },
    },
    {
      id: 24,
      category: "Advanced",
      question: "ကိုယ့်ကိုယ်ကို မြင်သည့်ပုံ ကလေးက ဘယ်လိုမျိုးလဲ?",
      statementA: "သူများနှင့် တူညီချင်တယ်၊ ထူးခြားနေရင် သိပ်သက်တောင့်သက်သာ မရှိဘူး",
      statementB: "သူများထက်ထူးချင်တယ်၊ ထူးအောင် မလုပ်ရရင် နေလို့မရဘူး",
      scoresA: { 9: 3, 6: 2, 2: 1 },
      scoresB: { 4: 3, 3: 2, 8: 1 },
    },
    {
      id: 25,
      category: "Advanced",
      question: "အခက်အခဲများနှင့် ရင်ဆိုင်သည့်အခါ ကလေးက ဘယ်လို attitude ရှိလေ့လဲ?",
      statementA: "အခက်အခဲများက ငါ့ကို ပိုမို ခိုင်မာစေတယ်၊ စိန်ခေါ်မှုအဖြစ် မြင်တယ်",
      statementB: "အခက်အခဲများက ငါ့ကို စိတ်ညစ်စေတယ်၊ ရှောင်လွှဲရတာ ပိုကောင်းတယ်",
      scoresA: { 8: 3, 3: 2, 1: 1 },
      scoresB: { 9: 3, 4: 2, 7: 1 },
    },
  ]

  // Enneagram type definitions
  const enneagramTypes = {
    1: { name: "Perfectionist", myanmar: "ပြီးပြည့်စုံမှုရှာဖွေသူ", color: "#2E8B57" },
    2: { name: "Helper", myanmar: "ကူညီပံ့ပိုးသူ", color: "#FF6B6B" },
    3: { name: "Achiever", myanmar: "အောင်မြင်မှုရှာဖွေသူ", color: "#4ECDC4" },
    4: { name: "Individualist", myanmar: "ထူးခြားမှုရှာဖွေသူ", color: "#45B7D1" },
    5: { name: "Investigator", myanmar: "စူးစမ်းလေ့လာသူ", color: "#96CEB4" },
    6: { name: "Loyalist", myanmar: "သစ္စာရှိသူ", color: "#FECA57" },
    7: { name: "Enthusiast", myanmar: "စိတ်အားထက်သန်သူ", color: "#FF9FF3" },
    8: { name: "Challenger", myanmar: "စိန်ခေါ်သူ", color: "#54A0FF" },
    9: { name: "Peacemaker", myanmar: "ငြိမ်းချမ်းရေးထားသူ", color: "#5F27CD" },
  }

  // Calculate results function
  const calculateResults = () => {
    const scores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 }

    Object.entries(answers).forEach(([questionId, choice]) => {
      const question = questions.find((q) => q.id === Number.parseInt(questionId))
      if (question) {
        const scoreKey = choice === "A" ? "scoresA" : "scoresB"
        const questionScores = question[scoreKey]
        Object.entries(questionScores).forEach(([type, points]) => {
          scores[Number.parseInt(type)] += points
        })
      }
    })

    // Age adjustment
    const ageWeight = childProfile.age <= 8 ? 0.8 : childProfile.age <= 12 ? 1.0 : 1.2
    Object.keys(scores).forEach((type) => {
      scores[type] = Math.round(scores[type] * ageWeight)
    })

    // Sort by score
    const sortedTypes = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .map(([type, score]) => ({ type: Number.parseInt(type), score }))

    return {
      primary: sortedTypes[0],
      secondary: sortedTypes[1],
      allScores: scores,
      confidence:
        sortedTypes[0].score > 0
          ? Math.round(((sortedTypes[0].score - sortedTypes[1].score) / sortedTypes[0].score) * 100)
          : 0,
    }
  }

  const handleAnswerSelect = (choice) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestionIndex].id]: choice,
    }))
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setShowResults(true)
    }
  }

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  // Setup Screen Component
  const SetupScreen = () => (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Little Patterns</h1>
        <p className="text-gray-600 text-lg">ကလေးများရဲ့ Enneagram Personality Patterns လေ့လာခြင်း</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">သင်၏ အခန်းကဏ္ဍ</label>
          <select
            value={childProfile.observerRole}
            onChange={(e) => setChildProfile((prev) => ({ ...prev, observerRole: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">ရွေးချယ်ပါ</option>
            <option value="parent">မိဘ</option>
            <option value="teacher">ဆရာ/ဆရာမ</option>
            <option value="caregiver">အုပ်ထိန်းသူ</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ကလေး၏ အသက်</label>
          <select
            value={childProfile.age}
            onChange={(e) => setChildProfile((prev) => ({ ...prev, age: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">ရွေးချယ်ပါ</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 5} value={i + 5}>
                {i + 5} နှစ်
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Observation ကာလ</label>
          <select
            value={childProfile.observationPeriod}
            onChange={(e) => setChildProfile((prev) => ({ ...prev, observationPeriod: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">ရွေးချယ်ပါ</option>
            <option value="3months">မကြာသေးသော ၃ လအတွင်း</option>
            <option value="6months">မကြာသေးသော ၆ လအတွင်း</option>
            <option value="1year">ပြီးခဲ့သော ၁ နှစ်အတွင်း</option>
          </select>
        </div>

        <button
          onClick={() => setCurrentStep("assessment")}
          disabled={!childProfile.observerRole || !childProfile.age || !childProfile.observationPeriod}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Assessment စတင်ရန် →
        </button>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>မှတ်ချက်:</strong> ဤ assessment သည် ကလေး၏ လက်ရှိ behavioral patterns များကိုသာ လေ့လာခြင်း ဖြစ်ပြီး personality ကတော့
          အချိန်ကြာလာသည်နှင့်အမျှ ပြောင်းလဲဖွံ့ဖြိုးနေဦးမှာ ဖြစ်ပါတယ်။
        </p>
      </div>
    </div>
  )

  // Assessment Screen Component
  const AssessmentScreen = () => {
    const currentQuestion = questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100

    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              မေးခွန်း {currentQuestionIndex + 1} / {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-600">{Math.round(progress)}% ပြီးပါပြီ</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentQuestion.question}</h2>
          <p className="text-gray-600">သင့်ကလေးနှင့် ပိုမို ကိုက်ညီသော statement ကို ရွေးချယ်ပါ</p>
        </div>

        {/* Statements */}
        <div className="space-y-4 mb-8">
          <button
            onClick={() => handleAnswerSelect("A")}
            className={`w-full p-6 text-left rounded-lg border-2 transition-all duration-200 ${
              answers[currentQuestion.id] === "A"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            <div className="flex items-start">
              <span className="bg-blue-100 text-blue-800 font-semibold px-3 py-1 rounded-full text-sm mr-4 mt-1">
                A
              </span>
              <p className="text-gray-800">{currentQuestion.statementA}</p>
            </div>
          </button>

          <button
            onClick={() => handleAnswerSelect("B")}
            className={`w-full p-6 text-left rounded-lg border-2 transition-all duration-200 ${
              answers[currentQuestion.id] === "B"
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-green-300 hover:bg-green-50"
            }`}
          >
            <div className="flex items-start">
              <span className="bg-green-100 text-green-800 font-semibold px-3 py-1 rounded-full text-sm mr-4 mt-1">
                B
              </span>
              <p className="text-gray-800">{currentQuestion.statementB}</p>
            </div>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← နောက်သို့
          </button>

          <button
            onClick={nextQuestion}
            disabled={!answers[currentQuestion.id]}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {currentQuestionIndex === questions.length - 1 ? "ရလဒ်ကြည့်ရန်" : "ရှေ့သို့"} →
          </button>
        </div>
      </div>
    )
  }

  // Results Screen Component
  const ResultsScreen = () => {
    const results = calculateResults()
    const primaryType = enneagramTypes[results.primary.type]
    const secondaryType = enneagramTypes[results.secondary.type]

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Main Result Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Assessment ရလဒ်</h2>
            <p className="text-gray-600">သင့်ကလေးရဲ့ လက်ရှိ behavioral patterns</p>
          </div>

          {/* Primary Type */}
          <div className="border-l-4 pl-6 mb-6" style={{ borderColor: primaryType.color }}>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              အဓိက သဘာဝ: Type {results.primary.type} - {primaryType.myanmar}
            </h3>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <span>Confidence: {results.confidence}%</span>
              <span className="mx-2">•</span>
              <span>Score: {results.primary.score} points</span>
            </div>
          </div>

          {/* Secondary Type */}
          <div className="border-l-4 border-gray-300 pl-6 mb-6">
            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              ဒုတိယ လွှမ်းမိုးမှု: Type {results.secondary.type} - {secondaryType.myanmar}
            </h4>
            <div className="text-sm text-gray-500">Score: {results.secondary.score} points</div>
          </div>

          {/* Score Distribution */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-4">Score Distribution</h4>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(results.allScores)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 6)
                .map(([type, score]) => (
                  <div key={type} className="text-center">
                    <div
                      className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: enneagramTypes[type].color }}
                    >
                      {type}
                    </div>
                    <div className="text-sm font-medium text-gray-700">{score}</div>
                    <div className="text-xs text-gray-500">{enneagramTypes[type].myanmar}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Development Suggestions */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Development Suggestions</h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-4">အားသာချက်များ</h4>
              <ul className="space-y-2 text-green-700">
                <li>• Type {results.primary.type} ရဲ့ သဘာဝအရ ပြုစုစောင့်ရှောက်နိုင်စွမ်း ရှိတယ်</li>
                <li>• လူမှုဆက်ဆံရေးမှာ ကောင်းမွန်တဲ့ အခြေခံ ရှိတယ်</li>
                <li>• ကိုယ့်သဘာဝအတိုင်း ဖွံ့ဖြိုးနေတဲ့ အခြေအနေ</li>
              </ul>
            </div>

            {/* Growth Areas */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-4">ဖွံ့ဖြိုးတိုးတက်ရမည့် နယ်ပယ်များ</h4>
              <ul className="space-y-2 text-blue-700">
                <li>• Balance ရှိတဲ့ perspective ဖွံ့ဖြိုးရန်</li>
                <li>• အခြား types တွေရဲ့ အားသာချက်တွေ လေ့လာရန်</li>
                <li>• စိတ်ခံစားမှု management skills တိုးတက်ရန်</li>
              </ul>
            </div>
          </div>

          {/* Parenting Tips */}
          <div className="mt-6 bg-yellow-50 rounded-lg p-6 border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-4">မိဘများအတွက် အကြံပြုချက်များ</h4>
            <div className="space-y-3 text-yellow-700">
              <p>• ကလေး၏ သဘာဝကို လက်ခံပြီး ပံ့ပိုးပေးပါ</p>
              <p>• Type {results.primary.type} အတွက် သင့်တော်သော environment ဖန်တီးပေးပါ</p>
              <p>• Balanced development အတွက် အခြား skills များလည်း အားပေးပါ</p>
            </div>
          </div>
        </div>

        {/* Important Disclaimers */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">အရေးကြီးသော မှတ်ချက်များ</h3>
          <div className="space-y-3 text-gray-600">
            <p>
              🔸 <strong>ဖွံ့ဖြိုးဆဲ Personality:</strong> ကလေးများ၏ personality သည် အချိန်ကြာလာသည်နှင့်အမျှ ပြောင်းလဲဖွံ့ဖြိုးနေဆဲဖြစ်သည်
            </p>
            <p>
              🔸 <strong>Development Tool:</strong> ဤ assessment သည် ကလေး၏ development ကို ပံ့ပိုးရန် tool တစ်ခုသာ ဖြစ်ပြီး
              diagnosis တစ်ခု မဟုတ်ပါ
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              setCurrentStep("setup")
              setCurrentQuestionIndex(0)
              setAnswers({})
              setShowResults(false)
              setChildProfile({ age: "", observerRole: "", observationPeriod: "" })
            }}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            အသစ်စတင်ရန်
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      {currentStep === "setup" && <SetupScreen />}
      {currentStep === "assessment" && !showResults && <AssessmentScreen />}
      {showResults && <ResultsScreen />}
    </div>
  )
}

export default ChildEnneagramAssessment
