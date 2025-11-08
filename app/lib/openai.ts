import OpenAI from 'openai';

// Lazy initialization to prevent build-time errors
let openaiInstance: OpenAI | null = null;

export const openai = (): OpenAI => {
  if (!openaiInstance) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    openaiInstance = new OpenAI({
      apiKey,
    });
  }
  return openaiInstance;
};

// Model selection: GPT-5/GPT-4o available, using as default
// Fallback to GPT-4 Turbo if GPT-5 not available
// GPT-4o is the latest model (GPT-5 equivalent) - better accuracy, similar cost
export const ASSESSMENT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o';
// Options: 'gpt-4o' (default, latest), 'gpt-4-turbo-preview', 'gpt-4', 'gpt-3.5-turbo'

export const MAX_TOKENS = 2000;
export const TEMPERATURE = 0.3;

// Model comparison (for testing)
export const AVAILABLE_MODELS = {
  'gpt-4o': {
    name: 'GPT-4o',
    description: 'Latest model, best accuracy',
    cost: 'TBD (testing)',
    contextWindow: 128000
  },
  'gpt-4-turbo-preview': {
    name: 'GPT-4 Turbo',
    description: 'Current production model',
    cost: '~$0.10-0.20 per assessment',
    contextWindow: 128000
  },
  'gpt-4': {
    name: 'GPT-4',
    description: 'Previous generation',
    cost: '~$0.15-0.30 per assessment',
    contextWindow: 8192
  },
  'gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    description: 'Fast, lower cost',
    cost: '~$0.01-0.02 per assessment',
    contextWindow: 16384
  }
};
