const { UnifyLLM } = require('./dist');

async function testGemini() {
  try {
    const unify = new UnifyLLM({
      gemini: {
        apiKey: process.env.GEMINI_API_KEY,
      },
      defaultProvider: 'gemini',
      defaultModel: 'gemini-1.5-flash',
    });

    console.log('Testing Gemini provider...');
    
    const response = await unify.chatCompletion({
      messages: [{ role: 'user', content: 'Hello! What is 2 + 2?' }],
      model: 'gemini-1.5-flash',
    });

    console.log('✅ Success! Response:', response.choices[0].message.content);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testGemini(); 