// Test setup file
process.env.NODE_ENV = 'test';

// Mock environment variables for testing
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.GEMINI_API_KEY = 'test-gemini-key';

// Increase timeout for async operations
jest.setTimeout(30000); 