import { UnifyLLM } from '../src';

async function basicExample() {
  // Initialize the SDK with both providers
  const unify = new UnifyLLM({
    openai: {
      apiKey: process.env.OPENAI_API_KEY!,
    },
    gemini: {
      apiKey: process.env.GEMINI_API_KEY!,
    },
    defaultProvider: 'openai',
    defaultModel: 'gpt-3.5-turbo',
  });

  // Example 1: Simple chat completion with default provider
  console.log('=== Example 1: Simple Chat Completion ===');
  const response1 = await unify.chatCompletion({
    messages: [
      { role: 'user', content: 'Hello! What is the capital of France?' }
    ],
  });
  console.log('Response:', response1.choices[0].message.content);

  // Example 2: Using a specific model (Gemini)
  console.log('\n=== Example 2: Using Gemini Model ===');
  const response2 = await unify.chatCompletion({
    messages: [
      { role: 'user', content: 'Explain quantum computing in simple terms.' }
    ],
    model: 'gemini-pro',
    temperature: 0.3,
  });
  console.log('Response:', response2.choices[0].message.content);

  // Example 3: Streaming response
  console.log('\n=== Example 3: Streaming Response ===');
  await unify.streamChatCompletion(
    {
      messages: [
        { role: 'user', content: 'Write a short story about a robot.' }
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

  // Example 4: List available models
  console.log('\n\n=== Example 4: Available Models ===');
  const models = await unify.listModels();
  console.log('Available models:');
  models.forEach(model => {
    console.log(`- ${model.name} (${model.provider}) - Max tokens: ${model.maxTokens || 'Unknown'}`);
  });

  // Example 5: Get specific model info
  console.log('\n=== Example 5: Model Information ===');
  const modelInfo = await unify.getModelInfo('gpt-4');
  if (modelInfo) {
    console.log('GPT-4 info:', modelInfo);
  }
}

// Run the example
if (require.main === module) {
  basicExample().catch(console.error);
} 