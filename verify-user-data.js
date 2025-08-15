import db from './src/app/api/_utils/db.js';
import User from './src/app/api/_models/User.js';
import bcrypt from 'bcryptjs';

console.log('🔍 Verifying User Data Structure');
console.log('=================================');

// Expected user data from the document
const expectedData = {
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
    callSeconds: 0
  }
};

// Test password
const testPassword = 'Qwerty90';

async function verifyUserData() {
  try {
    // Connect to database
    console.log('🔌 Connecting to database...');
    await db;
    console.log('✅ Database connected');
    
    // Find user
    console.log('\n🔍 Finding user in database...');
    const user = await User.findOne({ email: expectedData.email });
    
    if (!user) {
      console.log('❌ User not found:', expectedData.email);
      return;
    }
    
    console.log('✅ User found:', {
      id: user._id,
      name: user.name,
      email: user.email
    });
    
    // Verify user data structure
    console.log('\n📋 Verifying User Data Structure:');
    
    // Basic fields
    const basicChecks = [
      { field: 'name', expected: expectedData.name, actual: user.name },
      { field: 'email', expected: expectedData.email, actual: user.email },
      { field: 'jobTitle', expected: expectedData.jobTitle, actual: user.jobTitle },
      { field: 'language', expected: expectedData.language, actual: user.language },
      { field: 'emailVerified', expected: expectedData.emailVerified, actual: user.emailVerified },
      { field: 'trialUsed', expected: expectedData.trialUsed, actual: user.trialUsed }
    ];
    
    let allBasicChecksPassed = true;
    basicChecks.forEach(check => {
      const passed = check.actual === check.expected;
      console.log(`${passed ? '✅' : '❌'} ${check.field}: ${check.actual} ${passed ? '' : `(expected: ${check.expected})`}`);
      if (!passed) allBasicChecksPassed = false;
    });
    
    // Subscription data
    console.log('\n📦 Verifying Subscription Data:');
    if (user.subscription) {
      const subscriptionChecks = [
        { field: 'type', expected: expectedData.subscription.type, actual: user.subscription.type },
        { field: 'status', expected: expectedData.subscription.status, actual: user.subscription.status },
        { field: 'messageLimit', expected: expectedData.subscription.messageLimit, actual: user.subscription.messageLimit },
        { field: 'remainingMessages', expected: expectedData.subscription.remainingMessages, actual: user.subscription.remainingMessages },
        { field: 'callSeconds', expected: expectedData.subscription.callSeconds, actual: user.subscription.callSeconds }
      ];
      
      let allSubscriptionChecksPassed = true;
      subscriptionChecks.forEach(check => {
        const passed = check.actual === check.expected;
        console.log(`${passed ? '✅' : '❌'} subscription.${check.field}: ${check.actual} ${passed ? '' : `(expected: ${check.expected})`}`);
        if (!passed) allSubscriptionChecksPassed = false;
      });
      
      // Check dates
      if (user.subscription.startDate && user.subscription.endDate) {
        console.log('✅ subscription.startDate:', user.subscription.startDate);
        console.log('✅ subscription.endDate:', user.subscription.endDate);
      } else {
        console.log('❌ Missing subscription dates');
        allSubscriptionChecksPassed = false;
      }
      
    } else {
      console.log('❌ No subscription data found');
      allSubscriptionChecksPassed = false;
    }
    
    // Password verification
    console.log('\n🔐 Verifying Password:');
    if (user.password) {
      console.log('✅ Password hash exists');
      
      // Test password
      const isValid = await bcrypt.compare(testPassword, user.password);
      console.log(`Password verification: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
      
      if (isValid) {
        console.log('✅ User can login with password:', testPassword);
      } else {
        console.log('❌ Password verification failed');
        console.log('🔧 This will cause login to fail');
      }
    } else {
      console.log('❌ No password hash found');
    }
    
    // Timestamps
    console.log('\n⏰ Verifying Timestamps:');
    if (user.createdAt) {
      console.log('✅ createdAt:', user.createdAt);
    } else {
      console.log('❌ Missing createdAt');
    }
    
    if (user.updatedAt) {
      console.log('✅ updatedAt:', user.updatedAt);
    } else {
      console.log('❌ Missing updatedAt');
    }
    
    // Summary
    console.log('\n📊 Verification Summary:');
    if (allBasicChecksPassed && allSubscriptionChecksPassed) {
      console.log('✅ All user data fields are correct');
      console.log('✅ User structure matches expected document');
    } else {
      console.log('❌ Some user data fields are incorrect');
      console.log('🔧 Please run update-test-user.js to fix issues');
    }
    
    if (user.password) {
      const passwordValid = await bcrypt.compare(testPassword, user.password);
      if (passwordValid) {
        console.log('✅ Password is correct and verified');
        console.log('✅ User should be able to login successfully');
      } else {
        console.log('❌ Password verification failed');
        console.log('🔧 This will prevent successful login');
      }
    } else {
      console.log('❌ No password hash found');
      console.log('🔧 User cannot authenticate');
    }
    
    console.log('\n🎯 Next Steps:');
    if (allBasicChecksPassed && allSubscriptionChecksPassed && user.password) {
      console.log('1. ✅ User data is correct');
      console.log('2. ✅ Password is verified');
      console.log('3. 🧪 Test login in dashboard');
      console.log('4. 🧪 Test with email:', expectedData.email);
      console.log('5. 🧪 Test with password:', testPassword);
    } else {
      console.log('1. ❌ User data needs to be updated');
      console.log('2. 🔧 Run: node update-test-user.js');
      console.log('3. 🔍 Run: node verify-user-data.js (again)');
      console.log('4. 🧪 Then test login in dashboard');
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    console.error('Error details:', error);
  }
}

// Run the verification
verifyUserData();

