"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, Play, ExternalLink } from "lucide-react"

export function DirectSheetLoader() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  // Your specific Google Sheet ID
  const SHEET_ID = "12tgm-6KM1w5kUK_stJbLJCnwskiHZQIQTeYvPbmWtgQ"

  const loadDirectly = async () => {
    setLoading(true)
    setResult(null)

    try {
      console.log("🎯 Loading directly from your Google Sheet...")

      const response = await fetch(`/api/load-google-sheet?sheetId=${SHEET_ID}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
      })

      console.log(`📊 Response status: ${response.status}`)

      if (response.ok) {
        const data = await response.json()
        console.log("✅ Success! Data received:", {
          questionCount: data.questions?.length || 0,
          title: data.title,
          loadedVia: data._loadedVia,
        })

        setResult({
          success: true,
          data: data,
          questionCount: data.questions?.length || 0,
          title: data.title || "Enneagram Test",
          loadedVia: data._loadedVia || "Google Sheets",
        })
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        console.error("❌ Failed:", errorData)

        setResult({
          success: false,
          error: errorData.error || "Failed to load",
          details: errorData.details || [],
          suggestions: errorData.suggestions || [],
        })
      }
    } catch (error) {
      console.error("🚨 Network error:", error)
      setResult({
        success: false,
        error: "Network error: " + error.message,
        details: ["Check your internet connection", "Make sure the API route is working"],
        suggestions: ["Try refreshing the page", "Check browser console for more details"],
      })
    }

    setLoading(false)
  }

  const useThisData = () => {
    if (result?.success && result?.data) {
      // Store the data in localStorage for immediate use
      localStorage.setItem("enneagram-questions", JSON.stringify(result.data))

      // Reload the page to use the stored data
      window.location.reload()
    }
  }

  return (
    <div className="space-y-6">
      {/* Big Prominent Button */}
      <div className="text-center space-y-4">
        <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-xl">
          <h3 className="text-2xl font-bold text-green-800 mb-2">🚀 သင့် Google Sheet ကို Load လုပ်မယ်!</h3>
          <p className="text-green-700 mb-4">
            Sheet ID: <code className="bg-white px-2 py-1 rounded text-sm">{SHEET_ID}</code>
          </p>
          <Button
            onClick={loadDirectly}
            disabled={loading}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Loading from Google Sheets...
              </>
            ) : (
              <>
                <Play size={20} className="mr-2" />
                Load My Questions Now!
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Sheet Info */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">📊 Your Google Sheet Info:</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>
            <strong>Sheet ID:</strong> {SHEET_ID}
          </p>
          <p>
            <strong>URL:</strong>{" "}
            <a
              href={`https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              View Your Sheet <ExternalLink size={12} />
            </a>
          </p>
          <p>
            <strong>Expected Format:</strong> ID, Statement A, Statement B, Score A, Score B
          </p>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div
          className={`p-6 rounded-lg border-2 ${
            result.success ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"
          }`}
        >
          {result.success ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle size={20} />
                <span className="font-bold text-lg">🎉 Successfully Loaded!</span>
              </div>

              <div className="text-green-600 space-y-2">
                <p className="text-lg">
                  <strong>Questions Found:</strong> {result.questionCount}
                </p>
                <p>
                  <strong>Title:</strong> {result.title}
                </p>
                <p>
                  <strong>Method:</strong> {result.loadedVia}
                </p>
              </div>

              {result.data?.questions && result.data.questions.length > 0 && (
                <div className="mt-4">
                  <p className="font-medium text-green-700 mb-2">Sample Questions Preview:</p>
                  <div className="space-y-2">
                    {result.data.questions.slice(0, 3).map((q, i) => (
                      <div key={i} className="text-sm bg-green-100 p-3 rounded">
                        <strong>Q{q.id}:</strong> {q.statementA?.substring(0, 50)}... | {q.statementB?.substring(0, 50)}
                        ...
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={useThisData} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg">
                🚀 Start Test with These Questions!
              </Button>
            </div>
          ) : (
            <div className="text-red-700 space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} />
                <span className="font-bold text-lg">❌ Loading Failed</span>
              </div>

              <p className="text-lg">{result.error}</p>

              {result.details && result.details.length > 0 && (
                <div className="bg-red-100 p-3 rounded">
                  <p className="font-medium mb-2">Details:</p>
                  <ul className="space-y-1">
                    {result.details.map((detail, index) => (
                      <li key={index}>• {detail}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.suggestions && result.suggestions.length > 0 && (
                <div>
                  <p className="font-medium mb-2">💡 Try these solutions:</p>
                  <ul className="space-y-1">
                    {result.suggestions.map((suggestion, index) => (
                      <li key={index}>• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2">📋 Before clicking "Load":</h4>
        <ol className="text-sm text-yellow-700 space-y-1">
          <li>1. Make sure your Google Sheet is shared publicly ("Anyone with the link can view")</li>
          <li>2. Check that columns are: ID, Statement A, Statement B, Score A, Score B</li>
          <li>3. Verify Myanmar text is properly formatted</li>
          <li>4. Ensure there are no empty rows between questions</li>
        </ol>
      </div>
    </div>
  )
}
