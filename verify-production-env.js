// Script untuk verifikasi environment variables production
// Jalankan dengan: node verify-production-env.js

const fs = require('fs');
const path = require('path');

function verifyProductionEnvironment() {
  console.log('🔍 Verifying Production Environment Variables');
  console.log('===========================================');
  
  try {
    // Read .env.production file
    const envPath = path.join(__dirname, '.env.production');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    console.log('📁 Environment file: .env.production');
    console.log('');
    
    // Parse environment variables
    const envVars = {};
    envContent.split('\n').forEach(line => {
      if (line.trim() && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          envVars[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
    
    // Check critical variables
    const criticalVars = [
      'MONGODB_URI',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'JWT_VALIDATION_SECRET',
      'NODE_ENV'
    ];
    
    console.log('🔍 Checking critical environment variables:');
    console.log('');
    
    let allCriticalVarsPresent = true;
    
    criticalVars.forEach(varName => {
      const value = envVars[varName];
      if (value && value !== '') {
        if (varName.includes('SECRET') || varName.includes('KEY')) {
          console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
        } else {
          console.log(`✅ ${varName}: ${value}`);
        }
      } else {
        console.log(`❌ ${varName}: MISSING`);
        allCriticalVarsPresent = false;
      }
    });
    
    console.log('');
    
    // Check JWT secret consistency
    const backendJwtSecret = 'UKatDq+cFeozIv6S8J9LdFEktB5y6JNLSAkDz5e6Obk=';
    const dashboardJwtSecret = envVars['JWT_VALIDATION_SECRET'];
    
    if (dashboardJwtSecret === backendJwtSecret) {
      console.log('✅ JWT secrets match between backend and dashboard');
    } else {
      console.log('❌ JWT secrets do NOT match');
      console.log('Backend:', backendJwtSecret);
      console.log('Dashboard:', dashboardJwtSecret);
    }
    
    console.log('');
    
    // Check MongoDB URI format
    const mongoUri = envVars['MONGODB_URI'];
    if (mongoUri && mongoUri.includes('mongodb+srv://')) {
      console.log('✅ MongoDB URI format is correct');
    } else {
      console.log('❌ MongoDB URI format is incorrect');
    }
    
    // Check NEXTAUTH_URL format
    const nextAuthUrl = envVars['NEXTAUTH_URL'];
    if (nextAuthUrl && nextAuthUrl.startsWith('https://')) {
      console.log('✅ NEXTAUTH_URL format is correct');
    } else {
      console.log('❌ NEXTAUTH_URL format is incorrect');
    }
    
    console.log('');
    console.log('📊 Verification Summary:');
    
    if (allCriticalVarsPresent) {
      console.log('✅ All critical environment variables are present');
      console.log('✅ Environment configuration is ready for production');
      console.log('');
      console.log('🚀 Ready to deploy!');
      console.log('Run: ./deploy-production.sh');
    } else {
      console.log('❌ Some critical environment variables are missing');
      console.log('🔧 Please fix the missing variables before deploying');
    }
    
  } catch (error) {
    console.error('❌ Error reading environment file:', error.message);
    console.log('🔧 Make sure .env.production exists and is readable');
  }
}

// Run verification
verifyProductionEnvironment();
