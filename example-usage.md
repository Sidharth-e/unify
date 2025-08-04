# Using Unify LLM in Another Project

## Quick Setup

### 1. Create a new project
```bash
mkdir my-ai-app
cd my-ai-app
npm init -y
```

### 2. Install the SDK
```bash
# Option A: From local tarball
npm install /path/to/unify/unify-llm-1.0.0.tgz

# Option B: From local directory
npm install /path/to/unify

# Option C: Using npm link (for development)
npm link unify-llm
```

### 3. Install TypeScript (if using TypeScript)
```bash
npm install --save-dev typescript @types/node
```

### 4. Create a simple example
Create `index.ts`:
```typescript
import { UnifyLLM } from 'unify-llm';

async function main() {
  const unify = new UnifyLLM({
    openai: { apiKey: process.env.OPENAI_API_KEY! },
    gemini: { apiKey: process.env.GEMINI_API_KEY! },
    defaultProvider: 'openai',
  });

  const response = await unify.chatCompletion({
    messages: [{ role: 'user', content: 'Hello! What is 2 + 2?' }],
    model: 'gpt-3.5-turbo',
  });

  console.log('Response:', response.choices[0].message.content);
}

main().catch(console.error);
```

### 5. Set up environment variables
Create `.env` file:
```env
OPENAI_API_KEY=your-openai-key
GEMINI_API_KEY=your-gemini-key
```

### 6. Run the example
```bash
# Install dotenv for environment variables
npm install dotenv

# Run with ts-node
npx ts-node index.ts
```

## Package.json Example
```json
{
  "name": "my-ai-app",
  "version": "1.0.0",
  "dependencies": {
    "unify-llm": "file:../unify",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "ts-node": "^10.9.0"
  },
  "scripts": {
    "start": "ts-node index.ts",
    "dev": "ts-node --watch index.ts"
  }
}
```

## Available Features
- ✅ Unified interface for OpenAI and Gemini
- ✅ Automatic provider detection
- ✅ Streaming support
- ✅ Error handling with retries
- ✅ TypeScript support
- ✅ Model management

## Troubleshooting

### Gemini API Key Issues
If you encounter authentication errors with Gemini, make sure:
1. Your `GEMINI_API_KEY` environment variable is set correctly
2. The API key is valid and has the necessary permissions
3. You're using the latest version of the SDK

Example of proper Gemini setup:
```typescript
const unify = new UnifyLLM({
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },
  defaultProvider: 'gemini',
  defaultModel: 'gemini-1.5-flash',
});
``` 