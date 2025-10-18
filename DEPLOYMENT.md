# Deployment Checklist

## Pre-Deployment

- [ ] All tests passing
- [ ] Build completes without errors (`npm run build`)
- [ ] Environment variables documented in `.env.example`
- [ ] Database schema created in Supabase
- [ ] Row Level Security policies configured
- [ ] Storage bucket created for student photos
- [ ] Storage bucket set to public access

## Supabase Setup

### 1. Create Students Table

```sql
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  regno TEXT NOT NULL UNIQUE,
  college TEXT NOT NULL,
  address TEXT NOT NULL,
  destination_from TEXT NOT NULL,
  destination_to TEXT NOT NULL,
  via_1 TEXT,
  via_2 TEXT,
  photo_url TEXT,
  qr_code TEXT NOT NULL,
  application_status TEXT DEFAULT 'approved',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Enable Row Level Security

```sql
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own applications"
  ON students FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications"
  ON students FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
  ON students FOR UPDATE
  USING (auth.uid() = user_id);
```

### 3. Create Storage Bucket

1. Navigate to Storage in Supabase Dashboard
2. Click "New Bucket"
3. Name: `student-photos`
4. Set to Public
5. Create the bucket

### 4. Configure Storage Policies

```sql
CREATE POLICY "Users can upload their own photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'student-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'student-photos');
```

## Vercel Deployment

### 1. Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Select the repository

### 2. Configure Project

1. Framework Preset: Next.js
2. Root Directory: `./`
3. Build Command: `npm run build` (auto-detected)
4. Output Directory: `.next` (auto-detected)

### 3. Environment Variables

Add the following in Vercel dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from: Supabase Dashboard → Settings → API

### 4. Deploy

Click "Deploy" and wait for the build to complete.

## Post-Deployment

- [ ] Test user registration
- [ ] Test user login
- [ ] Test application submission
- [ ] Test photo upload
- [ ] Test QR code generation
- [ ] Test bus pass display
- [ ] Test on mobile devices
- [ ] Check all routes are accessible
- [ ] Verify authentication redirects work
- [ ] Test logout functionality

## Production Monitoring

- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Configure analytics (Google Analytics, Vercel Analytics)
- [ ] Set up uptime monitoring
- [ ] Configure backup strategy for Supabase

## Security Checklist

- [ ] Environment variables are not exposed in client code
- [ ] RLS policies are properly configured
- [ ] File upload size limits are set
- [ ] API rate limiting is considered
- [ ] HTTPS is enforced
- [ ] Security headers are configured (check `vercel.json`)
- [ ] Authentication tokens are secure
- [ ] Sensitive data is not logged

## Performance Optimization

- [ ] Images are optimized
- [ ] Code splitting is implemented (Next.js default)
- [ ] Critical CSS is inlined
- [ ] Fonts are optimized (using next/font)
- [ ] Lighthouse score > 90

## Documentation

- [ ] README.md is up to date
- [ ] API documentation (if applicable)
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] Known issues documented

## Support

- [ ] Error messages are user-friendly
- [ ] Contact information is available
- [ ] FAQ section created (optional)
- [ ] Support email configured

---

**Note:** Keep your Supabase credentials secure and never commit them to version control!
