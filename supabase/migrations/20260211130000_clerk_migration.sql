-- Decouple tables from Supabase Auth and use Clerk IDs (text) instead

-- 1. Watchlists
ALTER TABLE watchlists DROP CONSTRAINT IF EXISTS watchlists_user_id_fkey;
ALTER TABLE watchlists ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

-- 2. Listing Manual Inputs
ALTER TABLE listing_manual_inputs DROP CONSTRAINT IF EXISTS listing_manual_inputs_user_id_fkey;
ALTER TABLE listing_manual_inputs ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

-- 3. User Investment Goals (Add user_id text if not exists)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_investment_goals' AND column_name='user_id') THEN
        ALTER TABLE user_investment_goals ADD COLUMN user_id TEXT;
    END IF;
END $$;

-- 4. Update our public.users table to be the source of truth for Clerk users
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id TEXT UNIQUE NOT NULL,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
