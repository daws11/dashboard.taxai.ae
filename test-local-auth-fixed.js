import bcrypt from 'bcryptjs';

// Test user data from your database - using the updated document
const testUser = {
  email: 'dawskutel@gmail.com',
  password: 'Qwerty90', // The correct password
  storedHash: '$2a$12$AqjHGi9nsbJg3jKXMnHc4OeyADwQ6u4wCRnokwc9ReXg7VQ3Um.7a' // New hash from document
};

console.log('🧪 Testing Dashboard Local Authentication (UPDATED)');
console.log('==================================================');

console.log('\n📋 Test User Details:');
console.log('Email:', testUser.email);
console.log('Password:', testUser.password);
console.log('Stored Hash:', testUser.storedHash);

async function testPasswordVerification() {
  try {
    // Test 1: Password hash verification
    console.log('\n1. Testing password hash verification...');
    const isValidPassword = await bcrypt.compare(testUser.password, testUser.storedHash);
    console.log(`Password verification: ${isValidPassword ? '✅ VALID' : '❌ INVALID'}`);
    
    if (!isValidPassword) {
      console.log('❌ Password hash verification failed!');
      console.log('🔧 This explains why login is failing.');
      console.log('   The password in the database does not match the test password.');
      return false;
    }

    // Test 2: Generate new hash for comparison
    console.log('\n2. Generating new hash for comparison...');
    const newHash = await bcrypt.hash(testUser.password, 12);
    console.log('New hash:', newHash);
    
    // Test 3: Verify new hash
    const newHashValid = await bcrypt.compare(testUser.password, newHash);
    console.log(`New hash verification: ${newHashValid ? '✅ VALID' : '❌ INVALID'}`);

    // Test 4: Test with wrong passwords
    console.log('\n3. Testing with wrong passwords...');
    const wrongPasswords = ['wrongpass', 'test', '123test', 'test1234', 'password', 'test123'];
    
    for (const wrongPass of wrongPasswords) {
      const wrongResult = await bcrypt.compare(wrongPass, testUser.storedHash);
      console.log(`"${wrongPass}": ${wrongResult ? '❌ WRONGLY ACCEPTED' : '✅ CORRECTLY REJECTED'}`);
    }

    // Test 5: Hash analysis
    console.log('\n4. Hash analysis...');
    const hashRounds = bcrypt.getRounds(testUser.storedHash);
    console.log('Hash cost (rounds):', hashRounds);
    console.log('Hash algorithm:', testUser.storedHash.startsWith('$2a$') ? 'bcrypt' : 'unknown');

    console.log('\n📊 Local Authentication Test Summary:');
    console.log('✅ Password hash verification working');
    console.log('✅ bcrypt comparison working');
    console.log('✅ Hash generation working');
    
    console.log('\n🎯 The password hash is correct!');
    console.log('   Local authentication should work in the dashboard.');
    console.log('   If login still fails, check:');
    console.log('   1. MongoDB connection in dashboard');
    console.log('   2. User model schema compatibility');
    console.log('   3. NextAuth configuration');

    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Error details:', error);
    return false;
  }
}

// Test with different passwords to find the correct one
async function testMultiplePasswords() {
  console.log('\n🔍 Testing Multiple Password Possibilities');
  console.log('==========================================');
  
  const possiblePasswords = [
    'Qwerty90',    // From logs and document
    'test123',     // Original test
    'password',    // Common password
    '123456',      // Common password
    'admin',       // Common password
    'user',        // Common password
    'qwerty',      // Common password
    'abc123',      // Common password
    'password123', // Common password
    'admin123'     // Common password
  ];
  
  for (const password of possiblePasswords) {
    try {
      const isValid = await bcrypt.compare(password, testUser.storedHash);
      console.log(`"${password}": ${isValid ? '✅ MATCHES' : '❌ NO MATCH'}`);
      
      if (isValid) {
        console.log(`🎯 FOUND CORRECT PASSWORD: "${password}"`);
        return password;
      }
    } catch (error) {
      console.log(`"${password}": ❌ ERROR - ${error.message}`);
    }
  }
  
  console.log('❌ No password matches found');
  return null;
}

// Run the tests
async function runAllTests() {
  console.log('🚀 Starting comprehensive password tests...\n');
  
  // First, try to find the correct password
  const correctPassword = await testMultiplePasswords();
  
  if (correctPassword) {
    console.log(`\n✅ Correct password found: "${correctPassword}"`);
    console.log('🔧 Update your test scripts and login forms with this password');
    
    // Update the test user with correct password
    testUser.password = correctPassword;
    
    // Now test the verification
    await testPasswordVerification();
  } else {
    console.log('\n❌ No correct password found');
    console.log('🔧 You need to:');
    console.log('   1. Check the actual password in your database');
    console.log('   2. Update the password hash if needed');
    console.log('   3. Verify the registration process');
  }
  
  console.log('\n🔍 All tests completed!');
}

// Run all tests
runAllTests();
