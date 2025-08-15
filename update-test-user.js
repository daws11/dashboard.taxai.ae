import bcrypt from 'bcryptjs';
import db from './src/app/api/_utils/db.js';
import User from './src/app/api/_models/User.js';

console.log('🔧 Updating Test User to Match Document Structure');
console.log('=================================================');

// User details from the document
const userData = {
  email: 'dawskutel@gmail.com',
  name: 'Test user',
  jobTitle: 'test',
  language: null,
  emailVerified: true,
  trialUsed: false,
  subscription: {
    type: 'trial',
    status: 'pending',
    messageLimit: 0,
    remainingMessages: 0,
    callSeconds: 0,
    startDate: new Date('2025-08-13T04:24:08.962Z'),
    endDate: new Date('2025-08-27T04:24:08.962Z'),
    payment: null
  }
};

// Generate new password hash for 'Qwerty90'
const newPassword = 'Qwerty90';
const saltRounds = 12;

async function updateTestUser() {
  try {
    console.log('📋 User Update Details:');
    console.log('Email:', userData.email);
    console.log('Name:', userData.name);
    console.log('New Password:', newPassword);
    console.log('Email Verified:', userData.emailVerified);
    console.log('Subscription Status:', userData.subscription.status);
    
    // Connect to database
    console.log('\n🔌 Connecting to database...');
    await db;
    console.log('✅ Database connected');
    
    // Find existing user
    console.log('\n🔍 Finding existing user...');
    let user = await User.findOne({ email: userData.email });
    
    if (!user) {
      console.log('❌ User not found, creating new user...');
      user = new User();
    } else {
      console.log('✅ Existing user found:', {
        id: user._id,
        name: user.name,
        email: user.email
      });
    }
    
    // Generate new password hash
    console.log('\n🔐 Generating new password hash...');
    const newHash = await bcrypt.hash(newPassword, saltRounds);
    console.log('✅ New hash generated');
    
    // Verify the new hash
    console.log('\n✅ Verifying new hash...');
    const isValid = await bcrypt.compare(newPassword, newHash);
    console.log(`Hash verification: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
    
    if (!isValid) {
      console.log('❌ Hash verification failed, aborting update');
      return;
    }
    
    // Update user data
    console.log('\n💾 Updating user data...');
    user.name = userData.name;
    user.email = userData.email;
    user.password = newHash;
    user.jobTitle = userData.jobTitle;
    user.language = userData.language;
    user.emailVerified = userData.emailVerified;
    user.trialUsed = userData.trialUsed;
    user.subscription = userData.subscription;
    user.updatedAt = new Date();
    
    // Set createdAt if it's a new user
    if (!user.createdAt) {
      user.createdAt = new Date();
    }
    
    // Save user
    await user.save();
    console.log('✅ User updated successfully');
    
    // Verify the update
    console.log('\n🔍 Verifying update...');
    const updatedUser = await User.findOne({ email: userData.email });
    
    if (updatedUser) {
      console.log('✅ User data verified:');
      console.log('  - Name:', updatedUser.name);
      console.log('  - Email:', updatedUser.email);
      console.log('  - Email Verified:', updatedUser.emailVerified);
      console.log('  - Job Title:', updatedUser.jobTitle);
      console.log('  - Trial Used:', updatedUser.trialUsed);
      console.log('  - Subscription Type:', updatedUser.subscription?.type);
      console.log('  - Subscription Status:', updatedUser.subscription?.status);
      
      // Test password
      const passwordValid = await bcrypt.compare(newPassword, updatedUser.password);
      console.log('  - Password Valid:', passwordValid ? '✅ YES' : '❌ NO');
      
      if (passwordValid) {
        console.log('✅ Password update verified successfully');
        console.log('✅ User can now login with password:', newPassword);
      } else {
        console.log('❌ Password update verification failed');
      }
    } else {
      console.log('❌ Could not verify updated user');
    }
    
    console.log('\n📊 Update Summary:');
    console.log('✅ User data updated');
    console.log('✅ Password hash generated and verified');
    console.log('✅ Email verification set to true');
    console.log('✅ Subscription data updated');
    console.log('✅ Database saved and verified');
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Test login with email:', userData.email);
    console.log('2. Test login with password:', newPassword);
    console.log('3. Verify all user data is correct');
    console.log('4. Test dashboard authentication');
    
  } catch (error) {
    console.error('❌ Update failed:', error.message);
    console.error('Error details:', error);
  }
}

// Run the update
updateTestUser();

