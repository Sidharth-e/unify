import { UnifyLLM } from '../src';

describe('UnifyLLM', () => {
  let unify: UnifyLLM;

  beforeEach(() => {
    unify = new UnifyLLM({
      openai: {
        apiKey: 'test-openai-key',
      },
      gemini: {
        apiKey: 'test-gemini-key',
      },
      defaultProvider: 'openai',
    });
  });

  describe('initialization', () => {
    it('should initialize with both providers', () => {
      expect(unify.isProviderConfigured('openai')).toBe(true);
      expect(unify.isProviderConfigured('gemini')).toBe(true);
    });

    it('should throw error when default provider is not configured', () => {
      expect(() => {
        new UnifyLLM({
          openai: { apiKey: 'test' },
          defaultProvider: 'gemini',
        });
      }).toThrow("Default provider 'gemini' is not configured");
    });
  });

  describe('provider detection', () => {
    it('should detect OpenAI provider from model name', () => {
      const provider = (unify as any).detectProviderFromModelId('gpt-4');
      expect(provider).toBe('openai');
    });

    it('should detect Gemini provider from model name', () => {
      const provider = (unify as any).detectProviderFromModelId('gemini-pro');
      expect(provider).toBe('gemini');
    });

    it('should return null for unknown model', () => {
      const provider = (unify as any).detectProviderFromModelId('unknown-model');
      expect(provider).toBeNull();
    });
  });

  describe('model management', () => {
    it('should list models from all providers', async () => {
      const models = await unify.listModels();
      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBeGreaterThan(0);
    });

    it('should list models from specific provider', async () => {
      const openaiModels = await unify.listModels('openai');
      expect(Array.isArray(openaiModels)).toBe(true);
      expect(openaiModels.every(m => m.provider === 'openai')).toBe(true);
    });

    it('should get model info', async () => {
      const modelInfo = await unify.getModelInfo('gpt-3.5-turbo');
      expect(modelInfo).toBeDefined();
      if (modelInfo) {
        expect(modelInfo.id).toBe('gpt-3.5-turbo');
        expect(modelInfo.provider).toBe('openai');
      }
    });
  });

  describe('provider management', () => {
    it('should check if provider is configured', () => {
      expect(unify.isProviderConfigured('openai')).toBe(true);
      expect(unify.isProviderConfigured('gemini')).toBe(true);
      expect(unify.isProviderConfigured('unknown' as any)).toBe(false);
    });

    it('should get provider instance', () => {
      const openaiProvider = unify.getProvider('openai');
      const geminiProvider = unify.getProvider('gemini');
      
      expect(openaiProvider).toBeDefined();
      expect(geminiProvider).toBeDefined();
      expect(openaiProvider).not.toBe(geminiProvider);
    });
  });
}); 