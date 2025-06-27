import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get("fileId")

    if (!fileId) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 })
    }

    console.log(`🔄 API Proxy: Loading Google Drive file ${fileId}`)

    // Enhanced URL strategies with better error handling
    const urlStrategies = [
      {
        name: "Direct Download",
        url: `https://drive.google.com/uc?export=download&id=${fileId}`,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; EnneagramApp/1.0)",
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.9",
        },
      },
      {
        name: "Alternative Download",
        url: `https://drive.google.com/uc?id=${fileId}&export=download`,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "*/*",
          "Cache-Control": "no-cache",
        },
      },
      {
        name: "Docs Export",
        url: `https://docs.google.com/uc?export=download&id=${fileId}`,
        headers: {
          "User-Agent": "curl/7.68.0",
          Accept: "application/json",
        },
      },
      {
        name: "Raw Content",
        url: `https://drive.google.com/file/d/${fileId}/view?usp=sharing`,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; bot)",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      },
    ]

    const errors = []
    let lastResponse = null

    for (let i = 0; i < urlStrategies.length; i++) {
      const strategy = urlStrategies[i]
      try {
        console.log(`🔄 API Proxy trying strategy ${i + 1}: ${strategy.name}`)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

        const response = await fetch(strategy.url, {
          method: "GET",
          headers: strategy.headers,
          signal: controller.signal,
          // Remove redirect following to handle Google Drive redirects manually
          redirect: "follow",
        })

        clearTimeout(timeoutId)
        lastResponse = response

        console.log(`📊 API Proxy response: ${response.status} ${response.statusText}`)
        console.log(`📋 Content-Type: ${response.headers.get("content-type")}`)
        console.log(`📏 Content-Length: ${response.headers.get("content-length")}`)

        if (response.ok) {
          const responseText = await response.text()
          console.log(`📝 API Proxy response length: ${responseText.length}`)

          if (responseText.length === 0) {
            errors.push(`${strategy.name}: Empty response`)
            continue
          }

          // Log response preview for debugging
          const preview = responseText.substring(0, 300)
          console.log(`🔍 Response preview: ${preview}`)

          // Check if it's HTML (Google Drive error/login page)
          if (responseText.trim().startsWith("<!DOCTYPE html>") || responseText.includes("<html")) {
            // Try to extract useful information from HTML
            if (responseText.includes("Google Drive")) {
              errors.push(`${strategy.name}: Google Drive access page - file may not be public`)
            } else if (responseText.includes("sign in") || responseText.includes("login")) {
              errors.push(`${strategy.name}: Login required - file is not publicly accessible`)
            } else if (responseText.includes("virus scan")) {
              errors.push(`${strategy.name}: File too large for automatic download`)
            } else {
              errors.push(`${strategy.name}: Received HTML page instead of JSON`)
            }
            continue
          }

          // Check for Google Drive specific responses
          if (responseText.includes("virus scan") || responseText.includes("too large")) {
            errors.push(`${strategy.name}: File too large for automatic download`)
            continue
          }

          // Check if it looks like a redirect page
          if (responseText.includes("window.location") || responseText.includes("redirect")) {
            errors.push(`${strategy.name}: Received redirect page`)
            continue
          }

          // Try to parse as JSON
          try {
            const jsonData = JSON.parse(responseText)

            // Validate structure
            if (jsonData && typeof jsonData === "object") {
              if (jsonData.questions && Array.isArray(jsonData.questions)) {
                if (jsonData.questions.length > 0) {
                  console.log(`✅ API Proxy success: ${jsonData.questions.length} questions loaded`)

                  // Add metadata about the successful method
                  jsonData._loadedVia = strategy.name
                  jsonData._loadedAt = new Date().toISOString()

                  return NextResponse.json(jsonData)
                } else {
                  errors.push(`${strategy.name}: Valid JSON but questions array is empty`)
                }
              } else {
                errors.push(`${strategy.name}: Valid JSON but missing questions array`)
              }
            } else {
              errors.push(`${strategy.name}: Response is not a valid JSON object`)
            }
          } catch (parseError) {
            errors.push(`${strategy.name}: Invalid JSON - ${parseError.message}`)
            console.log(`📄 Raw response for debugging: ${responseText.substring(0, 500)}...`)
          }
        } else {
          let errorMsg = `${strategy.name}: HTTP ${response.status}`

          if (response.status === 403) {
            errorMsg += " - Access denied (file not public)"
          } else if (response.status === 404) {
            errorMsg += " - File not found (check file ID)"
          } else if (response.status === 400) {
            errorMsg += " - Bad request (invalid file ID format)"
          } else if (response.status === 429) {
            errorMsg += " - Rate limited (too many requests)"
          } else {
            errorMsg += ` - ${response.statusText}`
          }

          errors.push(errorMsg)
        }
      } catch (error) {
        let errorMsg = `${strategy.name}: ${error.message}`

        if (error.name === "AbortError") {
          errorMsg += " (timeout after 15 seconds)"
        } else if (error.message.includes("network")) {
          errorMsg += " (network error)"
        } else if (error.message.includes("fetch")) {
          errorMsg += " (fetch failed)"
        }

        errors.push(errorMsg)
        console.warn(`❌ API Proxy strategy ${i + 1} failed:`, error.message)
      }
    }

    // All strategies failed - provide comprehensive error response
    console.error("❌ API Proxy: All strategies failed")

    // Try to provide helpful suggestions based on the errors
    const suggestions = [
      "Verify the file is shared publicly ('Anyone with the link can view')",
      "Check that the file ID is correct (extract from Google Drive share URL)",
      "Ensure the file is a valid JSON file with a 'questions' array",
      "Try uploading the file directly using the file upload feature",
      "Make sure the file is not too large (under 10MB recommended)",
    ]

    // Add specific suggestions based on error patterns
    if (errors.some((e) => e.includes("403") || e.includes("Access denied"))) {
      suggestions.unshift("File permissions issue: Make sure the file is shared publicly")
    }
    if (errors.some((e) => e.includes("404") || e.includes("not found"))) {
      suggestions.unshift("File ID issue: Double-check the file ID from the Google Drive URL")
    }
    if (errors.some((e) => e.includes("HTML") || e.includes("login"))) {
      suggestions.unshift("Authentication issue: File requires login or is not public")
    }

    return NextResponse.json(
      {
        error: "Failed to load from Google Drive via proxy",
        fileId: fileId,
        attempts: urlStrategies.length,
        details: errors,
        lastHttpStatus: lastResponse?.status || "No response",
        suggestions: suggestions,
        troubleshooting: {
          fileIdFormat: "Should be like: 1ABC123XYZ789DEF456GHI",
          shareUrlExample: "https://drive.google.com/file/d/FILE_ID/view?usp=sharing",
          requiredPermission: "Anyone with the link can view",
          fileType: "Must be a .json file (not Google Doc)",
        },
      },
      { status: 404 },
    )
  } catch (error) {
    console.error("API Proxy critical error:", error)
    return NextResponse.json(
      {
        error: "Internal server error in Google Drive proxy",
        details: error.message,
        suggestion: "Try using the file upload feature instead",
      },
      { status: 500 },
    )
  }
}
