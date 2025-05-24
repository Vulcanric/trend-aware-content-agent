import axios from 'axios';
import type { Trend, GenerateContentRequest, GenerateContentResponse } from '@/types';

const API_BASE_URL = process.env.API_BASE_URL || 'https://trendybackend.railway.internal/api';
console.log("API BASE", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTrends = async (): Promise<Trend> => {
  const { data } = await api.get<Trend>('/trends');
  return data;
};

export const generateContent = async (request: GenerateContentRequest): Promise<GenerateContentResponse> => {
  const { data } = await api.post<GenerateContentResponse>('/generate', request);
  return data;
}; 