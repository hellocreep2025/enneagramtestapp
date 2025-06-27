import { GoogleDriveTester } from "@/components/google-drive-tester"

export default function TestDrivePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Google Drive Integration Tester</h1>
          <p className="text-muted-foreground">Verify that your Google Drive file works with the Enneagram Test app</p>
        </div>

        <GoogleDriveTester />

        <div className="text-center">
          <a href="/" className="text-blue-600 hover:underline">
            ← Back to Enneagram Test
          </a>
        </div>
      </div>
    </div>
  )
}
