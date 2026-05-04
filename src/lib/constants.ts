export const FALLBACK_PRODUCTS = [
  // VEGETABLES (20)
  { id: 'v-1', name: 'Beetroot', category: 'Vegetables', price: 45.00, image_url: '/Vegetables/Beetroot.png', description: 'Fresh and earthy beetroots, rich in nutrients.', unit: 'kg', pairsWith: ['v-7', 'v-15'], tags: ['daily'] },
  { id: 'v-2', name: 'Bitter Gourd', category: 'Vegetables', price: 35.00, image_url: '/Vegetables/Bitter Gourd.png', description: 'Fresh bitter gourd, great for healthy cooking.', unit: 'kg', pairsWith: ['v-14', 'v-11'], tags: ['healthy'] },
  { id: 'v-3', name: 'Bottle Gourd', category: 'Vegetables', price: 30.00, image_url: '/Vegetables/Bottle Gourd.png', description: 'Hydrating and fresh bottle gourd.', unit: 'kg', pairsWith: ['v-14', 'v-11'], tags: ['light'] },
  { id: 'v-4', name: 'Brinjal', category: 'Vegetables', price: 40.00, image_url: '/Vegetables/Brinjal.png', description: 'Fresh purple brinjals, perfect for curries.', unit: 'kg', pairsWith: ['v-14', 'v-11'], tags: ['curry'] },
  { id: 'v-5', name: 'Cabbage', category: 'Vegetables', price: 25.00, image_url: '/Vegetables/Cabbage.png', description: 'Crunchy and fresh green cabbage.', unit: 'kg', pairsWith: ['v-7', 'v-11'], tags: ['daily'] },
  { id: 'v-6', name: 'Capsicum', category: 'Vegetables', price: 80.00, image_url: '/Vegetables/Capsicum.png', description: 'Fresh green capsicum, perfect for salads.', unit: 'kg', pairsWith: ['v-14', 'v-15'], tags: ['salad', 'continental'] },
  { id: 'v-7', name: 'Carrot', category: 'Vegetables', price: 60.00, image_url: '/Vegetables/Carrot.png', description: 'Sweet and crunchy farm carrots.', unit: 'kg', pairsWith: ['v-1', 'v-15'], tags: ['daily', 'salad'] },
  { id: 'v-8', name: 'Cauliflower', category: 'Vegetables', price: 45.00, image_url: '/Vegetables/Cauliflower.png', description: 'Fresh white cauliflower heads.', unit: 'kg', pairsWith: ['v-15', 'v-11'], tags: ['curry'] },
  { id: 'v-9', name: 'Coriander Leaves', category: 'Vegetables', price: 10.00, image_url: '/Vegetables/Coriander Leaves.png', description: 'Fresh and aromatic coriander leaves.', unit: 'bundle', pairsWith: ['v-20', 'v-11'], tags: ['daily', 'essential'] },
  { id: 'v-10', name: 'Drumstick', category: 'Vegetables', price: 15.00, image_url: '/Vegetables/Drumstick.png', description: 'Fresh drumsticks for sambar and curries.', unit: 'piece', pairsWith: ['v-20', 'v-14'], tags: ['sambar'] },
  { id: 'v-11', name: 'Green Chilli', category: 'Vegetables', price: 40.00, image_url: '/Vegetables/Green Chilli.png', description: 'Spicy fresh green chillies.', unit: 'kg', pairsWith: ['v-14', 'v-20'], tags: ['essential', 'daily'] },
  { id: 'v-12', name: 'Ladies Finger', category: 'Vegetables', price: 35.00, image_url: '/Vegetables/Ladies Finger (Okra).png', description: 'Fresh okra, perfect for fry or curry.', unit: 'kg', pairsWith: ['v-14', 'v-11'], tags: ['daily'] },
  { id: 'v-13', name: 'Mint Leaves', category: 'Vegetables', price: 10.00, image_url: '/Vegetables/Mint Leaves.png', description: 'Fresh mint leaves for chutney and tea.', unit: 'bundle', pairsWith: ['v-11', 'v-14'], tags: ['daily', 'essential'] },
  { id: 'v-14', name: 'Onion', category: 'Vegetables', price: 45.00, image_url: '/Vegetables/Onion.png', description: 'Farm fresh red onions.', unit: 'kg', pairsWith: ['v-15', 'v-20'], tags: ['essential', 'daily'] },
  { id: 'v-15', name: 'Potato', category: 'Vegetables', price: 35.00, image_url: '/Vegetables/Potato.png', description: 'Quality potatoes from local farms.', unit: 'kg', pairsWith: ['v-14', 'v-11'], tags: ['essential', 'daily'] },
  { id: 'v-16', name: 'Pumpkin', category: 'Vegetables', price: 30.00, image_url: '/Vegetables/Pumpkin.png', description: 'Sweet and fresh orange pumpkin.', unit: 'kg', pairsWith: ['v-14', 'v-20'], tags: ['traditional'] },
  { id: 'v-17', name: 'Radish', category: 'Vegetables', price: 25.00, image_url: '/Vegetables/Radish.png', description: 'Fresh white radish with greens.', unit: 'kg', pairsWith: ['v-14', 'v-11'], tags: ['daily'] },
  { id: 'v-18', name: 'Snake Gourd', category: 'Vegetables', price: 30.00, image_url: '/Vegetables/Snake Gourd.png', description: 'Fresh and long snake gourds.', unit: 'kg', pairsWith: ['v-14', 'v-11'], tags: ['traditional'] },
  { id: 'v-19', name: 'Spinach', category: 'Vegetables', price: 15.00, image_url: '/Vegetables/Spinach.png', description: 'Nutritious green spinach leaves.', unit: 'bundle', pairsWith: ['v-15', 'v-14'], tags: ['healthy', 'daily'] },
  { id: 'v-20', name: 'Tomato', category: 'Vegetables', price: 30.00, image_url: '/Vegetables/Tomato.png', description: 'Juicy red farm tomatoes.', unit: 'kg', pairsWith: ['v-14', 'v-11'], tags: ['essential', 'daily'] },
  
  // FRUITS (14)
  { id: 'f-1', name: 'Apple', category: 'Fruits', price: 180.00, image_url: '/Fruits/Apple.png', description: 'Sweet and crunchy premium apples.', unit: 'kg', is_seasonal: true, pairsWith: ['f-2', 'f-11'], tags: ['breakfast', 'healthy'] },
  { id: 'f-2', name: 'Banana', category: 'Fruits', price: 60.00, image_url: '/Fruits/Banana.png', description: 'Ripe and sweet yellow bananas.', unit: 'dozen', pairsWith: ['f-1', 'f-9'], tags: ['breakfast', 'essential'] },
  { id: 'f-3', name: 'Custard Apple', category: 'Fruits', price: 120.00, image_url: '/Fruits/Custard Apple.png', description: 'Sweet and creamy custard apples.', unit: 'kg', is_seasonal: true, pairsWith: ['f-1', 'f-6'], tags: ['seasonal'] },
  { id: 'f-4', name: 'Grapes', category: 'Fruits', price: 90.00, image_url: '/Fruits/Grapes.png', description: 'Fresh green seedless grapes.', unit: 'kg', pairsWith: ['f-1', 'f-14'], tags: ['snack'] },
  { id: 'f-5', name: 'Guava', category: 'Fruits', price: 70.00, image_url: '/Fruits/Guava.png', description: 'Fresh and sweet pink guavas.', unit: 'kg', pairsWith: ['f-1', 'f-9'], tags: ['healthy'] },
  { id: 'f-6', name: 'Mango', category: 'Fruits', price: 150.00, image_url: '/Fruits/Mango.png', description: 'Premium Alphonso mangoes.', unit: 'kg', is_seasonal: true, pairsWith: ['f-14', 'f-2'], tags: ['seasonal', 'favorite'] },
  { id: 'f-7', name: 'Muskmelon', category: 'Fruits', price: 50.00, image_url: '/Fruits/Muskmelon.png', description: 'Sweet and hydrating muskmelons.', unit: 'kg', is_seasonal: true, pairsWith: ['f-14', 'f-1'], tags: ['seasonal', 'hydrating'] },
  { id: 'f-8', name: 'Orange', category: 'Fruits', price: 110.00, image_url: '/Fruits/Orange.png', description: 'Juicy and vitamin C rich oranges.', unit: 'kg', pairsWith: ['f-13', 'f-1'], tags: ['breakfast', 'juice'] },
  { id: 'f-9', name: 'Papaya', category: 'Fruits', price: 40.00, image_url: '/Fruits/Papaya.png', description: 'Ripe and sweet farm papayas.', unit: 'kg', pairsWith: ['f-13', 'f-1'], tags: ['breakfast', 'healthy'] },
  { id: 'f-10', name: 'Pineapple', category: 'Fruits', price: 60.00, image_url: '/Fruits/Pineapple.png', description: 'Sweet and tangy fresh pineapples.', unit: 'piece', pairsWith: ['f-1', 'f-8'], tags: ['seasonal', 'juice'] },
  { id: 'f-11', name: 'Pomegranate', category: 'Fruits', price: 160.00, image_url: '/Fruits/Pomegranate.png', description: 'Premium red pomegranates.', unit: 'kg', pairsWith: ['f-1', 'f-4'], tags: ['premium', 'healthy'] },
  { id: 'f-12', name: 'Sapota', category: 'Fruits', price: 60.00, image_url: '/Fruits/Sapota (Chikoo).png', description: 'Sweet and grainy sapota (chikoo).', unit: 'kg', pairsWith: ['f-2', 'f-1'], tags: ['sweet'] },
  { id: 'f-13', name: 'Sweet Lime', category: 'Fruits', price: 80.00, image_url: '/Fruits/Sweet Lime (Mosambi).png', description: 'Fresh and juicy mosambi.', unit: 'kg', pairsWith: ['f-8', 'f-9'], tags: ['juice', 'healthy'] },
  { id: 'f-14', name: 'Watermelon', category: 'Fruits', price: 40.00, image_url: '/Fruits/Watermelon.png', description: 'Refreshing sweet watermelons.', unit: 'piece', is_seasonal: true, pairsWith: ['f-7', 'f-10'], tags: ['seasonal', 'hydrating'] },
  
  // VALLUVAM PRODUCTS (10)
  { id: 'val-1', name: 'Coconut Oil', category: 'Valluvam Products', price: 280, image_url: '/Valluvam/coconut-1L.jpg', description: 'Pure, unrefined cold pressed coconut oil.', unit: '1L', pairsWith: ['v-11', 'v-14'], tags: ['cooking', 'essential'] },
  { id: 'val-2', name: 'Groundnut Oil', category: 'Valluvam Products', price: 320, image_url: '/Valluvam/ground-1L.jpg', description: 'Traditional cold pressed groundnut oil.', unit: '1L', pairsWith: ['v-15', 'v-20'], tags: ['cooking', 'essential'] },
  { id: 'val-3', name: 'Sesame Oil', category: 'Valluvam Products', price: 450, image_url: '/Valluvam/sesame-1L.jpg', description: 'Rich and aromatic cold pressed sesame oil.', unit: '1L', pairsWith: ['v-11', 'v-20'], tags: ['cooking', 'healthy'] },
  { id: 'val-4', name: 'Palm Jaggery', category: 'Valluvam Products', price: 180, image_url: '/Valluvam/products-plam.jpg', description: 'Authentic palm jaggery with no additives.', unit: '500g', pairsWith: ['val-9', 'val-10'], tags: ['sweetener', 'healthy'] },
  { id: 'val-5', name: 'Forest Honey', category: 'Valluvam Products', price: 350, image_url: '/Valluvam/products-naatu.jpg', description: 'Raw, unprocessed honey from deep forests.', unit: '500g', pairsWith: ['f-1', 'f-2'], tags: ['superfood', 'healthy'] },
  { id: 'val-6', name: 'Traditional Millets', category: 'Valluvam Products', price: 120, image_url: '/Valluvam/millets.jpg', description: 'High-fiber traditional millets breakfast mix.', unit: '500g', pairsWith: ['val-10', 'val-1'], tags: ['breakfast', 'healthy'] },
  { id: 'val-7', name: 'Cashew Nuts', category: 'Valluvam Products', price: 450, image_url: '/Valluvam/nuts.jpg', description: 'Large, crunchy premium quality cashew nuts.', unit: '250g', pairsWith: ['val-5', 'f-4'], tags: ['snack', 'premium'] },
  { id: 'val-8', name: 'Turmeric Powder', category: 'Valluvam Products', price: 85, image_url: '/Valluvam/spieces.jpg', description: 'Pure turmeric powder with high curcumin content.', unit: '200g', pairsWith: ['val-1', 'val-10'], tags: ['spice', 'essential'] },
  { id: 'val-9', name: 'Natural Palm Sugar', category: 'Valluvam Products', price: 220, image_url: '/Valluvam/products-pine.jpg', description: 'Healthy alternative to white sugar.', unit: '500g', pairsWith: ['val-6', 'val-5'], tags: ['sweetener', 'healthy'] },
  { id: 'val-10', name: 'Pure Desi Ghee', category: 'Valluvam Products', price: 650, image_url: '/Valluvam/products-18.jpg', description: 'Pure A2 ghee made using traditional bilona method.', unit: '500ml', pairsWith: ['val-6', 'v-15'], tags: ['superfood', 'essential'] }
].map(p => ({ ...p, stock: 100, is_active: true }));

export const VERIFIED_INVENTORY = [
  // VEGETABLES (20 items)
  { name: 'Beetroot', category: 'Vegetables', price: 45.00, image_url: '/Vegetables/Beetroot.png', description: 'Fresh and earthy beetroots, rich in nutrients.', stock: 100, unit: 'kg', is_active: true },
  { name: 'Bitter Gourd', category: 'Vegetables', price: 35.00, image_url: '/Vegetables/Bitter Gourd.png', description: 'Fresh bitter gourd, great for healthy cooking.', stock: 100, unit: 'kg', is_active: true },
  { name: 'Bottle Gourd', category: 'Vegetables', price: 30.00, image_url: '/Vegetables/Bottle Gourd.png', description: 'Hydrating and fresh bottle gourd.', stock: 100, unit: 'kg', is_active: true },
  { name: 'Brinjal', category: 'Vegetables', price: 40.00, image_url: '/Vegetables/Brinjal.png', description: 'Fresh purple brinjals, perfect for curries.', stock: 100, unit: 'kg', is_active: true },
  { name: 'Cabbage', category: 'Vegetables', price: 25.00, image_url: '/Vegetables/Cabbage.png', description: 'Crunchy and fresh green cabbage.', stock: 100, unit: 'kg', is_active: true },
  { name: 'Capsicum', category: 'Vegetables', price: 80.00, image_url: '/Vegetables/Capsicum.png', description: 'Fresh green capsicum, perfect for salads.', stock: 100, unit: 'kg', is_active: true },
  { name: 'Carrot', category: 'Vegetables', price: 60.00, image_url: '/Vegetables/Carrot.png', description: 'Sweet and crunchy farm carrots.', stock: 100, unit: 'kg', is_active: true },
  { name: 'Cauliflower', category: 'Vegetables', price: 45.00, image_url: '/Vegetables/Cauliflower.png', description: 'Fresh white cauliflower heads.', stock: 100, unit: 'kg', is_active: true },
  { name: 'Coriander Leaves', category: 'Vegetables', price: 10.00, image_url: '/Vegetables/Coriander Leaves.png', description: 'Fresh and aromatic coriander leaves.', stock: 100, unit: 'bundle', is_active: true },
  { name: 'Drumstick', category: 'Vegetables', price: 15.00, image_url: '/Vegetables/Drumstick.png', description: 'Fresh drumsticks for sambar and curries.', stock: 100, unit: 'piece', is_active: true },
  { name: 'Green Chilli', category: 'Vegetables', price: 40.00, image_url: '/Vegetables/Green Chilli.png', description: 'Spicy fresh green chillies.', stock: 100, unit: 'kg', is_active: true },
  { name: 'Ladies Finger', category: 'Vegetables', price: 35.00, image_url: '/Vegetables/Ladies Finger (Okra).png', description: 'Fresh okra, perfect for fry or curry.', stock: 100, unit: 'kg', is_active: true },
  { name: 'Mint Leaves', category: 'Vegetables', price: 10.00, image_url: '/Vegetables/Mint Leaves.png', description: 'Fresh mint leaves for chutney and tea.', stock: 100, unit: 'bundle', is_active: true },
  { name: 'Onion', category: 'Vegetables', price: 45.00, image_url: '/Vegetables/Onion.png', description: 'Farm fresh red onions.', stock: 100, unit: 'kg', is_active: true },
  { name: 'Potato', category: 'Vegetables', price: 35.00, image_url: '/Vegetables/Potato.png', description: 'Quality potatoes from local farms.', stock: 100, unit: 'kg', is_active: true },
  { name: 'Pumpkin', category: 'Vegetables', price: 30.00, image_url: '/Vegetables/Pumpkin.png', description: 'Sweet and fresh orange pumpkin.', stock: 100, unit: 'kg', is_active: true },
  { name: 'Radish', category: 'Vegetables', price: 25.00, image_url: '/Vegetables/Radish.png', description: 'Fresh white radish with greens.', stock: 100, unit: 'kg', is_active: true },
  { name: 'Snake Gourd', category: 'Vegetables', price: 30.00, image_url: '/Vegetables/Snake Gourd.png', description: 'Fresh and long snake gourds.', stock: 100, unit: 'kg', is_active: true },
  { name: 'Spinach', category: 'Vegetables', price: 15.00, image_url: '/Vegetables/Spinach.png', description: 'Nutritious green spinach leaves.', stock: 100, unit: 'bundle', is_active: true },
  { name: 'Tomato', category: 'Vegetables', price: 30.00, image_url: '/Vegetables/Tomato.png', description: 'Juicy red farm tomatoes.', stock: 100, unit: 'kg', is_active: true },
  
  // FRUITS (14 items)
  { name: 'Apple', category: 'Fruits', price: 180.00, image_url: '/Fruits/Apple.png', description: 'Sweet and crunchy premium apples.', stock: 100, unit: 'kg', is_active: true, is_seasonal: true },
  { name: 'Banana', category: 'Fruits', price: 60.00, image_url: '/Fruits/Banana.png', description: 'Ripe and sweet yellow bananas.', stock: 100, unit: 'dozen', is_active: true },
  { name: 'Custard Apple', category: 'Fruits', price: 120.00, image_url: '/Fruits/Custard Apple.png', description: 'Sweet and creamy custard apples.', stock: 100, unit: 'kg', is_active: true, is_seasonal: true },
  { name: 'Grapes', category: 'Fruits', price: 90.00, image_url: '/Fruits/Grapes.png', description: 'Fresh green seedless grapes.', stock: 100, unit: 'kg', is_active: true },
  { name: 'Guava', category: 'Fruits', price: 70.00, image_url: '/Fruits/Guava.png', description: 'Fresh and sweet pink guavas.', stock: 100, unit: 'kg', is_active: true },
  { name: 'Mango', category: 'Fruits', price: 150.00, image_url: '/Fruits/Mango.png', description: 'Premium Alphonso mangoes.', stock: 100, unit: 'kg', is_active: true, is_seasonal: true },
  { name: 'Muskmelon', category: 'Fruits', price: 50.00, image_url: '/Fruits/Muskmelon.png', description: 'Sweet and hydrating muskmelons.', stock: 100, unit: 'kg', is_active: true, is_seasonal: true },
  { name: 'Orange', category: 'Fruits', price: 110.00, image_url: '/Fruits/Orange.png', description: 'Juicy and vitamin C rich oranges.', stock: 100, unit: 'kg', is_active: true },
  { name: 'Papaya', category: 'Fruits', price: 40.00, image_url: '/Fruits/Papaya.png', description: 'Ripe and sweet farm papayas.', stock: 100, unit: 'kg', is_active: true },
  { name: 'Pineapple', category: 'Fruits', price: 60.00, image_url: '/Fruits/Pineapple.png', description: 'Sweet and tangy fresh pineapples.', stock: 100, unit: 'piece', is_active: true },
  { name: 'Pomegranate', category: 'Fruits', price: 160.00, image_url: '/Fruits/Pomegranate.png', description: 'Premium red pomegranates.', stock: 100, unit: 'kg', is_active: true },
  { name: 'Sapota', category: 'Fruits', price: 60.00, image_url: '/Fruits/Sapota (Chikoo).png', description: 'Sweet and grainy sapota (chikoo).', stock: 100, unit: 'kg', is_active: true },
  { name: 'Sweet Lime', category: 'Fruits', price: 80.00, image_url: '/Fruits/Sweet Lime (Mosambi).png', description: 'Fresh and juicy mosambi.', stock: 100, unit: 'kg', is_active: true },
  { name: 'Watermelon', category: 'Fruits', price: 40.00, image_url: '/Fruits/Watermelon.png', description: 'Refreshing sweet watermelons.', stock: 100, unit: 'piece', is_active: true, is_seasonal: true },
  
  // VALLUVAM PRODUCTS (10 items)
  { name: 'Cold Pressed Coconut Oil', category: 'Valluvam Products', price: 280, unit: '1L', stock: 100, description: 'Pure, unrefined cold pressed coconut oil.', image_url: '/Valluvam/coconut-1L.jpg', is_active: true },
  { name: 'Cold Pressed Groundnut Oil', category: 'Valluvam Products', price: 320, unit: '1L', stock: 100, description: 'Traditional cold pressed groundnut oil.', image_url: '/Valluvam/ground-1L.jpg', is_active: true },
  { name: 'Cold Pressed Sesame Oil', category: 'Valluvam Products', price: 450, unit: '1L', stock: 100, description: 'Rich and aromatic cold pressed sesame oil.', image_url: '/Valluvam/sesame-1L.jpg', is_active: true },
  { name: 'Natural Palm Jaggery', category: 'Valluvam Products', price: 180, unit: '500g', stock: 100, description: 'Authentic palm jaggery with no additives.', image_url: '/Valluvam/products-plam.jpg', is_active: true },
  { name: 'Wild Forest Honey', category: 'Valluvam Products', price: 350, unit: '500g', stock: 100, description: 'Raw, unprocessed honey from deep forests.', image_url: '/Valluvam/products-naatu.jpg', is_active: true },
  { name: 'Traditional Millets Mix', category: 'Valluvam Products', price: 120, unit: '500g', stock: 100, description: 'High-fiber traditional millets breakfast mix.', image_url: '/Valluvam/millets.jpg', is_active: true },
  { name: 'Premium Cashew Nuts', category: 'Valluvam Products', price: 450, unit: '250g', stock: 100, description: 'Large, crunchy premium quality cashew nuts.', image_url: '/Valluvam/nuts.jpg', is_active: true },
  { name: 'Hand-ground Turmeric Powder', category: 'Valluvam Products', price: 85, unit: '200g', stock: 100, description: 'Pure turmeric powder with high curcumin content.', image_url: '/Valluvam/spieces.jpg', is_active: true },
  { name: 'Natural Palm Sugar', category: 'Valluvam Products', price: 220, unit: '500g', stock: 100, description: 'Healthy alternative to white sugar.', image_url: '/Valluvam/products-pine.jpg', is_active: true },
  { name: 'A2 Desi Cow Ghee', category: 'Valluvam Products', price: 650, unit: '500ml', stock: 100, description: 'Pure A2 ghee made using traditional bilona method.', image_url: '/Valluvam/products-18.jpg', is_active: true }
];

export const getRelatedFallback = (category: string, excludeId: string, limit: number = 8) => {
  return FALLBACK_PRODUCTS
    .filter(p => p.category === category && p.id !== excludeId)
    .slice(0, limit);
};

export const getSmartRecommendations = (product: any, limit: number = 24) => {
  if (!product) return FALLBACK_PRODUCTS.slice(0, limit);
  // 1. Get explicitly paired products
  const paired = FALLBACK_PRODUCTS.filter(p => product.pairsWith?.includes(p.id));
  
  // 2. Get same-tag products
  const tagged = FALLBACK_PRODUCTS.filter(p => 
    p.id !== product.id && 
    p.tags?.some(tag => product.tags?.includes(tag)) &&
    !paired.some(pp => pp.id === p.id)
  );
  
  // 3. Get same-category products
  const categorized = FALLBACK_PRODUCTS.filter(p => 
    p.id !== product.id && 
    p.category === product.category &&
    !paired.some(pp => pp.id === p.id) &&
    !tagged.some(pp => pp.id === p.id)
  );
  
  return [...paired, ...tagged, ...categorized].slice(0, limit);
};

export const getTrendingProducts = (limit: number = 12, excludeIds: string[] = []) => {
  // Simple trending logic: mix of different categories and premium tags
  return FALLBACK_PRODUCTS
    .filter(p => !excludeIds.includes(p.id))
    .sort(() => 0.5 - Math.random()) // Shuffle for variety
    .slice(0, limit);
};
