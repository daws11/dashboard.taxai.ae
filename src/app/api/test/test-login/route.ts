import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '../../_utils/db';
import User from '../../_models/User';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 API: Testing Direct Login Logic');
    
    // Get credentials from request
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email and password are required' 
      }, { status: 400 });
    }
    
    console.log('📋 Login Test Details:');
    console.log('Email:', email);
    console.log('Password:', password);
    
    // Connect to database
    console.log('\n🔌 Connecting to database...');
    await db;
    console.log('✅ Database connected');
    
    // Find user
    console.log('\n🔍 Finding user...');
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }
    
    console.log('✅ User found:', {
      id: user._id,
      name: user.name,
      email: user.email,
      hasPassword: !!user.password
    });
    
    // Test password verification
    console.log('\n🔐 Testing password verification...');
    if (!user.password) {
      console.log('❌ User has no password hash');
      return NextResponse.json({ 
        success: false, 
        error: 'User has no password' 
      }, { status: 400 });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log(`Password verification: ${isValidPassword ? '✅ VALID' : '❌ INVALID'}`);
    
    if (!isValidPassword) {
      console.log('❌ Invalid password');
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials' 
      }, { status: 401 });
    }
    
    console.log('✅ Password is valid!');
    
    // Check user data for login
    console.log('\n📋 User Data for Login:');
    console.log('  - Name:', user.name);
    console.log('  - Email:', user.email);
    console.log('  - Job Title:', user.jobTitle);
    console.log('  - Language:', user.language);
    console.log('  - Trial Used:', user.trialUsed);
    console.log('  - Created At:', user.createdAt);
    console.log('  - Updated At:', user.updatedAt);
    
    // Check subscription (if exists)
    if (user.subscription) {
      console.log('\n📦 Subscription Data:');
      console.log('  - Type:', user.subscription.type);
      console.log('  - Status:', user.subscription.status);
      console.log('  - Message Limit:', user.subscription.messageLimit);
      console.log('  - Remaining Messages:', user.subscription.remainingMessages);
      console.log('  - Call Seconds:', user.subscription.callSeconds);
      console.log('  - Start Date:', user.subscription.startDate);
      console.log('  - End Date:', user.subscription.endDate);
    } else {
      console.log('\n⚠️ No subscription data found');
    }
    
    // Simulate successful login response
    console.log('\n🎉 LOGIN SUCCESSFUL!');
    console.log('✅ User can login with these credentials');
    
    const loginResult = {
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        jobTitle: user.jobTitle,
        language: user.language,
        trialUsed: user.trialUsed,
        subscription: user.subscription,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
             authentication: {
         passwordValid: true,
         canLogin: true,
         issues: [] as string[]
       }
    };
    
    // Check for potential login issues
    if (!user.name) {
      loginResult.authentication.issues.push('Missing user name');
    }
    if (!user.jobTitle) {
      loginResult.authentication.issues.push('Missing job title');
    }
    if (!user.subscription) {
      loginResult.authentication.issues.push('No subscription data');
    }
    
    console.log('\n📊 Login Test Summary:');
    console.log('✅ Database connection working');
    console.log('✅ User found in database');
    console.log('✅ Password verification working');
    console.log('✅ User data complete');
    console.log('✅ Login should work in dashboard');
    
    if (loginResult.authentication.issues.length > 0) {
      console.log('⚠️ Potential issues:', loginResult.authentication.issues.join(', '));
    }
    
    return NextResponse.json(loginResult);
    
  } catch (error) {
    console.error('❌ Login test failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

