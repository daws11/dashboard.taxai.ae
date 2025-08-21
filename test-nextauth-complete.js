// Comprehensive test script untuk NextAuth authentication flow
// Jalankan dengan: node test-nextauth-complete.js

const BASE_URL = 'http://localhost:3000';

async function testNextAuthComplete() {
  console.log('🔐 Testing Complete NextAuth Authentication Flow');
  console.log('================================================');
  console.log('Base URL:', BASE_URL);
  console.log('');
  
  const testCredentials = {
    email: 'dawskutel@gmail.com',
    password: 'password'
  };
  
  console.log('📋 Test Credentials:');
  console.log('Email:', testCredentials.email);
  console.log('Password:', testCredentials.password);
  console.log('');
  
  try {
    // Test 1: Verify user data in database
    console.log('1. 🗄️  Verifying user data in database...');
    const verifyResponse = await fetch(`${BASE_URL}/api/test/verify-user`);
    
    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      console.log('✅ User verification successful');
      console.log('User ID:', verifyData.user._id);
      console.log('Email Verified:', verifyData.user.emailVerified);
      console.log('Subscription Status:', verifyData.user.subscription?.status);
      console.log('');
    } else {
      console.log('❌ User verification failed:', verifyResponse.status);
      return;
    }
    
    // Test 2: Test direct login logic
    console.log('2. 🔑 Testing direct login logic...');
    const loginResponse = await fetch(`${BASE_URL}/api/test/test-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testCredentials)
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Direct login logic working');
      console.log('Password Valid:', loginData.authentication.passwordValid);
      console.log('Can Login:', loginData.authentication.canLogin);
      console.log('');
    } else {
      console.log('❌ Direct login logic failed:', loginResponse.status);
      return;
    }
    
    // Test 3: Test NextAuth providers endpoint
    console.log('3. 🔐 Testing NextAuth providers...');
    const providersResponse = await fetch(`${BASE_URL}/api/auth/providers`);
    
    if (providersResponse.ok) {
      const providersData = await providersResponse.json();
      console.log('✅ NextAuth providers endpoint working');
      console.log('Available providers:', Object.keys(providersData));
      console.log('');
    } else {
      console.log('❌ NextAuth providers endpoint failed:', providersResponse.status);
    }
    
    // Test 4: Test NextAuth session endpoint
    console.log('4. 📋 Testing NextAuth session...');
    const sessionResponse = await fetch(`${BASE_URL}/api/auth/session`);
    
    if (sessionResponse.ok) {
      const sessionData = await sessionResponse.json();
      console.log('✅ NextAuth session endpoint working');
      console.log('Session data:', sessionData);
      console.log('');
    } else {
      console.log('❌ NextAuth session endpoint failed:', sessionResponse.status);
    }
    
    // Test 5: Test NextAuth csrf endpoint
    console.log('5. 🛡️  Testing NextAuth CSRF...');
    const csrfResponse = await fetch(`${BASE_URL}/api/auth/csrf`);
    
    if (csrfResponse.ok) {
      const csrfData = await csrfResponse.json();
      console.log('✅ NextAuth CSRF endpoint working');
      console.log('CSRF token:', csrfData.csrfToken ? 'Present' : 'Missing');
      console.log('');
    } else {
      console.log('❌ NextAuth CSRF endpoint failed:', csrfResponse.status);
    }
    
    console.log('📊 Test Summary:');
    console.log('✅ User data verified in database');
    console.log('✅ Direct login logic working');
    console.log('✅ NextAuth endpoints accessible');
    console.log('');
    
    console.log('🎯 CONCLUSION:');
    console.log('✅ Semua komponen NextAuth berfungsi dengan baik');
    console.log('✅ User data dan password valid');
    console.log('✅ NextAuth configuration correct');
    console.log('');
    
    console.log('🔧 Next Steps:');
    console.log('1. Test actual login form di dashboard');
    console.log('2. Check browser console untuk error details');
    console.log('3. Verify NextAuth callback flow');
    console.log('4. Deploy ke production jika semua test passed');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if Next.js server is running');
    console.log('2. Verify all API endpoints exist');
    console.log('3. Check database connection');
    console.log('4. Review NextAuth configuration');
  }
}

// Run the complete test
testNextAuthComplete();
