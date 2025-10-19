
```markdown
# StudX - Student Bus Pass Management System

A modern, full-stack web application for managing student bus passes with real-time QR code generation. Built with cutting-edge technologies for a seamless user experience.

![StudX Banner](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss)

## 🌟 Features

- ✅ **Secure Authentication** - User registration and login powered by Supabase Auth
- ✅ **Online Application** - Complete digital application form with photo upload
- ✅ **QR Code Generation** - Instant QR code creation for pass verification
- ✅ **Digital Bus Pass** - Beautiful, responsive pass design with student details
- ✅ **Route Management** - Define source, destination, and multiple via points
- ✅ **User Dashboard** - Manage applications and view pass status
- ✅ **Glassmorphism UI** - Modern transparent design with backdrop blur effects
- ✅ **Background Video** - Immersive full-screen video background
- ✅ **Responsive Design** - Works flawlessly on desktop, tablet, and mobile
- ✅ **Print-Ready Pass** - Download and print your bus pass

## 🎨 UI Highlights

- **Transparent Navbar** with glassmorphism effect
- **Full-screen background video** for engaging user experience
- **Gradient text effects** and smooth animations
- **Three unique card styles** with different glassmorphism designs
- **Professional SVG icons** throughout the interface
- **Responsive layouts** that adapt to all screen sizes

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **Supabase** | Backend as a Service (BaaS) |
| **Supabase Auth** | User authentication |
| **Supabase Storage** | File uploads and storage |
| **PostgreSQL** | Relational database (via Supabase) |
| **react-qr-code** | QR code generation |

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- A **Supabase** account (free tier works)
- **Git** for version control

## 🚀 Quick Start

### 1. Clone the Repository

```
git clone https://github.com/yourusername/studx.git
cd studx
```

### 2. Install Dependencies

```
npm install
# or
yarn install
```

### 3. Set Up Supabase

#### Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project" and fill in the details
3. Wait for the project to be provisioned

#### Create Database Schema

Go to the **SQL Editor** in your Supabase dashboard and run:

```
-- Create students table
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  regno VARCHAR(100) NOT NULL UNIQUE,
  college VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  destination_from VARCHAR(255) NOT NULL,
  destination_to VARCHAR(255) NOT NULL,
  via_1 VARCHAR(255),
  via_2 VARCHAR(255),
  photo_url TEXT,
  qr_code TEXT NOT NULL,
  application_status VARCHAR(50) DEFAULT 'approved',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own data" ON students
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own data" ON students
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own data" ON students
  FOR UPDATE USING (auth.uid() = user_id);
```

#### Create Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Click **New Bucket**
3. Name it `student-photos`
4. Make it **Public**
5. Click **Create Bucket**

#### Configure Storage Policies

In the SQL Editor, run:

```
-- Enable RLS on storage
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow authenticated uploads
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'student-photos');

-- Allow public read access
CREATE POLICY "Public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'student-photos');
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Get your credentials:**
- Go to **Project Settings** → **API** in Supabase
- Copy the **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copy the **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 5. Add Background Video

Place your `bus.mp4` video file in the `public` folder at the project root:

```
studx/
├── public/
│   └── bus.mp4    ← Place video here
├── app/
├── components/
└── ...
```

### 6. Run Development Server

```
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application!

## 📁 Project Structure

```
studx/
├── app/
│   ├── application/         # Bus pass application form
│   │   └── page.tsx
│   ├── dashboard/           # User dashboard
│   │   └── page.tsx
│   ├── login/               # Login page
│   │   └── page.tsx
│   ├── register/            # Registration page
│   │   └── page.tsx
│   ├── pass/                # Digital pass display
│   │   └── [id]/
│   │       └── page.tsx
│   ├── qr-scan/             # QR code display
│   │   └── page.tsx
│   ├── layout.tsx           # Root layout with navbar
│   ├── page.tsx             # Homepage with video background
│   └── globals.css          # Global styles
├── components/
│   └── Navbar.tsx           # Transparent glassmorphism navbar
├── lib/
│   └── supabase/
│       ├── client.ts        # Browser Supabase client
│       └── server.ts        # Server Supabase client
├── types/
│   └── index.ts             # TypeScript type definitions
├── public/
│   └── bus.mp4              # Background video
├── .env.local               # Environment variables (create this)
├── next.config.mjs          # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies
```

## 🎯 Usage Flow

1. **Register** - Create a new account with email and password
2. **Login** - Access your account
3. **Apply** - Fill out the bus pass application form:
   - Upload your photo
   - Enter personal details (name, email, registration number)
   - Provide college information
   - Specify route details (from, to, via points)
4. **Submit** - Application is processed instantly
5. **View QR Code** - Scan the QR code to access your pass
6. **Digital Pass** - View and print your beautiful bus pass card
7. **Dashboard** - Manage your applications anytime

## 🔧 Build for Production

```
npm run build
npm start
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click **Deploy**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Other Deployment Options

- **Netlify** - Connect your GitHub repo and deploy
- **Railway** - One-click deployment with environment variables
- **AWS Amplify** - Full-stack deployment on AWS
- **Self-hosted** - Use Docker or PM2 for custom servers

## 🔒 Security Features

- ✅ **Row Level Security (RLS)** enabled on all database tables
- ✅ **Authenticated routes** protect user data
- ✅ **Type-safe database operations** with TypeScript
- ✅ **Secure file uploads** to Supabase Storage
- ✅ **Environment variable validation**
- ✅ **SQL injection prevention** through Supabase client

## 🎨 Customization

### Change Color Scheme

Edit `tailwind.config.ts`:

```
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    }
  }
}
```

### Modify Form Fields

Update `app/application/page.tsx` and adjust the database schema accordingly.

### Replace Background Video

Replace `public/bus.mp4` with your own video file. Supported formats: MP4, WebM, OGG.

## 📦 Dependencies

```
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@supabase/supabase-js": "^2.45.4",
    "@supabase/ssr": "^0.5.2",
    "react-qr-code": "^2.0.15",
    "typescript": "^5"
  }
}
```

## 🐛 Troubleshooting

### Environment Variables Not Loading

- Ensure `.env.local` is in the root directory
- Restart the development server after creating/editing `.env.local`
- Variables must start with `NEXT_PUBLIC_` for client-side access

### Storage Upload Errors (400 Bad Request)

- Verify the `student-photos` bucket exists
- Check that the bucket is marked as public
- Ensure storage policies are created correctly
- Confirm user is authenticated before upload

### Video Not Playing

- Ensure `bus.mp4` is in the `public` folder
- Check video codec compatibility (H.264 recommended)
- Verify file size is reasonable (< 50MB recommended)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Kupendra V**  
📧 Email: kupendrav99@gmail.com  
🔗 GitHub: [@kupendrav](https://github.com/kupendrav)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Supabase](https://supabase.com/) - Open Source Firebase Alternative
- [Tailwind CSS](https://tailwindcss.com/) - Utility-First CSS Framework
- [Vercel](https://vercel.com/) - Deployment Platform

---

**Built with ❤️ using Next.js, TypeScript, and Supabase**

**Star ⭐ this repository if you find it helpful!**
```

#   s t u d X  
 #   s t u d X  
 #   s t u d X  
 #   s t u d X  
 