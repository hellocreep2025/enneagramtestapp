import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Key, Upload, Zap } from "lucide-react"

export function SetupGuide() {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="text-yellow-500" size={24} />
          Setup Guide - Enable Full Features
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Google Drive Setup */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Upload className="text-blue-500" size={20} />
              <h3 className="font-semibold">1. Google Drive Questions</h3>
              <Badge variant="outline">Optional</Badge>
            </div>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>To load your full 144 questions:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Upload your JSON file to Google Drive</li>
                <li>Make it publicly accessible (Anyone with link can view)</li>
                <li>Copy the file ID from the share URL</li>
                <li>Replace the file ID in the code</li>
              </ol>
            </div>
          </div>

          {/* Gemini API Setup */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Key className="text-purple-500" size={20} />
              <h3 className="font-semibold">2. Google Gemini API</h3>
              <Badge variant="secondary">Required for AI</Badge>
            </div>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>To enable AI personality insights:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>
                  Get API key from{" "}
                  <a
                    href="https://makersuite.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    Google AI Studio <ExternalLink size={12} />
                  </a>
                </li>
                <li>Add GEMINI_API_KEY to environment variables</li>
                <li>Redeploy your application</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Sample JSON Structure */}
        <div className="space-y-3">
          <h3 className="font-semibold">Sample JSON Structure for Questions:</h3>
          <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
            <pre>{`{
  "title": "Enneagram Test - Myanmar",
  "version": "1.0",
  "questions": [
    {
      "id": 1,
      "statementA": "Myanmar statement A text...",
      "statementB": "Myanmar statement B text...",
      "scoreA": "E",
      "scoreB": "B"
    }
  ]
}`}</pre>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
