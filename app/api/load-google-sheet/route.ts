import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sheetId = searchParams.get("sheetId")
    const sheetName = searchParams.get("sheetName") || "Sheet1"

    if (!sheetId) {
      return NextResponse.json({ error: "Sheet ID is required" }, { status: 400 })
    }

    console.log(`🔄 Loading Google Sheet: ${sheetId}, Sheet: ${sheetName}`)

    // Enhanced Google Sheets CSV export URLs with better redirect handling
    const csvUrls = [
      // Method 1: Direct CSV export with explicit format
      `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0&single=true&output=csv`,
      // Method 2: Alternative CSV export
      `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`,
      // Method 3: With sheet name and better parameters
      `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`,
      // Method 4: Public CSV URL
      `https://docs.google.com/spreadsheets/d/${sheetId}/pub?output=csv&single=true`,
      // Method 5: Alternative public URL
      `https://docs.google.com/spreadsheets/d/${sheetId}/pub?gid=0&single=true&output=csv`,
    ]

    const errors = []

    for (let i = 0; i < csvUrls.length; i++) {
      const url = csvUrls[i]
      try {
        console.log(`🔄 Trying CSV method ${i + 1}: ${url}`)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000)

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; EnneagramApp/1.0)",
            Accept: "text/csv, text/plain, */*",
            "Cache-Control": "no-cache",
          },
          signal: controller.signal,
          redirect: "follow", // Follow redirects automatically
        })

        clearTimeout(timeoutId)

        console.log(`📊 Response: ${response.status} ${response.statusText}`)
        console.log(`📋 Final URL after redirects: ${response.url}`)

        if (response.ok) {
          const csvText = await response.text()
          console.log(`📝 CSV length: ${csvText.length} characters`)
          console.log(`📄 CSV preview: ${csvText.substring(0, 500)}...`)

          if (csvText.length === 0) {
            errors.push(`Method ${i + 1}: Empty response`)
            continue
          }

          // Check if it's HTML error page
          if (csvText.includes("<!DOCTYPE html>") || csvText.includes("<html")) {
            if (csvText.includes("Google Sheets")) {
              errors.push(`Method ${i + 1}: Sheet not public or doesn't exist`)
            } else if (csvText.includes("sign in") || csvText.includes("login")) {
              errors.push(`Method ${i + 1}: Login required - sheet not public`)
            } else {
              errors.push(`Method ${i + 1}: Received HTML instead of CSV`)
            }
            continue
          }

          // Parse CSV to JSON
          try {
            const jsonData = parseCSVToQuestions(csvText)

            if (jsonData.questions && jsonData.questions.length > 0) {
              console.log(`✅ Success: ${jsonData.questions.length} questions loaded from CSV`)

              // Add metadata
              jsonData._loadedVia = `CSV Method ${i + 1}`
              jsonData._loadedAt = new Date().toISOString()
              jsonData._sourceType = "Google Sheets"

              return NextResponse.json(jsonData)
            } else {
              errors.push(`Method ${i + 1}: CSV parsed but no valid questions found`)
            }
          } catch (parseError) {
            errors.push(`Method ${i + 1}: CSV parse error - ${parseError.message}`)
            console.log(`📄 Raw CSV for debugging: ${csvText.substring(0, 1000)}...`)
          }
        } else {
          let errorMsg = `Method ${i + 1}: HTTP ${response.status}`

          if (response.status === 403) {
            errorMsg += " - Sheet not public"
          } else if (response.status === 404) {
            errorMsg += " - Sheet not found"
          } else if (response.status === 401) {
            errorMsg += " - Unauthorized (sheet not public)"
          } else if (response.status === 307 || response.status === 302) {
            errorMsg += " - Redirect (trying to follow automatically)"
          }

          errors.push(errorMsg)
        }
      } catch (error) {
        let errorMsg = `Method ${i + 1}: ${error.message}`

        if (error.name === "AbortError") {
          errorMsg += " (timeout)"
        }

        errors.push(errorMsg)
      }
    }

    // All methods failed
    return NextResponse.json(
      {
        error: "Failed to load from Google Sheets",
        sheetId: sheetId,
        attempts: csvUrls.length,
        details: errors,
        suggestions: [
          "Make sure the Google Sheet is shared publicly ('Anyone with the link can view')",
          "Check that the Sheet ID is correct",
          "Verify the sheet contains the correct columns",
          "Try using the Google Sheet template provided",
          "Make sure there are no empty rows at the top",
          "Check that the first row contains column headers",
        ],
        setupInstructions: {
          step1: "Open your Google Sheet",
          step2: "Click 'Share' button",
          step3: "Change to 'Anyone with the link can view'",
          step4: "Copy the Sheet ID from the URL",
          step5: "Use the Sheet ID in the app",
        },
      },
      { status: 404 },
    )
  } catch (error) {
    console.error("Google Sheets API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

// Enhanced CSV parser with flexible column matching
function parseCSVToQuestions(csvText) {
  const lines = csvText.trim().split("\n")

  if (lines.length < 2) {
    throw new Error("CSV must have at least a header row and one data row")
  }

  // Parse header row
  const headers = parseCSVRow(lines[0])
  console.log(`📋 CSV Headers found: ${JSON.stringify(headers)}`)

  // Enhanced column mapping with flexible matching (case-insensitive, space-tolerant)
  const expectedColumns = {
    id: [
      "id",
      "question_id",
      "no",
      "number",
      "№",
      "ID", // Added uppercase
      "Question ID",
      "Question No",
    ],
    statementA: [
      "statement_a",
      "statementA",
      "choice_a",
      "option_a",
      "a",
      "မေးခွန်း_က",
      "ရွေးချယ်မှု_က",
      "Statement A", // Added with space
      "statement a", // Added lowercase with space
      "Choice A",
      "Option A",
    ],
    statementB: [
      "statement_b",
      "statementB",
      "choice_b",
      "option_b",
      "b",
      "မေးခွန်း_ခ",
      "ရွေးချယ်မှု_ခ",
      "Statement B", // Added with space
      "statement b", // Added lowercase with space
      "Choice B",
      "Option B",
    ],
    scoreA: [
      "score_a",
      "scoreA",
      "point_a",
      "type_a",
      "အမှတ်_က",
      "Score A", // Added with space
      "score a", // Added lowercase with space
      "Point A",
      "Type A",
    ],
    scoreB: [
      "score_b",
      "scoreB",
      "point_b",
      "type_b",
      "အမှတ်_ခ",
      "Score B", // Added with space
      "score b", // Added lowercase with space
      "Point B",
      "Type B",
    ],
  }

  // Find column indices with flexible matching
  const columnMap = {}
  for (const [key, possibleNames] of Object.entries(expectedColumns)) {
    const index = headers.findIndex((header) => {
      const cleanHeader = header.trim().toLowerCase()
      return possibleNames.some((name) => {
        const cleanName = name.toLowerCase()
        return cleanHeader === cleanName || cleanHeader.includes(cleanName) || cleanName.includes(cleanHeader)
      })
    })
    if (index !== -1) {
      columnMap[key] = index
      console.log(`✅ Found column "${key}" at index ${index}: "${headers[index]}"`)
    } else {
      console.log(`❌ Could not find column "${key}" in headers: ${JSON.stringify(headers)}`)
    }
  }

  console.log(`🗂️ Final column mapping:`, columnMap)

  // Validate required columns
  const requiredColumns = ["id", "statementA", "statementB", "scoreA", "scoreB"]
  const missingColumns = requiredColumns.filter((col) => columnMap[col] === undefined)

  if (missingColumns.length > 0) {
    throw new Error(
      `Missing required columns: ${missingColumns.join(", ")}. Found columns: ${headers.join(", ")}. Make sure your sheet has columns named: ID, Statement A, Statement B, Score A, Score B`,
    )
  }

  // Parse data rows
  const questions = []
  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVRow(lines[i])

    // Skip empty rows
    if (row.length === 0 || row.every((cell) => !cell || cell.trim() === "")) {
      console.log(`⚠️ Skipping empty row ${i + 1}`)
      continue
    }

    if (row.length < Math.max(...Object.values(columnMap)) + 1) {
      console.warn(`⚠️ Row ${i + 1} has insufficient columns (${row.length}), skipping`)
      continue
    }

    const question = {
      id: Number.parseInt(row[columnMap.id]) || i,
      statementA: row[columnMap.statementA]?.trim() || "",
      statementB: row[columnMap.statementB]?.trim() || "",
      scoreA: row[columnMap.scoreA]?.trim().toUpperCase() || "",
      scoreB: row[columnMap.scoreB]?.trim().toUpperCase() || "",
    }

    // Validate question data
    if (question.statementA && question.statementB && question.scoreA && question.scoreB) {
      questions.push(question)
      console.log(`✅ Added question ${question.id}: ${question.statementA.substring(0, 30)}...`)
    } else {
      console.warn(`⚠️ Row ${i + 1} has missing data, skipping:`, {
        id: question.id,
        hasA: !!question.statementA,
        hasB: !!question.statementB,
        scoreA: question.scoreA,
        scoreB: question.scoreB,
      })
    }
  }

  if (questions.length === 0) {
    throw new Error("No valid questions found in CSV data. Check that your data rows are properly formatted.")
  }

  console.log(`🎉 Successfully parsed ${questions.length} questions from CSV`)

  return {
    title: "Enneagram Test - Myanmar (Google Sheets)",
    version: "1.0",
    lastUpdated: new Date().toISOString(),
    totalQuestions: questions.length,
    description: `Loaded from Google Sheets with ${questions.length} questions`,
    questions: questions,
  }
}

// Enhanced CSV row parser with better quote handling
function parseCSVRow(row) {
  const result = []
  let current = ""
  let inQuotes = false
  let i = 0

  while (i < row.length) {
    const char = row[i]

    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        // Escaped quote
        current += '"'
        i += 2 // Skip both quotes
      } else {
        // Toggle quote state
        inQuotes = !inQuotes
        i++
      }
    } else if (char === "," && !inQuotes) {
      // End of field
      result.push(current.trim())
      current = ""
      i++
    } else {
      current += char
      i++
    }
  }

  // Add last field
  result.push(current.trim())

  return result
}
