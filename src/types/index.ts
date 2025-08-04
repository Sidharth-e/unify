export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatCompletionRequest {
  messages: Message[];
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stream?: boolean;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: ChatChoice[];
  usage: Usage;
}

export interface ChatChoice {
  index: number;
  message: Message;
  finishReason: string;
}

export interface Usage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface StreamChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: StreamChatChoice[];
}

export interface StreamChatChoice {
  index: number;
  delta: Partial<Message>;
  finishReason?: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: 'openai' | 'gemini';
  maxTokens?: number;
  supportsStreaming: boolean;
}

export interface ProviderConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
}

export interface UnifyConfig {
  openai?: ProviderConfig;
  gemini?: ProviderConfig;
  defaultProvider?: 'openai' | 'gemini';
  defaultModel?: string;
}

export type ModelProvider = 'openai' | 'gemini';

export interface ChatStreamCallback {
  (chunk: StreamChatCompletionResponse): void;
}

export interface ErrorResponse {
  error: {
    message: string;
    type: string;
    code?: string;
  };
} 