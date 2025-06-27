"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TestTube, CheckCircle, XCircle, AlertTriangle, Copy, ExternalLink, RefreshCw, Eye } from "lucide-react"

export function GoogleDriveTester() {
  const [fileId, setFileId] = useState("")
  const [testing, setTesting] = useState(false)
  const [testResults, setTestResults] = useState(null)
  const [testProgress, setTestProgress] = useState(0)
  const [currentTest, setCurrentTest] = useState("")

  // Sample file IDs for testing (you can replace these with real ones)
  const sampleFileIds = [
    {
      name: "Sample Test File",
      id: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms", // Google Sheets sample
      description: "Google's public sample spreadsheet",
    },
    {
      name: "Your File ID",
      id: "",
      description: "Enter your Google Drive file ID here",
    },
  ]

  const testGoogleDriveFile = async (testFileId) => {
    setTesting(true)
    setTestProgress(0)
    setCurrentTest("Initializing test...")

    const results = {
      fileId: testFileId,
      timestamp: new Date().toISOString(),
      tests: [],
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0,
      },
    }

    // Test URLs to try
    const testUrls = [
      {
        name: "Direct Download URL",
        url: `https://drive.google.com/uc?export=download&id=${testFileId}`,
        method: "direct",
      },
      {
        name: "Alternative Download URL",
        url: `https://drive.google.com/uc?id=${testFileId}&export=download`,
        method: "direct",
      },
      {
        name: "Docs Export URL",
        url: `https://docs.google.com/uc?export=download&id=${testFileId}`,
        method: "direct",
      },
      {
        name: "API Proxy",
        url: `/api/load-google-drive?fileId=${testFileId}`,
        method: "proxy",
      },
      {
        name: "View URL (for reference)",
        url: `https://drive.google.com/file/d/${testFileId}/view?usp=sharing`,
        method: "reference",
      },
    ]

    for (let i = 0; i < testUrls.length; i++) {
      const testUrl = testUrls[i]
      setCurrentTest(`Testing ${testUrl.name}...`)
      setTestProgress(((i + 1) / testUrls.length) * 100)

      const testResult = {
        name: testUrl.name,
        url: testUrl.url,
        method: testUrl.method,
        status: "unknown",
        details: {},
        errors: [],
        warnings: [],
        success: false,
      }

      try {
        console.log(`🧪 Testing: ${testUrl.name}`)

        // Skip reference URL from actual testing
        if (testUrl.method === "reference") {
          testResult.status = "reference"
          testResult.details.message = "Reference URL - not tested directly"
          testResult.success = true
          results.tests.push(testResult)
          continue
        }

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const startTime = Date.now()

        const response = await fetch(testUrl.url, {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Cache-Control": "no-cache",
            "User-Agent": "Mozilla/5.0 (compatible; EnneagramTester/1.0)",
          },
          signal: controller.signal,
          mode: testUrl.method === "proxy" ? "same-origin" : "cors",
        })

        clearTimeout(timeoutId)
        const responseTime = Date.now() - startTime

        testResult.details.httpStatus = response.status
        testResult.details.statusText = response.statusText
        testResult.details.responseTime = responseTime
        testResult.details.contentType = response.headers.get("content-type")
        testResult.details.contentLength = response.headers.get("content-length")

        if (response.ok) {
          const responseText = await response.text()
          testResult.details.responseLength = responseText.length
          testResult.details.responsePreview = responseText.substring(0, 200)

          // Check response type
          if (responseText.trim().startsWith("<!DOCTYPE html>") || responseText.includes("<html")) {
            testResult.status = "html_response"
            testResult.warnings.push("Received HTML page instead of JSON")
            testResult.details.responseType = "HTML"

            if (responseText.includes("Google Drive")) {
              testResult.warnings.push("Google Drive access page - file may not be public")
            }
            if (responseText.includes("sign in") || responseText.includes("login")) {
              testResult.warnings.push("Login required - file is not publicly accessible")
            }
          } else if (responseText.includes("virus scan")) {
            testResult.status = "virus_scan"
            testResult.warnings.push("File too large for automatic download")
            testResult.details.responseType = "Virus Scan Warning"
          } else {
            // Try to parse as JSON
            try {
              const jsonData = JSON.parse(responseText)
              testResult.details.responseType = "JSON"
              testResult.details.jsonKeys = Object.keys(jsonData)

              if (jsonData.questions && Array.isArray(jsonData.questions)) {
                testResult.status = "success"
                testResult.success = true
                testResult.details.questionCount = jsonData.questions.length
                testResult.details.title = jsonData.title || "Untitled"
                testResult.details.version = jsonData.version || "Unknown"

                // Validate first question structure
                if (jsonData.questions.length > 0) {
                  const firstQ = jsonData.questions[0]
                  const requiredFields = ["id", "statementA", "statementB", "scoreA", "scoreB"]
                  const missingFields = requiredFields.filter((field) => !firstQ.hasOwnProperty(field))

                  if (missingFields.length > 0) {
                    testResult.warnings.push(`Question missing fields: ${missingFields.join(", ")}`)
                  } else {
                    testResult.details.validStructure = true
                  }
                }
              } else {
                testResult.status = "invalid_json"
                testResult.warnings.push("Valid JSON but missing 'questions' array")
              }
            } catch (parseError) {
              testResult.status = "parse_error"
              testResult.errors.push(`JSON parse error: ${parseError.message}`)
              testResult.details.responseType = "Invalid JSON"
            }
          }
        } else {
          testResult.status = "http_error"
          testResult.errors.push(`HTTP ${response.status}: ${response.statusText}`)

          if (response.status === 403) {
            testResult.errors.push("Access denied - file may not be public")
          } else if (response.status === 404) {
            testResult.errors.push("File not found - check file ID")
          } else if (response.status === 400) {
            testResult.errors.push("Bad request - invalid file ID format")
          }
        }
      } catch (error) {
        testResult.status = "network_error"
        testResult.errors.push(error.message)

        if (error.name === "AbortError") {
          testResult.errors.push("Request timed out (10 seconds)")
        } else if (error.message.includes("CORS")) {
          testResult.errors.push("CORS error - cross-origin request blocked")
        } else if (error.message.includes("network")) {
          testResult.errors.push("Network connectivity issue")
        }
      }

      // Update summary
      results.summary.total++
      if (testResult.success) {
        results.summary.passed++
      } else if (testResult.warnings.length > 0) {
        results.summary.warnings++
      } else {
        results.summary.failed++
      }

      results.tests.push(testResult)
    }

    setCurrentTest("Test completed!")
    setTestProgress(100)
    setTestResults(results)
    setTesting(false)
  }

  const copyFileId = (id) => {
    navigator.clipboard.writeText(id)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle className="text-green-500" size={16} />
      case "reference":
        return <Eye className="text-blue-500" size={16} />
      case "html_response":
      case "virus_scan":
      case "invalid_json":
        return <AlertTriangle className="text-yellow-500" size={16} />
      default:
        return <XCircle className="text-red-500" size={16} />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-green-50 border-green-200"
      case "reference":
        return "bg-blue-50 border-blue-200"
      case "html_response":
      case "virus_scan":
      case "invalid_json":
        return "bg-yellow-50 border-yellow-200"
      default:
        return "bg-red-50 border-red-200"
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="text-blue-500" size={24} />
            Google Drive Integration Tester
            <Badge variant="outline">Real-time Verification</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File ID Input */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Google Drive File ID:</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your Google Drive file ID..."
                  value={fileId}
                  onChange={(e) => setFileId(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={() => testGoogleDriveFile(fileId)}
                  disabled={testing || !fileId.trim()}
                  className="flex items-center gap-2"
                >
                  {testing ? <RefreshCw className="animate-spin" size={16} /> : <TestTube size={16} />}
                  {testing ? "Testing..." : "Test File"}
                </Button>
              </div>
            </div>

            {/* Sample File IDs */}
            <div>
              <p className="text-sm font-medium mb-2">Quick Test Options:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {sampleFileIds.map((sample, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{sample.name}</p>
                      <p className="text-xs text-muted-foreground">{sample.description}</p>
                    </div>
                    <div className="flex gap-1">
                      {sample.id && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyFileId(sample.id)}
                            className="flex items-center gap-1"
                          >
                            <Copy size={12} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setFileId(sample.id)
                              testGoogleDriveFile(sample.id)
                            }}
                          >
                            Test
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Testing Progress */}
          {testing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{currentTest}</span>
                <span className="text-sm text-muted-foreground">{Math.round(testProgress)}%</span>
              </div>
              <Progress value={testProgress} className="w-full" />
            </div>
          )}

          {/* Test Results */}
          {testResults && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Test Results</h3>
                <div className="flex gap-2">
                  <Badge variant="default">{testResults.summary.passed} Passed</Badge>
                  <Badge variant="secondary">{testResults.summary.warnings} Warnings</Badge>
                  <Badge variant="destructive">{testResults.summary.failed} Failed</Badge>
                </div>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="text-green-500 mx-auto mb-2" size={24} />
                    <p className="font-semibold text-green-700">{testResults.summary.passed} Successful</p>
                    <p className="text-sm text-green-600">Methods working</p>
                  </CardContent>
                </Card>
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4 text-center">
                    <AlertTriangle className="text-yellow-500 mx-auto mb-2" size={24} />
                    <p className="font-semibold text-yellow-700">{testResults.summary.warnings} Warnings</p>
                    <p className="text-sm text-yellow-600">Partial success</p>
                  </CardContent>
                </Card>
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-4 text-center">
                    <XCircle className="text-red-500 mx-auto mb-2" size={24} />
                    <p className="font-semibold text-red-700">{testResults.summary.failed} Failed</p>
                    <p className="text-sm text-red-600">Methods blocked</p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Results */}
              <div className="space-y-3">
                <h4 className="font-medium">Detailed Test Results:</h4>
                {testResults.tests.map((test, index) => (
                  <Card key={index} className={`border ${getStatusColor(test.status)}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(test.status)}
                          <h5 className="font-medium">{test.name}</h5>
                          <Badge variant="outline" className="text-xs">
                            {test.method}
                          </Badge>
                        </div>
                        {test.details.responseTime && (
                          <span className="text-xs text-muted-foreground">{test.details.responseTime}ms</span>
                        )}
                      </div>

                      <div className="space-y-2 text-sm">
                        {/* Success Details */}
                        {test.success && test.details.questionCount && (
                          <div className="bg-green-100 p-2 rounded">
                            <p className="font-medium text-green-800">✅ Success!</p>
                            <p className="text-green-700">Loaded {test.details.questionCount} questions</p>
                            <p className="text-green-700">Title: {test.details.title}</p>
                          </div>
                        )}

                        {/* Technical Details */}
                        {test.details.httpStatus && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                            <div>
                              <span className="font-medium">Status:</span> {test.details.httpStatus}
                            </div>
                            <div>
                              <span className="font-medium">Type:</span> {test.details.responseType || "Unknown"}
                            </div>
                            <div>
                              <span className="font-medium">Size:</span> {test.details.responseLength || 0} chars
                            </div>
                            <div>
                              <span className="font-medium">Time:</span> {test.details.responseTime}ms
                            </div>
                          </div>
                        )}

                        {/* Warnings */}
                        {test.warnings.length > 0 && (
                          <div className="bg-yellow-100 p-2 rounded">
                            <p className="font-medium text-yellow-800 mb-1">⚠️ Warnings:</p>
                            <ul className="text-yellow-700 space-y-1">
                              {test.warnings.map((warning, i) => (
                                <li key={i}>• {warning}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Errors */}
                        {test.errors.length > 0 && (
                          <div className="bg-red-100 p-2 rounded">
                            <p className="font-medium text-red-800 mb-1">❌ Errors:</p>
                            <ul className="text-red-700 space-y-1">
                              {test.errors.map((error, i) => (
                                <li key={i}>• {error}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Response Preview */}
                        {test.details.responsePreview && (
                          <details className="bg-gray-100 p-2 rounded">
                            <summary className="font-medium cursor-pointer">Response Preview</summary>
                            <pre className="text-xs mt-2 overflow-x-auto">{test.details.responsePreview}...</pre>
                          </details>
                        )}

                        {/* URL for reference */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>URL:</span>
                          <code className="bg-gray-200 px-1 rounded flex-1 truncate">{test.url}</code>
                          {test.method !== "proxy" && (
                            <a
                              href={test.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:underline"
                            >
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">📋 Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  {testResults.summary.passed > 0 ? (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">✅ Good News!</h4>
                      <p className="text-green-700 mb-2">
                        {testResults.summary.passed} method(s) are working successfully. Your Google Drive integration
                        should work!
                      </p>
                      <p className="text-sm text-green-600">
                        The app will automatically use the working method to load your questions.
                      </p>
                    </div>
                  ) : testResults.summary.warnings > 0 ? (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-medium text-yellow-800 mb-2">⚠️ Partial Success</h4>
                      <p className="text-yellow-700 mb-2">
                        Some methods are working but with issues. Check the warnings above.
                      </p>
                      <ul className="text-sm text-yellow-600 space-y-1">
                        <li>• Make sure your file is shared publicly</li>
                        <li>• Verify the file is in JSON format</li>
                        <li>• Check that it contains a 'questions' array</li>
                      </ul>
                    </div>
                  ) : (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-medium text-red-800 mb-2">❌ Issues Detected</h4>
                      <p className="text-red-700 mb-2">All methods failed. Here are some solutions:</p>
                      <ul className="text-sm text-red-600 space-y-1">
                        <li>• Check if the file ID is correct</li>
                        <li>• Make sure the file is shared publicly ('Anyone with the link can view')</li>
                        <li>• Verify the file is a valid JSON file</li>
                        <li>• Try using the file upload feature instead</li>
                        <li>• Use demo mode to test the app functionality</li>
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
