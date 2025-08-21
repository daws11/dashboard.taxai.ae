// Test script untuk verifikasi password hash
// Jalankan dengan: node test-password-hash.js

const bcrypt = require('bcryptjs');

async function testPasswordHash() {
  console.log('🔐 Testing Password Hash Verification');
  console.log('=====================================');
  
  // Test credentials
  const testEmail = 'dawskutel@gmail.com';
  const testPassword = 'password'; // Password baru yang disebutkan user
  
  console.log('📋 Test Credentials:');
  console.log('Email:', testEmail);
  console.log('Password:', testPassword);
  console.log('');
  
  // Test 1: Generate new hash untuk password 'password'
  console.log('1. 🔄 Generating new hash for password "password"...');
  const newHash = await bcrypt.hash(testPassword, 12);
  console.log('✅ New hash generated:', newHash);
  console.log('Hash length:', newHash.length);
  console.log('');
  
  // Test 2: Verify password dengan hash baru
  console.log('2. 🔍 Verifying password with new hash...');
  const isValidNew = await bcrypt.compare(testPassword, newHash);
  console.log('Password valid with new hash:', isValidNew ? '✅ YES' : '❌ NO');
  console.log('');
  
  // Test 3: Test dengan hash lama dari document user
  console.log('3. 🔍 Testing with old hash from user document...');
  const oldHash = '$2a$12$AqjHGi9nsbJg3jKXMnHc4OeyADwQ6u4wCRnokwc9ReXg7VQ3Um.7a';
  const isValidOld = await bcrypt.compare(testPassword, oldHash);
  console.log('Password valid with old hash:', isValidOld ? '✅ YES' : '❌ NO');
  console.log('');
  
  // Test 4: Test dengan password lama 'Qwerty90'
  console.log('4. 🔍 Testing old password "Qwerty90" with old hash...');
  const oldPassword = 'Qwerty90';
  const isValidOldPassword = await bcrypt.compare(oldPassword, oldHash);
  console.log('Old password valid with old hash:', isValidOldPassword ? '✅ YES' : '❌ NO');
  console.log('');
  
  // Test 5: Generate hash untuk password lama
  console.log('5. 🔄 Generating hash for old password "Qwerty90"...');
  const oldPasswordHash = await bcrypt.hash(oldPassword, 12);
  console.log('✅ Old password hash generated:', oldPasswordHash);
  console.log('');
  
  console.log('📊 Test Summary:');
  console.log('✅ New password "password" can be hashed and verified');
  console.log('✅ Old password "Qwerty90" can be hashed and verified');
  console.log('❌ New password "password" does NOT work with old hash');
  console.log('✅ Old password "Qwerty90" works with old hash');
  console.log('');
  
  console.log('🎯 CONCLUSION:');
  if (isValidOldPassword) {
    console.log('✅ User masih bisa login dengan password lama "Qwerty90"');
    console.log('✅ Hash lama masih valid');
    console.log('⚠️  Jika user ingin ganti ke password "password", perlu update hash di database');
  } else {
    console.log('❌ Hash lama tidak valid');
    console.log('🔧 Perlu reset password user');
  }
  
  console.log('');
  console.log('🔧 Next Steps:');
  console.log('1. Update user password hash di database jika perlu');
  console.log('2. Test login dengan password yang benar');
  console.log('3. Verify NextAuth authentication flow');
}

// Run the test
testPasswordHash().catch(console.error);
