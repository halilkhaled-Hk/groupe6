-- Seed initial data for Myka restaurant

-- Insert categories
INSERT INTO categories (name, slug, display_order) VALUES
  ('Burgers', 'burgers', 1),
  ('Pizzas', 'pizzas', 2),
  ('Plats', 'plats', 3),
  ('Boissons', 'boissons', 4),
  ('Desserts', 'desserts', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, category_id, image_url, is_vegan, allergens) 
SELECT 
  'Myka Burger Classic',
  'Notre burger signature avec steak haché, cheddar, salade, tomate, oignons caramélisés',
  12.90,
  (SELECT id FROM categories WHERE slug = 'burgers'),
  '/placeholder.svg?height=400&width=400',
  false,
  ARRAY['gluten', 'dairy']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Myka Burger Classic');

INSERT INTO products (name, description, price, category_id, image_url, is_vegan, allergens)
SELECT
  'Veggie Delight',
  'Burger végétarien avec galette de légumes, avocat, roquette et sauce maison',
  11.90,
  (SELECT id FROM categories WHERE slug = 'burgers'),
  '/placeholder.svg?height=400&width=400',
  true,
  ARRAY['gluten']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Veggie Delight');

-- Fixed column list to include both is_vegan and is_student_special
INSERT INTO products (name, description, price, category_id, image_url, is_vegan, is_student_special, allergens)
SELECT
  'Student Special Burger',
  'Burger étudiant : steak, fromage, frites incluses',
  8.90,
  (SELECT id FROM categories WHERE slug = 'burgers'),
  '/placeholder.svg?height=400&width=400',
  false,
  true,
  ARRAY['gluten', 'dairy']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Student Special Burger');

INSERT INTO products (name, description, price, category_id, image_url, is_vegan, allergens)
SELECT
  'Pizza Margherita',
  'La classique : sauce tomate, mozzarella, basilic frais',
  10.90,
  (SELECT id FROM categories WHERE slug = 'pizzas'),
  '/placeholder.svg?height=400&width=400',
  false,
  ARRAY['gluten', 'dairy']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Pizza Margherita');

INSERT INTO products (name, description, price, category_id, image_url, is_vegan, allergens)
SELECT
  'Pizza 4 Fromages',
  'Mozzarella, gorgonzola, chèvre, parmesan',
  13.90,
  (SELECT id FROM categories WHERE slug = 'pizzas'),
  '/placeholder.svg?height=400&width=400',
  false,
  ARRAY['gluten', 'dairy']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Pizza 4 Fromages');

-- Fixed column list to include is_vegan and match the number of values
INSERT INTO products (name, description, price, category_id, image_url, is_vegan, allergens)
SELECT
  'Coca-Cola',
  'Canette 33cl',
  2.50,
  (SELECT id FROM categories WHERE slug = 'boissons'),
  '/placeholder.svg?height=400&width=400',
  false,
  ARRAY[]::TEXT[]
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Coca-Cola');

INSERT INTO products (name, description, price, category_id, image_url, is_vegan, allergens)
SELECT
  'Jus d''Orange Frais',
  'Pressé minute',
  4.50,
  (SELECT id FROM categories WHERE slug = 'boissons'),
  '/placeholder.svg?height=400&width=400',
  true,
  ARRAY[]::TEXT[]
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Jus d''Orange Frais');

INSERT INTO products (name, description, price, category_id, image_url, is_vegan, allergens)
SELECT
  'Tiramisu Maison',
  'Le vrai tiramisu italien',
  6.50,
  (SELECT id FROM categories WHERE slug = 'desserts'),
  '/placeholder.svg?height=400&width=400',
  false,
  ARRAY['gluten', 'dairy', 'eggs']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Tiramisu Maison');

INSERT INTO products (name, description, price, category_id, image_url, is_vegan, allergens)
SELECT
  'Brownie Chocolat',
  'Brownie fondant avec glace vanille',
  5.90,
  (SELECT id FROM categories WHERE slug = 'desserts'),
  '/placeholder.svg?height=400&width=400',
  false,
  ARRAY['gluten', 'dairy', 'eggs', 'nuts']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Brownie Chocolat');

-- Insert restaurant tables (for QR code ordering)
INSERT INTO restaurant_tables (table_number, qr_code, capacity) VALUES
  ('T01', 'qr-table-01', 2),
  ('T02', 'qr-table-02', 2),
  ('T03', 'qr-table-03', 4),
  ('T04', 'qr-table-04', 4),
  ('T05', 'qr-table-05', 6),
  ('T06', 'qr-table-06', 6),
  ('T07', 'qr-table-07', 4),
  ('T08', 'qr-table-08', 2)
ON CONFLICT (table_number) DO NOTHING;

-- Insert loyalty rewards
INSERT INTO loyalty_rewards (name, description, points_required, reward_type, reward_value) VALUES
  ('Burger Gratuit', 'Un burger au choix offert', 100, 'free_item', '{"type": "category", "value": "burgers"}'),
  ('10% de Réduction', 'Réduction de 10% sur votre prochaine commande', 50, 'discount', '{"type": "percentage", "value": 10}'),
  ('Dessert Offert', 'Un dessert au choix offert', 75, 'free_item', '{"type": "category", "value": "desserts"}'),
  ('Boisson Gratuite', 'Une boisson au choix offerte', 30, 'free_item', '{"type": "category", "value": "boissons"}')
ON CONFLICT DO NOTHING;

-- Insert promo codes
INSERT INTO promo_codes (code, description, discount_type, discount_value, min_order_amount, max_uses, valid_until) VALUES
  ('CAMPUSMYKA', 'Réduction étudiante de 15%', 'percentage', 15, 10, 1000, NOW() + INTERVAL '1 year'),
  ('BIENVENUE10', 'Bienvenue chez Myka - 10% de réduction', 'percentage', 10, 15, 500, NOW() + INTERVAL '6 months'),
  ('MYKA5', 'Réduction de 5€ sur votre commande', 'fixed', 5, 20, 200, NOW() + INTERVAL '3 months')
ON CONFLICT (code) DO NOTHING;
