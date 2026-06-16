import axios from 'axios';
// @ts-ignore
import { GROQ_API_KEY } from '@env';

export const axiosClient = axios.create({
  baseURL: 'https://api.groq.com/openai/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  if (GROQ_API_KEY) {
    config.headers.Authorization = `Bearer ${GROQ_API_KEY}`;
  } else {
    console.warn('GROQ_API_KEY is not defined in .env file');
  }
  return config;
});
