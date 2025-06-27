"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, ExternalLink, Copy, TestTube } from "lucide-react"
import { useState } from "react"

export function TroubleshootingGuide() {
  const [copiedStep, setCopiedStep] = useState(null)

  const copyToClipboard = (text, stepIndex) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(stepIndex)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const commonIssues = [
    {
      error: "HTTP 400: Bad Request",
      causes: [
        "Invalid file ID format",
        "File ID contains extra characters or spaces",
        "File is not accessible via direct download",
      ],
      solutions: [
        "Double-check the file ID from Google Drive URL",
        "Remove any extra characters or spaces",
        "Make sure the file is a JSON file, not a Google Doc",
      ],
    },
    {
      error: "HTTP 403: Access Denied",
      causes: [
        "File is not shared publicly",
        "File sharing is restricted to specific users",
        "File owner has disabled public access",
      ],
      solutions: [
        "Right-click file → Share → Change to 'Anyone with the link'",
        "Set permission to 'Viewer' for public access",
        "Check that link sharing is enabled",
      ],
    },
    {
      error: "HTTP 404: Not Found",
      causes: ["Incorrect file ID", "File has been deleted or moved", "File ID copied incorrectly"],
      solutions: [
        "Verify file ID from the share URL",
        "Check if file still exists in Google Drive",
        "Copy file ID carefully without extra characters",
      ],
    },
    {
      error: "Received HTML instead of JSON",
      causes: [
        "File sharing permissions not set correctly",
        "Google Drive showing login page",
        "File is a Google Doc instead of JSON file",
      ],
      solutions: [
        "Set file sharing to 'Anyone with the link can view'",
        "Upload a .json file instead of Google Doc",
        "Check file type in Google Drive",
      ],
    },
  ]

  const setupSteps = [
    {
      title: "Create JSON File",
      description: "Create a file named 'enneagram-questions.json'",
      code: `{
  "title": "Enneagram Test - Myanmar",
  "questions": [
    {
      "id": 1,
      "statementA": "Myanmar text A...",
      "statementB": "Myanmar text B...",
      "scoreA": "E",
      "scoreB": "B"
    }
  ]
}`,
    },
    {
      title: "Upload to Google Drive",
      description: "Upload the JSON file to your Google Drive",
      steps: [
        "Go to drive.google.com",
        "Click 'New' → 'File upload'",
        "Select your JSON file",
        "Wait for upload to complete",
      ],
    },
    {
      title: "Share the File",
      description: "Make the file publicly accessible",
      steps: [
        "Right-click on the uploaded file",
        "Click 'Share'",
        "Click 'Change to anyone with the link'",
        "Set permission to 'Viewer'",
        "Click 'Copy link'",
      ],
    },
    {
      title: "Extract File ID",
      description: "Get the file ID from the share URL",
      example: "https://drive.google.com/file/d/1ABC123XYZ789DEF456/view?usp=sharing",
      fileId: "1ABC123XYZ789DEF456",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="text-orange-500" size={24} />
            Troubleshooting Guide
            <Badge variant="outline">Common Issues</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {commonIssues.map((issue, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-red-600 flex items-center gap-2">
                <AlertTriangle size={16} />
                {issue.error}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Possible Causes:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {issue.causes.map((cause, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-red-500">•</span>
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Solutions:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    {issue.solutions.map((solution, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <CheckCircle size={12} className="mt-0.5 flex-shrink-0" />
                        <span>{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="text-green-500" size={24} />
            Step-by-Step Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {setupSteps.map((step, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <h3 className="font-semibold">{step.title}</h3>
              </div>

              <p className="text-muted-foreground ml-11">{step.description}</p>

              {step.code && (
                <div className="ml-11">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">JSON Template:</span>
                    <button
                      onClick={() => copyToClipboard(step.code, index)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded flex items-center gap-1"
                    >
                      <Copy size={12} />
                      {copiedStep === index ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">{step.code}</pre>
                </div>
              )}

              {step.steps && (
                <div className="ml-11">
                  <ol className="text-sm space-y-1">
                    {step.steps.map((stepItem, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="bg-gray-200 text-gray-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{stepItem}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {step.example && (
                <div className="ml-11 space-y-2">
                  <p className="text-sm font-medium">Example URL:</p>
                  <code className="text-xs bg-gray-100 p-2 rounded block break-all">{step.example}</code>
                  <p className="text-sm">
                    <strong>File ID:</strong>
                    <code className="bg-yellow-200 px-1 rounded ml-1">{step.fileId}</code>
                  </p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Validation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Before using your file, validate it with these tools:</p>
          <div className="flex gap-2 flex-wrap">
            <a
              href="https://jsonlint.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm"
            >
              JSONLint <ExternalLink size={12} />
            </a>
            <a
              href="https://jsonformatter.curiousconcept.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm"
            >
              JSON Formatter <ExternalLink size={12} />
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Testing Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="text-blue-500" size={24} />
            Test Your Google Drive File
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Use our comprehensive tester to verify your Google Drive file works correctly:
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">🧪 Real-time Testing</h4>
              <ul className="text-sm text-blue-700 space-y-1 mb-3">
                <li>• Tests all loading methods simultaneously</li>
                <li>• Shows detailed error messages and solutions</li>
                <li>• Validates JSON structure and content</li>
                <li>• Provides specific recommendations</li>
              </ul>
              <a
                href="/test-drive"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <TestTube size={16} />
                Open Google Drive Tester
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
