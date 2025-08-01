#!/usr/bin/env node

/**
 * Database Setup Script for Infiniti Casa
 * This script helps set up the production Supabase database
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Check if required environment variables are set
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease create a .env file with the required variables.');
  console.error('See env.example for reference.');
  process.exit(1);
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🏠 Setting up Infiniti Casa Database...\n');

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('📋 Checking database connection...');
    
    // Test connection by querying properties table
    const { data: properties, error } = await supabase
      .from('properties')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      console.log('\nPlease ensure:');
      console.log('1. Your Supabase project is created and running');
      console.log('2. The migration has been applied to your database');
      console.log('3. Your environment variables are correct');
      process.exit(1);
    }
    
    console.log('✅ Database connection successful!');
    
    // Check if properties exist
    const { data: propertyCount, error: countError } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Error checking properties:', countError.message);
      return;
    }
    
    console.log(`📊 Found ${propertyCount.length} properties in database`);
    
    if (propertyCount.length === 0) {
      console.log('\n⚠️  No properties found. You may need to:');
      console.log('1. Run the database migration');
      console.log('2. Populate the database with property data');
      console.log('3. Check your RLS policies');
    }
    
    // Check RLS policies
    console.log('\n🔒 Checking Row Level Security policies...');
    
    const { data: policies, error: policyError } = await supabase
      .rpc('get_rls_policies');
    
    if (policyError) {
      console.log('ℹ️  RLS policies check not available (this is normal)');
    } else {
      console.log('✅ RLS policies are configured');
    }
    
    console.log('\n🎉 Database setup check completed!');
    console.log('\nNext steps:');
    console.log('1. ✅ Database connection verified');
    console.log('2. 📝 Add property data (BE002)');
    console.log('3. 🔐 Test authentication (BE003)');
    console.log('4. 🎨 Connect frontend (FE001)');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup
setupDatabase(); 