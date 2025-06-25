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

    // Create a detailed prompt for personality insights
    const prompt = `
You are an expert Enneagram personality psychologist. Based on the following Enneagram test results, provide detailed, personalized insights in both English and Myanmar language.

Test Results:
- Primary Type: ${topTypes[0].type} - ${topTypes[0].name} (${topTypes[0].myanmar}) - Score: ${topTypes[0].count}
- Secondary Type: ${topTypes[1]?.type || "N/A"} - ${topTypes[1]?.name || "N/A"} (${topTypes[1]?.myanmar || "N/A"}) - Score: ${topTypes[1]?.count || 0}
- Third Type: ${topTypes[2]?.type || "N/A"} - ${topTypes[2]?.name || "N/A"} (${topTypes[2]?.myanmar || "N/A"}) - Score: ${topTypes[2]?.count || 0}

Please provide insights covering:

1. **Core Personality Analysis** (English & Myanmar)
   - Main characteristics and traits
   - Core motivations and fears
   - Behavioral patterns

2. **Strengths & Growth Areas** (English & Myanmar)
   - Natural strengths and talents
   - Areas for personal development
   - Common challenges to overcome

3. **Relationships & Communication** (English & Myanmar)
   - How they interact with others
   - Communication style
   - Relationship patterns

4. **Career & Life Path** (English & Myanmar)
   - Suitable career directions
   - Work environment preferences
   - Leadership style

5. **Integration & Disintegration** (English & Myanmar)
   - How they behave when healthy/stressed
   - Growth direction and stress direction
   - Tips for personal development

Format the response in a clear, engaging way with both English and Myanmar translations. Use emojis and formatting to make it visually appealing. Keep the tone encouraging and constructive.

Make it personal and actionable, not generic. Focus on practical insights the person can use in their daily life.
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
