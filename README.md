# Load Board – Next.js + Supabase

This project is a role-based load management system built with:

- Next.js 14 App Router
- Supabase Auth & Database
- TypeScript
- TailwindCSS
- Deployed on Vercel

## Features

Dispatcher:
- create loads
- view own loads
- mark loads completed

Driver:
- view open loads
- claim loads
- view assigned loads

## Security

Row Level Security (RLS) is implemented in Supabase to ensure:
- drivers only see open or assigned loads
- dispatchers only see loads they created
- only dispatchers can create loads
- only drivers can claim loads



- ## Live Demo ------------------------------

https://your-vercel-url.vercel.app

## Setup

1. Clone the repository

git clone https://github.com/StaffbridgeCo/load-board

2. Install dependencies

npm install

3. Create .env.local

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url  
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

4. Run development server

npm run dev
