# Unify LLM

A unified TypeScript SDK for interacting with multiple Large Language Model providers including OpenAI and Google Gemini. This SDK provides a consistent interface across different providers, making it easy to switch between models or implement fallback strategies.

## Features

- 🚀 **Unified Interface**: Single API for both OpenAI and Gemini models
- 🔄 **Automatic Provider Detection**: Automatically detects the appropriate provider based on model name
- 📡 **Streaming Support**: Real-time streaming responses for both providers
- 🛡️ **Error Handling**: Robust error handling with retry mechanisms
- 🔧 **Flexible Configuration**: Customizable timeouts, retries, and provider settings
- 📊 **Model Information**: Easy access to model capabilities and limits
- 🎯 **TypeScript Support**: Full TypeScript support with comprehensive type definitions
- 🆕 **Latest Gemini SDK**: Updated to use the latest `@google/genai` SDK with Gemini 2.0 models

## Installation

```bash
npm install unify-llm
```

## Quick Start

```typescript
import { UnifyLLM } from 'unify-llm';

// Initialize with your API keys
const unify = new UnifyLLM({
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY!,
  },
  defaultProvider: 'openai',
});

// Simple chat completion
const response = await unify.chatCompletion({
  messages: [
    { role: 'user', content: 'Hello! How are you?' }
  ],
});

console.log(response.choices[0].message.content);
```

## Configuration

### Basic Configuration

```typescript
const unify = new UnifyLLM({
  openai: {
    apiKey: 'your-openai-api-key',
  },
  gemini: {
    apiKey: 'your-gemini-api-key',
  },
  defaultProvider: 'openai', // or 'gemini'
  defaultModel: 'gpt-3.5-turbo', // or 'gemini-2.0-flash-001'
});
```

### Advanced Configuration

```typescript
const unify = new UnifyLLM({
  openai: {
    apiKey: 'your-openai-api-key',
    baseUrl: 'https://api.openai.com/v1', // Optional custom base URL
    timeout: 60000, // 60 seconds
    maxRetries: 3,
  },
  gemini: {
    apiKey: 'your-gemini-api-key',
    timeout: 45000, // 45 seconds
    maxRetries: 2,
  },
  defaultProvider: 'openai',
  defaultModel: 'gpt-4',
});
```

## API Reference

### Chat Completion

#### Basic Usage

```typescript
const response = await unify.chatCompletion({
  messages: [
    { role: 'user', content: 'What is the capital of France?' }
  ],
});
```

#### With Custom Parameters

```typescript
const response = await unify.chatCompletion({
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Explain quantum computing.' }
  ],
  model: 'gpt-4', // or 'gemini-2.0-flash-001'
  temperature: 0.7,
  maxTokens: 1000,
  topP: 0.9,
  frequencyPenalty: 0.1,
  presencePenalty: 0.1,
});
```

### Streaming

```typescript
await unify.streamChatCompletion(
  {
    messages: [
      { role: 'user', content: 'Write a story about a robot.' }
    ],
    model: 'gpt-3.5-turbo',
  },
  (chunk) => {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      process.stdout.write(content);
    }
  }
);
```

### Model Management

#### List Available Models

```typescript
// List all models from all providers
const allModels = await unify.listModels();

// List models from a specific provider
const openaiModels = await unify.listModels('openai');
const geminiModels = await unify.listModels('gemini');
```

#### Get Model Information

```typescript
const modelInfo = await unify.getModelInfo('gpt-4');
if (modelInfo) {
  console.log('Model:', modelInfo.name);
  console.log('Provider:', modelInfo.provider);
  console.log('Max Tokens:', modelInfo.maxTokens);
  console.log('Supports Streaming:', modelInfo.supportsStreaming);
}
```

### Provider Management

```typescript
// Check if a provider is configured
const hasOpenAI = unify.isProviderConfigured('openai');
const hasGemini = unify.isProviderConfigured('gemini');

// Get a specific provider instance
const openaiProvider = unify.getProvider('openai');
const geminiProvider = unify.getProvider('gemini');
```

## Supported Models

### OpenAI Models
- `gpt-4`
- `gpt-4-32k`
- `gpt-4-turbo`
- `gpt-4-turbo-preview`
- `gpt-3.5-turbo`
- `gpt-3.5-turbo-16k`

### Gemini Models
- `gemini-pro`
- `gemini-pro-vision`
- `gemini-1.5-pro`
- `gemini-1.5-flash`

## Error Handling

The SDK includes robust error handling with automatic retries and exponential backoff:

```typescript
try {
  const response = await unify.chatCompletion({
    messages: [{ role: 'user', content: 'Hello!' }],
  });
} catch (error) {
  if (error.message.includes('rate limit')) {
    console.log('Rate limit exceeded, retrying...');
  } else if (error.message.includes('authentication')) {
    console.log('Invalid API key');
  } else {
    console.log('Unexpected error:', error.message);
  }
}
```

## Advanced Usage Examples

### Multi-turn Conversations

```typescript
const conversation = [
  { role: 'system', content: 'You are a helpful coding assistant.' },
  { role: 'user', content: 'What is TypeScript?' },
];

let response = await unify.chatCompletion({ messages: conversation });
conversation.push(response.choices[0].message);
conversation.push({ role: 'user', content: 'How does it compare to JavaScript?' });

response = await unify.chatCompletion({ messages: conversation });
```

### Provider Fallback Strategy

```typescript
async function getResponseWithFallback(prompt: string) {
  try {
    // Try GPT-4 first
    return await unify.chatCompletion({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4',
    });
  } catch (error) {
    console.log('GPT-4 failed, trying Gemini...');
    // Fallback to Gemini
    return await unify.chatCompletion({
      messages: [{ role: 'user', content: prompt }],
      model: 'gemini-2.0-flash-001',
    });
  }
}
```

### Available Gemini Models

The SDK now supports the latest Gemini models including:

- **gemini-2.0-flash-001**: Latest Gemini 2.0 Flash model (1M tokens)
- **gemini-2.0-flash-exp**: Experimental Gemini 2.0 Flash model
- **gemini-1.5-pro**: Gemini 1.5 Pro model (1M tokens)
- **gemini-1.5-flash**: Gemini 1.5 Flash model (1M tokens)
- **gemini-pro**: Original Gemini Pro model (32K tokens)
- **gemini-pro-vision**: Gemini Pro Vision model (32K tokens)

```typescript
// Use the latest Gemini 2.0 model
const response = await unify.chatCompletion({
  messages: [{ role: 'user', content: 'Explain quantum computing' }],
  model: 'gemini-2.0-flash-001',
  maxTokens: 1000,
});
```

### Batch Processing

```typescript
const questions = [
  'What is machine learning?',
  'Explain neural networks',
  'What is deep learning?',
];

const results = await Promise.all(
  questions.map(question =>
    unify.chatCompletion({
      messages: [{ role: 'user', content: question }],
      model: 'gpt-3.5-turbo',
    })
  )
);
```

## TypeScript Types

The SDK provides comprehensive TypeScript types:

```typescript
import type {
  Message,
  ChatCompletionRequest,
  ChatCompletionResponse,
  ModelInfo,
  UnifyConfig,
  ModelProvider,
} from 'unify-llm';

// Use types in your code
const messages: Message[] = [
  { role: 'user', content: 'Hello!' }
];

const config: UnifyConfig = {
  openai: { apiKey: 'your-key' },
  defaultProvider: 'openai',
};
```

## Development

### Building from Source

```bash
git clone <repository-url>
cd unify-llm
npm install
npm run build
```

### Running Tests

```bash
npm test
```

### Running Examples

```bash
# Set your API keys
export OPENAI_API_KEY="your-openai-key"
export GEMINI_API_KEY="your-gemini-key"

# Run basic example
npx ts-node examples/basic-usage.ts

# Run advanced example
npx ts-node examples/advanced-usage.ts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions, please open an issue on GitHub or contact the maintainers. 