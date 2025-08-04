import OpenAI from 'openai';
import { BaseProvider } from './base';
import { 
  ChatCompletionRequest, 
  ChatCompletionResponse, 
  StreamChatCompletionResponse,
  ChatStreamCallback,
  ModelInfo 
} from '../types';

export class OpenAIProvider extends BaseProvider {
  private client: OpenAI;

  constructor(config: {
    apiKey: string;
    baseUrl?: string;
    timeout?: number;
    maxRetries?: number;
  }) {
    super(config);
    this.client = new OpenAI({
      apiKey: this.apiKey,
      baseURL: this.baseUrl,
      timeout: this.timeout,
      maxRetries: this.maxRetries,
    });
  }

  async chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    return this.retryWithBackoff(async () => {
      const response = await this.client.chat.completions.create({
        model: request.model,
        messages: request.messages,
        temperature: request.temperature,
        max_tokens: request.maxTokens,
        top_p: request.topP,
        frequency_penalty: request.frequencyPenalty,
        presence_penalty: request.presencePenalty,
        stream: false,
      });

      return {
        id: response.id,
        object: response.object,
        created: response.created,
        model: response.model,
        choices: response.choices.map(choice => ({
          index: choice.index,
          message: {
            role: choice.message.role as 'user' | 'assistant' | 'system',
            content: choice.message.content || '',
          },
          finishReason: choice.finish_reason || 'stop',
        })),
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        },
      };
    });
  }

  async streamChatCompletion(
    request: ChatCompletionRequest,
    callback: ChatStreamCallback
  ): Promise<void> {
    return this.retryWithBackoff(async () => {
      const stream = await this.client.chat.completions.create({
        model: request.model,
        messages: request.messages,
        temperature: request.temperature,
        max_tokens: request.maxTokens,
        top_p: request.topP,
        frequency_penalty: request.frequencyPenalty,
        presence_penalty: request.presencePenalty,
        stream: true,
      });

      for await (const chunk of stream) {
        const streamResponse: StreamChatCompletionResponse = {
          id: chunk.id,
          object: chunk.object,
          created: chunk.created,
          model: chunk.model,
          choices: chunk.choices.map(choice => ({
            index: choice.index,
            delta: {
              role: choice.delta.role as 'user' | 'assistant' | 'system' | undefined,
              content: choice.delta.content || '',
            },
            finishReason: choice.finish_reason || undefined,
          })),
        };
        callback(streamResponse);
      }
    });
  }

  async listModels(): Promise<ModelInfo[]> {
    return this.retryWithBackoff(async () => {
      const models = await this.client.models.list();
      return models.data
        .filter(model => model.id.includes('gpt'))
        .map(model => ({
          id: model.id,
          name: model.id,
          provider: 'openai' as const,
          maxTokens: this.getMaxTokensForModel(model.id),
          supportsStreaming: true,
        }));
    });
  }

  async getModelInfo(modelId: string): Promise<ModelInfo | null> {
    return this.retryWithBackoff(async () => {
      try {
        const model = await this.client.models.retrieve(modelId);
        return {
          id: model.id,
          name: model.id,
          provider: 'openai' as const,
          maxTokens: this.getMaxTokensForModel(model.id),
          supportsStreaming: true,
        };
      } catch (error) {
        return null;
      }
    });
  }

  private getMaxTokensForModel(modelId: string): number | undefined {
    const modelLimits: Record<string, number> = {
      'gpt-4': 8192,
      'gpt-4-32k': 32768,
      'gpt-4-turbo': 128000,
      'gpt-4-turbo-preview': 128000,
      'gpt-3.5-turbo': 4096,
      'gpt-3.5-turbo-16k': 16384,
    };

    for (const [model, limit] of Object.entries(modelLimits)) {
      if (modelId.includes(model)) {
        return limit;
      }
    }

    return undefined;
  }
} 