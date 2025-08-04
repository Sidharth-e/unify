#!/bin/bash

echo "🔨 Building Unify LLM SDK..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build TypeScript
echo "⚙️  Compiling TypeScript..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Output directory: dist/"
    
    # Show build output
    echo "📋 Built files:"
    find dist/ -name "*.js" -o -name "*.d.ts" | sort
    
    echo ""
    echo "🚀 SDK is ready for use!"
    echo "📖 Run 'npm test' to run tests"
    echo "🎯 Run 'node demo.js' to see a demo (after setting API keys)"
else
    echo "❌ Build failed!"
    exit 1
fi 