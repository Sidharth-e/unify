# Test Project Setup Guide

## Your Current Setup
- **Unify LLM Location**: `C:\Users\sidha\Desktop\Projects\AI labs\unify`
- **Test Project Location**: `C:\Users\sidha\Desktop\Projects\AI labs\test\test`

## Step-by-Step Installation

### 1. Navigate to Your Test Project
```bash
cd "C:\Users\sidha\Desktop\Projects\AI labs\test\test"
```

### 2. Initialize npm (if not already done)
```bash
npm init -y
```

### 3. Install the SDK (Choose one method)

**Method A: Install from Directory (Recommended)**
```bash
npm install "C:\Users\sidha\Desktop\Projects\AI labs\unify"
```

**Method B: Install from Tarball**
```bash
npm install "C:\Users\sidha\Desktop\Projects\AI labs\unify\unify-llm-1.0.0.tgz"
```

**Method C: Copy and Install**
```bash
# Copy tarball to current directory
copy "C:\Users\sidha\Desktop\Projects\AI labs\unify\unify-llm-1.0.0.tgz" .

# Install from local copy
npm install unify-llm-1.0.0.tgz
```

### 4. Install TypeScript Dependencies
```bash
npm install --save-dev typescript @types/node ts-node
```

### 5. Create a Test File
Create `test.js` or `test.ts`:
```javascript
// test.js
const { UnifyLLM } = require('unify-llm');

async function test() {
  const unify = new UnifyLLM({
    openai: { apiKey: process.env.OPENAI_API_KEY || 'test-key' },
    gemini: { apiKey: process.env.GEMINI_API_KEY || 'test-key' },
  });

  console.log('✅ SDK loaded successfully!');
  console.log('📦 Available providers:', unify.isProviderConfigured('openai') ? 'OpenAI' : '', unify.isProviderConfigured('gemini') ? 'Gemini' : '');
}

test().catch(console.error);
```

### 6. Run the Test
```bash
node test.js
```

## Troubleshooting

### If you get path errors:
- Always use quotes around paths with spaces
- Use forward slashes: `C:/Users/sidha/Desktop/Projects/AI labs/unify`
- Or escape spaces: `C:\Users\sidha\Desktop\Projects\AI\ labs\unify`

### If npm can't find the package:
- Verify the path exists: `dir "C:\Users\sidha\Desktop\Projects\AI labs\unify"`
- Check if package.json exists in the unify directory
- Try copying the tarball to your project directory first

## Expected Output
After successful installation, you should see:
```
✅ SDK loaded successfully!
📦 Available providers: OpenAI Gemini
``` 