"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Settings, ExternalLink, Copy, CheckCircle } from "lucide-react"

export function FileConfigPanel() {
  const [fileId, setFileId] = useState("")
  const [testResult, setTestResult] = useState(null)
  const [testing, setTesting] = useState(false)

  const testFileId = async () => {
    if (!fileId.trim()) {
      setTestResult({ error: "Please enter a file ID" })
      return
    }

    setTesting(true)
    setTestResult(null)

    try {
      // Test multiple URL formats like the main app does
      const urlsToTest = [
        `https://drive.google.com/uc?export=download&id=${fileId}`,
        `https://drive.google.com/uc?id=${fileId}&export=download`,
        `https://docs.google.com/uc?export=download&id=${fileId}`,
      ]

      let bestResult = null
      const allErrors = []

      for (let i = 0; i < urlsToTest.length; i++) {
        const testUrl = urlsToTest[i]
        try {
          console.log(`Testing URL ${i + 1}: ${testUrl}`)

          const response = await fetch(testUrl, {
            signal: AbortSignal.timeout(10000), // 10 second timeout
          })

          const responseText = await response.text()

          if (response.ok && responseText.length > 0) {
            // Check if it's HTML (error page)
            if (responseText.trim().startsWith("<!DOCTYPE html>") || responseText.includes("<html")) {
              allErrors.push(`URL ${i + 1}: Received HTML page (likely permission issue)`)
              continue
            }

            // Check for virus scan warning
            if (responseText.includes("virus scan")) {
              allErrors.push(`URL ${i + 1}: File too large for automatic download`)
              continue
            }

            // Try to parse JSON
            try {
              const json = JSON.parse(responseText)

              // Validate structure
              if (json.questions && Array.isArray(json.questions)) {
                bestResult = {
                  success: true,
                  questionCount: json.questions.length,
                  title: json.title || "Untitled",
                  version: json.version || "Unknown",
                  url: testUrl,
                  responseSize: responseText.length,
                }
                break // Found working URL
              } else {
                allErrors.push(`URL ${i + 1}: Valid JSON but missing questions array`)
              }
            } catch (parseError) {
              allErrors.push(`URL ${i + 1}: Invalid JSON - ${parseError.message}`)
            }
          } else {
            allErrors.push(`URL ${i + 1}: HTTP ${response.status} - ${response.statusText}`)
          }
        } catch (error) {
          allErrors.push(`URL ${i + 1}: ${error.message}`)
        }
      }

      if (bestResult) {
        setTestResult(bestResult)
      } else {
        setTestResult({
          error: "All test URLs failed",
          details: allErrors,
          suggestions: [
            "Make sure the file is shared publicly ('Anyone with the link can view')",
            "Verify the file ID is correct (extract from Google Drive share URL)",
            "Check that the file is a valid JSON file with questions array",
            "Try uploading a smaller file if you get virus scan warnings",
          ],
        })
      }
    } catch (error) {
      setTestResult({
        error: error.message,
        suggestions: [
          "Check your internet connection",
          "Make sure the file ID format is correct",
          "Verify Google Drive file permissions",
        ],
      })
    }

    setTesting(false)
  }

  const useFileId = () => {
    const currentUrl = new URL(window.location.href)
    currentUrl.searchParams.set("fileId", fileId)
    window.location.href = currentUrl.toString()
  }

  const copyExampleUrl = () => {
    const exampleUrl = `${window.location.origin}?fileId=YOUR_FILE_ID_HERE`
    navigator.clipboard.writeText(exampleUrl)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="text-blue-500" size={24} />
          Configure Google Drive File
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Google Drive File ID:</label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter your Google Drive file ID..."
              value={fileId}
              onChange={(e) => setFileId(e.target.value)}
              className="flex-1"
            />
            <Button onClick={testFileId} disabled={testing || !fileId.trim()}>
              {testing ? "Testing..." : "Test"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Extract the file ID from your Google Drive share URL:
            <code className="bg-gray-100 px-1 rounded ml-1">
              https://drive.google.com/file/d/<strong>FILE_ID_HERE</strong>/view
            </code>
          </p>
        </div>

        {testResult && (
          <div
            className={`p-4 rounded-lg border ${testResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
          >
            {testResult.success ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle size={16} />
                  <span className="font-medium">File loaded successfully!</span>
                </div>
                <div className="text-sm text-green-600 space-y-1">
                  <p>
                    <strong>Title:</strong> {testResult.title}
                  </p>
                  <p>
                    <strong>Questions:</strong> {testResult.questionCount}
                  </p>
                  <p>
                    <strong>Version:</strong> {testResult.version}
                  </p>
                  <p>
                    <strong>File Size:</strong> {(testResult.responseSize / 1024).toFixed(1)} KB
                  </p>
                  <p>
                    <strong>Working URL:</strong>{" "}
                    <code className="text-xs bg-green-100 px-1 rounded">{testResult.url}</code>
                  </p>
                </div>
                <Button onClick={useFileId} className="mt-2">
                  Use This File
                </Button>
              </div>
            ) : (
              <div className="text-red-700 space-y-3">
                <p className="font-medium">❌ Error loading file:</p>
                <p className="text-sm">{testResult.error}</p>

                {testResult.details && (
                  <div className="text-xs bg-red-100 p-2 rounded">
                    <p className="font-medium mb-1">Detailed errors:</p>
                    <ul className="space-y-1">
                      {testResult.details.map((detail, index) => (
                        <li key={index}>• {detail}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {testResult.suggestions && (
                  <div className="text-sm">
                    <p className="font-medium mb-1">💡 Suggestions:</p>
                    <ul className="space-y-1">
                      {testResult.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span>•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-medium">Quick Setup Options:</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 border rounded-lg">
              <h5 className="font-medium text-sm mb-1">URL Parameter</h5>
              <p className="text-xs text-muted-foreground mb-2">Add file ID to URL for temporary use</p>
              <Button variant="outline" size="sm" onClick={copyExampleUrl} className="flex items-center gap-1">
                <Copy size={12} />
                Copy Example URL
              </Button>
            </div>

            <div className="p-3 border rounded-lg">
              <h5 className="font-medium text-sm mb-1">Environment Variable</h5>
              <p className="text-xs text-muted-foreground mb-2">Set NEXT_PUBLIC_GOOGLE_DRIVE_FILE_ID</p>
              <Badge variant="secondary" className="text-xs">
                Permanent Setup
              </Badge>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Need Help?</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Make sure your Google Drive file is set to "Anyone with the link can view"</li>
            <li>• Your JSON file should contain a "questions" array with Myanmar text</li>
            <li>• Each question needs: id, statementA, statementB, scoreA, scoreB</li>
            <li>
              • Use{" "}
              <a
                href="https://jsonlint.com"
                target="_blank"
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
                rel="noreferrer"
              >
                JSONLint <ExternalLink size={10} />
              </a>{" "}
              to validate your JSON
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
