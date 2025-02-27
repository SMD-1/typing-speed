import React, { useState, useEffect, useCallback, useRef } from "react";
import { RefreshCcw } from "lucide-react";
import { TypingStats, TypingHistory } from "./types";
import Stats from "./components/Stats";
import Timer from "./components/Timer";

const SAMPLE_TEXT =
  "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump! The five boxing wizards jump quickly. Sphinx of black quartz, judge my vow.";

function App() {
  const [duration, setDuration] = useState(30);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [targetText, setTargetText] = useState(SAMPLE_TEXT);
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 0,
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0,
  });
  const [history, setHistory] = useState<TypingHistory[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const calculateStats = useCallback(() => {
    const correctChars = currentText
      .split("")
      .filter((char, i) => char === targetText[i]).length;
    const incorrectChars = currentText.length - correctChars;
    const accuracy = Math.round((correctChars / currentText.length) * 100) || 0;
    const timeSpent = duration - timeLeft;
    const wpm = Math.round(correctChars / 5 / (timeSpent / 60)) || 0;

    return {
      wpm,
      accuracy,
      correctChars,
      incorrectChars,
      totalChars: targetText.length,
    };
  }, [currentText, targetText, duration, timeLeft]);
  const calculateStatsRef = useRef(calculateStats);
  useEffect(() => {
    calculateStatsRef.current = calculateStats;
  }, [calculateStats]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            const finalStats = calculateStatsRef.current();
            setStats(finalStats);
            setHistory((prev) => [
              ...prev,
              {
                timestamp: Date.now(),
                wpm: finalStats.wpm,
                accuracy: finalStats.accuracy,
              },
            ]);
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isActive, timeLeft]);

  const handleStart = () => {
    setTimeLeft(duration);
    setCurrentText("");
    setIsActive(true);
    setStats({
      wpm: 0,
      accuracy: 0,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: targetText.length,
    });
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value.slice(0, targetText.length);
    if (!isActive && newText.length === 1) {
      setIsActive(true);
    }
    setCurrentText(newText);

    if (isActive) {
      const currentStats = calculateStats();
      setStats(currentStats);
    }
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
    setTimeLeft(newDuration);
    setIsActive(false);
    setCurrentText("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Speed Typing Test
          </h1>
          <p className="mt-2 text-gray-600">
            Test your typing speed and accuracy
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center">
            <Timer
              timeLeft={timeLeft}
              duration={duration}
              onDurationChange={handleDurationChange}
            />
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Restart
            </button>
          </div>

          <div className="relative">
            <div
              className="font-mono text-lg p-4 bg-gray-100 rounded-lg whitespace-pre-wrap break-all"
              style={{ minHeight: "100px" }}
            >
              {targetText.split("").map((char, i) => {
                let color = "text-gray-500";
                if (i < currentText.length) {
                  color =
                    currentText[i] === char ? "text-green-600" : "text-red-600";
                }
                return (
                  <span key={i} className={color}>
                    {char}
                  </span>
                );
              })}
            </div>
            <textarea
              ref={inputRef}
              value={currentText}
              onChange={handleInput}
              className="absolute inset-0 opacity-0 w-full h-full cursor-text resize-none p-4"
              style={{ caretColor: "transparent" }}
              disabled={timeLeft === 0}
              autoFocus
            />
          </div>

          {isActive && timeLeft > 0 && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>WPM: {stats.wpm}</span>
              <span>Accuracy: {stats.accuracy}%</span>
            </div>
          )}
        </div>

        {timeLeft === 0 && <Stats stats={stats} history={history} />}
      </div>
    </div>
  );
}

export default App;
