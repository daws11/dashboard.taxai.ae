import { NextResponse } from 'next/server';
import db from '../../_utils/db';
import User from '../../_models/User';

export async function GET() {
  try {
    console.log('🔍 API: Debugging User Field Issues');
    
    // Connect to database
    console.log('🔌 Connecting to database...');
    await db;
    console.log('✅ Database connected');
    
    // Find user
    const email = 'dawskutel@gmail.com';
    console.log('\n🔍 Finding user:', email);
    
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
      email: user.email
    });
    
    // Debug field values
    console.log('\n📋 Field Values Analysis:');
    console.log('  - name:', user.name, `(Type: ${typeof user.name})`);
    console.log('  - email:', user.email, `(Type: ${typeof user.email})`);
    console.log('  - jobTitle:', user.jobTitle, `(Type: ${typeof user.jobTitle})`);
    console.log('  - language:', user.language, `(Type: ${typeof user.language})`);
    console.log('  - emailVerified:', user.emailVerified, `(Type: ${typeof user.emailVerified})`);
    console.log('  - trialUsed:', user.trialUsed, `(Type: ${typeof user.trialUsed})`);
    console.log('  - password:', user.password ? 'EXISTS' : 'MISSING', `(Type: ${typeof user.password})`);
    console.log('  - createdAt:', user.createdAt, `(Type: ${typeof user.createdAt})`);
    console.log('  - updatedAt:', user.updatedAt, `(Type: ${typeof user.updatedAt})`);
    
    // Debug subscription
    if (user.subscription) {
      console.log('\n📦 Subscription Analysis:');
      console.log('  - type:', user.subscription.type, `(Type: ${typeof user.subscription.type})`);
      console.log('  - status:', user.subscription.status, `(Type: ${typeof user.subscription.status})`);
      console.log('  - startDate:', user.subscription.startDate, `(Type: ${typeof user.subscription.startDate})`);
      console.log('  - endDate:', user.subscription.endDate, `(Type: ${typeof user.subscription.endDate})`);
    } else {
      console.log('\n❌ No subscription data');
    }
    
    // Check User model schema
    console.log('\n🔍 User Model Schema Analysis:');
    const userSchema = User.schema.obj;
    console.log('  - Schema fields:', Object.keys(userSchema));
    
    // Check if emailVerified field exists in schema
    if (userSchema.emailVerified) {
      console.log('  - emailVerified schema:', userSchema.emailVerified);
    } else {
      console.log('  - ❌ emailVerified field NOT in schema!');
    }
    
    // Try to update emailVerified directly
    console.log('\n🔧 Attempting to fix emailVerified field...');
    
    try {
      // Method 1: Direct field update
      user.emailVerified = true;
      await user.save();
      console.log('✅ Method 1: Direct field update successful');
      
      // Verify the update
      const updatedUser = await User.findOne({ email });
      console.log('  - emailVerified after update:', updatedUser?.emailVerified);
      
    } catch (updateError) {
      console.log('❌ Method 1 failed:', updateError instanceof Error ? updateError.message : 'Unknown error');
      
      try {
        // Method 2: UpdateOne with $set
        console.log('\n🔄 Trying Method 2: UpdateOne with $set...');
        const result = await User.updateOne(
          { email },
          { $set: { emailVerified: true, updatedAt: new Date() } }
        );
        
        if (result.modifiedCount > 0) {
          console.log('✅ Method 2: UpdateOne successful');
          
          // Verify the update
          const reUpdatedUser = await User.findOne({ email });
          console.log('  - emailVerified after UpdateOne:', reUpdatedUser?.emailVerified);
        } else {
          console.log('❌ Method 2: No documents modified');
        }
        
             } catch (updateOneError) {
         console.log('❌ Method 2 failed:', updateOneError instanceof Error ? updateOneError.message : 'Unknown error');
      }
    }
    
    // Final verification
    console.log('\n🔍 Final Verification:');
    const finalUser = await User.findOne({ email });
    
    const debugResult = {
      success: true,
      user: {
        id: finalUser?._id,
        name: finalUser?.name,
        email: finalUser?.email,
        emailVerified: finalUser?.emailVerified,
        jobTitle: finalUser?.jobTitle,
        trialUsed: finalUser?.trialUsed,
        subscriptionType: finalUser?.subscription?.type,
        subscriptionStatus: finalUser?.subscription?.status,
        hasSubscriptionDates: finalUser?.subscription?.startDate && finalUser?.subscription?.endDate,
        password: finalUser?.password ? 'EXISTS' : 'MISSING'
      },
      schema: {
        hasEmailVerifiedField: !!User.schema.obj.emailVerified,
        emailVerifiedSchema: User.schema.obj.emailVerified,
        allSchemaFields: Object.keys(User.schema.obj)
      },
             issues: [] as string[]
    };
    
    // Identify issues
    if (finalUser?.emailVerified !== true) {
      debugResult.issues.push('emailVerified field not properly set');
    }
    if (!finalUser?.subscription?.startDate || !finalUser?.subscription?.endDate) {
      debugResult.issues.push('subscription dates missing');
    }
    if (!User.schema.obj.emailVerified) {
      debugResult.issues.push('emailVerified field missing from schema');
    }
    
    console.log('\n📊 Debug Summary:');
    console.log('  - emailVerified field in schema:', !!User.schema.obj.emailVerified);
    console.log('  - emailVerified value:', finalUser?.emailVerified);
    console.log('  - Issues found:', debugResult.issues.length);
    
    return NextResponse.json(debugResult);
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

