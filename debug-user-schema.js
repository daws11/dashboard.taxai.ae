import db from './src/app/api/_utils/db.js';
import User from './src/app/api/_models/User.js';

console.log('🔍 Debugging User Schema and Database');
console.log('=====================================');

async function debugUserSchema() {
  try {
    // Connect to database
    console.log('🔌 Connecting to database...');
    await db;
    console.log('✅ Database connected');
    
    // Test user email
    const testEmail = 'dawskutel@gmail.com';
    
    // Find user with raw query to see actual data
    console.log('\n🔍 Finding user with raw query...');
    const rawUser = await User.findOne({ email: testEmail }).lean();
    
    if (!rawUser) {
      console.log('❌ User not found:', testEmail);
      return;
    }
    
    console.log('✅ Raw user data found');
    console.log('\n📋 User Data Analysis:');
    console.log('ID:', rawUser._id);
    console.log('Name:', rawUser.name);
    console.log('Email:', rawUser.email);
    console.log('Password Hash:', rawUser.password ? 'EXISTS (' + rawUser.password.length + ' chars)' : 'MISSING');
    console.log('Email Verified:', rawUser.emailVerified, `(Type: ${typeof rawUser.emailVerified})`);
    console.log('Job Title:', rawUser.jobTitle);
    console.log('Language:', rawUser.language);
    console.log('Trial Used:', rawUser.trialUsed);
    console.log('Created At:', rawUser.createdAt);
    console.log('Updated At:', rawUser.updatedAt);
    
    // Check subscription data
    if (rawUser.subscription) {
      console.log('\n📦 Subscription Data:');
      console.log('Type:', rawUser.subscription.type);
      console.log('Status:', rawUser.subscription.status);
      console.log('Message Limit:', rawUser.subscription.messageLimit);
      console.log('Remaining Messages:', rawUser.subscription.remainingMessages);
      console.log('Call Seconds:', rawUser.subscription.callSeconds);
      console.log('Start Date:', rawUser.subscription.startDate);
      console.log('End Date:', rawUser.subscription.endDate);
    } else {
      console.log('\n❌ No subscription data found');
    }
    
    // Check for any additional fields
    console.log('\n🔍 Additional Fields:');
    const knownFields = ['_id', 'name', 'email', 'password', 'emailVerified', 'jobTitle', 'language', 'trialUsed', 'createdAt', 'updatedAt', 'subscription', '__v'];
    const allFields = Object.keys(rawUser);
    const unknownFields = allFields.filter(field => !knownFields.includes(field));
    
    if (unknownFields.length > 0) {
      console.log('⚠️ Unknown fields found:', unknownFields);
      unknownFields.forEach(field => {
        console.log(`  ${field}:`, rawUser[field]);
      });
    } else {
      console.log('✅ No unknown fields found');
    }
    
    // Test User model methods
    console.log('\n🧪 Testing User Model Methods...');
    try {
      const userInstance = await User.findOne({ email: testEmail });
      if (userInstance) {
        console.log('✅ User model instance created');
        
        // Test if methods exist
        if (typeof userInstance.comparePassword === 'function') {
          console.log('✅ comparePassword method exists');
        } else {
          console.log('❌ comparePassword method missing');
        }
        
        if (typeof userInstance.isSubscriptionActive === 'function') {
          console.log('✅ isSubscriptionActive method exists');
        } else {
          console.log('❌ isSubscriptionActive method missing');
        }
        
        // Test password comparison
        console.log('\n🔐 Testing password comparison...');
        const testPassword = 'Qwerty90';
        const isValid = await userInstance.comparePassword(testPassword);
        console.log(`Password comparison result: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
        
      } else {
        console.log('❌ Could not create user model instance');
      }
    } catch (methodError) {
      console.log('❌ Error testing user model methods:', methodError.message);
    }
    
    // Check database connection status
    console.log('\n🔌 Database Connection Status:');
    const dbStatus = db.connection.readyState;
    const statusMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    console.log('Status:', statusMap[dbStatus] || 'unknown');
    console.log('Database:', db.connection.name);
    console.log('Host:', db.connection.host);
    console.log('Port:', db.connection.port);
    
    console.log('\n📊 Debug Summary:');
    console.log('✅ Database connection working');
    console.log('✅ User data found');
    console.log('✅ Schema analysis complete');
    
    console.log('\n🎯 Recommendations:');
    if (rawUser.emailVerified === undefined) {
      console.log('⚠️ emailVerified field is undefined - consider setting default value');
    }
    if (!rawUser.password) {
      console.log('❌ Password hash missing - user cannot authenticate');
    }
    if (!rawUser.subscription) {
      console.log('⚠️ Subscription data missing - may affect access control');
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    console.error('Error details:', error);
  }
}

// Run the debug
debugUserSchema();
