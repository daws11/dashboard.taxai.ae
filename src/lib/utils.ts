import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import bcrypt from 'bcryptjs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function untuk membuat API call ke backend dengan error handling
export async function backendApiCall(endpoint: string, options: RequestInit = {}) {
  const backendUrl = process.env.BACKEND_API_URL || 'https://tax-ai-backend-dm7p.onrender.com';
  const url = `${backendUrl}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend API error: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Backend API call failed:', error);
    throw error;
  }
}

// Utility function untuk mendapatkan user data dari backend
export async function getBackendUserData(email: string, token?: string) {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return backendApiCall(`/api/users/${email}`, {
    method: 'GET',
    headers,
  });
}

// Utility function untuk update user data di backend
export async function updateBackendUserData(email: string, data: Record<string, unknown>, token?: string) {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return backendApiCall(`/api/users/${email}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data),
  });
}

// Utility function untuk debug password hashing
export async function debugPasswordHash(password: string, storedHash: string) {
  console.log('🔍 Password Debug Info:');
  console.log('Input password:', password);
  console.log('Input password length:', password.length);
  console.log('Stored hash:', storedHash);
  console.log('Stored hash length:', storedHash.length);
  
  // Test bcrypt comparison
  try {
    const isValid = await bcrypt.compare(password, storedHash);
    console.log('Bcrypt comparison result:', isValid);
    return isValid;
  } catch (error) {
    console.error('Bcrypt comparison error:', error);
    return false;
  }
}

// Utility function untuk membuat hash password baru (untuk testing)
export async function createPasswordHash(password: string) {
  try {
    const hash = await bcrypt.hash(password, 10);
    console.log('New password hash created:', hash);
    return hash;
  } catch (error) {
    console.error('Error creating password hash:', error);
    return null;
  }
}
