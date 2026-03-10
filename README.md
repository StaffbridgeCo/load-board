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