import bcrypt from 'bcryptjs';

// Test user data from your database
const testUser = {
  email: 'dawskutel@gmail.com',
  password: 'Qwerty90', // Replace with actual password
  storedHash: '$2a$12$XAbmTcQXgfa8XDJRKD9lEe/BsWwl2qGivUKAFmSYdqq/CgNcZqKEy'
};

console.log('🧪 Testing Dashboard Local Authentication');
console.log('=========================================');

console.log('\n📋 Test User Details:');
console.log('Email:', testUser.email);
console.log('Password:', testUser.password);
console.log('Stored Hash:', testUser.storedHash);

try {
  // Test 1: Password hash verification
  console.log('\n1. Testing password hash verification...');
  const isValidPassword = await bcrypt.compare(testUser.password, testUser.storedHash);
  console.log(`Password verification: ${isValidPassword ? '✅ VALID' : '❌ INVALID'}`);
  
  if (!isValidPassword) {
    console.log('❌ Password hash verification failed!');
    console.log('🔧 This explains why login is failing.');
    console.log('   The password in the database does not match the test password.');
    return;
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
  const wrongPasswords = ['wrongpass', 'test', '123test', 'test1234', 'password'];
  
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

} catch (error) {
  console.error('❌ Test failed:', error.message);
  console.error('Error details:', error);
}

console.log('\n🔍 Test completed!');
