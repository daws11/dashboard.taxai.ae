// Script untuk update password user test
// Jalankan dengan: node update-password.js

const BASE_URL = 'http://localhost:3000';

async function updateTestUserPassword() {
  console.log('🔐 Updating Test User Password');
  console.log('================================');
  console.log('Base URL:', BASE_URL);
  console.log('');
  
  try {
    console.log('📋 Updating password for: dawskutel@gmail.com');
    console.log('New password: password');
    console.log('');
    
    // Call update password API
    console.log('🔄 Calling update password API...');
    const response = await fetch(`${BASE_URL}/api/test/update-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Password updated successfully!');
      console.log('');
      console.log('📊 Update Result:');
      console.log('User ID:', result.user.id);
      console.log('User Name:', result.user.name);
      console.log('User Email:', result.user.email);
      console.log('');
      console.log('🔐 Password Details:');
      console.log('New Hash:', result.password.newHash);
      console.log('Hash Length:', result.password.length);
      console.log('Password Valid:', result.password.valid ? '✅ YES' : '❌ NO');
      console.log('');
      
      console.log('🎯 CONCLUSION:');
      console.log('✅ Password hash berhasil diupdate di database');
      console.log('✅ User sekarang bisa login dengan password "password"');
      console.log('');
      
      console.log('🔧 Next Steps:');
      console.log('1. Test login di dashboard dengan password "password"');
      console.log('2. Verify NextAuth authentication flow');
      console.log('3. Check if 401 error resolved');
      
    } else {
      console.log('❌ Failed to update password:', response.status);
      const errorData = await response.text();
      console.log('Error:', errorData);
      
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Check if Next.js server is running');
      console.log('2. Verify API endpoint exists at /api/test/update-password');
      console.log('3. Check database connection');
      console.log('4. Verify user exists in database');
    }
    
  } catch (error) {
    console.error('❌ Update failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure Next.js server is running (npm run dev)');
    console.log('2. Check if API endpoints exist at /api/test/*');
    console.log('3. Verify database connection in Next.js');
    console.log('4. Check console logs for detailed errors');
  }
}

// Run the update
updateTestUserPassword();
