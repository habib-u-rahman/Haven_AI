import axios from 'axios';
import { HavenRequest, HavenResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function analyzeHaven(request: HavenRequest): Promise<HavenResponse> {
  const response = await axios.post<HavenResponse>(`${API_BASE_URL}/api/haven`, request);
  return response.data;
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/health`);
    return response.status === 200;
  } catch {
    return false;
  }
}
