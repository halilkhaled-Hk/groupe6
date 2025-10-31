-- Fix RLS policies for loyalty_transactions table
-- Allow users to insert their own loyalty transactions

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert own loyalty transactions" ON loyalty_transactions;

-- Create policy to allow users to insert their own loyalty transactions
CREATE POLICY "Users can insert own loyalty transactions" 
ON loyalty_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Also allow system/service role to insert loyalty transactions for any user
-- This is needed when creating orders via API routes
CREATE POLICY "Service role can insert loyalty transactions" 
ON loyalty_transactions 
FOR INSERT 
WITH CHECK (true);
