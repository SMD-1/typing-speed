export interface TypingStats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  created_at: string;
  updated_at: string;
  profile: Profile;
  typing_history: TypingHistory[];
  typing_tests: TypingTest[];
}

export interface TypingHistory {
  timestamp: number;
  wpm: number;
  accuracy: number;
}

export interface Profile {
  username: string;
  avatar_url: string;
  email: string;
}

export interface TypingTest {
  wpm: number;
  accuracy: number;
  duration: number;
  createdAt: string;
}
