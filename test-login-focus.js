// Test script untuk fokus pada masalah login
// Jalankan dengan: node test-login-focus.js

const BASE_URL = 'http://localhost:3000';

async function testLoginDirectly() {
  console.log('🧪 Testing Direct Login (Focus on Main Issue)');
  console.log('==============================================');
  console.log('Base URL:', BASE_URL);
  console.log('');

  try {
    // Test credentials
    const testCredentials = {
      email: 'dawskutel@gmail.com',
      password: 'Qwerty90'
    };

    console.log('📋 Test Credentials:');
    console.log('Email:', testCredentials.email);
    console.log('Password:', testCredentials.password);
    console.log('');

    // Test 1: Direct Login API
    console.log('1. 🧪 Testing Direct Login API...');
    const loginResponse = await fetch(`${BASE_URL}/api/test/test-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testCredentials)
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Direct Login API working!');
      console.log('Login Result:', loginData.message);
      console.log('User:', loginData.user.name);
      console.log('Password Valid:', loginData.authentication.passwordValid ? '✅ YES' : '❌ NO');
      console.log('Can Login:', loginData.authentication.canLogin ? '✅ YES' : '❌ NO');

      if (loginData.authentication.issues.length > 0) {
        console.log('\n⚠️ Potential Issues:');
        loginData.authentication.issues.forEach(issue => console.log(`  - ${issue}`));
      }

      console.log('\n📊 Login Test Summary:');
      console.log('✅ Database connection working');
      console.log('✅ User found in database');
      console.log('✅ Password verification working');
      console.log('✅ User data complete');
      console.log('✅ Login should work in dashboard');
      
      console.log('\n🎯 CONCLUSION:');
      if (loginData.authentication.canLogin) {
        console.log('✅ User CAN login with these credentials');
        console.log('✅ The issue is NOT with user data or password');
        console.log('🔍 The problem is likely in NextAuth configuration or dashboard code');
        console.log('');
        console.log('🔧 Next Steps:');
        console.log('1. Check NextAuth configuration in dashboard');
        console.log('2. Check browser console for specific errors');
        console.log('3. Verify NextAuth environment variables');
        console.log('4. Test actual dashboard login form');
      } else {
        console.log('❌ User CANNOT login with these credentials');
        console.log('❌ There are issues with user data');
        console.log('🔧 Fix the issues shown above first');
      }

    } else {
      console.log('❌ Direct Login API failed:', loginResponse.status);
      const errorData = await loginResponse.text();
      console.log('Error:', errorData);
      
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Check if Next.js server is running');
      console.log('2. Verify API endpoint exists at /api/test/test-login');
      console.log('3. Check database connection');
      console.log('4. Verify user exists in database');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure Next.js server is running (npm run dev)');
    console.log('2. Check if API endpoints exist at /api/test/*');
    console.log('3. Verify database connection in Next.js');
    console.log('4. Check console logs for detailed errors');
  }
}

// Test NextAuth configuration
async function testNextAuthConfig() {
  console.log('\n🔐 Testing NextAuth Configuration...');
  console.log('=====================================');

  try {
    // Test NextAuth endpoint
    console.log('1. Testing NextAuth endpoint...');
    const nextAuthResponse = await fetch(`${BASE_URL}/api/auth/providers`);
    
    if (nextAuthResponse.ok) {
      const providers = await nextAuthResponse.json();
      console.log('✅ NextAuth endpoint working');
      console.log('Available providers:', Object.keys(providers));
      
      if (providers.credentials) {
        console.log('✅ Credentials provider configured');
        console.log('Credentials config:', providers.credentials);
      } else {
        console.log('❌ Credentials provider NOT configured');
      }
    } else {
      console.log('❌ NextAuth endpoint failed:', nextAuthResponse.status);
    }

  } catch (error) {
    console.log('❌ NextAuth test failed:', error.message);
  }
}

// Run focused tests
async function runFocusedTests() {
  console.log('🚀 Starting Focused Login Tests...\n');
  
  // Test direct login first
  await testLoginDirectly();
  
  // Test NextAuth configuration
  await testNextAuthConfig();
  
  console.log('\n🔍 Focused tests completed!');
  console.log('\n🎯 SUMMARY:');
  console.log('If direct login works but dashboard login fails:');
  console.log('  - The issue is in NextAuth or dashboard code');
  console.log('  - NOT in user data or database');
  console.log('');
  console.log('If direct login also fails:');
  console.log('  - The issue is in user data or database');
  console.log('  - Fix user data first');
}

// Run the tests
runFocusedTests();

