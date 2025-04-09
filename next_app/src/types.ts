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
  test_duration: number;
  created_at: string;
}

export const dummyTypingTests: TypingTest[] = [
  {
    wpm: 65,
    accuracy: 98.5,
    test_duration: 60,
    created_at: "2024-03-01T10:00:00Z",
  },
  {
    wpm: 70,
    accuracy: 97.2,
    test_duration: 60,
    created_at: "2024-03-03T15:30:00Z",
  },
  {
    wpm: 68,
    accuracy: 96.8,
    test_duration: 60,
    created_at: "2024-03-05T09:15:00Z",
  },
  {
    wpm: 75,
    accuracy: 98.1,
    test_duration: 60,
    created_at: "2024-03-07T14:20:00Z",
  },
  {
    wpm: 72,
    accuracy: 97.5,
    test_duration: 60,
    created_at: "2024-03-09T11:45:00Z",
  },
  {
    wpm: 78,
    accuracy: 98.7,
    test_duration: 60,
    created_at: "2024-03-11T16:30:00Z",
  },
  {
    wpm: 80,
    accuracy: 99.0,
    test_duration: 60,
    created_at: "2024-03-13T13:10:00Z",
  },
];
