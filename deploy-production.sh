#!/bin/bash

echo "🚀 Deploying Dashboard to Production"
echo "====================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the dashboard directory."
    exit 1
fi

# Check environment files
echo "📋 Checking environment files..."
if [ ! -f ".env.production" ]; then
    echo "❌ Error: .env.production not found"
    exit 1
fi

# Verify critical environment variables
echo "🔍 Verifying critical environment variables..."
source .env.production

if [ -z "$MONGODB_URI" ]; then
    echo "❌ Error: MONGODB_URI not set in .env.production"
    exit 1
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
    echo "❌ Error: NEXTAUTH_SECRET not set in .env.production"
    exit 1
fi

if [ -z "$JWT_VALIDATION_SECRET" ]; then
    echo "❌ Error: JWT_VALIDATION_SECRET not set in .env.production"
    exit 1
fi

echo "✅ Environment variables verified"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build production
echo "🔨 Building production..."
pnpm build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"

# Start production server
echo "🚀 Starting production server..."
echo "Dashboard will be available at: https://dashboard.taxai.ae"
echo ""
echo "📋 Production Configuration:"
echo "- MongoDB: Connected"
echo "- NextAuth: Configured"
echo "- JWT Secret: Updated"
echo "- Password Hash: Fixed"
echo ""
echo "🔧 To test login:"
echo "- Email: dawskutel@gmail.com"
echo "- Password: password"
echo ""
echo "Press Ctrl+C to stop the server"

# Start the production server
pnpm start
