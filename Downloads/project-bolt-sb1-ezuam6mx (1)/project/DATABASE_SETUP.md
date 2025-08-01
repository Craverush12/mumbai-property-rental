# 🗄️ Database Setup Guide - Infiniti Casa

## 📋 **Overview**
This guide helps you set up the production Supabase database for Infiniti Casa with proper security, performance, and phone-based authentication.

## 🚀 **Quick Setup**

### **1. Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### **2. Configure Environment Variables**
```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your Supabase credentials
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### **3. Run Database Migration**
```bash
# Apply the production database schema
npm run db:migrate

# Or manually run the migration file in Supabase SQL editor
```

### **4. Verify Setup**
```bash
# Test database connection and configuration
npm run db:setup
```

## 🏗️ **Database Schema**

### **Core Tables**
- **properties** - Luxury rental properties with categories and aesthetics
- **user_profiles** - Phone-based user profiles with roles
- **bookings** - Reservation system with payment tracking
- **otp_verifications** - Phone authentication system
- **user_favorites** - Property wishlist functionality
- **property_suggestions** - AI recommendation system
- **newsletter_subscriptions** - Marketing and communication
- **user_activity_log** - User behavior tracking

### **Key Features**
- ✅ **Row Level Security (RLS)** - Data protection
- ✅ **Phone-based Authentication** - OTP verification
- ✅ **Booking Conflict Prevention** - Automated availability checking
- ✅ **Performance Indexes** - Optimized queries
- ✅ **Audit Trails** - Activity logging
- ✅ **Multi-role Support** - Guest, Admin, Property Manager

## 🔒 **Security Configuration**

### **Row Level Security Policies**
- **Properties**: Public read, admin-only write
- **User Profiles**: Users can only access their own data
- **Bookings**: Users see only their bookings, admins see all
- **OTP Verifications**: Restricted access for security

### **Data Validation**
- Phone number format validation
- Booking date conflict prevention
- Price and capacity constraints
- Unique confirmation codes

## 📊 **Performance Optimization**

### **Database Indexes**
```sql
-- Property search optimization
CREATE INDEX idx_properties_category ON properties(category);
CREATE INDEX idx_properties_aesthetic ON properties(aesthetic);
CREATE INDEX idx_properties_price ON properties(price);

-- Booking performance
CREATE INDEX idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX idx_bookings_status ON bookings(status);

-- User queries
CREATE INDEX idx_user_profiles_phone ON user_profiles(phone);
CREATE INDEX idx_otp_verifications_phone ON otp_verifications(phone);
```

### **Query Optimization**
- Efficient booking conflict checking
- Optimized property search and filtering
- Fast user authentication lookups

## 🔧 **Configuration Steps**

### **Step 1: Supabase Project Setup**
1. **Create Project**
   ```bash
   # Use Supabase CLI (optional)
   supabase init
   supabase login
   supabase projects create infiniti-casa
   ```

2. **Configure Settings**
   - Enable Row Level Security
   - Set up authentication providers
   - Configure storage buckets

### **Step 2: Apply Migration**
```sql
-- Run the migration file in Supabase SQL Editor
-- File: supabase/migrations/20250101000000_production_setup.sql
```

### **Step 3: Test Configuration**
```bash
# Run the setup verification script
npm run db:setup
```

### **Step 4: Populate Data**
```bash
# Add property data (next task: BE002)
# Add admin users
# Configure WhatsApp integration
```

## 🛠️ **Troubleshooting**

### **Common Issues**

**1. Connection Failed**
```bash
# Check environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Verify project is active in Supabase dashboard
```

**2. RLS Policy Errors**
```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

**3. Permission Denied**
```sql
-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
```

### **Debug Commands**
```bash
# Test connection
npm run db:setup

# Check migration status
supabase migration list

# Reset database (development only)
npm run db:reset
```

## 📈 **Monitoring & Maintenance**

### **Database Health Checks**
- Monitor query performance
- Check RLS policy effectiveness
- Review user activity logs
- Track booking patterns

### **Backup Strategy**
- Automated daily backups
- Point-in-time recovery
- Data retention policies
- Disaster recovery procedures

## 🔄 **Next Steps**

After completing this setup:

1. **BE002** - Populate Database with Real Property Data
2. **BE003** - Implement Phone/OTP Authentication Backend
3. **FE001** - Implement Phone/OTP Authentication UI Components
4. **INT001** - Connect Frontend Authentication to Backend

## 📞 **Support**

For database issues:
1. Check Supabase dashboard logs
2. Review RLS policy configuration
3. Verify environment variables
4. Test with setup script

---

*This database setup provides a secure, scalable foundation for Infiniti Casa's luxury rental platform.* 