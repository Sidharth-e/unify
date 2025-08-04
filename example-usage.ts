import { UnifyLLM } from './src';

async function main() {
  try {
    const unify = new UnifyLLM({
      gemini: {
        apiKey: process.env.GEMINI_API_KEY,
      },
      defaultProvider: 'gemini',
      defaultModel: 'gemini-1.5-flash',
    });

    // Method 1: Use default model (no need to specify model)
    const response1 = await unify.chatCompletion({
      messages: [{ role: 'user', content: 'Hello! What is 2 + 2?' }],
    });

    console.log('Response 1:', response1.choices[0].message.content);

    // Method 2: Specify a specific model
    const response2 = await unify.chatCompletion({
      messages: [{ role: 'user', content: 'Explain quantum computing briefly' }],
      model: 'gemini-2.0-flash-001', // Using the latest Gemini 2.0 model
    });

    console.log('Response 2:', response2.choices[0].message.content);

    // Method 3: With additional parameters
    const response3 = await unify.chatCompletion({
      messages: [{ role: 'user', content: 'Write a short poem about AI' }],
      model: 'gemini-1.5-flash',
      temperature: 0.8,
      maxTokens: 200,
    });

    console.log('Response 3:', response3.choices[0].message.content);

    // Method 4: Streaming example
    console.log('\nStreaming response:');
    await unify.streamChatCompletion(
      {
        messages: [{ role: 'user', content: 'Count from 1 to 5' }],
        model: 'gemini-1.5-flash',
      },
      (chunk) => {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          process.stdout.write(content);
        }
      }
    );

  } catch (error) {
    console.error('Error:', error);
  }
}

// Check if API key is available
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ Please set the GEMINI_API_KEY environment variable');
  console.log('Example: export GEMINI_API_KEY="your-api-key"');
  process.exit(1);
}

main(); 