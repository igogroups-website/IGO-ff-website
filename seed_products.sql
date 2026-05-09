-- MASTER FARMERS FACTORY DATABASE SEED SCRIPT
-- This script ensures the database ONLY contains products that exist in the /public folder.

-- STEP 1: Fix the database structure
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_seasonal BOOLEAN DEFAULT FALSE;

-- STEP 2: Clear old data to ensure ONLY these products exist
DELETE FROM products;

-- STEP 3: Insert all 61 products with correct image paths
INSERT INTO products (name, category, price, image_url, description, stock, unit, is_active, is_seasonal) VALUES
-- VEGETABLES (32 items)
('Beetroot', 'Vegetables', 45.00, '/Vegetables/Beetroot.png', 'Fresh and earthy beetroots, rich in nutrients.', 100, 'kg', true, false),
('Bitter Gourd', 'Vegetables', 35.00, '/Vegetables/Bitter Gourd.png', 'Fresh bitter gourd, great for healthy cooking.', 100, 'kg', true, false),
('Bottle Gourd', 'Vegetables', 30.00, '/Vegetables/Bottle Gourd.png', 'Hydrating and fresh bottle gourd.', 100, 'kg', true, false),
('Brinjal', 'Vegetables', 40.00, '/Vegetables/Brinjal.png', 'Fresh purple brinjals, perfect for curries.', 100, 'kg', true, false),
('Cabbage', 'Vegetables', 25.00, '/Vegetables/Cabbage.png', 'Crunchy and fresh green cabbage.', 100, 'kg', true, false),
('Capsicum', 'Vegetables', 80.00, '/Vegetables/Capsicum.png', 'Fresh green capsicum, perfect for salads.', 100, 'kg', true, false),
('Carrot', 'Vegetables', 60.00, '/Vegetables/Carrot.png', 'Sweet and crunchy farm carrots.', 100, 'kg', true, false),
('Cauliflower', 'Vegetables', 45.00, '/Vegetables/Cauliflower.png', 'Fresh white cauliflower heads.', 100, 'kg', true, false),
('Coriander Leaves', 'Vegetables', 10.00, '/Vegetables/Coriander Leaves.png', 'Fresh and aromatic coriander leaves.', 100, 'bundle', true, false),
('Drumstick', 'Vegetables', 15.00, '/Vegetables/Drumstick.png', 'Fresh drumsticks for sambar and curries.', 100, 'piece', true, false),
('Green Chilli', 'Vegetables', 40.00, '/Vegetables/Green Chilli.png', 'Spicy fresh green chillies.', 100, 'kg', true, false),
('Ladies Finger', 'Vegetables', 35.00, '/Vegetables/Ladies Finger (Okra).png', 'Fresh okra, perfect for fry or curry.', 100, 'kg', true, false),
('Mint Leaves', 'Vegetables', 10.00, '/Vegetables/Mint Leaves.png', 'Fresh mint leaves for chutney and tea.', 100, 'bundle', true, false),
('Onion', 'Vegetables', 45.00, '/Vegetables/Onion.png', 'Farm fresh red onions.', 100, 'kg', true, false),
('Potato', 'Vegetables', 35.00, '/Vegetables/Potato.png', 'Quality potatoes from local farms.', 100, 'kg', true, false),
('Pumpkin', 'Vegetables', 30.00, '/Vegetables/Pumpkin.png', 'Sweet and fresh orange pumpkin.', 100, 'kg', true, false),
('Radish', 'Vegetables', 25.00, '/Vegetables/Radish.png', 'Fresh white radish with greens.', 100, 'kg', true, false),
('Snake Gourd', 'Vegetables', 30.00, '/Vegetables/Snake Gourd.png', 'Fresh and long snake gourds.', 100, 'kg', true, false),
('Spinach', 'Vegetables', 15.00, '/Vegetables/Spinach.png', 'Nutritious green spinach leaves.', 100, 'bundle', true, false),
('Tomato', 'Vegetables', 30.00, '/Vegetables/Tomato.png', 'Juicy red farm tomatoes.', 100, 'kg', true, false),
('Garlic', 'Vegetables', 120.00, '/Vegetables/Garlic.png', 'Fresh organic garlic bulbs, essential for seasoning.', 100, 'kg', true, false),
('Ginger', 'Vegetables', 100.00, '/Vegetables/Ginger.png', 'Fresh and aromatic ginger root.', 100, 'kg', true, false),
('Lemon', 'Vegetables', 5.00, '/Vegetables/Lemon.png', 'Juicy fresh lemons, rich in Vitamin C.', 100, 'piece', true, false),
('French Beans', 'Vegetables', 60.00, '/Vegetables/French Beans.png', 'Fresh green french beans, crunchy and sweet.', 100, 'kg', true, false),
('Green Peas', 'Vegetables', 80.00, '/Vegetables/Green Peas.png', 'Fresh green peas, sweet and nutritious.', 100, 'kg', true, false),
('Cucumber', 'Vegetables', 30.00, '/Vegetables/Cucumber.png', 'Cool and hydrating fresh cucumbers.', 100, 'kg', true, false),
('Sweet Potato', 'Vegetables', 45.00, '/Vegetables/Sweet Potato.png', 'Nutritious and sweet farm-grown sweet potatoes.', 100, 'kg', true, false),
('Broccoli', 'Vegetables', 150.00, '/Vegetables/Broccoli.png', 'Fresh green broccoli, high in fiber and vitamins.', 100, 'kg', true, false),
('Mushroom', 'Vegetables', 50.00, '/Vegetables/Mushroom.png', 'Fresh button mushrooms, perfect for varied dishes.', 100, 'pack', true, false),
('Ridge Gourd', 'Vegetables', 35.00, '/Vegetables/Ridge Gourd.png', 'Fresh and healthy ridge gourd (peerkangai).', 100, 'kg', true, false),
('Fenugreek Leaves', 'Vegetables', 15.00, '/Vegetables/Fenugreek Leaves.png', 'Fresh methi leaves, aromatic and healthy.', 100, 'bundle', true, false),
('Curry Leaves', 'Vegetables', 5.00, '/Vegetables/Curry Leaves.png', 'Fresh and aromatic curry leaves.', 100, 'bundle', true, false),

-- FRUITS (19 items)
('Apple', 'Fruits', 180.00, '/Fruits/Apple.png', 'Sweet and crunchy premium apples.', 100, 'kg', true, true),
('Banana', 'Fruits', 60.00, '/Fruits/Banana.png', 'Ripe and sweet yellow bananas.', 100, 'dozen', true, false),
('Custard Apple', 'Fruits', 120.00, '/Fruits/Custard Apple.png', 'Sweet and creamy custard apples.', 100, 'kg', true, true),
('Grapes', 'Fruits', 90.00, '/Fruits/Grapes.png', 'Fresh green seedless grapes.', 100, 'kg', true, false),
('Guava', 'Fruits', 70.00, '/Fruits/Guava.png', 'Fresh and sweet pink guavas.', 100, 'kg', true, false),
('Mango', 'Fruits', 150.00, '/Fruits/Mango.png', 'Premium Alphonso mangoes.', 100, 'kg', true, true),
('Muskmelon', 'Fruits', 50.00, '/Fruits/Muskmelon.png', 'Sweet and hydrating muskmelons.', 100, 'kg', true, true),
('Orange', 'Fruits', 110.00, '/Fruits/Orange.png', 'Juicy and vitamin C rich oranges.', 100, 'kg', true, false),
('Papaya', 'Fruits', 40.00, '/Fruits/Papaya.png', 'Ripe and sweet farm papayas.', 100, 'kg', true, false),
('Pineapple', 'Fruits', 60.00, '/Fruits/Pineapple.png', 'Sweet and tangy fresh pineapples.', 100, 'piece', true, false),
('Pomegranate', 'Fruits', 160.00, '/Fruits/Pomegranate.png', 'Premium red pomegranates.', 100, 'kg', true, false),
('Sapota', 'Fruits', 60.00, '/Fruits/Sapota (Chikoo).png', 'Sweet and grainy sapota (chikoo).', 100, 'kg', true, false),
('Sweet Lime', 'Fruits', 80.00, '/Fruits/Sweet Lime (Mosambi).png', 'Fresh and juicy mosambi.', 100, 'kg', true, false),
('Watermelon', 'Fruits', 40.00, '/Fruits/Watermelon.png', 'Refreshing sweet watermelons.', 100, 'piece', true, true),
('Strawberry', 'Fruits', 150.00, '/Fruits/Strawberry.png', 'Fresh and juicy red strawberries.', 100, 'pack', true, true),
('Blueberry', 'Fruits', 250.00, '/Fruits/Blueberry.png', 'Fresh antioxidant-rich blueberries.', 100, 'pack', true, true),
('Kiwi', 'Fruits', 120.00, '/Fruits/Kiwi.png', 'Zesty and vitamin-rich fresh kiwi.', 100, 'kg', true, false),
('Dragon Fruit', 'Fruits', 80.00, '/Fruits/Dragon Fruit.png', 'Exotic and healthy dragon fruit.', 100, 'piece', true, false),
('Avocado', 'Fruits', 180.00, '/Fruits/Avocado.png', 'Creamy and nutritious fresh avocados.', 100, 'kg', true, false),

-- VALLUVAM PRODUCTS (10 items)
('Cold Pressed Coconut Oil', 'Valluvam Products', 280, '/Valluvam/coconut-1L.jpg', 'Pure, unrefined cold pressed coconut oil.', 100, '1L', true, false),
('Cold Pressed Groundnut Oil', 'Valluvam Products', 320, '/Valluvam/ground-1L.jpg', 'Traditional cold pressed groundnut oil.', 100, '1L', true, false),
('Cold Pressed Sesame Oil', 'Valluvam Products', 450, '/Valluvam/sesame-1L.jpg', 'Rich and aromatic cold pressed sesame oil.', 100, '1L', true, false),
('Natural Palm Jaggery', 'Valluvam Products', 180, '/Valluvam/products-plam.jpg', 'Authentic palm jaggery with no additives.', 100, '500g', true, false),
('Wild Forest Honey', 'Valluvam Products', 350, '/Valluvam/products-naatu.jpg', 'Raw, unprocessed honey from deep forests.', 100, '500g', true, false),
('Traditional Millets Mix', 'Valluvam Products', 120, '/Valluvam/millets.jpg', 'High-fiber traditional millets breakfast mix.', 100, '500g', true, false),
('Premium Cashew Nuts', 'Valluvam Products', 450, '/Valluvam/nuts.jpg', 'Large, crunchy premium quality cashew nuts.', 100, '250g', true, false),
('Hand-ground Turmeric Powder', 'Valluvam Products', 85, '/Valluvam/spieces.jpg', 'Pure turmeric powder with high curcumin content.', 100, '200g', true, false),
('Natural Palm Sugar', 'Valluvam Products', 220, '/Valluvam/products-pine.jpg', 'Healthy alternative to white sugar.', 100, '500g', true, false),
('A2 Desi Cow Ghee', 'Valluvam Products', 650, '/Valluvam/products-2.jpg', 'Pure A2 ghee made using traditional bilona method.', 100, '500ml', true, false);
