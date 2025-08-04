#!/usr/bin/env ts-node

import { UnifyLLM } from './src';

async function demo() {
  console.log('🚀 Unify LLM SDK Demo\n');

  // Check if API keys are available
  const openaiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!openaiKey && !geminiKey) {
    console.log('❌ No API keys found! Please set OPENAI_API_KEY and/or GEMINI_API_KEY environment variables.');
    console.log('Example:');
    console.log('export OPENAI_API_KEY="your-openai-key"');
    console.log('export GEMINI_API_KEY="your-gemini-key"');
    return;
  }

  // Initialize the SDK
  const config: any = {};
  if (openaiKey) config.openai = { apiKey: openaiKey };
  if (geminiKey) config.gemini = { apiKey: geminiKey };
  
  config.defaultProvider = openaiKey ? 'openai' : 'gemini';
  config.defaultModel = openaiKey ? 'gpt-3.5-turbo' : 'gemini-2.0-flash-001';

  const unify = new UnifyLLM(config);

  console.log('✅ SDK initialized successfully!');
  console.log(`📡 Configured providers: ${Array.from(unify.getProvider('openai') ? ['OpenAI'] : []).concat(unify.getProvider('gemini') ? ['Gemini'] : []).join(', ')}\n`);

  // Demo 1: List available models
  console.log('📋 Available Models:');
  try {
    const models = await unify.listModels();
    models.forEach(model => {
      console.log(`  - ${model.name} (${model.provider})`);
    });
  } catch (error) {
    console.log('  ❌ Failed to fetch models:', (error as Error).message);
  }
  console.log('');

  // Demo 2: Simple chat completion
  console.log('💬 Simple Chat Completion:');
  try {
    const response = await unify.chatCompletion({
      messages: [
        { role: 'user', content: 'Hello! What is 2 + 2?' }
      ],
    });
    console.log(`  🤖 Response: ${response.choices[0].message.content}`);
  } catch (error) {
    console.log(`  ❌ Failed: ${(error as Error).message}`);
  }
  console.log('');

  // Demo 3: Multi-provider comparison (if both are available)
  if (openaiKey && geminiKey) {
    console.log('🔄 Multi-Provider Comparison:');
    const question = 'What is the capital of Japan?';
    
    try {
      const openaiResponse = await unify.chatCompletion({
        messages: [{ role: 'user', content: question }],
        model: 'gpt-3.5-turbo',
        maxTokens: 50,
      });
      console.log(`  🤖 OpenAI: ${openaiResponse.choices[0].message.content}`);
    } catch (error) {
      console.log(`  ❌ OpenAI failed: ${(error as Error).message}`);
    }

    try {
      const geminiResponse = await unify.chatCompletion({
        messages: [{ role: 'user', content: question }],
        model: 'gemini-2.0-flash-001',
        maxTokens: 50,
      });
      console.log(`  🤖 Gemini: ${geminiResponse.choices[0].message.content}`);
    } catch (error) {
      console.log(`  ❌ Gemini failed: ${(error as Error).message}`);
    }
    console.log('');
  }

  // Demo 4: Streaming (if supported)
  console.log('📡 Streaming Demo:');
  try {
    let streamedContent = '';
    await unify.streamChatCompletion(
      {
        messages: [
          { role: 'user', content: 'Count from 1 to 5 slowly.' }
        ],
        model: config.defaultModel,
      },
      (chunk) => {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          streamedContent += content;
          process.stdout.write(content);
        }
      }
    );
    console.log('\n  ✅ Streaming completed!');
  } catch (error) {
    console.log(`  ❌ Streaming failed: ${(error as Error).message}`);
  }
  console.log('');

  console.log('🎉 Demo completed!');
  console.log('\n📚 For more examples, check out the examples/ directory.');
  console.log('📖 For documentation, see README.md');
}

// Run the demo
if (require.main === module) {
  demo().catch(console.error);
} 