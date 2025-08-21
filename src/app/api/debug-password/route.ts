import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { password, storedHash } = await req.json();
    
    if (!password || !storedHash) {
      return NextResponse.json({ error: 'Password and storedHash are required' }, { status: 400 });
    }
    
    console.log('🔍 Debug Password Request:');
    console.log('Password:', password);
    console.log('Password length:', password.length);
    console.log('Stored hash:', storedHash);
    console.log('Stored hash length:', storedHash.length);
    
    // Test bcrypt comparison
    const isValid = await bcrypt.compare(password, storedHash);
    console.log('Bcrypt comparison result:', isValid);
    
    // Create new hash for comparison
    const newHash = await bcrypt.hash(password, 10);
    
    return NextResponse.json({
      inputPassword: password,
      inputPasswordLength: password.length,
      storedHash: storedHash,
      storedHashLength: storedHash.length,
      isValid: isValid,
      newHash: newHash,
      newHashLength: newHash.length
    });
    
  } catch (error) {
    console.error('Debug password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

