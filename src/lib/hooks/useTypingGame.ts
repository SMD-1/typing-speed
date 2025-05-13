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

  // Reset the game
  const resetGame = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

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
      const newCharIndex = inputVal.length;
      const currentChar = text[newCharIndex - 1];
      const typedChar = inputVal[newCharIndex - 1];
      const isNewChar = newCharIndex > userInput.length;
      const isDeleting = newCharIndex < userInput.length;
      const isCorrect = typedChar === currentChar;

      setUserInput(inputVal);

      setStats((prev) => {
        const now = Date.now();
        const startTime = prev.startTime ?? (inputVal.length > 0 ? now : null);
        const keystrokes = prev.keystrokes + (isNewChar ? 1 : 0);
        const correctKeystrokes =
          prev.correctKeystrokes +
          (isNewChar && isCorrect ? 1 : 0) -
          (isDeleting && prev.correctKeystrokes > 0 ? 1 : 0);
        const errors =
          prev.errors +
          (isNewChar && !isCorrect ? 1 : 0) -
          (isDeleting && prev.errors > 0 ? 1 : 0);
        const currentIndex =
          prev.currentIndex + (isNewChar ? 1 : 0) - (isDeleting ? 1 : 0);

        const elapsedTimeInMinutes = startTime ? (now - startTime) / 60000 : 0;
        const wordCount = correctKeystrokes / 5;
        const wpm =
          elapsedTimeInMinutes > 0
            ? Math.round(wordCount / elapsedTimeInMinutes)
            : 0;
        const accuracy =
          keystrokes > 0
            ? Math.round((correctKeystrokes / keystrokes) * 100)
            : 100;
        const progress = Math.min(
          Math.round((currentIndex / text.length) * 100),
          100
        );
        const complete = currentIndex >= text.length;

        // Fire onProgress callback here
        onProgress(progress, wpm, accuracy);

        return {
          ...prev,
          startTime,
          keystrokes,
          correctKeystrokes,
          errors,
          currentIndex,
          wpm,
          accuracy,
          progress,
          complete,
          endTime: complete ? now : null,
        };
      });

      // Set next character
      if (newCharIndex < text.length) {
        setCurrentCharacter(text[newCharIndex]);
      }

      // Start interval on first keystroke
      if (!stats.startTime && inputVal.length > 0 && !intervalRef.current) {
        intervalRef.current = setInterval(() => {
          setStats((prev) => {
            if (!prev.startTime || prev.complete) return prev;

            const now = Date.now();
            const elapsedTimeInMinutes = (now - prev.startTime) / 60000;
            const wordCount = prev.correctKeystrokes / 5;
            const wpm =
              elapsedTimeInMinutes > 0
                ? Math.round(wordCount / elapsedTimeInMinutes)
                : 0;
            const accuracy =
              prev.keystrokes > 0
                ? Math.round((prev.correctKeystrokes / prev.keystrokes) * 100)
                : 100;
            const progress = Math.min(
              Math.round((prev.currentIndex / text.length) * 100),
              100
            );

            // Fire onProgress callback periodically
            onProgress(progress, wpm, accuracy);

            return {
              ...prev,
              wpm,
              accuracy,
              progress,
            };
          });
        }, 500);
      }

      // Clear interval on completion
      if (stats.currentIndex + 1 >= text.length && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    },
    [
      userInput,
      text,
      gameStarted,
      stats.complete,
      stats.startTime,
      stats.currentIndex,
      onProgress,
    ]
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
