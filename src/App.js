import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Cloud,
  AlertCircle,
} from "lucide-react";

const EnneagramTestApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState("");

  // Type mapping with Myanmar translations
  const typeMapping = {
    A: {
      type: "Type 9",
      name: "The Peacemaker",
      myanmar: "ငြိမ်းချမ်းရေး ဖန်တီးသူ",
    },
    B: { type: "Type 6", name: "The Loyalist", myanmar: "သစ္စာရှိသူ" },
    C: { type: "Type 3", name: "The Achiever", myanmar: "အောင်မြင်သူ" },
    D: { type: "Type 1", name: "The Perfectionist", myanmar: "စံပြသူ" },
    E: {
      type: "Type 4",
      name: "The Individualist",
      myanmar: "ကိုယ်ပိုင်လမ်းသွားသူ",
    },
    F: { type: "Type 2", name: "The Helper", myanmar: "ကူညီသူ" },
    G: { type: "Type 8", name: "The Challenger", myanmar: "စိန်ခေါ်သူ" },
    H: { type: "Type 5", name: "The Investigator", myanmar: "လေ့လာသူ" },
    I: { type: "Type 7", name: "The Enthusiast", myanmar: "စိတ်အားထက်သန်သူ" },
  };

  // Load questions from Google Drive JSON file
  useEffect(() => {
    const loadQuestionsFromCloud = async () => {
      setLoading(true);

      try {
        console.log("🌐 Attempting to load questions from Google Drive...");

        // 🔗 ဒီနေရာမှာ သင်ရဲ့ Google Drive JSON file ID ထည့်ပါ
        // Google Drive link: https://drive.google.com/file/d/YOUR_FILE_ID_HERE/view
        // File ID ကိုပဲ အောက်မှာ ထည့်ပါ
        const GOOGLE_DRIVE_FILE_ID = "1LVtvILc_XTn62bwcHiKa2JagK2-oz5Vo";

        // Direct download URL for Google Drive
        const CLOUD_JSON_URL = `https://drive.google.com/uc?id=${GOOGLE_DRIVE_FILE_ID}&export=download`;

        // Attempt to fetch from Google Drive
        const response = await fetch(CLOUD_JSON_URL, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Google Drive fetch failed: ${response.status} ${response.statusText}`
          );
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON format");
        }

        const jsonData = await response.json();

        // Validate JSON structure
        if (
          !jsonData ||
          !jsonData.questions ||
          !Array.isArray(jsonData.questions)
        ) {
          throw new Error("Invalid JSON structure - missing questions array");
        }

        if (jsonData.questions.length === 0) {
          throw new Error("JSON file contains no questions");
        }

        // Success! Load the questions
        console.log(
          `✅ Successfully loaded ${jsonData.questions.length} questions from Google Drive`
        );
        console.log(`📊 Data version: ${jsonData.version || "unknown"}`);
        console.log(`📅 Last updated: ${jsonData.lastUpdated || "unknown"}`);
        console.log(`🏷️ Title: ${jsonData.title || "Enneagram Test"}`);

        setQuestions(jsonData.questions);
        setDataSource(`Cloud (${jsonData.questions.length} questions)`);
      } catch (cloudError) {
        console.warn("⚠️ Cloud loading failed:", cloudError.message);
        console.log("📝 Loading fallback demo questions...");

        // Fallback to embedded demo questions
        const fallbackQuestions = [
          {
            id: 1,
            statementA:
              "ငါဟာ စိတ်ကူးလည်းယဥ်တတ်တယ်​။ စိတ်ကူးစိတ်သန်းလည်းကောင်းတယ်",
            statementB:
              "ငါဟာလက်တွေ့ကျတယ် ။ ကြွားကြွားဝါဝါ မနေဘူး ။ လိုတာထက်ပိုပြီး ပြောလေ့မရှိဘူး။",
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
          {
            id: 3,
            statementA:
              "ငါဟာ အဆင်ပြေအောင် ကြည့်ပြောတတ်တယ်။ နှစ်သက်အောင် ပြောတတ်တယ်။ အောင်မြင်ကြီးပွားဖို့ ရည်မှန်းချက် ကြီးတယ်။",
            statementB:
              "ငါဟာ ပရိယာယ် မသုံးတတ်ဘူး ။ ထုံးတမ်းစဥ်လာအတိုင်းပဲလုပ်တယ်။ စံထားချက်မြင့်တယ်။",
            scoreA: "C",
            scoreB: "D",
          },
          {
            id: 4,
            statementA: "ငါဟာ အာရုံစူးစိုက်တယ်။ အားသွန်ခွန်စိုက်လုပ်တတ်တယ်",
            statementB: "ငါဟာ စိတ်ကူးပေါက်တာ လုပ်တတ်တယ်။ ပျော်ပျော်နေတတ်တယ်",
            scoreA: "H",
            scoreB: "I",
          },
          {
            id: 5,
            statementA:
              "ငါဟာ ဖော်ရွေတယ် ။ ကိုယ့်ဘဝထဲကို မိတ်သစ် ဆွေသစ်တွေ ရောက်လာတာကို ဖိတ်ခေါ်တတ်တယ်။",
            statementB:
              "ငါဟာ သီးသီးသန့်သန့်နေတတ်တယ်။ လူအများနဲ့ သိပ်ရောလေ့မရှိဘူး။",
            scoreA: "F",
            scoreB: "E",
          },
          {
            id: 6,
            statementA:
              "ငါဟာ ဖြစ်လာနိုင်တဲ့ ပြဿနာတွေနဲ့ ပတ်သက်ပြီး စိတ်ပူပန်တာတွေ ရပ်ပစ်ဖို့နဲ့ စိတ်အေးအေးထားနိုင်ဖို့ အခက်အခဲရှိတယ်",
            statementB:
              "ငါဟာဖြစ်လာနိုင်တဲ့ ပြဿနာတွေနဲ့ ပတ်သက်ပြီး ပူပန်ကြောင့်ကြမှု မထားပါဘူး။",
            scoreA: "B",
            scoreB: "A",
          },
          {
            id: 7,
            statementA:
              "ငါဟာ အခြေအနေကို ကြည့်ပြီး အဆင်ပြေအောင် နေတတ်လုပ်တတ်တယ်။",
            statementB:
              "ငါဟာ စိတ်နေမြင့်တယ်။ လိုချင်တာရဖို့ လူလည်မလုပ်ဘူး ။ လူလည်လုပ် မစားတတ်ဘူး။",
            scoreA: "G",
            scoreB: "D",
          },
          {
            id: 8,
            statementA:
              "လူတွေကို ချစ်ခင်ကြောင်း နှစ်သက်ကြောင်းပြဖို့ဟာ ငါ့ရဲ့လိုအပ်ချက်ဖြစ်တယ်။",
            statementB: "လူတွေနဲ့ ခပ်ခွာခွာလေးနေရတာ ပိုနှစ်သက်တယ်။",
            scoreA: "F",
            scoreB: "H",
          },
          {
            id: 9,
            statementA:
              "အတွေ့အကြုံတစ်ခု ရဖို့ရှိလာရင် ဒီအတွေ့အကြုံက ငါ့အတွက်အသုံးဝင်မှာလားလို့ မေးလေ့ရှိတယ်။",
            statementB:
              "အတွေ့အကြုံတစ်ခုရဖို့ ရှိလာရင် ဒီအတွေ့အကြုံက ငါ့အတွက်ပျော်စရာကောင်းမှာလားလို့ မေးလေ့ရှိတယ်။",
            scoreA: "C",
            scoreB: "I",
          },
          {
            id: 10,
            statementA:
              "ငါဟာ အခြေအနေတိုင်းကို ကောင်းစွာ ကိုင်တွယ်နိုင်ဖို့ အစဉ်အမြဲကြိုးစားနေတယ်။",
            statementB:
              "ငါဟာ စိတ်မအီမသာ ဖြစ်လို့ ရှိပြီဆိုရင် ဘာတွေဖြစ်လာမလဲဆိုတာ မသေချာဘူး။",
            scoreA: "A",
            scoreB: "E",
          },
        ];

        setQuestions(fallbackQuestions);
        setDataSource(`Demo (${fallbackQuestions.length} questions)`);
      }

      setLoading(false);
    };

    loadQuestionsFromCloud();
  }, []);

  const handleAnswerSelect = (choice) => {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedScore =
      choice === "A" ? currentQuestion.scoreA : currentQuestion.scoreB;

    setAnswers({
      ...answers,
      [currentQuestion.id]: {
        choice,
        score: selectedScore,
      },
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults();
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateResults = () => {
    const scoreCount = {};

    Object.values(answers).forEach((answer) => {
      scoreCount[answer.score] = (scoreCount[answer.score] || 0) + 1;
    });

    setScores(scoreCount);
    setShowResults(true);
  };

  const getTopThreeTypes = () => {
    const sortedScores = Object.entries(scores)
      .map(([letter, count]) => ({
        letter,
        count,
        ...typeMapping[letter],
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return sortedScores;
  };

  const resetTest = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setScores({});
  };

  const getProgress = () => {
    return Math.round((Object.keys(answers).length / questions.length) * 100);
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            <Cloud className="inline mr-2" size={24} />
            Loading Enneagram Test
          </h2>
          <p className="text-gray-600 mb-1">
            ထူးခြားသော စိတ်ခံစားမှု နယ်မြေ စစ်ဆေးမှု
          </p>
          <p className="text-sm text-gray-500">
            Loading questions from cloud... 🌐
          </p>
          <div className="mt-4">
            <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
              <div
                className="bg-purple-600 h-2 rounded-full animate-pulse"
                style={{ width: "70%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state (no questions loaded)
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Questions Failed to Load
          </h2>
          <p className="text-gray-600 mb-4">မေးခွန်းတွေ load မရပါ</p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>• Google Drive file ID မှန်မမှန် စစ်ကြည့်ပါ</p>
            <p>• File ကို public sharing ပေးထားမပေး စစ်ပါ</p>
            <p>• Internet connection စစ်ကြည့်ပါ</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Results screen
  if (showResults) {
    const topThree = getTopThreeTypes();

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                🎉 Enneagram Test Results
              </h1>
              <p className="text-gray-600">
                Total Questions Answered: {Object.keys(answers).length} /{" "}
                {questions.length}
              </p>
              <p className="text-sm text-gray-500">Data Source: {dataSource}</p>
            </div>

            <div className="space-y-6">
              {topThree.map((result, index) => (
                <div
                  key={result.letter}
                  className={`
                  p-6 rounded-lg border-2 ${
                    index === 0
                      ? "border-yellow-400 bg-yellow-50"
                      : index === 1
                      ? "border-gray-400 bg-gray-50"
                      : "border-orange-400 bg-orange-50"
                  }
                `}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                        {result.type} - {result.name}
                      </h3>
                      <p className="text-gray-600 mt-1">{result.myanmar}</p>
                      <p className="text-gray-600 mt-1">
                        Score: {result.count} points
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">
                        {Math.round(
                          (result.count / Object.keys(answers).length) * 100
                        )}
                        %
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={resetTest}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 mx-auto"
              >
                <RotateCcw size={20} />
                Take Test Again
              </button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                This test helps identify your primary Enneagram personality
                type.
              </p>
              <p>
                Your top score indicates your dominant type, while secondary
                scores show your wings.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion?.id];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Enneagram Personality Test
            </h1>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              <div className="text-xs text-gray-500">{dataSource}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgress()}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {getProgress()}% Complete ({Object.keys(answers).length} answered)
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Choose the statement that best describes you:
            </h2>

            <div className="space-y-4">
              {/* Statement A */}
              <button
                onClick={() => handleAnswerSelect("A")}
                className={`w-full p-6 rounded-lg border-2 text-left transition-all duration-200 ${
                  currentAnswer?.choice === "A"
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                      currentAnswer?.choice === "A"
                        ? "border-purple-500 bg-purple-500"
                        : "border-gray-300"
                    }
                  `}
                  >
                    {currentAnswer?.choice === "A" && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-purple-600 mb-1">
                      Statement A
                    </div>
                    <div className="text-gray-700 leading-relaxed">
                      {currentQuestion.statementA}
                    </div>
                  </div>
                </div>
              </button>

              {/* Statement B */}
              <button
                onClick={() => handleAnswerSelect("B")}
                className={`w-full p-6 rounded-lg border-2 text-left transition-all duration-200 ${
                  currentAnswer?.choice === "B"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                      currentAnswer?.choice === "B"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }
                  `}
                  >
                    {currentAnswer?.choice === "B" && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-blue-600 mb-1">
                      Statement B
                    </div>
                    <div className="text-gray-700 leading-relaxed">
                      {currentQuestion.statementB}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-lg transition-colors duration-200"
            >
              <ChevronLeft size={20} />
              Previous
            </button>

            <button
              onClick={goToNextQuestion}
              disabled={!currentAnswer}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-lg transition-colors duration-200"
            >
              {currentQuestionIndex === questions.length - 1
                ? "Finish Test"
                : "Next"}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h3 className="font-semibold text-gray-800 mb-2">Instructions:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Read both statements carefully</li>
            <li>• Choose the one that best describes you</li>
            <li>• Answer honestly for the most accurate results</li>
            <li>• You can go back to change previous answers</li>
            <li>• Data loaded from: {dataSource}</li>
            <li>
              •{" "}
              {questions.length < 50
                ? "For full 144 questions, upload JSON to Google Drive"
                : "Complete question set loaded!"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EnneagramTestApp;
