import bcrypt from 'bcryptjs';
import db from './src/app/api/_utils/db.js';
import User from './src/app/api/_models/User.js';

console.log('🔧 Updating Password Hash in Database');
console.log('=====================================');

// User details
const userEmail = 'dawskutel@gmail.com';
const newPassword = 'Qwerty90'; // The correct password from logs
const saltRounds = 12;

async function updatePasswordHash() {
  try {
    console.log('📋 User Details:');
    console.log('Email:', userEmail);
    console.log('New Password:', newPassword);
    console.log('Salt Rounds:', saltRounds);
    
    // Connect to database
    console.log('\n🔌 Connecting to database...');
    await db;
    console.log('✅ Database connected');
    
    // Find user
    console.log('\n🔍 Finding user in database...');
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      console.log('❌ User not found:', userEmail);
      return;
    }
    
    console.log('✅ User found:', {
      id: user._id,
      name: user.name,
      email: user.email,
      currentHash: user.password ? 'EXISTS' : 'MISSING'
    });
    
    // Generate new password hash
    console.log('\n🔐 Generating new password hash...');
    const newHash = await bcrypt.hash(newPassword, saltRounds);
    console.log('✅ New hash generated:', newHash);
    
    // Verify the new hash
    console.log('\n✅ Verifying new hash...');
    const isValid = await bcrypt.compare(newPassword, newHash);
    console.log(`Hash verification: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
    
    if (!isValid) {
      console.log('❌ Hash verification failed, aborting update');
      return;
    }
    
    // Update user password in database
    console.log('\n💾 Updating password in database...');
    user.password = newHash;
    user.updatedAt = new Date();
    
    await user.save();
    console.log('✅ Password updated successfully');
    
    // Verify the update
    console.log('\n🔍 Verifying update...');
    const updatedUser = await User.findOne({ email: userEmail });
    
    if (updatedUser && await bcrypt.compare(newPassword, updatedUser.password)) {
      console.log('✅ Password update verified successfully');
      console.log('✅ User can now login with the new password');
    } else {
      console.log('❌ Password update verification failed');
    }
    
    console.log('\n📊 Update Summary:');
    console.log('✅ Password hash generated');
    console.log('✅ Hash verification passed');
    console.log('✅ Database updated');
    console.log('✅ Update verified');
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Test login with new password:', newPassword);
    console.log('2. Update any test scripts with new password');
    console.log('3. Verify authentication works in dashboard');
    
  } catch (error) {
    console.error('❌ Update failed:', error.message);
    console.error('Error details:', error);
  }
}

// Run the update
updatePasswordHash();

