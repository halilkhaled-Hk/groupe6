-- Fix RLS policies to allow anonymous orders and ensure order_items can be inserted

-- Drop existing policies for orders
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;

-- Create new policies that allow both authenticated and anonymous orders
CREATE POLICY "Anyone can create orders" ON orders 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view own orders" ON orders 
  FOR SELECT 
  USING (
    auth.uid() = user_id 
    OR user_id IS NULL
  );

CREATE POLICY "Users can update own orders" ON orders 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Fix order_items policies
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;

CREATE POLICY "Anyone can insert order items" ON order_items 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view order items" ON order_items 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
    )
  );
