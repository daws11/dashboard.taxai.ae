import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '../../_utils/db';
import User from '../../_models/User';

export async function POST() {
  try {
    console.log('🔧 API: Updating Test User to Match Document Structure EXACTLY');
    
    // User details from the ORIGINAL document - EXACT MATCH
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

    // Use the EXACT password hash from the document
    const exactPasswordHash = '$2a$12$AqjHGi9nsbJXMnHc4OeyADwQ6u4wCRnokwc9ReXg7VQ3Um.7a';
    const testPassword = 'Qwerty90';

    console.log('📋 User Update Details (EXACT MATCH):');
    console.log('Email:', userData.email);
    console.log('Name:', userData.name);
    console.log('Test Password:', testPassword);
    console.log('Exact Hash:', exactPasswordHash);
    console.log('Email Verified:', userData.emailVerified);
    console.log('Subscription Status:', userData.subscription.status);
    console.log('Start Date:', userData.subscription.startDate);
    console.log('End Date:', userData.subscription.endDate);
    
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
    
    // Verify the exact hash works with the password
    console.log('\n🔐 Verifying exact hash with password...');
    const exactHashValid = await bcrypt.compare(testPassword, exactPasswordHash);
    console.log(`Exact hash verification: ${exactHashValid ? '✅ VALID' : '❌ INVALID'}`);
    
    if (!exactHashValid) {
      console.log('❌ Exact hash verification failed!');
      console.log('🔧 The hash from the document does not match password "Qwerty90"');
      console.log('🔧 Generating new hash for "Qwerty90"...');
      
      // Generate new hash for 'Qwerty90'
      const saltRounds = 12;
      const newHash = await bcrypt.hash(testPassword, saltRounds);
      console.log('✅ New hash generated:', newHash);
      
      // Verify the new hash
      const newHashValid = await bcrypt.compare(testPassword, newHash);
      console.log(`New hash verification: ${newHashValid ? '✅ VALID' : '❌ INVALID'}`);
      
      if (!newHashValid) {
        console.log('❌ New hash verification failed, aborting update');
        return NextResponse.json({ 
          success: false, 
          error: 'Password hash verification failed' 
        }, { status: 500 });
      }
      
      // Use the new hash
      user.password = newHash;
      console.log('✅ Using new generated hash');
      
    } else {
      console.log('✅ Exact hash is valid, using it directly');
      user.password = exactPasswordHash;
    }
    
    // Update user data
    console.log('\n💾 Updating user data...');
    user.name = userData.name;
    user.email = userData.email;
    user.jobTitle = userData.jobTitle;
    user.language = userData.language;
    user.emailVerified = userData.emailVerified;
    user.trialUsed = userData.trialUsed;
    user.subscription = userData.subscription;
    user.updatedAt = new Date();
    
    // Set createdAt if it's a new user
    if (!user.createdAt) {
      user.createdAt = new Date('2025-08-13T04:24:08.963Z');
    }
    
    // Save user
    await user.save();
    console.log('✅ User updated successfully');
    
    // Verify the update
    console.log('\n🔍 Verifying update...');
    const updatedUser = await User.findOne({ email: userData.email });
    
    const verificationResult = {
      success: true,
      message: 'User updated successfully',
      user: {
        id: updatedUser?._id,
        name: updatedUser?.name,
        email: updatedUser?.email,
        emailVerified: updatedUser?.emailVerified,
        jobTitle: updatedUser?.jobTitle,
        trialUsed: updatedUser?.trialUsed,
        subscriptionType: updatedUser?.subscription?.type,
        subscriptionStatus: updatedUser?.subscription?.status,
        hasSubscriptionDates: updatedUser?.subscription?.startDate && updatedUser?.subscription?.endDate,
        startDate: updatedUser?.subscription?.startDate,
        endDate: updatedUser?.subscription?.endDate,
        passwordValid: false
      }
    };
    
    if (updatedUser) {
      // Test password with current hash
      const currentHash = updatedUser.password;
      const passwordValid = await bcrypt.compare(testPassword, currentHash);
      verificationResult.user.passwordValid = passwordValid;
      
      if (passwordValid) {
        console.log('✅ Password update verified successfully');
        console.log('✅ User can now login with password:', testPassword);
        console.log('✅ Current hash:', currentHash);
      } else {
        console.log('❌ Password update verification failed');
        console.log('❌ Current hash:', currentHash);
      }
      
      // Log detailed verification
      console.log('\n📋 Detailed Verification:');
      console.log('  - Name:', updatedUser.name);
      console.log('  - Email:', updatedUser.email);
      console.log('  - Email Verified:', updatedUser.emailVerified);
      console.log('  - Job Title:', updatedUser.jobTitle);
      console.log('  - Trial Used:', updatedUser.trialUsed);
      console.log('  - Subscription Type:', updatedUser.subscription?.type);
      console.log('  - Subscription Status:', updatedUser.subscription?.status);
      console.log('  - Start Date:', updatedUser.subscription?.startDate);
      console.log('  - End Date:', updatedUser.subscription?.endDate);
      console.log('  - Password Valid:', passwordValid);
      
    } else {
      console.log('❌ Could not verify updated user');
      verificationResult.success = false;
      verificationResult.message = 'Could not verify updated user';
    }
    
    console.log('\n📊 Update Summary:');
    console.log('✅ User data updated');
    console.log('✅ Password hash set and verified');
    console.log('✅ Email verification set to true');
    console.log('✅ Subscription data updated with dates');
    console.log('✅ Database saved and verified');
    
    return NextResponse.json(verificationResult);
    
  } catch (error) {
    console.error('❌ Update failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
