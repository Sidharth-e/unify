import { OpenAIProvider } from './providers/openai';
import { GeminiProvider } from './providers/gemini';
import { 
  ChatCompletionRequest, 
  ChatCompletionResponse, 
  StreamChatCompletionResponse,
  ChatStreamCallback,
  ModelInfo,
  UnifyConfig,
  ModelProvider
} from './types';

export class UnifyLLM {
  private providers: Map<ModelProvider, OpenAIProvider | GeminiProvider> = new Map();
  private defaultProvider: ModelProvider;
  private defaultModel: string;

  constructor(config: UnifyConfig) {
    if (config.openai) {
      this.providers.set('openai', new OpenAIProvider(config.openai));
    }

    if (config.gemini) {
      this.providers.set('gemini', new GeminiProvider(config.gemini));
    }

    this.defaultProvider = config.defaultProvider || 'openai';
    this.defaultModel = config.defaultModel || this.getDefaultModelForProvider(this.defaultProvider);

    if (!this.providers.has(this.defaultProvider)) {
      throw new Error(`Default provider '${this.defaultProvider}' is not configured`);
    }
  }

  async chatCompletion(request: Partial<ChatCompletionRequest>): Promise<ChatCompletionResponse> {
    const provider = this.getProviderFromRequest(request);
    const fullRequest = this.buildFullRequest(request);
    
    return provider.chatCompletion(fullRequest);
  }

  async streamChatCompletion(
    request: Partial<ChatCompletionRequest>,
    callback: ChatStreamCallback
  ): Promise<void> {
    const provider = this.getProviderFromRequest(request);
    const fullRequest = this.buildFullRequest(request);
    
    return provider.streamChatCompletion(fullRequest, callback);
  }

  async listModels(provider?: ModelProvider): Promise<ModelInfo[]> {
    if (provider) {
      const providerInstance = this.providers.get(provider);
      if (!providerInstance) {
        throw new Error(`Provider '${provider}' is not configured`);
      }
      return providerInstance.listModels();
    }

    // Return models from all configured providers
    const allModels: ModelInfo[] = [];
    for (const [providerName, providerInstance] of this.providers) {
      try {
        const models = await providerInstance.listModels();
        allModels.push(...models);
      } catch (error) {
        console.warn(`Failed to fetch models from ${providerName}:`, error);
      }
    }

    return allModels;
  }

  async getModelInfo(modelId: string): Promise<ModelInfo | null> {
    // Try to determine provider from model ID
    const provider = this.detectProviderFromModelId(modelId);
    
    if (provider && this.providers.has(provider)) {
      return this.providers.get(provider)!.getModelInfo(modelId);
    }

    // If we can't determine provider, try all providers
    for (const providerInstance of this.providers.values()) {
      const modelInfo = await providerInstance.getModelInfo(modelId);
      if (modelInfo) {
        return modelInfo;
      }
    }

    return null;
  }

  getProvider(model: ModelProvider): OpenAIProvider | GeminiProvider | undefined {
    return this.providers.get(model);
  }

  isProviderConfigured(provider: ModelProvider): boolean {
    return this.providers.has(provider);
  }

  private getProviderFromRequest(request: Partial<ChatCompletionRequest>): OpenAIProvider | GeminiProvider {
    if (request.model) {
      const provider = this.detectProviderFromModelId(request.model);
      if (provider && this.providers.has(provider)) {
        return this.providers.get(provider)!;
      }
    }

    const defaultProviderInstance = this.providers.get(this.defaultProvider);
    if (!defaultProviderInstance) {
      throw new Error(`Default provider '${this.defaultProvider}' is not available`);
    }

    return defaultProviderInstance;
  }

  private buildFullRequest(request: Partial<ChatCompletionRequest>): ChatCompletionRequest {
    return {
      messages: request.messages || [],
      model: request.model || this.defaultModel,
      temperature: request.temperature ?? 0.7,
      maxTokens: request.maxTokens,
      topP: request.topP,
      frequencyPenalty: request.frequencyPenalty,
      presencePenalty: request.presencePenalty,
      stream: request.stream ?? false,
    };
  }

  private detectProviderFromModelId(modelId: string): ModelProvider | null {
    if (modelId.startsWith('gpt-') || modelId.includes('openai')) {
      return 'openai';
    }
    
    if (modelId.startsWith('gemini-') || modelId.includes('gemini')) {
      return 'gemini';
    }

    return null;
  }

  private getDefaultModelForProvider(provider: ModelProvider): string {
    switch (provider) {
      case 'openai':
        return 'gpt-3.5-turbo';
      case 'gemini':
        return 'gemini-pro';
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }
} 