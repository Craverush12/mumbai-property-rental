#!/usr/bin/env node

/**
 * Environment Validation Script
 * This script validates environment variables and configuration
 */

require('dotenv').config();

const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

const optionalVars = [
  'VITE_WHATSAPP_BUSINESS_TOKEN',
  'VITE_WHATSAPP_PHONE_NUMBER_ID',
  'VITE_RAZORPAY_KEY_ID',
  'VITE_PHONEPE_MERCHANT_ID',
  'VITE_SENTRY_DSN',
  'VITE_GOOGLE_ANALYTICS_ID'
];

function validateEnvironment() {
  console.log('🔍 Validating Environment Configuration...\n');

  let hasErrors = false;
  const missingRequired = [];
  const missingOptional = [];

  // Check required variables
  requiredVars.forEach(varName => {
    if (!process.env[varName] || process.env[varName] === `your_${varName.toLowerCase()}`) {
      missingRequired.push(varName);
      hasErrors = true;
    }
  });

  // Check optional variables
  optionalVars.forEach(varName => {
    if (!process.env[varName] || process.env[varName] === `your_${varName.toLowerCase()}`) {
      missingOptional.push(varName);
    }
  });

  // Display results
  if (missingRequired.length > 0) {
    console.log('❌ Missing Required Environment Variables:');
    missingRequired.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('');
  }

  if (missingOptional.length > 0) {
    console.log('⚠️  Missing Optional Environment Variables:');
    missingOptional.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('');
  }

  // Validate Supabase URL format
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.includes('supabase.co')) {
    console.log('⚠️  Warning: VITE_SUPABASE_URL may not be in correct format');
    console.log('   Expected format: https://your-project.supabase.co\n');
  }

  // Validate Supabase key format
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (supabaseKey && supabaseKey.length < 100) {
    console.log('⚠️  Warning: VITE_SUPABASE_ANON_KEY may not be in correct format');
    console.log('   Expected: Long alphanumeric string\n');
  }

  // Check environment type
  const appEnv = process.env.VITE_APP_ENV;
  if (appEnv) {
    console.log(`📋 Environment: ${appEnv.toUpperCase()}`);
  }

  // Display current configuration
  console.log('\n📊 Current Configuration:');
  console.log(`   Node Environment: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`   App Environment: ${process.env.VITE_APP_ENV || 'not set'}`);
  console.log(`   Supabase URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
  console.log(`   Supabase Key: ${supabaseKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`   WhatsApp Token: ${process.env.VITE_WHATSAPP_BUSINESS_TOKEN ? '✅ Set' : '❌ Missing'}`);
  console.log(`   Razorpay Key: ${process.env.VITE_RAZORPAY_KEY_ID ? '✅ Set' : '❌ Missing'}`);
  console.log(`   Sentry DSN: ${process.env.VITE_SENTRY_DSN ? '✅ Set' : '❌ Missing'}`);
  console.log(`   Google Analytics: ${process.env.VITE_GOOGLE_ANALYTICS_ID ? '✅ Set' : '❌ Missing'}`);

  if (!hasErrors) {
    console.log('\n✅ Environment validation passed!');
    console.log('   All required variables are configured.');
    
    if (missingOptional.length > 0) {
      console.log('\n💡 Recommendations:');
      console.log('   Consider setting up optional variables for full functionality:');
      missingOptional.forEach(varName => {
        console.log(`   - ${varName}: For enhanced features`);
      });
    }
  } else {
    console.log('\n❌ Environment validation failed!');
    console.log('   Please set all required environment variables.');
    console.log('\n💡 Quick Fix:');
    console.log('   1. Copy env.example to .env');
    console.log('   2. Update with your actual credentials');
    console.log('   3. Run this validation again');
    process.exit(1);
  }

  return !hasErrors;
}

// Run validation
if (require.main === module) {
  validateEnvironment();
}

module.exports = { validateEnvironment }; 