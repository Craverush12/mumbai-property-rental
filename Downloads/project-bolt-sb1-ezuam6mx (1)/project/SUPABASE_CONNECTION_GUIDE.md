# 🔗 Supabase Database Connection Guide

## 📋 **Prerequisites**

1. **Supabase Project Created** ✅
2. **Database Schema Ready** ✅
3. **Environment Variables Set** ⏳

---

## 🚀 **Step 1: Get Your Supabase Credentials**

### **1.1 Access Your Supabase Dashboard**
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **API**

### **1.2 Copy Your Credentials**
You'll need these two values:
- **Project URL** (e.g., `https://your-project.supabase.co`)
- **Anon Public Key** (starts with `eyJ...`)

---

## 🔧 **Step 2: Set Up Environment Variables**

### **2.1 Create Environment File**
Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# WhatsApp Business API (for OTP and notifications)
VITE_WHATSAPP_BUSINESS_TOKEN=your_whatsapp_business_token_here
VITE_WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id_here

# Payment Gateway Configuration
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
VITE_PHONEPE_MERCHANT_ID=your_phonepe_merchant_id_here

# Environment
NODE_ENV=development
VITE_APP_ENV=development
```

### **2.2 Add to .gitignore**
Ensure `.env.local` is in your `.gitignore` file to keep credentials secure.

---

## 🗄️ **Step 3: Run Database Migrations**

### **3.1 Install Supabase CLI** (if not already installed)
```bash
npm install -g supabase
```

### **3.2 Link Your Project**
```bash
supabase login
supabase link --project-ref your-project-ref
```

### **3.3 Run Migrations**
```bash
supabase db push
```

### **3.4 Seed Your Database**
```bash
supabase db reset
```

---

## 🧪 **Step 4: Test Database Connection**

### **4.1 Create a Test Component**
Create `src/components/DatabaseTest.tsx`:

```tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PropertyService } from '../services/propertyService';

const DatabaseTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [properties, setProperties] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test basic connection
      const { data, error } = await supabase
        .from('properties')
        .select('count')
        .limit(1);

      if (error) {
        throw error;
      }

      // Test property service
      const allProperties = await PropertyService.getAllProperties();
      setProperties(allProperties);
      setConnectionStatus('success');
    } catch (err) {
      setConnectionStatus('error');
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Database Connection Test</h2>
      
      <div className="mb-4">
        <span className="font-medium">Status: </span>
        <span className={`px-2 py-1 rounded text-sm ${
          connectionStatus === 'success' ? 'bg-green-100 text-green-800' :
          connectionStatus === 'error' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {connectionStatus === 'testing' ? 'Testing...' :
           connectionStatus === 'success' ? 'Connected ✅' :
           'Error ❌'}
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {connectionStatus === 'success' && (
        <div>
          <p className="text-green-600 mb-2">✅ Database connection successful!</p>
          <p className="text-sm text-gray-600">
            Found {properties.length} properties in database
          </p>
          {properties.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Sample Properties:</h3>
              <div className="space-y-2">
                {properties.slice(0, 3).map((property) => (
                  <div key={property.id} className="p-2 bg-gray-50 rounded text-sm">
                    <strong>{property.name}</strong> - {property.location} (₹{property.price})
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DatabaseTest;
```

### **4.2 Add to Your App**
Temporarily add the test component to your main App:

```tsx
// In src/App.tsx
import DatabaseTest from './components/DatabaseTest';

// Add this to your render method for testing
{showDatabaseTest && <DatabaseTest />}
```

---

## 🔄 **Step 5: Update Services to Use Real Data**

### **5.1 Update PropertyService**
The PropertyService is already configured to use Supabase. Let's verify it's working:

```tsx
// Test in your component
const [properties, setProperties] = useState<Property[]>([]);

useEffect(() => {
  const loadProperties = async () => {
    try {
      const data = await PropertyService.getAllProperties();
      setProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
    }
  };
  
  loadProperties();
}, []);
```

### **5.2 Update Other Services**
All services are already configured to use Supabase:
- ✅ PropertyService
- ✅ BookingService  
- ✅ AuthService
- ✅ UserManagementService
- ✅ FileStorageService
- ✅ WhatsAppService

---

## 🎯 **Step 6: Verify Data Flow**

### **6.1 Check Property Grid**
Your PropertyGrid component should now display real data from Supabase.

### **6.2 Test Property Search**
The PropertySearch component should filter real data.

### **6.3 Verify Booking System**
The booking system should save to your Supabase database.

---

## 🔍 **Step 7: Troubleshooting**

### **Common Issues:**

1. **"Missing Supabase environment variables"**
   - Check your `.env.local` file exists
   - Verify variable names start with `VITE_`
   - Restart your development server

2. **"Invalid API key"**
   - Double-check your anon key from Supabase dashboard
   - Ensure no extra spaces or characters

3. **"Table doesn't exist"**
   - Run migrations: `supabase db push`
   - Check table names match your schema

4. **"Permission denied"**
   - Check Row Level Security (RLS) policies
   - Verify your anon key has proper permissions

### **Debug Commands:**
```bash
# Check Supabase status
supabase status

# View logs
supabase logs

# Reset database
supabase db reset

# Generate types (if schema changed)
supabase gen types typescript --local > src/lib/database.types.ts
```

---

## 📊 **Step 8: Monitor Your Database**

### **8.1 Supabase Dashboard**
- Go to your Supabase dashboard
- Check **Table Editor** to see your data
- Monitor **Logs** for any errors
- Check **API** usage

### **8.2 Real-time Features**
Your app supports real-time features:
- Booking updates
- Property availability changes
- User activity tracking

---

## ✅ **Success Checklist**

- [ ] Environment variables set correctly
- [ ] Database migrations run successfully
- [ ] Connection test passes
- [ ] Properties load from database
- [ ] Search and filtering work
- [ ] Booking system saves data
- [ ] File uploads work
- [ ] WhatsApp notifications configured

---

## 🚀 **Next Steps**

Once your database is connected:

1. **Populate with Real Data** - Add your actual properties
2. **Configure WhatsApp API** - Set up notifications
3. **Set up Payment Gateways** - Configure Razorpay/PhonePe
4. **Deploy to Production** - Use production Supabase project

---

## 📞 **Need Help?**

If you encounter issues:

1. Check the Supabase documentation
2. Verify your credentials are correct
3. Check the browser console for errors
4. Test with the DatabaseTest component
5. Share error messages for specific help

Your database schema is well-structured and ready to go! 🎉 