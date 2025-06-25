"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ExternalLink, Play } from "lucide-react"

export function QuickSheetConnector() {
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  const userSheetId = "12tgm-6KM1w5kUK_stJbLJCnwskiHZQIQTeYvPbmWtgQ"

  const testUserSheet = async () => {
    setTesting(true)
    setTestResult(null)

    try {
      const response = await fetch(`/api/load-google-sheet?sheetId=${userSheetId}`)
      const data = await response.json()

      if (response.ok) {
        setTestResult({
          success: true,
          questionCount: data.questions.length,
          title: data.title,
          sampleQuestions: data.questions.slice(0, 3),
          loadedVia: data._loadedVia,
        })
      } else {
        setTestResult({
          error: data.error,
          details: data.details,
          suggestions: data.suggestions,
        })
      }
    } catch (error) {
      setTestResult({
        error: "Network error",
        details: [error.message],
      })
    }

    setTesting(false)
  }

  const useUserSheet = () => {
    const currentUrl = new URL(window.location.href)
    currentUrl.searchParams.set("sheetId", userSheetId)
    window.location.href = currentUrl.toString()
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎯 သင့် Google Sheet ချိတ်ဆက်မယ်
          <Badge variant="default">Ready to Connect</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sheet Info */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">✅ Sheet Information:</h4>
          <div className="text-sm text-green-700 space-y-1">
            <p>
              <strong>Sheet ID:</strong> {userSheetId}
            </p>
            <p>
              <strong>Format:</strong> Perfect (ID, Statement A, Statement B, Score A, Score B)
            </p>
            <p>
              <strong>Language:</strong> Myanmar ✅
            </p>
            <p>
              <strong>Status:</strong> Ready to connect
            </p>
          </div>
        </div>

        {/* Test Button */}
        <div className="text-center space-y-3">
          <Button onClick={testUserSheet} disabled={testing} size="lg" className="flex items-center gap-2">
            {testing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Testing Connection...
              </>
            ) : (
              <>
                <Play size={16} />
                Test Your Google Sheet
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground">This will test if your Google Sheet can be loaded properly</p>
        </div>

        {/* Test Results */}
        {testResult && (
          <div
            className={`p-4 rounded-lg border ${
              testResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
            }`}
          >
            {testResult.success ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle size={16} />
                  <span className="font-medium">🎉 Connection Successful!</span>
                </div>
                <div className="text-sm text-green-600 space-y-1">
                  <p>
                    <strong>Questions Loaded:</strong> {testResult.questionCount}
                  </p>
                  <p>
                    <strong>Method:</strong> {testResult.loadedVia}
                  </p>
                  <p>
                    <strong>Title:</strong> {testResult.title}
                  </p>
                </div>

                {testResult.sampleQuestions && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-green-700 mb-2">Sample Questions Preview:</p>
                    <div className="space-y-1">
                      {testResult.sampleQuestions.map((q, i) => (
                        <div key={i} className="text-xs bg-green-100 p-2 rounded">
                          <strong>Q{q.id}:</strong> {q.statementA.substring(0, 30)}... | {q.statementB.substring(0, 30)}
                          ...
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button onClick={useUserSheet} className="mt-3 w-full">
                  🚀 Start Test with Your Questions
                </Button>
              </div>
            ) : (
              <div className="text-red-700 space-y-3">
                <p className="font-medium">❌ Connection Failed:</p>
                <p className="text-sm">{testResult.error}</p>

                {testResult.details && (
                  <div className="text-xs bg-red-100 p-2 rounded">
                    <p className="font-medium mb-1">Details:</p>
                    <ul className="space-y-1">
                      {testResult.details.map((detail, index) => (
                        <li key={index}>• {detail}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {testResult.suggestions && (
                  <div className="text-sm">
                    <p className="font-medium mb-1">💡 Try these solutions:</p>
                    <ul className="space-y-1">
                      {testResult.suggestions.map((suggestion, index) => (
                        <li key={index}>• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a
            href={`https://docs.google.com/spreadsheets/d/${userSheetId}/edit`}
            target="_blank"
            className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors text-sm"
            rel="noreferrer"
          >
            <span>📊</span>
            <div>
              <p className="font-medium">View Your Sheet</p>
              <p className="text-xs text-muted-foreground">Open in Google Sheets</p>
            </div>
            <ExternalLink size={12} className="ml-auto" />
          </a>

          <button
            onClick={() => {
              const url = `${window.location.origin}?sheetId=${userSheetId}`
              navigator.clipboard.writeText(url)
              alert("Direct link copied!")
            }}
            className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <span>🔗</span>
            <div>
              <p className="font-medium">Copy Direct Link</p>
              <p className="text-xs text-muted-foreground">Share with others</p>
            </div>
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">📋 Next Steps:</h4>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Click "Test Your Google Sheet" above</li>
            <li>2. If successful, click "Start Test with Your Questions"</li>
            <li>3. If failed, check the error messages and solutions</li>
            <li>4. Make sure your sheet is shared publicly</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
