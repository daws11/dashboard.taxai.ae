#!/bin/bash

echo "🔧 TaxAI Dashboard Environment Setup Script"
echo "=========================================="

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo "✅ $1 exists"
        return 0
    else
        echo "❌ $1 not found"
        return 1
    fi
}

# Function to validate environment variables
validate_env() {
    local env_file=$1
    local env_name=$2
    
    echo "🔍 Validating $env_name environment..."
    
    if [ ! -f "$env_file" ]; then
        echo "❌ $env_file not found"
        return 1
    fi
    
    # Source the environment file
    source "$env_file"
    
    # Check required variables
    local required_vars=(
        "MONGODB_URI"
        "NEXTAUTH_SECRET"
        "NEXTAUTH_URL"
        "BACKEND_API_URL"
        "JWT_VALIDATION_SECRET"
    )
    
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -eq 0 ]; then
        echo "✅ All required variables are set in $env_name"
        return 0
    else
        echo "❌ Missing variables in $env_name:"
        for var in "${missing_vars[@]}"; do
            echo "   - $var"
        done
        return 1
    fi
}

# Function to setup environment
setup_env() {
    local env_type=$1
    
    case $env_type in
        "development")
            echo "🚀 Setting up development environment..."
            if [ -f ".env.development" ]; then
                cp .env.development .env.local
                echo "✅ Development environment loaded"
            else
                echo "❌ .env.development not found"
                return 1
            fi
            ;;
        "production")
            echo "🚀 Setting up production environment..."
            if [ -f ".env.production" ]; then
                cp .env.production .env.local
                echo "✅ Production environment loaded"
            else
                echo "❌ .env.production not found"
                return 1
            fi
            ;;
        "local")
            echo "🚀 Keeping local environment..."
            echo "✅ Local environment unchanged"
            ;;
        *)
            echo "❌ Invalid environment type: $env_type"
            echo "Usage: $0 [development|production|local]"
            return 1
            ;;
    esac
}

# Main script
echo "📋 Checking environment files..."

check_file ".env.local"
check_file ".env.development"
check_file ".env.production"

echo ""
echo "🔍 Current environment validation:"
validate_env ".env.local" "local"

echo ""
echo "🎯 Environment Setup Options:"
echo "1. development - Use development environment"
echo "2. production - Use production environment"
echo "3. local - Keep current local environment"
echo "4. validate - Validate all environments"
echo "5. exit"

read -p "Choose option (1-5): " choice

case $choice in
    1)
        setup_env "development"
        ;;
    2)
        setup_env "production"
        ;;
    3)
        setup_env "local"
        ;;
    4)
        echo ""
        echo "🔍 Validating all environments..."
        validate_env ".env.development" "development"
        echo ""
        validate_env ".env.production" "production"
        echo ""
        validate_env ".env.local" "local"
        ;;
    5)
        echo "👋 Exiting..."
        exit 0
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "✅ Environment setup completed!"
echo "Current environment: $(grep '^NODE_ENV=' .env.local | cut -d'=' -f2)"
echo "Backend URL: $(grep '^BACKEND_API_URL=' .env.local | cut -d'=' -f2)"
echo "JWT Secret: $(grep '^JWT_VALIDATION_SECRET=' .env.local | cut -d'=' -f2 | head -c 20)..."
