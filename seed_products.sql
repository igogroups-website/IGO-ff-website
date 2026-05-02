-- COMPLETE FARMERS FACTORY DATABASE SEED SCRIPT
-- This script fixes your database and adds all 34+ products from your folder.

-- STEP 1: Fix the database structure (Add missing columns)
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_seasonal BOOLEAN DEFAULT FALSE;

-- STEP 2: Clear old empty data (Optional - uncomment if you want a clean start)
-- DELETE FROM products;

-- STEP 3: Insert all products with correct image paths from your folder
INSERT INTO products (name, category, price, image_url, description, stock, unit, is_active) VALUES
-- VEGETABLES (20 items)
('Beetroot', 'Vegetables', 45.00, '/Vegetables/Beetroot.png', 'Fresh and earthy beetroots, rich in nutrients.', 100, 'kg', true),
('Bitter Gourd', 'Vegetables', 35.00, '/Vegetables/Bitter Gourd.png', 'Fresh bitter gourd, great for healthy cooking.', 100, 'kg', true),
('Bottle Gourd', 'Vegetables', 30.00, '/Vegetables/Bottle Gourd.png', 'Hydrating and fresh bottle gourd.', 100, 'kg', true),
('Brinjal', 'Vegetables', 40.00, '/Vegetables/Brinjal.png', 'Fresh purple brinjals, perfect for curries.', 100, 'kg', true),
('Cabbage', 'Vegetables', 25.00, '/Vegetables/Cabbage.png', 'Crunchy and fresh green cabbage.', 100, 'kg', true),
('Capsicum', 'Vegetables', 80.00, '/Vegetables/Capsicum.png', 'Fresh green capsicum, perfect for salads and stir-fry.', 100, 'kg', true),
('Carrot', 'Vegetables', 60.00, '/Vegetables/Carrot.png', 'Sweet and crunchy farm carrots.', 100, 'kg', true),
('Cauliflower', 'Vegetables', 45.00, '/Vegetables/Cauliflower.png', 'Fresh white cauliflower heads.', 100, 'kg', true),
('Coriander Leaves', 'Vegetables', 10.00, '/Vegetables/Coriander Leaves.png', 'Fresh and aromatic coriander leaves.', 100, 'bundle', true),
('Drumstick', 'Vegetables', 15.00, '/Vegetables/Drumstick.png', 'Fresh drumsticks for sambar and curries.', 100, 'piece', true),
('Green Chilli', 'Vegetables', 40.00, '/Vegetables/Green Chilli.png', 'Spicy fresh green chillies.', 100, 'kg', true),
('Ladies Finger', 'Vegetables', 35.00, '/Vegetables/Ladies Finger (Okra).png', 'Fresh okra, perfect for fry or curry.', 100, 'kg', true),
('Mint Leaves', 'Vegetables', 10.00, '/Vegetables/Mint Leaves.png', 'Fresh mint leaves for chutney and tea.', 100, 'bundle', true),
('Onion', 'Vegetables', 45.00, '/Vegetables/Onion.png', 'Farm fresh red onions.', 100, 'kg', true),
('Potato', 'Vegetables', 35.00, '/Vegetables/Potato.png', 'Quality potatoes from local farms.', 100, 'kg', true),
('Pumpkin', 'Vegetables', 30.00, '/Vegetables/Pumpkin.png', 'Sweet and fresh orange pumpkin.', 100, 'kg', true),
('Radish', 'Vegetables', 25.00, '/Vegetables/Radish.png', 'Fresh white radish with greens.', 100, 'kg', true),
('Snake Gourd', 'Vegetables', 30.00, '/Vegetables/Snake Gourd.png', 'Fresh and long snake gourds.', 100, 'kg', true),
('Spinach', 'Vegetables', 15.00, '/Vegetables/Spinach.png', 'Nutritious green spinach leaves.', 100, 'bundle', true),
('Tomato', 'Vegetables', 30.00, '/Vegetables/Tomato.png', 'Juicy red farm tomatoes.', 100, 'kg', true),

-- FRUITS (14 items)
('Apple', 'Fruits', 180.00, '/Fruits/Apple.png', 'Sweet and crunchy premium apples.', 100, 'kg', true),
('Banana', 'Fruits', 60.00, '/Fruits/Banana.png', 'Ripe and sweet yellow bananas.', 100, 'dozen', true),
('Custard Apple', 'Fruits', 120.00, '/Fruits/Custard Apple.png', 'Sweet and creamy custard apples.', 100, 'kg', true),
('Grapes', 'Fruits', 90.00, '/Fruits/Grapes.png', 'Fresh green seedless grapes.', 100, 'kg', true),
('Guava', 'Fruits', 70.00, '/Fruits/Guava.png', 'Fresh and sweet pink guavas.', 100, 'kg', true),
('Mango', 'Fruits', 150.00, '/Fruits/Mango.png', 'Premium Alphonso mangoes.', 100, 'kg', true),
('Muskmelon', 'Fruits', 50.00, '/Fruits/Muskmelon.png', 'Sweet and hydrating muskmelons.', 100, 'kg', true),
('Orange', 'Fruits', 110.00, '/Fruits/Orange.png', 'Juicy and vitamin C rich oranges.', 100, 'kg', true),
('Papaya', 'Fruits', 40.00, '/Fruits/Papaya.png', 'Ripe and sweet farm papayas.', 100, 'kg', true),
('Pineapple', 'Fruits', 60.00, '/Fruits/Pineapple.png', 'Sweet and tangy fresh pineapples.', 100, 'piece', true),
('Pomegranate', 'Fruits', 160.00, '/Fruits/Pomegranate.png', 'Premium red pomegranates.', 100, 'kg', true),
('Sapota', 'Fruits', 60.00, '/Fruits/Sapota (Chikoo).png', 'Sweet and grainy sapota (chikoo).', 100, 'kg', true),
('Sweet Lime', 'Fruits', 80.00, '/Fruits/Sweet Lime (Mosambi).png', 'Fresh and juicy mosambi.', 100, 'kg', true),
('Watermelon', 'Fruits', 40.00, '/Fruits/Watermelon.png', 'Refreshing sweet watermelons.', 100, 'piece', true),

-- VALLUVAM PRODUCTS (10 items)
('Cold Pressed Coconut Oil', 'Valluvam Products', 280, '/Valluvam/images/coconut-1L.jpg', 'Pure, unrefined cold pressed coconut oil.', 100, '1L', true),
('Cold Pressed Groundnut Oil', 'Valluvam Products', 320, '/Valluvam/images/ground-1L.jpg', 'Traditional cold pressed groundnut oil.', 100, '1L', true),
('Cold Pressed Sesame Oil', 'Valluvam Products', 450, '/Valluvam/images/sesame-1L.jpg', 'Rich and aromatic cold pressed sesame oil.', 100, '1L', true),
('Natural Palm Jaggery', 'Valluvam Products', 180, '/Valluvam/images/palm-jaggery(500).jpg', 'Authentic palm jaggery with no additives.', 100, '500g', true),
('Wild Forest Honey', 'Valluvam Products', 350, '/Valluvam/images/products-naatu.jpg', 'Raw, unprocessed honey from deep forests.', 100, '500g', true),
('Traditional Millets Mix', 'Valluvam Products', 120, '/Valluvam/images/millets.jpg', 'High-fiber traditional millets breakfast mix.', 100, '500g', true),
('Premium Cashew Nuts', 'Valluvam Products', 450, '/Valluvam/images/nuts.jpg', 'Large, crunchy premium quality cashew nuts.', 100, '250g', true),
('Hand-ground Turmeric Powder', 'Valluvam Products', 85, '/Valluvam/images/spieces.jpg', 'Pure turmeric powder with high curcumin content.', 100, '200g', true),
('Natural Palm Sugar', 'Valluvam Products', 220, '/Valluvam/images/products-plam.jpg', 'Healthy alternative to white sugar.', 100, '500g', true),
('A2 Desi Cow Ghee', 'Valluvam Products', 650, '/Valluvam/images/products-2.jpg', 'Pure A2 ghee made using traditional bilona method.', 100, '500ml', true);
