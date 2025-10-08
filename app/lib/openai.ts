import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const ASSESSMENT_MODEL = 'gpt-4-turbo-preview';
export const MAX_TOKENS = 2000;
export const TEMPERATURE = 0.3;
