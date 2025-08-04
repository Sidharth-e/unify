# Project Structure

```
unify-llm/
├── src/                          # Source code
│   ├── types/                    # TypeScript type definitions
│   │   └── index.ts             # Core interfaces and types
│   ├── providers/               # LLM provider implementations
│   │   ├── base.ts             # Base provider abstract class
│   │   ├── openai.ts           # OpenAI provider implementation
│   │   ├── gemini.ts           # Gemini provider implementation
│   │   └── index.ts            # Provider exports
│   ├── unify.ts                # Main UnifyLLM class
│   └── index.ts                # Public API exports
├── examples/                    # Usage examples
│   ├── basic-usage.ts          # Basic SDK usage examples
│   └── advanced-usage.ts       # Advanced usage patterns
├── tests/                      # Test files
│   ├── setup.ts               # Jest test setup
│   └── unify.test.ts          # Main SDK tests
├── scripts/                    # Build and utility scripts
│   └── build.sh               # Build script
├── package.json               # NPM package configuration
├── tsconfig.json              # TypeScript configuration
├── jest.config.js             # Jest test configuration
├── .eslintrc.js              # ESLint configuration
├── .gitignore                # Git ignore rules
├── README.md                 # Main documentation
├── demo.ts                   # Interactive demo script
└── PROJECT_STRUCTURE.md      # This file
```

## Key Components

### Core SDK (`src/`)

- **`types/index.ts`**: Defines all TypeScript interfaces and types used throughout the SDK
- **`providers/base.ts`**: Abstract base class that all providers must extend
- **`providers/openai.ts`**: OpenAI API integration
- **`providers/gemini.ts`**: Google Gemini API integration
- **`unify.ts`**: Main `UnifyLLM` class that provides the unified interface
- **`index.ts`**: Public API exports

### Examples (`examples/`)

- **`basic-usage.ts`**: Simple examples showing basic SDK functionality
- **`advanced-usage.ts`**: Complex examples including multi-turn conversations, fallback strategies, and batch processing

### Tests (`tests/`)

- **`setup.ts`**: Jest configuration and test environment setup
- **`unify.test.ts`**: Unit tests for the main SDK functionality

### Configuration Files

- **`package.json`**: NPM package configuration with dependencies and scripts
- **`tsconfig.json`**: TypeScript compilation settings
- **`jest.config.js`**: Jest testing framework configuration
- **`.eslintrc.js`**: Code linting rules
- **`.gitignore`**: Files to exclude from version control

### Scripts (`scripts/`)

- **`build.sh`**: Automated build script that cleans, installs dependencies, and compiles the SDK

## Architecture Overview

The SDK follows a provider pattern where:

1. **BaseProvider** (`providers/base.ts`) defines the common interface
2. **Concrete Providers** (`providers/openai.ts`, `providers/gemini.ts`) implement the interface for specific APIs
3. **UnifyLLM** (`unify.ts`) acts as a facade that manages multiple providers and provides a unified API
4. **Types** (`types/index.ts`) ensure type safety across the entire SDK

## Key Features

- **Unified Interface**: Single API for multiple LLM providers
- **Automatic Provider Detection**: Detects the appropriate provider based on model name
- **Streaming Support**: Real-time streaming for both providers
- **Error Handling**: Robust error handling with retry mechanisms
- **TypeScript Support**: Full type safety and IntelliSense support
- **Extensible**: Easy to add new providers by extending the BaseProvider class

## Development Workflow

1. **Install Dependencies**: `npm install`
2. **Build**: `npm run build` or `npm run build:full`
3. **Test**: `npm test`
4. **Lint**: `npm run lint`
5. **Demo**: `npm run demo` (requires API keys)
6. **Format**: `npm run format`

## Adding New Providers

To add a new LLM provider:

1. Create a new file in `src/providers/` (e.g., `anthropic.ts`)
2. Extend the `BaseProvider` class
3. Implement all required abstract methods
4. Add the provider to the `UnifyLLM` constructor
5. Update the provider detection logic
6. Add tests for the new provider
7. Update documentation 