-- Re-link tables to use the internal UUID from public.users table

-- 1. Ensure public.users exists (already created in previous migration, but let's be safe)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id TEXT UNIQUE NOT NULL,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Watchlists: Change user_id to UUID and add Foreign Key
ALTER TABLE watchlists ALTER COLUMN user_id TYPE UUID USING user_id::UUID;
ALTER TABLE watchlists ADD CONSTRAINT watchlists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

-- 3. Listing Manual Inputs: Change user_id to UUID and add Foreign Key
ALTER TABLE listing_manual_inputs ALTER COLUMN user_id TYPE UUID USING user_id::UUID;
ALTER TABLE listing_manual_inputs ADD CONSTRAINT listing_manual_inputs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

-- 4. User Investment Goals: Change user_id to UUID and add Foreign Key
ALTER TABLE user_investment_goals ALTER COLUMN user_id TYPE UUID USING user_id::UUID;
ALTER TABLE user_investment_goals ADD CONSTRAINT user_investment_goals_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
