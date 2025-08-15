// Test script untuk Next.js API endpoints
// Jalankan dengan: node test-nextjs-api.js

const BASE_URL = 'http://localhost:3000';

async function testAPIEndpoints() {
  console.log('🧪 Testing Next.js API Endpoints');
  console.log('=================================');
  console.log('Base URL:', BASE_URL);
  console.log('');

  try {
    // Test 1: Verify User Data
    console.log('1. 🔍 Testing User Data Verification...');
    const verifyResponse = await fetch(`${BASE_URL}/api/test/verify-user`);
    
    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      console.log('✅ Verification API working');
      console.log('User:', verifyData.user.email);
      console.log('Overall Status:', verifyData.verification.overall.passed ? '✅ PASSED' : '❌ FAILED');
      
      // Show detailed results
      console.log('\n📋 Basic Field Checks:');
      verifyData.verification.basicChecks.results.forEach(check => {
        console.log(`  ${check.passed ? '✅' : '❌'} ${check.field}: ${check.actual} (expected: ${check.expected})`);
      });
      
      console.log('\n📦 Subscription Checks:');
      verifyData.verification.subscriptionChecks.results.forEach(check => {
        console.log(`  ${check.passed ? '✅' : '❌'} subscription.${check.field}: ${check.actual} (expected: ${check.expected})`);
      });
      
      console.log('\n🔐 Password Check:');
      console.log(`  ${verifyData.verification.passwordCheck.passed ? '✅' : '❌'} Password valid: ${verifyData.user.passwordValid}`);
      
      console.log('\n⏰ Timestamp Checks:');
      console.log(`  ${verifyData.verification.timestampChecks.passed ? '✅' : '❌'} Created: ${verifyData.user.hasCreatedAt}, Updated: ${verifyData.user.hasUpdatedAt}`);
      
      // Show recommendations
      if (verifyData.recommendations.length > 0) {
        console.log('\n🔧 Recommendations:');
        verifyData.recommendations.forEach(rec => console.log(`  - ${rec}`));
      }
      
      // If verification failed, run debug first
      if (!verifyData.verification.overall.passed) {
        console.log('\n🔍 User data has issues. Running debug API first...');
        
        // Test Debug API
        console.log('\n1.5. 🔍 Testing Debug API...');
        const debugResponse = await fetch(`${BASE_URL}/api/test/debug-user`);
        
        if (debugResponse.ok) {
          const debugData = await debugResponse.json();
          console.log('✅ Debug API working');
          console.log('Schema Analysis:');
          console.log('  - Has emailVerified field:', debugData.schema.hasEmailVerifiedField);
          console.log('  - All schema fields:', debugData.schema.allSchemaFields.join(', '));
          console.log('Issues found:', debugData.issues.length);
          debugData.issues.forEach(issue => console.log(`  - ${issue}`));
          
          if (debugData.issues.length > 0) {
            console.log('\n🔧 Debug API attempted to fix issues...');
            console.log('  - emailVerified after fix:', debugData.user.emailVerified);
          }
        } else {
          console.log('❌ Debug API failed:', debugResponse.status);
        }
        
        console.log('\n🔄 Now running update API...');
        
        // Test 2: Update User Data
        console.log('\n2. 🔧 Testing User Data Update...');
        const updateResponse = await fetch(`${BASE_URL}/api/test/update-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (updateResponse.ok) {
          const updateData = await updateResponse.json();
          console.log('✅ Update API working');
          console.log('Update Result:', updateData.message);
          console.log('User:', updateData.user.name);
          console.log('Password Valid:', updateData.user.passwordValid ? '✅ YES' : '❌ NO');
          
          // Verify again after update
          console.log('\n3. 🔍 Re-verifying after update...');
          const reVerifyResponse = await fetch(`${BASE_URL}/api/test/verify-user`);
          
          if (reVerifyResponse.ok) {
            const reVerifyData = await reVerifyResponse.json();
            console.log('✅ Re-verification complete');
            console.log('Final Status:', reVerifyData.verification.overall.passed ? '✅ PASSED' : '❌ FAILED');
            
            if (reVerifyData.verification.overall.passed) {
              console.log('\n🎉 SUCCESS! User data is now correct and ready for login testing');
              console.log('🧪 Next step: Test login in dashboard with:');
              console.log('   Email: dawskutel@gmail.com');
              console.log('   Password: Qwerty90');
            } else {
              console.log('\n⚠️ User data still has issues after update');
              console.log('Check the verification details above');
              
              // Run debug again to see what's still wrong
              console.log('\n🔍 Running final debug to see remaining issues...');
              const finalDebugResponse = await fetch(`${BASE_URL}/api/test/debug-user`);
              if (finalDebugResponse.ok) {
                const finalDebugData = await finalDebugResponse.json();
                console.log('Final Debug Results:');
                console.log('  - emailVerified:', finalDebugData.user.emailVerified);
                console.log('  - Issues:', finalDebugData.issues.join(', '));
              }
            }
          } else {
            console.log('❌ Re-verification failed:', reVerifyResponse.status);
          }
          
        } else {
          console.log('❌ Update API failed:', updateResponse.status);
          const errorData = await updateResponse.text();
          console.log('Error:', errorData);
        }
        
      } else {
        console.log('\n🎉 User data is already correct!');
        console.log('🧪 Ready for login testing with:');
        console.log('   Email: dawskutel@gmail.com');
        console.log('   Password: Qwerty90');
      }
      
    } else {
      console.log('❌ Verification API failed:', verifyResponse.status);
      const errorData = await verifyResponse.text();
      console.log('Error:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure Next.js server is running (npm run dev)');
    console.log('2. Check if API endpoints exist at /api/test/*');
    console.log('3. Verify database connection in Next.js');
    console.log('4. Check console logs for detailed errors');
  }
}

// Test password verification locally
async function testPasswordLocally() {
  console.log('\n🔐 Testing Password Verification Locally');
  console.log('=========================================');
  
  try {
    // Test with the hash from your document
    const testHash = '$2a$12$AqjHGi9nsbJg3jKXMnHc4OeyADwQ6u4wCRnokwc9ReXg7VQ3Um.7a';
    const testPassword = 'Qwerty90';
    
    // Note: bcrypt.compare is async, but we can't use it here without bcrypt
    console.log('Password Hash:', testHash);
    console.log('Test Password:', testPassword);
    console.log('Hash Length:', testHash.length);
    console.log('Hash Algorithm:', testHash.startsWith('$2a$') ? 'bcrypt' : 'unknown');
    console.log('Hash Cost:', testHash.substring(4, 6) + ' rounds');
    
    console.log('\n⚠️ Note: bcrypt verification requires the bcrypt library');
    console.log('   This test will be performed by the API endpoints');
    
  } catch (error) {
    console.error('❌ Local test failed:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Next.js API Tests...\n');
  
  // Test password locally first
  await testPasswordLocally();
  
  // Test API endpoints
  await testAPIEndpoints();
  
  console.log('\n🔍 All tests completed!');
}

// Run the tests
runAllTests();
