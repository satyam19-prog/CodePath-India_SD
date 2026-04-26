export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Challenge {
  id: number;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags: string[];
  description: string;
  sampleInput: string;
  sampleOutput: string;
}

export interface Submission {
  id: number;
  challengeId: number;
  userId: number;
  code: string;
  language: string;
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'RUNTIME_ERROR' | 'PENDING';
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  name: string;
  score: number;
  badges: string[];
}

export interface Classroom {
  id: number;
  name: string;
  joinCode: string;
  teacherId: number;
  _count?: {
    students: number;
  };
}
