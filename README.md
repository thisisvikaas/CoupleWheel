# 💑 Couples Challenge Wheel

A web application for couples to exchange and complete weekly challenges. Every Sunday at 11 PM, both partners spin wheels containing surprise tasks created by each other. The app tracks completions, manages task pools, and gamifies relationship building.

## 🌟 Features

### MVP (Current Implementation)
- **User Authentication**: Email/password signup with automatic partner linking
- **Task Pool Management**: Create, edit, and delete tasks with optional categories
- **Weekly Spinner**: Reveal 6 random tasks every Sunday at 11 PM
- **Task Assignment**: Each partner gets one task to complete during the week
- **Verification System**: Partners verify each other's completion on Sundays
- **Veto Power**: One veto per month to swap task assignments
- **Countdown Timer**: Shows time until next spin
- **Current Week View**: See active task assignments

### Coming Soon
- Completion statistics and streaks
- Task history with filtering
- Special date animations (birthdays, anniversaries)
- PWA support for mobile installation
- Push notifications

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Date Handling**: date-fns
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier)
- Git

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/thisisvikaas/CoupleWheel.git
cd CoupleWheel
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor and run the contents of `supabase-schema.sql`
4. Get your project URL and anon key from Project Settings > API

See `SUPABASE_SETUP.md` for detailed instructions.

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app!

## 🎯 How It Works

### For Users

1. **Sign Up**: Both partners sign up with their emails
2. **Create Tasks**: Add tasks to your pool for your partner (minimum 20 recommended)
3. **Wait for Sunday**: A countdown shows time until the next spin
4. **Verify (Sunday before 11 PM)**: Verify if your partner completed last week's task
5. **Spin (Sunday at 11 PM)**: Reveal 6 random tasks and spin the wheel
6. **Complete**: Work on your assigned task during the week
7. **Veto (Optional)**: Use your monthly veto to swap tasks if needed

### Key Rules

- Each user creates tasks for their partner (not for themselves)
- Tasks are hidden until the Sunday reveal
- Verification is required from both partners before spinning
- One veto per calendar month to swap task assignments
- Tasks are randomly selected with category distribution when possible

## 📁 Project Structure

```
CoupleWheel/
├── src/
│   ├── components/
│   │   ├── auth/          # Login and signup forms
│   │   ├── common/        # Shared components (navbar, loading, etc.)
│   │   ├── countdown/     # Countdown timer
│   │   ├── spinner/       # Wheel spinner components
│   │   ├── tasks/         # Task management components
│   │   ├── verification/  # Sunday verification
│   │   └── veto/          # Veto system
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Main page components
│   ├── services/          # API service layers
│   ├── store/             # Zustand state management
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── supabaseClient.ts  # Supabase configuration
├── public/                # Static assets
├── supabase-schema.sql    # Database schema
├── SUPABASE_SETUP.md      # Supabase setup guide
└── package.json
```

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com) and import your repository
3. Add environment variables in project settings
4. Deploy!

The app is automatically built and deployed on every push to main.

## 🤝 Contributing

This is a personal project, but suggestions and bug reports are welcome! Feel free to open an issue.

## 📝 License

ISC

## 👤 Author

**Vikas Pareek** ([@thisisvikaas](https://github.com/thisisvikaas))

## 🙏 Acknowledgments

Built with love for couples looking to add more fun and challenges to their relationship! 💕

