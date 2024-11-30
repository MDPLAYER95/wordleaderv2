import { LeaderboardEntry } from "@/types/game";

const API_URL = '/.netlify/functions/leaderboard';

export const getLeaderboard = async (difficulty?: string, limit = 10): Promise<LeaderboardEntry[]> => {
  const params = new URLSearchParams();
  if (difficulty && difficulty !== 'all') {
    params.append('difficulty', difficulty);
  }
  params.append('limit', limit.toString());

  const response = await fetch(`${API_URL}?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard');
  }

  return response.json();
};

export const addToLeaderboard = async (entry: Omit<LeaderboardEntry, 'id'>): Promise<LeaderboardEntry> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entry),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to add score to leaderboard');
  }

  return response.json();
};