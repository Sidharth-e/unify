import { 
  ChatCompletionRequest, 
  ChatCompletionResponse, 
  StreamChatCompletionResponse,
  ChatStreamCallback,
  ModelInfo 
} from '../types';

export abstract class BaseProvider {
  protected apiKey: string;
  protected baseUrl?: string;
  protected timeout: number;
  protected maxRetries: number;

  constructor(config: {
    apiKey: string;
    baseUrl?: string;
    timeout?: number;
    maxRetries?: number;
  }) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout || 30000;
    this.maxRetries = config.maxRetries || 3;
  }

  abstract chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse>;
  abstract streamChatCompletion(
    request: ChatCompletionRequest, 
    callback: ChatStreamCallback
  ): Promise<void>;
  abstract listModels(): Promise<ModelInfo[]>;
  abstract getModelInfo(modelId: string): Promise<ModelInfo | null>;

  protected async retryWithBackoff<T>(
    operation: () => Promise<T>,
    retries: number = this.maxRetries
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === retries) {
          throw lastError;
        }

        // Exponential backoff with jitter
        const delay = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 1000, 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  protected createErrorResponse(message: string, type: string, code?: string) {
    return {
      error: {
        message,
        type,
        code
      }
    };
  }
} 