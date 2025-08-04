import { GoogleGenAI } from '@google/genai';
import { BaseProvider } from './base';
import { 
  ChatCompletionRequest, 
  ChatCompletionResponse, 
  StreamChatCompletionResponse,
  ChatStreamCallback,
  ModelInfo 
} from '../types';

export class GeminiProvider extends BaseProvider {
  private client: GoogleGenAI;

  constructor(config: {
    apiKey: string;
    baseUrl?: string;
    timeout?: number;
    maxRetries?: number;
  }) {
    super(config);
    // Set the API key as an environment variable for Google GenAI
    process.env.GOOGLE_API_KEY = this.apiKey;
    this.client = new GoogleGenAI({ apiKey: this.apiKey });
  }

  async chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    return this.retryWithBackoff(async () => {
      // Convert messages to Gemini format
      const geminiMessages = this.convertMessagesToGeminiFormat(request.messages);
      
      const response = await this.client.models.generateContent({
        model: request.model,
        contents: geminiMessages,
        config: {
          temperature: request.temperature,
          maxOutputTokens: request.maxTokens,
          topP: request.topP,
        },
      });

      return {
        id: this.generateId(),
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: request.model,
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: response.text || '',
          },
          finishReason: 'stop',
        }],
        usage: {
          promptTokens: 0, // Gemini doesn't provide token usage in the same way
          completionTokens: 0,
          totalTokens: 0,
        },
      };
    });
  }

  async streamChatCompletion(
    request: ChatCompletionRequest,
    callback: ChatStreamCallback
  ): Promise<void> {
    return this.retryWithBackoff(async () => {
      const geminiMessages = this.convertMessagesToGeminiFormat(request.messages);
      
      const result = await this.client.models.generateContentStream({
        model: request.model,
        contents: geminiMessages,
        config: {
          temperature: request.temperature,
          maxOutputTokens: request.maxTokens,
          topP: request.topP,
        },
      });

      let fullText = '';

      for await (const chunk of result) {
        const text = chunk.text || '';
        fullText += text;

        const streamResponse: StreamChatCompletionResponse = {
          id: this.generateId(),
          object: 'chat.completion.chunk',
          created: Math.floor(Date.now() / 1000),
          model: request.model,
          choices: [{
            index: 0,
            delta: {
              role: 'assistant',
              content: text,
            },
          }],
        };
        callback(streamResponse);
      }

      // Send final chunk with finish reason
      const finalResponse: StreamChatCompletionResponse = {
        id: this.generateId(),
        object: 'chat.completion.chunk',
        created: Math.floor(Date.now() / 1000),
        model: request.model,
        choices: [{
          index: 0,
          delta: {},
          finishReason: 'stop',
        }],
      };
      callback(finalResponse);
    });
  }

  async listModels(): Promise<ModelInfo[]> {
    return this.retryWithBackoff(async () => {
      // Updated list with latest Gemini models
      const models: ModelInfo[] = [
        {
          id: 'gemini-2.0-flash-001',
          name: 'Gemini 2.0 Flash',
          provider: 'gemini',
          maxTokens: 1048576,
          supportsStreaming: true,
        },
        {
          id: 'gemini-2.0-flash-exp',
          name: 'Gemini 2.0 Flash Experimental',
          provider: 'gemini',
          maxTokens: 1048576,
          supportsStreaming: true,
        },
        {
          id: 'gemini-1.5-pro',
          name: 'Gemini 1.5 Pro',
          provider: 'gemini',
          maxTokens: 1048576,
          supportsStreaming: true,
        },
        {
          id: 'gemini-1.5-flash',
          name: 'Gemini 1.5 Flash',
          provider: 'gemini',
          maxTokens: 1048576,
          supportsStreaming: true,
        },
        {
          id: 'gemini-pro',
          name: 'Gemini Pro',
          provider: 'gemini',
          maxTokens: 32768,
          supportsStreaming: true,
        },
        {
          id: 'gemini-pro-vision',
          name: 'Gemini Pro Vision',
          provider: 'gemini',
          maxTokens: 32768,
          supportsStreaming: true,
        },
      ];

      return models;
    });
  }

  async getModelInfo(modelId: string): Promise<ModelInfo | null> {
    return this.retryWithBackoff(async () => {
      const models = await this.listModels();
      return models.find(model => model.id === modelId) || null;
    });
  }



  private convertMessagesToGeminiFormat(messages: any[]): string {
    // Gemini doesn't support system messages in the same way as OpenAI
    // We'll concatenate system messages with the first user message
    let conversation = '';
    
    for (const message of messages) {
      if (message.role === 'system') {
        conversation += `System: ${message.content}\n\n`;
      } else if (message.role === 'user') {
        conversation += `User: ${message.content}\n\n`;
      } else if (message.role === 'assistant') {
        conversation += `Assistant: ${message.content}\n\n`;
      }
    }

    return conversation.trim();
  }

  private generateId(): string {
    return 'gemini-' + Math.random().toString(36).substr(2, 9);
  }
} 