import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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
