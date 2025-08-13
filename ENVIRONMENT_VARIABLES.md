# Environment Variables Configuration

## Overview

This document describes the environment variables configuration for the TaxAI Dashboard application, including development, production, and local environments.

## Environment Files

### 1. `.env.local` (Current Active)
- **Purpose**: Active environment configuration
- **Usage**: Automatically loaded by Next.js
- **Priority**: Highest (overrides other files)

### 2. `.env.development`
- **Purpose**: Development environment configuration
- **Usage**: Local development with backend on localhost
- **Backend URL**: `http://localhost:5000`

### 3. `.env.production`
- **Purpose**: Production environment configuration
- **Usage**: Production deployment with live backend
- **Backend URL**: `https://tax-ai-backend-dm7p.onrender.com`

## Required Environment Variables

### Core Configuration
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | `your-secret-key-here` |
| `NEXTAUTH_URL` | NextAuth.js base URL | `https://dashboard.taxai.ae` |
| `NODE_ENV` | Node.js environment | `development` or `production` |

### Backend Integration
| Variable | Description | Example |
|----------|-------------|---------|
| `BACKEND_API_URL` | Backend service URL | `https://tax-ai-backend-dm7p.onrender.com` |
| `NEXT_PUBLIC_BACKEND_API_URL` | Public backend URL | `https://tax-ai-backend-dm7p.onrender.com` |
| `JWT_VALIDATION_SECRET` | JWT validation secret | `your-jwt-secret-here` |

### Stripe Configuration
| Variable | Description | Example |
|----------|-------------|---------|
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` |

### Application URLs
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_BASE_URL` | Application base URL | `https://dashboard.taxai.ae/` |

## Environment Setup

### Quick Setup Script
```bash
# Make script executable
chmod +x scripts/env-setup.sh

# Run setup script
./scripts/env-setup.sh
```

### Manual Setup

#### Development Environment
```bash
# Copy development environment
cp .env.development .env.local

# Or manually set variables
export NODE_ENV=development
export BACKEND_API_URL=http://localhost:5000
export JWT_VALIDATION_SECRET=jwt
```

#### Production Environment
```bash
# Copy production environment
cp .env.production .env.local

# Or manually set variables
export NODE_ENV=production
export BACKEND_API_URL=https://tax-ai-backend-dm7p.onrender.com
export JWT_VALIDATION_SECRET=your-production-jwt-secret
```

## JWT Authentication Configuration

### JWT Secret Management
The `JWT_VALIDATION_SECRET` must match the `JWT_SECRET` in the backend service for seamless authentication.

#### Backend Configuration
```bash
# Backend .env.production
JWT_SECRET=your-super-secure-jwt-secret-for-production-change-this-immediately
```

#### Dashboard Configuration
```bash
# Dashboard .env.production
JWT_VALIDATION_SECRET=your-super-secure-jwt-secret-for-production-change-this-immediately
```

### JWT Flow
1. **User Login**: Dashboard calls backend `/api/auth/login`
2. **Token Generation**: Backend generates JWT with `JWT_SECRET`
3. **Token Validation**: Dashboard validates JWT with `JWT_VALIDATION_SECRET`
4. **Session Creation**: NextAuth creates session if validation succeeds

## Environment Validation

### Required Variables Check
```bash
# Check if all required variables are set
./scripts/env-setup.sh

# Choose option 4 to validate all environments
```

### Manual Validation
```bash
# Check specific variables
echo "MONGODB_URI: ${MONGODB_URI:-NOT SET}"
echo "JWT_VALIDATION_SECRET: ${JWT_VALIDATION_SECRET:-NOT SET}"
echo "BACKEND_API_URL: ${BACKEND_API_URL:-NOT SET}"
```

## Troubleshooting

### Common Issues

#### 1. JWT Authentication Fails
**Symptoms**: Login succeeds but session not created
**Cause**: JWT secret mismatch between backend and dashboard
**Solution**: Ensure `JWT_VALIDATION_SECRET` matches backend `JWT_SECRET`

#### 2. Backend Connection Fails
**Symptoms**: 401/500 errors on login attempts
**Cause**: Wrong `BACKEND_API_URL` or backend service down
**Solution**: Verify backend URL and service status

#### 3. Environment Not Loaded
**Symptoms**: Variables show as undefined
**Cause**: Wrong environment file or file not found
**Solution**: Check file existence and Next.js configuration

### Debug Commands
```bash
# Check current environment
echo "Current NODE_ENV: $NODE_ENV"
echo "Current BACKEND_API_URL: $BACKEND_API_URL"

# Validate environment file
source .env.local
echo "Loaded variables:"
env | grep -E "(MONGODB_URI|NEXTAUTH|BACKEND|JWT)"
```

## Security Considerations

### 1. JWT Secret Security
- **Never** commit JWT secrets to version control
- Use strong, random secrets (32+ characters)
- Rotate secrets regularly
- Use different secrets for different environments

### 2. Environment File Security
- Add `.env*` to `.gitignore`
- Use `.env.example` for documentation
- Restrict access to production environment files
- Monitor for secret exposure

### 3. Production Deployment
- Use secure secret management (e.g., Vercel, Netlify)
- Enable environment variable encryption
- Monitor for unauthorized access
- Regular security audits

## Best Practices

### 1. Environment Management
- Use separate files for different environments
- Validate environment variables on startup
- Provide clear error messages for missing variables
- Use environment-specific configurations

### 2. Secret Management
- Generate unique secrets for each environment
- Use secure random generation
- Implement secret rotation
- Monitor secret usage

### 3. Configuration Validation
- Validate all required variables
- Check variable formats and values
- Provide helpful error messages
- Fail fast on configuration errors

## Example Configurations

### Development Environment
```bash
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
BACKEND_API_URL=http://localhost:5000
JWT_VALIDATION_SECRET=jwt
```

### Production Environment
```bash
NODE_ENV=production
NEXTAUTH_URL=https://dashboard.taxai.ae
BACKEND_API_URL=https://tax-ai-backend-dm7p.onrender.com
JWT_VALIDATION_SECRET=your-production-jwt-secret
```

## Next Steps

1. **Validate Environment**: Run validation script
2. **Test Authentication**: Verify JWT flow works
3. **Deploy Changes**: Update production environment
4. **Monitor Logs**: Watch for authentication issues
5. **Update Documentation**: Keep this guide current

---

**⚠️ Important**: Always test environment changes in development before applying to production.
