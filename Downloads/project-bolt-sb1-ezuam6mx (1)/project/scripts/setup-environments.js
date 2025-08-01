#!/usr/bin/env node

/**
 * Environment Configuration Setup Script
 * This script helps set up different environment configurations
 */

const fs = require('fs');
const path = require('path');

const environments = {
  development: {
    NODE_ENV: 'development',
    VITE_APP_ENV: 'development',
    VITE_SUPABASE_URL: 'your_development_supabase_url',
    VITE_SUPABASE_ANON_KEY: 'your_development_supabase_anon_key',
    VITE_WHATSAPP_BUSINESS_TOKEN: 'your_development_whatsapp_token',
    VITE_WHATSAPP_PHONE_NUMBER_ID: 'your_development_whatsapp_phone_id',
    VITE_RAZORPAY_KEY_ID: 'your_development_razorpay_key',
    VITE_PHONEPE_MERCHANT_ID: 'your_development_phonepe_merchant_id',
    VITE_SENTRY_DSN: '',
    VITE_GOOGLE_ANALYTICS_ID: ''
  },
  staging: {
    NODE_ENV: 'production',
    VITE_APP_ENV: 'staging',
    VITE_SUPABASE_URL: 'your_staging_supabase_url',
    VITE_SUPABASE_ANON_KEY: 'your_staging_supabase_anon_key',
    VITE_WHATSAPP_BUSINESS_TOKEN: 'your_staging_whatsapp_token',
    VITE_WHATSAPP_PHONE_NUMBER_ID: 'your_staging_whatsapp_phone_id',
    VITE_RAZORPAY_KEY_ID: 'your_staging_razorpay_key',
    VITE_PHONEPE_MERCHANT_ID: 'your_staging_phonepe_merchant_id',
    VITE_SENTRY_DSN: 'your_staging_sentry_dsn',
    VITE_GOOGLE_ANALYTICS_ID: 'your_staging_ga_id'
  },
  production: {
    NODE_ENV: 'production',
    VITE_APP_ENV: 'production',
    VITE_SUPABASE_URL: 'your_production_supabase_url',
    VITE_SUPABASE_ANON_KEY: 'your_production_supabase_anon_key',
    VITE_WHATSAPP_BUSINESS_TOKEN: 'your_production_whatsapp_token',
    VITE_WHATSAPP_PHONE_NUMBER_ID: 'your_production_whatsapp_phone_id',
    VITE_RAZORPAY_KEY_ID: 'your_production_razorpay_key',
    VITE_PHONEPE_MERCHANT_ID: 'your_production_phonepe_merchant_id',
    VITE_SENTRY_DSN: 'your_production_sentry_dsn',
    VITE_GOOGLE_ANALYTICS_ID: 'your_production_ga_id'
  }
};

function createEnvFile(envName, config) {
  const envContent = Object.entries(config)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const fileName = envName === 'development' ? '.env' : `.env.${envName}`;
  const filePath = path.join(process.cwd(), fileName);

  fs.writeFileSync(filePath, envContent);
  console.log(`✅ Created ${fileName}`);
}

function createEnvExample() {
  const exampleContent = `# Environment Configuration for Infiniti Casa
# Copy this file to .env and update with your actual values

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# WhatsApp Business API (for OTP and notifications)
VITE_WHATSAPP_BUSINESS_TOKEN=your_whatsapp_business_token
VITE_WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id

# Payment Gateway Configuration
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_PHONEPE_MERCHANT_ID=your_phonepe_merchant_id

# Environment
NODE_ENV=development
VITE_APP_ENV=development

# Optional: Analytics and Monitoring
VITE_SENTRY_DSN=your_sentry_dsn
VITE_GOOGLE_ANALYTICS_ID=your_ga_id

# Instructions:
# 1. Replace all 'your_*' values with actual credentials
# 2. Keep this file secure and never commit to version control
# 3. Use different values for development, staging, and production
`;

  const filePath = path.join(process.cwd(), 'env.example');
  fs.writeFileSync(filePath, exampleContent);
  console.log('✅ Created env.example');
}

function createViteConfig() {
  const viteConfigContent = `import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV),
    },
    server: {
      port: 3000,
      host: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            supabase: ['@supabase/supabase-js'],
          },
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', '@supabase/supabase-js'],
    },
  };
});
`;

  const filePath = path.join(process.cwd(), 'vite.config.ts');
  fs.writeFileSync(filePath, viteConfigContent);
  console.log('✅ Updated vite.config.ts');
}

function createEnvironmentGuide() {
  const guideContent = `# Environment Configuration Guide

## Overview
This guide explains how to set up environment configurations for different deployment stages.

## Environment Files

### Development (.env)
- Used for local development
- Contains development API keys and endpoints
- Never commit to version control

### Staging (.env.staging)
- Used for staging/testing environment
- Contains staging API keys and endpoints
- Used for pre-production testing

### Production (.env.production)
- Used for production deployment
- Contains production API keys and endpoints
- Highest security requirements

## Required Environment Variables

### Supabase Configuration
- \`VITE_SUPABASE_URL\`: Your Supabase project URL
- \`VITE_SUPABASE_ANON_KEY\`: Your Supabase anonymous key

### WhatsApp Business API
- \`VITE_WHATSAPP_BUSINESS_TOKEN\`: WhatsApp Business API token
- \`VITE_WHATSAPP_PHONE_NUMBER_ID\`: WhatsApp phone number ID

### Payment Gateways
- \`VITE_RAZORPAY_KEY_ID\`: Razorpay public key
- \`VITE_PHONEPE_MERCHANT_ID\`: PhonePe merchant ID

### Analytics & Monitoring
- \`VITE_SENTRY_DSN\`: Sentry error tracking DSN
- \`VITE_GOOGLE_ANALYTICS_ID\`: Google Analytics tracking ID

## Setup Instructions

1. **Development Setup**
   \`\`\`bash
   npm run env:dev
   \`\`\`

2. **Staging Setup**
   \`\`\`bash
   npm run env:staging
   \`\`\`

3. **Production Setup**
   \`\`\`bash
   npm run env:prod
   \`\`\`

## Security Best Practices

1. **Never commit .env files** to version control
2. **Use different API keys** for each environment
3. **Rotate keys regularly** for production
4. **Limit API key permissions** to minimum required
5. **Monitor API usage** for unusual activity

## Troubleshooting

### Common Issues
1. **Missing environment variables**: Check that all required variables are set
2. **Invalid API keys**: Verify keys are correct and active
3. **CORS errors**: Ensure Supabase URL is correct
4. **WhatsApp API errors**: Check phone number ID and token

### Validation
Run the environment validation script:
\`\`\`bash
npm run env:validate
\`\`\`

## Deployment

### Vercel
- Set environment variables in Vercel dashboard
- Use \`VITE_\` prefix for client-side variables

### Netlify
- Set environment variables in Netlify dashboard
- Use \`VITE_\` prefix for client-side variables

### Manual Deployment
- Copy appropriate .env file to server
- Ensure file permissions are secure
- Restart application after changes
`;

  const filePath = path.join(process.cwd(), 'ENVIRONMENT_GUIDE.md');
  fs.writeFileSync(filePath, guideContent);
  console.log('✅ Created ENVIRONMENT_GUIDE.md');
}

function updatePackageJson() {
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  // Add environment scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    'env:dev': 'node scripts/setup-environments.js development',
    'env:staging': 'node scripts/setup-environments.js staging',
    'env:prod': 'node scripts/setup-environments.js production',
    'env:validate': 'node scripts/validate-env.js',
    'env:setup': 'node scripts/setup-environments.js all'
  };

  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Updated package.json with environment scripts');
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log('🏠 Setting up Environment Configuration for Infiniti Casa...\n');

  if (command === 'all' || !command) {
    // Create all environment files
    Object.entries(environments).forEach(([envName, config]) => {
      createEnvFile(envName, config);
    });
    createEnvExample();
    createViteConfig();
    createEnvironmentGuide();
    updatePackageJson();
  } else if (environments[command]) {
    // Create specific environment file
    createEnvFile(command, environments[command]);
  } else {
    console.error('❌ Invalid environment. Use: development, staging, production, or all');
    process.exit(1);
  }

  console.log('\n🎉 Environment configuration setup completed!');
  console.log('\nNext steps:');
  console.log('1. Update the generated .env files with your actual credentials');
  console.log('2. Run "npm run env:validate" to verify your configuration');
  console.log('3. Start development with "npm run dev"');
}

main(); 