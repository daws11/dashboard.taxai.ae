import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '../../_utils/db';
import User from '../../_models/User';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API: Verifying User Data Structure');
    
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

    // Connect to database
    console.log('🔌 Connecting to database...');
    await db;
    console.log('✅ Database connected');
    
    // Find user
    console.log('\n🔍 Finding user in database...');
    const user = await User.findOne({ email: expectedData.email });
    
    if (!user) {
      console.log('❌ User not found:', expectedData.email);
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
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
    const basicCheckResults = [];
    
    basicChecks.forEach(check => {
      const passed = check.actual === check.expected;
      basicCheckResults.push({
        field: check.field,
        expected: check.expected,
        actual: check.actual,
        passed
      });
      
      if (!passed) allBasicChecksPassed = false;
    });
    
    // Subscription data
    console.log('\n📦 Verifying Subscription Data:');
    let allSubscriptionChecksPassed = true;
    const subscriptionCheckResults = [];
    
    if (user.subscription) {
      const subscriptionChecks = [
        { field: 'type', expected: expectedData.subscription.type, actual: user.subscription.type },
        { field: 'status', expected: expectedData.subscription.status, actual: user.subscription.status },
        { field: 'messageLimit', expected: expectedData.subscription.messageLimit, actual: user.subscription.messageLimit },
        { field: 'remainingMessages', expected: expectedData.subscription.remainingMessages, actual: user.subscription.remainingMessages },
        { field: 'callSeconds', expected: expectedData.subscription.callSeconds, actual: user.subscription.callSeconds }
      ];
      
      subscriptionChecks.forEach(check => {
        const passed = check.actual === check.expected;
        subscriptionCheckResults.push({
          field: check.field,
          expected: check.expected,
          actual: check.actual,
          passed
        });
        
        if (!passed) allSubscriptionChecksPassed = false;
      });
      
      // Check dates
      const hasDates = user.subscription.startDate && user.subscription.endDate;
      if (!hasDates) {
        allSubscriptionChecksPassed = false;
      }
      
    } else {
      allSubscriptionChecksPassed = false;
    }
    
    // Password verification
    console.log('\n🔐 Verifying Password:');
    let passwordValid = false;
    
    if (user.password) {
      console.log('✅ Password hash exists');
      
      // Test password
      passwordValid = await bcrypt.compare(testPassword, user.password);
      console.log(`Password verification: ${passwordValid ? '✅ VALID' : '❌ INVALID'}`);
      
      if (passwordValid) {
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
    const hasCreatedAt = !!user.createdAt;
    const hasUpdatedAt = !!user.updatedAt;
    
    // Summary
    console.log('\n📊 Verification Summary:');
    const allChecksPassed = allBasicChecksPassed && allSubscriptionChecksPassed;
    
    if (allChecksPassed) {
      console.log('✅ All user data fields are correct');
      console.log('✅ User structure matches expected document');
    } else {
      console.log('❌ Some user data fields are incorrect');
      console.log('🔧 Please run update user API to fix issues');
    }
    
    if (passwordValid) {
      console.log('✅ Password is correct and verified');
      console.log('✅ User should be able to login successfully');
    } else {
      console.log('❌ Password verification failed');
      console.log('🔧 This will prevent successful login');
    }
    
    // Return verification results
    const verificationResult = {
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        jobTitle: user.jobTitle,
        trialUsed: user.trialUsed,
        subscriptionType: user.subscription?.type,
        subscriptionStatus: user.subscription?.status,
        hasSubscriptionDates: user.subscription?.startDate && user.subscription?.endDate,
        hasPassword: !!user.password,
        passwordValid,
        hasCreatedAt,
        hasUpdatedAt
      },
      verification: {
        basicChecks: {
          passed: allBasicChecksPassed,
          results: basicCheckResults
        },
        subscriptionChecks: {
          passed: allSubscriptionChecksPassed,
          results: subscriptionCheckResults
        },
        passwordCheck: {
          passed: passwordValid
        },
        timestampChecks: {
          passed: hasCreatedAt && hasUpdatedAt,
          hasCreatedAt,
          hasUpdatedAt
        },
        overall: {
          passed: allChecksPassed && passwordValid
        }
      },
      recommendations: []
    };
    
    // Add recommendations
    if (!allBasicChecksPassed) {
      verificationResult.recommendations.push('Run update user API to fix basic field issues');
    }
    if (!allSubscriptionChecksPassed) {
      verificationResult.recommendations.push('Run update user API to fix subscription data');
    }
    if (!passwordValid) {
      verificationResult.recommendations.push('Password verification failed - user cannot login');
    }
    if (!hasCreatedAt || !hasUpdatedAt) {
      verificationResult.recommendations.push('Missing timestamp data');
    }
    
    return NextResponse.json(verificationResult);
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

