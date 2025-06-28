import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured. Please add it to your environment variables." },
        { status: 500 },
      )
    }

    const { topTypes, language } = await request.json()

    // Validate input
    if (!topTypes || !Array.isArray(topTypes) || topTypes.length === 0) {
      return NextResponse.json({ error: "Invalid topTypes data provided" }, { status: 400 })
    }

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Create a detailed prompt for personality insights in Myanmar only
    const prompt = `
သင်သည် Enneagram ကိုယ်ရည်ကိုယ်သွေး စိတ်ပညာရှင် ကျွမ်းကျင်သူ တစ်ဦးဖြစ်သည်။ အောက်ပါ Enneagram test ရလဒ်များကို အခြေခံ၍ အသေးစိတ်၊ ကိုယ်ပိုင်ဆန်သော ထိုးထွင်းသိမြင်မှုများကို မြန်မာဘာသာဖြင့်သာ ပေးပါ။

Test ရလဒ်များ:
- အဓိက Type: ${topTypes[0].type} - ${topTypes[0].name} (${topTypes[0].myanmar}) - အမှတ်: ${topTypes[0].count}
- ဒုတိယ Type: ${topTypes[1]?.type || "N/A"} - ${topTypes[1]?.name || "N/A"} (${topTypes[1]?.myanmar || "N/A"}) - အမှတ်: ${topTypes[1]?.count || 0}
- တတိယ Type: ${topTypes[2]?.type || "N/A"} - ${topTypes[2]?.name || "N/A"} (${topTypes[2]?.myanmar || "N/A"}) - အမှတ်: ${topTypes[2]?.count || 0}

အောက်ပါ အကြောင်းအရာများကို ခြုံငုံ၍ ထိုးထွင်းသိမြင်မှုများ ပေးပါ:

**၁. အဓိက ကိုယ်ရည်ကိုယ်သွေး ခွဲခြမ်းစိတ်ဖြာမှု**
- အဓိက လက္ခဏာများနှင့် ဂုဏ်သတ္တိများ
- အဓိက လှုံ့ဆော်မှုများနှင့် ကြောက်ရွံ့မှုများ
- အပြုအမူ ပုံစံများ

**၂. အားသာချက်များနှင့် ဖွံ့ဖြိုးတိုးတက်ရမည့် နယ်ပယ်များ**
- သဘာဝ အားသာချက်များနှင့် စွမ်းရည်များ
- ကိုယ်ရေးကိုယ်တာ ဖွံ့ဖြိုးတိုးတက်မှုအတွက် နယ်ပယ်များ
- ကျော်လွှားရမည့် ဘုံ စိန်ခေါ်မှုများ

**၃. ဆက်ဆံရေးများနှင့် ဆက်သွယ်မှု**
- အခြားသူများနှင့် ဆက်ဆံပုံ
- ဆက်သွယ်မှု ပုံစံ
- ဆက်ဆံရေး ပုံစံများ

**၄. အသက်မွေးဝမ်းကြောင်းနှင့် ဘဝလမ်းကြောင်း**
- သင့်လျော်သော အသက်မွေးဝမ်းကြောင်း လမ်းကြောင်းများ
- အလုပ်ပတ်ဝန်းကျင် နှစ်သက်မှုများ
- ခေါင်းဆောင်မှု ပုံစံ

**၅. ပေါင်းစည်းမှုနှင့် ပြိုကွဲမှု**
- ကျန်းမာသောအခါ/ဖိစီးမှုရှိသောအခါ အပြုအမူ
- ကြီးထွားမှု လမ်းကြောင်းနှင့် ဖိစီးမှု လမ်းကြောင်း
- ကိုယ်ရေးကိုယ်တာ ဖွံ့ဖြိုးတိုးတက်မှုအတွက် အကြံပြုချက်များ

ရှင်းလင်း၊ စိတ်ဝင်စားဖွယ်ရာ ပုံစံဖြင့် ဖြေကြားပါ။ အားပေးမှုနှင့် တည်ဆောက်မှုရှိသော လေသံကို အသုံးပြုပါ။

ယေဘုယျ မဟုတ်ဘဲ ကိုယ်ပိုင်ဆန်သောနှင့် လက်တွေ့ကျသော ထိုးထွင်းသိမြင်မှုများကို ဖြေကြားပါ။ လူတစ်ဦးသည် ၎င်းတို့၏ နေ့စဉ်ဘဝတွင် အသုံးပြုနိုင်သော လက်တွေ့ကျသော ထိုးထွင်းသိမြင်မှုများကို အာရုံစိုက်ပါ။

**အရေးကြီးသည်မှာ: မြန်မာဘာသာဖြင့်သာ ဖြေကြားပါ။ အင်္ဂလိပ်စာ မပါဝင်စေရပါ။**
`

    // Generate content using Gemini
    const result = await model.generateContent(prompt)
    const response = await result.response
    const insight = response.text()

    return NextResponse.json({
      insight: insight,
      timestamp: new Date().toISOString(),
      model: "gemini-1.5-flash",
      primaryType: topTypes[0],
      analysisDepth: "comprehensive",
      language: "myanmar",
    })
  } catch (error) {
    console.error("Gemini AI Error:", error)

    // Provide a helpful error message based on the error type
    let errorMessage = "Failed to generate AI insights"

    if (error.message?.includes("API_KEY")) {
      errorMessage = "Invalid API key. Please check your GEMINI_API_KEY environment variable."
    } else if (error.message?.includes("quota")) {
      errorMessage = "API quota exceeded. Please try again later."
    } else if (error.message?.includes("network")) {
      errorMessage = "Network error. Please check your internet connection."
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
