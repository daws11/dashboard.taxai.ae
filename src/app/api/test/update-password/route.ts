import { NextResponse } from 'next/server';
import db from '@/app/api/_utils/db';
import User from '@/app/api/_models/User';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    console.log('🔐 Update Password API called');
    
    // Connect to database
    await db;
    console.log('✅ Database connected');
    
    // Find test user
    const testEmail = 'dawskutel@gmail.com';
    const user = await User.findOne({ email: testEmail });
    
    if (!user) {
      console.log('❌ Test user not found:', testEmail);
      return NextResponse.json(
        { error: 'Test user not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Test user found:', {
      id: user._id,
      name: user.name,
      email: user.email,
      currentPasswordHash: user.password ? user.password.substring(0, 20) + '...' : 'none'
    });
    
    // Generate new password hash for 'password'
    const newPassword = 'password';
    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    
    console.log('🔄 Updating password hash...');
    console.log('New hash:', newPasswordHash.substring(0, 20) + '...');
    
    // Update user password
    user.password = newPasswordHash;
    await user.save();
    
    console.log('✅ Password updated successfully');
    
    // Verify the update
    const updatedUser = await User.findOne({ email: testEmail });
    const isPasswordValid = await bcrypt.compare(newPassword, updatedUser!.password);
    
    console.log('🔍 Verification result:', {
      passwordValid: isPasswordValid,
      hashLength: updatedUser!.password.length
    });
    
    return NextResponse.json({
      message: 'Password updated successfully',
      user: {
        id: updatedUser!._id,
        name: updatedUser!.name,
        email: updatedUser!.email
      },
      password: {
        newHash: newPasswordHash.substring(0, 20) + '...',
        valid: isPasswordValid,
        length: newPasswordHash.length
      }
    });
    
  } catch (error) {
    console.error('❌ Update password error:', error);
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    );
  }
}
