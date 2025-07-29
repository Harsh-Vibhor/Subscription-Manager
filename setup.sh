#!/bin/bash

# Subscription Manager Setup Script
echo "🚀 Setting up Subscription Manager..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ and try again."
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL is not installed. Please install MySQL and try again."
    echo "   You can download it from: https://dev.mysql.com/downloads/"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Setup environment files
echo "⚙️  Setting up environment files..."
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "📝 Created backend/.env file. Please configure your database settings."
else
    echo "✅ Backend .env file already exists"
fi

# Create database
echo "🗄️  Setting up database..."
echo "Please make sure MySQL is running and you have the correct credentials in backend/.env"

# Build frontend
echo "🏗️  Building frontend..."
cd frontend && npm run build && cd ..

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Configure your database settings in backend/.env"
echo "2. Make sure MySQL is running"
echo "3. Run 'npm run dev' to start the development servers"
echo ""
echo "📚 Available commands:"
echo "  npm run dev          - Start both frontend and backend in development mode"
echo "  npm run start        - Start both frontend and backend in production mode"
echo "  npm run build        - Build the frontend for production"
echo "  npm run test         - Run tests for both frontend and backend"
echo ""
echo "🌐 The application will be available at:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:3001"
echo ""
echo "👤 Default admin credentials:"
echo "  Email:    admin@subscriptionmanager.com"
echo "  Password: admin123"
