"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Upload, AlertTriangle, CheckCircle, Copy } from "lucide-react"
import { useState } from "react"

export function GoogleDriveSetup() {
  const [copied, setCopied] = useState(false)

  const sampleJSON = {
    title: "Enneagram Test - Myanmar",
    version: "1.0",
    lastUpdated: "2024-01-15",
    totalQuestions: 144,
    description: "Complete Enneagram personality assessment with 144 questions in Myanmar language",
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
        statementB: "ငါဟာ ပြဿနာနကို ထိပ်တိုက်ရင်ဆိုင်လေ့မရှိဘူး",
        scoreA: "G",
        scoreB: "A",
      },
      // ... add all 144 questions here
    ],
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(sampleJSON, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="text-blue-500" size={24} />
            Google Drive Setup Guide
            <Badge variant="outline">မေးခွန်း ၁၄၄ ခု အတွက်</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step by Step Guide */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">📋 Step-by-Step Setup:</h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Create JSON File</h4>
                  <p className="text-sm text-muted-foreground">
                    Create a new file called <code className="bg-gray-200 px-1 rounded">enneagram-questions.json</code>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Add Your 144 Questions</h4>
                  <p className="text-sm text-muted-foreground">
                    Use the JSON format below and add all your Myanmar questions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Upload to Google Drive</h4>
                  <p className="text-sm text-muted-foreground">Upload the JSON file to your Google Drive</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-medium">Make Public</h4>
                  <p className="text-sm text-muted-foreground">
                    Right-click → Share → Change to "Anyone with the link"
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  5
                </div>
                <div>
                  <h4 className="font-medium">Copy File ID</h4>
                  <p className="text-sm text-muted-foreground">
                    From the share URL, copy the file ID and update your code
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* URL Format Examples */}
          <div className="space-y-3">
            <h3 className="font-semibold">🔗 Google Drive URL Format:</h3>
            <div className="bg-gray-100 p-4 rounded-lg space-y-2">
              <div>
                <p className="text-sm font-medium">Full URL:</p>
                <code className="text-xs bg-white p-2 rounded block">
                  https://drive.google.com/file/d/<span className="bg-yellow-200">1ABC123XYZ789DEF456GHI</span>
                  /view?usp=sharing
                </code>
              </div>
              <div>
                <p className="text-sm font-medium">File ID (highlighted part):</p>
                <code className="text-xs bg-yellow-200 p-2 rounded block">1ABC123XYZ789DEF456GHI</code>
              </div>
            </div>
          </div>

          {/* Common Issues */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <AlertTriangle className="text-yellow-500" size={20} />
              Common Issues & Solutions:
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-red-500">❌</span>
                <div>
                  <strong>File not public:</strong> Make sure sharing is set to "Anyone with the link can view"
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-500">❌</span>
                <div>
                  <strong>Wrong file format:</strong> File must be .json, not .txt or .docx
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-500">❌</span>
                <div>
                  <strong>Invalid JSON:</strong> Use a JSON validator to check your file format
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✅</span>
                <div>
                  <strong>Test your JSON:</strong> Use{" "}
                  <a
                    href="https://jsonlint.com"
                    target="_blank"
                    className="text-blue-600 hover:underline"
                    rel="noreferrer"
                  >
                    JSONLint.com
                  </a>{" "}
                  to validate
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* JSON Template */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>📄 JSON Template</span>
            <Button variant="outline" size="sm" onClick={copyToClipboard} className="flex items-center gap-2">
              <Copy size={16} />
              {copied ? "Copied!" : "Copy Template"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre className="text-xs">{JSON.stringify(sampleJSON, null, 2)}</pre>
          </div>
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm">
              <strong>📝 Note:</strong> This template shows only 2 questions. You need to add all 144 questions in the
              same format. Each question should have a unique ID (1-144) and proper scoreA/scoreB values (A-I).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Testing Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="text-green-500" size={24} />
            Testing Your Setup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              After setting up your Google Drive file, check the browser console (F12) for detailed loading information:
            </p>
            <div className="bg-gray-100 p-3 rounded text-xs font-mono space-y-1">
              <div className="text-blue-600">🌐 Attempting to load questions from Google Drive...</div>
              <div className="text-green-600">✅ Successfully loaded 144 questions from Google Drive</div>
              <div className="text-gray-600">📊 Data version: 1.0</div>
            </div>
            <p className="text-sm text-muted-foreground">
              If you see errors, check the console messages for specific troubleshooting steps.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
