import { UnifyLLM, Message } from '../src';

async function advancedExample() {
  // Initialize with custom configuration
  const unify = new UnifyLLM({
    openai: {
      apiKey: process.env.OPENAI_API_KEY!,
      timeout: 60000, // 60 seconds
      maxRetries: 3,
    },
    gemini: {
      apiKey: process.env.GEMINI_API_KEY!,
      timeout: 45000, // 45 seconds
      maxRetries: 2,
    },
    defaultProvider: 'openai',
  });

  // Example 1: Multi-turn conversation
  console.log('=== Example 1: Multi-turn Conversation ===');
  const conversation: Message[] = [
    { role: 'system', content: 'You are a helpful coding assistant. Provide clear, concise explanations.' },
    { role: 'user', content: 'What is TypeScript?' },
  ];

  let response = await unify.chatCompletion({
    messages: conversation,
    model: 'gpt-3.5-turbo',
    temperature: 0.1,
  });

  console.log('Assistant:', response.choices[0].message.content);

  // Add the assistant's response to the conversation
  conversation.push(response.choices[0].message);
  conversation.push({ role: 'user', content: 'How does it compare to JavaScript?' });

  response = await unify.chatCompletion({
    messages: conversation,
    model: 'gpt-3.5-turbo',
  });

  console.log('Assistant:', response.choices[0].message.content);

  // Example 2: Provider fallback strategy
  console.log('\n=== Example 2: Provider Fallback ===');
  try {
    const fallbackResponse = await unify.chatCompletion({
      messages: [{ role: 'user', content: 'What is the weather like?' }],
      model: 'gpt-4', // Try GPT-4 first
    });
    console.log('GPT-4 response:', fallbackResponse.choices[0].message.content);
  } catch (error) {
    console.log('GPT-4 failed, trying Gemini...');
    try {
      const geminiResponse = await unify.chatCompletion({
        messages: [{ role: 'user', content: 'What is the weather like?' }],
        model: 'gemini-pro',
      });
      console.log('Gemini response:', geminiResponse.choices[0].message.content);
    } catch (geminiError) {
      console.error('Both providers failed:', geminiError);
    }
  }

  // Example 3: Batch processing with different models
  console.log('\n=== Example 3: Batch Processing ===');
  const questions = [
    'What is machine learning?',
    'Explain neural networks',
    'What is deep learning?',
  ];

  const models = ['gpt-3.5-turbo', 'gemini-pro'];
  const results: Array<{ question: string; model: string; response: string }> = [];

  for (const question of questions) {
    for (const model of models) {
      try {
        const batchResponse = await unify.chatCompletion({
          messages: [{ role: 'user', content: question }],
          model,
          maxTokens: 100, // Limit response length for comparison
        });

        results.push({
          question,
          model,
          response: batchResponse.choices[0].message.content,
        });
      } catch (error) {
        console.error(`Failed to get response for ${question} with ${model}:`, error);
      }
    }
  }

  console.log('Batch results:');
  results.forEach(result => {
    console.log(`\nQ: ${result.question}`);
    console.log(`Model: ${result.model}`);
    console.log(`A: ${result.response.substring(0, 100)}...`);
  });

  // Example 4: Streaming with error handling
  console.log('\n=== Example 4: Streaming with Error Handling ===');
  try {
    let streamedContent = '';
    await unify.streamChatCompletion(
      {
        messages: [{ role: 'user', content: 'Write a poem about programming.' }],
        model: 'gpt-3.5-turbo',
        temperature: 0.8,
      },
      (chunk) => {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          streamedContent += content;
          process.stdout.write(content);
        }
        
        // Check for finish reason
        if (chunk.choices[0]?.finishReason) {
          console.log(`\n\nFinished with reason: ${chunk.choices[0].finishReason}`);
        }
      }
    );
  } catch (error) {
    console.error('Streaming failed:', error);
  }

  // Example 5: Model comparison
  console.log('\n=== Example 5: Model Comparison ===');
  const testQuestion = 'Explain the concept of recursion in programming.';
  
  const comparisonResults = await Promise.allSettled([
    unify.chatCompletion({
      messages: [{ role: 'user', content: testQuestion }],
      model: 'gpt-3.5-turbo',
      maxTokens: 200,
    }),
    unify.chatCompletion({
      messages: [{ role: 'user', content: testQuestion }],
      model: 'gemini-pro',
      maxTokens: 200,
    }),
  ]);

  console.log('Model Comparison Results:');
  comparisonResults.forEach((result, index) => {
    const model = index === 0 ? 'GPT-3.5-turbo' : 'Gemini Pro';
    if (result.status === 'fulfilled') {
      console.log(`\n${model}: ${result.value.choices[0].message.content.substring(0, 150)}...`);
    } else {
      console.log(`\n${model}: Failed - ${result.reason}`);
    }
  });
}

// Run the example
if (require.main === module) {
  advancedExample().catch(console.error);
} 