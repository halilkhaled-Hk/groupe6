-- Function to increment loyalty points
CREATE OR REPLACE FUNCTION increment_loyalty_points(user_id UUID, points INTEGER)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_profiles (id, loyalty_points, total_orders)
  VALUES (user_id, points, 1)
  ON CONFLICT (id)
  DO UPDATE SET
    loyalty_points = user_profiles.loyalty_points + points,
    total_orders = user_profiles.total_orders + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
