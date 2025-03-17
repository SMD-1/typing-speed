import React, { useState, useEffect, useCallback, useRef } from "react";
import { Moon, RefreshCcw, Sun } from "lucide-react";
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
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
  const targetText = SAMPLE_TEXT;
  // const [targetText, setTargetText] = useState(SAMPLE_TEXT);
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 0,
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0,
  });
  const [history, setHistory] = useState<TypingHistory[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [cursorBlink, setCursorBlink] = useState(true);

  useEffect(() => {
    const handleGlobalClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    document.addEventListener("click", handleGlobalClick);

    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setCursorBlink((prev) => !prev);
    }, 530);

    return () => clearInterval(blinkInterval);
  }, []);

  const calculateStats = useCallback(() => {
    const correctChars = currentText
      .split("")
      .filter((char, i) => char === targetText[i]).length;
    const incorrectChars = currentText.length - correctChars;
    const accuracy = Math.round((correctChars / currentText.length) * 100) || 0;
    const timeSpent = duration - timeLeft;
    const wpm =
      timeSpent > 0 ? Math.round(correctChars / 5 / (timeSpent / 60)) : 0;

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
          }
          return prev - 1;
        });

        // Update history every second
        const currentStats = calculateStatsRef.current();
        setHistory((prev) => [
          ...prev,
          {
            timestamp: Date.now(),
            wpm: currentStats.wpm,
            accuracy: currentStats.accuracy,
          },
        ]);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isActive, timeLeft]);

  const handleStart = () => {
    setIsFinished(false);
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
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value.slice(0, targetText.length);
    if (!isActive && newText.length === 1) {
      setIsActive(true);
    }
    setCurrentText(newText);

    if (newText.length === targetText.length) {
      setIsActive(false);
      const finalStats = calculateStats();
      setStats(finalStats);
      setHistory((prev) => [
        ...prev,
        {
          timestamp: Date.now(),
          wpm: finalStats.wpm,
          accuracy: finalStats.accuracy,
        },
      ]);
      setIsFinished(true);
    } else if (isActive) {
      const currentStats = calculateStats();
      setStats(currentStats);
    }
  };

  const handleDurationChange = (newDuration: number) => {
    setIsFinished(false);
    setDuration(newDuration);
    setTimeLeft(newDuration);
    setIsActive(false);
    setCurrentText("");
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <div className={`${isDark ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-50 py-12 px-4 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center relative">
            <button
              onClick={() => setIsDark(!isDark)}
              className="absolute right-0 top-0 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Speed Typing Test
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Test your typing speed and accuracy
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6 dark:bg-gray-800">
            <div className="flex justify-between items-center">
              <Timer
                timeLeft={timeLeft}
                duration={duration}
                onDurationChange={handleDurationChange}
              />
              <button
                onClick={handleStart}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                <RefreshCcw className="w-4 h-4" />
                Restart
              </button>
            </div>

            <div className="relative">
              <div
                className="font-mono text-lg p-4 bg-gray-100 rounded-lg whitespace-pre-wrap break-all dark:bg-gray-700"
                style={{
                  minHeight: "100px",
                  whiteSpace: "pre-wrap",
                  wordBreak: "normal",
                  overflowWrap: "normal",
                }}
              >
                {targetText.split("").map((char, i) => {
                  let color = "text-gray-500 dark:text-gray-400";
                  if (i < currentText.length) {
                    color =
                      currentText[i] === char
                        ? "text-green-600"
                        : "text-red-600";
                  }
                  return (
                    <span key={i} className={color}>
                      {i === currentText.length && (
                        <span
                          className={`inline-block w-0.5 h-5 bg-black dark:bg-slate-400 -mr-[1px] -mb-0.5 ${
                            cursorBlink ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      )}
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
                disabled={timeLeft === 0 || isFinished}
                autoFocus
              />
            </div>

            {isActive && timeLeft > 0 && (
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>WPM: {stats.wpm}</span>
                <span>Accuracy: {stats.accuracy}%</span>
              </div>
            )}
          </div>

          {(timeLeft === 0 || isFinished) && (
            <Stats stats={stats} history={history} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
