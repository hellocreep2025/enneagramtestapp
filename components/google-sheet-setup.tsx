"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileSpreadsheet, Copy, ExternalLink, CheckCircle, Download } from "lucide-react"

export function GoogleSheetSetup() {
  const [sheetId, setSheetId] = useState("")
  const [testResult, setTestResult] = useState(null)
  const [testing, setTesting] = useState(false)

  // Sample data structure for Google Sheets
  const sampleData = [
    { id: 1, statement_a: "ငါဟာ စိတ်ကူးလည်းယဥ်တတ်တယ်​။", statement_b: "ငါဟာလက်တွေ့ကျတယ်။", score_a: "E", score_b: "B" },
    {
      id: 2,
      statement_a: "ငါဟာပြဿနာကို ထိပ်တိုက်ရင်ဆိုင်လေ့ရှိတယ်",
      statement_b: "ငါဟာ ပြဿနာကို ရှောင်လေ့ရှိတယ်",
      score_a: "G",
      score_b: "A",
    },
    {
      id: 3,
      statement_a: "ငါဟာ အဆင်ပြေအောင် ကြည့်ပြောတတ်တယ်။",
      statement_b: "ငါဟာ ပရိယာယ် မသုံးတတ်ဘူး။",
      score_a: "C",
      score_b: "D",
    },
  ]

  const testGoogleSheet = async () => {
    if (!sheetId.trim()) {
      setTestResult({ error: "Please enter a Sheet ID" })
      return
    }

    setTesting(true)
    setTestResult(null)

    try {
      const response = await fetch(`/api/load-google-sheet?sheetId=${sheetId}`)
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
        suggestions: ["Check your internet connection", "Try again in a few moments"],
      })
    }

    setTesting(false)
  }

  const useSheet = () => {
    const currentUrl = new URL(window.location.href)
    currentUrl.searchParams.set("sheetId", sheetId)
    window.location.href = currentUrl.toString()
  }

  const copyTemplate = () => {
    const csvTemplate = `id,statement_a,statement_b,score_a,score_b
1,"ငါဟာ စိတ်ကူးလည်းယဥ်တတ်တယ်​။ စိတ်ကူးစိတ်သန်းလည်းကောင်းတယ်","ငါဟာလက်တွေ့ကျတယ် ။ ကြွားကြွားဝါဝါ မနေဘူး။",E,B
2,"ငါဟာပြဿနာကို ထိပ်တိုက်ရင်ဆိုင်လေ့ရှိတယ်","ငါဟာ ပြဿနာကို ရှောင်လေ့ရှိတယ်",G,A
3,"ငါဟာ အဆင်ပြေအောင် ကြည့်ပြောတတ်တယ်။","ငါဟာ ပရိယာယ် မသုံးတတ်ဘူး။",C,D`

    navigator.clipboard.writeText(csvTemplate)
    alert("Template copied! Paste it into your Google Sheet.")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="text-green-500" size={24} />
            Google Sheets Setup
            <Badge variant="outline">အလွယ်ကူဆုံး နည်းလမ်း</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Why Google Sheets */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">✅ Google Sheets ရဲ့ အားသာချက်များ:</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• JSON ထက် အသုံးပြုရလွယ်တယ်</li>
              <li>• Excel လို အလုပ်လုပ်နိုင်တယ်</li>
              <li>• မေးခွန်းတွေကို တိုက်ရိုက် edit လုပ်လို့ရတယ်</li>
              <li>• အလိုအလျောက် save ဖြစ်တယ်</li>
              <li>• မိတ်ဆွေတွေနဲ့ share လုပ်လို့ရတယ်</li>
              <li>• အမှားတွေ ရှာဖွေရလွယ်တယ်</li>
            </ul>
          </div>

          {/* Step by Step Guide */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">📋 လုပ်ဆောင်ရမည့် အဆင့်များ:</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Google Sheets ဖွင့်ပါ</h4>
                    <p className="text-sm text-muted-foreground">
                      <a
                        href="https://sheets.google.com"
                        target="_blank"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1"
                        rel="noreferrer"
                      >
                        sheets.google.com <ExternalLink size={12} />
                      </a>{" "}
                      သို့သွားပြီး Sheet အသစ်ဖန်တီးပါ
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Column Headers ထည့်ပါ</h4>
                    <p className="text-sm text-muted-foreground">
                      A1 မှာ id, B1 မှာ statement_a, C1 မှာ statement_b, D1 မှာ score_a, E1 မှာ score_b
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">မေးခွန်းများ ထည့်ပါ</h4>
                    <p className="text-sm text-muted-foreground">Row 2 ကစပြီး မေးခွန်း ၁၄၄ ခု ထည့်ပါ</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium">Share လုပ်ပါ</h4>
                    <p className="text-sm text-muted-foreground">
                      'Share' ခလုတ်နှိပ်ပြီး 'Anyone with the link can view' ရွေးပါ
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    5
                  </div>
                  <div>
                    <h4 className="font-medium">Sheet ID ကူးပါ</h4>
                    <p className="text-sm text-muted-foreground">URL ထဲက Sheet ID ကို ကူးယူပြီး အောက်မှာ ထည့်ပါ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Template */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">📊 Google Sheets Template:</h3>
              <Button variant="outline" size="sm" onClick={copyTemplate} className="flex items-center gap-2">
                <Copy size={16} />
                Copy Template
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>id</TableHead>
                    <TableHead>statement_a</TableHead>
                    <TableHead>statement_b</TableHead>
                    <TableHead>score_a</TableHead>
                    <TableHead>score_b</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell className="max-w-xs truncate">{row.statement_a}</TableCell>
                      <TableCell className="max-w-xs truncate">{row.statement_b}</TableCell>
                      <TableCell>{row.score_a}</TableCell>
                      <TableCell>{row.score_b}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* URL Format */}
          <div className="space-y-3">
            <h3 className="font-semibold">🔗 Google Sheets URL Format:</h3>
            <div className="bg-gray-100 p-4 rounded-lg space-y-2">
              <div>
                <p className="text-sm font-medium">Full URL:</p>
                <code className="text-xs bg-white p-2 rounded block">
                  https://docs.google.com/spreadsheets/d/<span className="bg-yellow-200">1ABC123XYZ789DEF456GHI</span>
                  /edit#gid=0
                </code>
              </div>
              <div>
                <p className="text-sm font-medium">Sheet ID (highlighted part):</p>
                <code className="text-xs bg-yellow-200 p-2 rounded block">1ABC123XYZ789DEF456GHI</code>
              </div>
            </div>
          </div>

          {/* Test Section */}
          <div className="space-y-3">
            <h3 className="font-semibold">🧪 Test Your Google Sheet:</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your Google Sheet ID..."
                value={sheetId}
                onChange={(e) => setSheetId(e.target.value)}
                className="flex-1"
              />
              <Button onClick={testGoogleSheet} disabled={testing || !sheetId.trim()}>
                {testing ? "Testing..." : "Test Sheet"}
              </Button>
            </div>
          </div>

          {/* Test Results */}
          {testResult && (
            <div
              className={`p-4 rounded-lg border ${testResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
            >
              {testResult.success ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle size={16} />
                    <span className="font-medium">Sheet loaded successfully!</span>
                  </div>
                  <div className="text-sm text-green-600 space-y-1">
                    <p>
                      <strong>Questions:</strong> {testResult.questionCount}
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
                      <p className="text-sm font-medium text-green-700 mb-2">Sample Questions:</p>
                      <div className="space-y-1">
                        {testResult.sampleQuestions.map((q, i) => (
                          <div key={i} className="text-xs bg-green-100 p-2 rounded">
                            <strong>Q{q.id}:</strong> {q.statementA.substring(0, 50)}... |{" "}
                            {q.statementB.substring(0, 50)}...
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <Button onClick={useSheet} className="mt-2">
                    Use This Sheet
                  </Button>
                </div>
              ) : (
                <div className="text-red-700 space-y-3">
                  <p className="font-medium">❌ Error loading sheet:</p>
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
                      <p className="font-medium mb-1">💡 Suggestions:</p>
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
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <a
              href="https://sheets.google.com"
              target="_blank"
              className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              rel="noreferrer"
            >
              <FileSpreadsheet className="text-green-500" size={20} />
              <div>
                <p className="font-medium text-sm">Create New Sheet</p>
                <p className="text-xs text-muted-foreground">Open Google Sheets</p>
              </div>
              <ExternalLink size={12} className="ml-auto" />
            </a>

            <button
              onClick={copyTemplate}
              className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Copy className="text-blue-500" size={20} />
              <div>
                <p className="font-medium text-sm">Copy Template</p>
                <p className="text-xs text-muted-foreground">Get CSV template</p>
              </div>
            </button>

            <a
              href="/test-drive"
              className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="text-purple-500" size={20} />
              <div>
                <p className="font-medium text-sm">Test Integration</p>
                <p className="text-xs text-muted-foreground">Verify setup</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
