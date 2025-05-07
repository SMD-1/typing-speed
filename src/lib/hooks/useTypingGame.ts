import { useEffect, useState, useRef, useCallback } from "react";

interface UseTypingGameProps {
  text: string;
  gameStarted: boolean;
  onProgress: (progress: number, wpm: number, accuracy: number) => void;
}

interface TypingStats {
  startTime: number | null;
  endTime: number | null;
  keystrokes: number;
  correctKeystrokes: number;
  errors: number;
  currentIndex: number;
  wpm: number;
  accuracy: number;
  progress: number;
  complete: boolean;
}

export function useTypingGame({
  text,
  gameStarted,
  onProgress,
}: UseTypingGameProps) {
  const [userInput, setUserInput] = useState("");
  const [stats, setStats] = useState<TypingStats>({
    startTime: null,
    endTime: null,
    keystrokes: 0,
    correctKeystrokes: 0,
    errors: 0,
    currentIndex: 0,
    wpm: 0,
    accuracy: 100,
    progress: 0,
    complete: false,
  });

  const [currentCharacter, setCurrentCharacter] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const calculateStats = useCallback(() => {
    if (!stats.startTime) return;

    const elapsedTimeInMinutes = (Date.now() - stats.startTime) / 60000;
    const textLength = text.length;

    // Calculate WPM (standard word length is 5 characters)
    const wordCount = stats.correctKeystrokes / 5;
    const wpm = Math.round(wordCount / elapsedTimeInMinutes);

    // Calculate accuracy
    const accuracy =
      stats.keystrokes > 0
        ? Math.round((stats.correctKeystrokes / stats.keystrokes) * 100)
        : 100;

    // Calculate progress
    const progress = Math.round((stats.currentIndex / textLength) * 100);

    setStats((prev) => ({
      ...prev,
      wpm: isNaN(wpm) ? 0 : wpm,
      accuracy,
      progress,
    }));

    onProgress(progress, isNaN(wpm) ? 0 : wpm, accuracy);
  }, [
    stats.startTime,
    stats.correctKeystrokes,
    stats.keystrokes,
    stats.currentIndex,
    text?.length,
    onProgress,
  ]);

  // Reset the game
  const resetGame = useCallback(() => {
    setUserInput("");
    setStats({
      startTime: null,
      endTime: null,
      keystrokes: 0,
      correctKeystrokes: 0,
      errors: 0,
      currentIndex: 0,
      wpm: 0,
      accuracy: 100,
      progress: 0,
      complete: false,
    });
    setCurrentCharacter(text?.[0] || "");
  }, [text]);

  // Handle user typing
  const handleTyping = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!gameStarted || stats.complete) return;

      const inputVal = e.target.value;
      setUserInput(inputVal);

      // Record start time on first keystroke
      if (!stats.startTime && inputVal.length > 0) {
        setStats((prev) => ({ ...prev, startTime: Date.now() }));

        // Start the interval for continuous stats calculation
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(calculateStats, 500);
      }

      const currentChar = text[stats.currentIndex];
      const typedChar = inputVal[inputVal.length - 1];

      // Only process if the user has typed a new character
      if (inputVal.length > userInput.length) {
        const isCorrect = typedChar === currentChar;

        setStats((prev) => ({
          ...prev,
          keystrokes: prev.keystrokes + 1,
          correctKeystrokes: isCorrect
            ? prev.correctKeystrokes + 1
            : prev.correctKeystrokes,
          errors: isCorrect ? prev.errors : prev.errors + 1,
          currentIndex: prev.currentIndex + 1,
        }));

        // Set the next character to type
        if (stats.currentIndex + 1 < text.length) {
          setCurrentCharacter(text[stats.currentIndex + 1]);
        }

        // Check if typing is complete
        if (stats.currentIndex + 1 >= text.length) {
          setStats((prev) => ({
            ...prev,
            endTime: Date.now(),
            progress: 100,
            complete: true,
          }));

          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          calculateStats();
        }
      }
    },
    [userInput, text, stats, gameStarted, calculateStats]
  );

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Reset when text changes or game restarts
  useEffect(() => {
    resetGame();
  }, [text, resetGame]);

  return {
    userInput,
    stats,
    currentCharacter,
    handleTyping,
    resetGame,
  };
}
