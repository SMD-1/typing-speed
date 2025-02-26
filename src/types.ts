export interface TypingStats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
}

export interface TypingHistory {
  timestamp: number;
  wpm: number;
  accuracy: number;
}
