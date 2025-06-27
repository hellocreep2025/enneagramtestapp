"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bug, RefreshCw, ExternalLink } from "lucide-react"

export function DebugPanel() {
  const [testResults, setTestResults] = useState(null)
  const [testing, setTesting] = useState(false)

  const testGoogleDriveConnection = async () => {
    setTesting(true)
    const results = {
      timestamp: new Date().toISOString(),
      tests: [],
    }

    // Test different file IDs and URLs
    const testFileId = "PUT_YOUR_GOOGLE_DRIVE_FILE_ID_HERE"
    const testUrls = [
      `https://drive.google.com/uc?id=${testFileId}&export=download`,
      `https://drive.google.com/file/d/${testFileId}/view?usp=sharing`,
    ]

    for (const url of testUrls) {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
          },
        })

        const contentType = response.headers.get("content-type")
        const responseText = await response.text()

        results.tests.push({
          url,
          status: response.status,
          contentType,
          responseLength: responseText.length,
          isJson: responseText.trim().startsWith("{"),
          isHtml: responseText.includes("<!DOCTYPE html>"),
          preview: responseText.substring(0, 200),
        })
      } catch (error) {
        results.tests.push({
          url,
          error: error.message,
        })
      }
    }

    setTestResults(results)
    setTesting(false)
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="text-orange-500" size={24} />
          Debug Panel
          <Badge variant="outline">Troubleshooting</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testGoogleDriveConnection} disabled={testing} className="flex items-center gap-2">
            <RefreshCw className={testing ? "animate-spin" : ""} size={16} />
            Test Google Drive Connection
          </Button>
        </div>

        {testResults && (
          <div className="space-y-4">
            <h3 className="font-semibold">Test Results:</h3>
            {testResults.tests.map((test, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={test.error ? "destructive" : test.status === 200 ? "default" : "secondary"}>
                    {test.error ? "Error" : `HTTP ${test.status}`}
                  </Badge>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">{test.url}</code>
                </div>

                {test.error ? (
                  <p className="text-red-600 text-sm">{test.error}</p>
                ) : (
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Content-Type:</strong> {test.contentType}
                    </p>
                    <p>
                      <strong>Response Length:</strong> {test.responseLength} characters
                    </p>
                    <p>
                      <strong>Is JSON:</strong> {test.isJson ? "✅ Yes" : "❌ No"}
                    </p>
                    <p>
                      <strong>Is HTML:</strong> {test.isHtml ? "⚠️ Yes (likely login page)" : "✅ No"}
                    </p>
                    <div>
                      <strong>Preview:</strong>
                      <pre className="bg-gray-100 p-2 rounded text-xs mt-1 overflow-x-auto">{test.preview}...</pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Quick Fixes:</h4>
          <ul className="text-sm space-y-1">
            <li>• If you see HTML response: File is not public or wrong URL format</li>
            <li>• If you see 404 error: File ID is incorrect</li>
            <li>• If you see 403 error: File permissions are not set to public</li>
            <li>
              • If JSON is invalid: Use{" "}
              <a
                href="https://jsonlint.com"
                target="_blank"
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
                rel="noreferrer"
              >
                JSONLint <ExternalLink size={12} />
              </a>{" "}
              to validate
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
