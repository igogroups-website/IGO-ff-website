export const FALLBACK_PRODUCTS = [
  // VEGETABLES (20)
  { id: 'v-1', name: 'Beetroot', category: 'Vegetables', price: 45.00, image_url: 'https://images.unsplash.com/photo-1590518712762-b9e737756f7e?q=80&w=800&auto=format&fit=crop', description: 'Fresh and earthy beetroots, rich in nutrients.', unit: 'kg', pairsWith: ['v-7', 'v-15'], tags: ['daily'] },
  { id: 'v-2', name: 'Bitter Gourd', category: 'Vegetables', price: 35.00, image_url: 'https://images.unsplash.com/photo-1589146182301-447551064609?q=80&w=800&auto=format&fit=crop', description: 'Fresh bitter gourd, great for healthy cooking.', unit: 'kg', pairsWith: ['v-14', 'v-11'], tags: ['healthy'] },
  { id: 'v-3', name: 'Bottle Gourd', category: 'Vegetables', price: 30.00, image_url: 'https://images.unsplash.com/photo-1594282486512-ad58f49bad70?q=80&w=800&auto=format&fit=crop', description: 'Hydrating and fresh bottle gourd.', unit: 'kg', pairsWith: ['v-14', 'v-11'], tags: ['light'] },
  { id: 'v-4', name: 'Brinjal', category: 'Vegetables', price: 40.00, image_url: 'https://images.unsplash.com/photo-1510444641151-579b29150030?q=80&w=800&auto=format&fit=crop', description: 'Fresh purple brinjals, perfect for curries.', unit: 'kg', pairsWith: ['v-14', 'v-11'], tags: ['curry'] },
  { id: 'v-5', name: 'Cabbage', category: 'Vegetables', price: 25.00, image_url: 'https://images.unsplash.com/photo-1591586121040-298307c037f3?q=80&w=800&auto=format&fit=crop', description: 'Crunchy and fresh green cabbage.', unit: 'kg', pairsWith: ['v-7', 'v-11'], tags: ['daily'] },
  { id: 'v-6', name: 'Capsicum', category: 'Vegetables', price: 80.00, image_url: 'https://images.unsplash.com/photo-1563513307168-a4262ed77fd1?q=80&w=800&auto=format&fit=crop', description: 'Fresh green capsicum, perfect for salads.', unit: 'kg', pairsWith: ['v-14', 'v-15'], tags: ['salad', 'continental'] },
  { id: 'v-7', name: 'Carrot', category: 'Vegetables', price: 60.00, image_url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=800&auto=format&fit=crop', description: 'Sweet and crunchy farm carrots.', unit: 'kg', pairsWith: ['v-1', 'v-15'], tags: ['daily', 'salad'] },
  { id: 'v-8', name: 'Cauliflower', category: 'Vegetables', price: 45.00, image_url: 'https://images.unsplash.com/photo-1510627489930-0c1b0ba05417?q=80&w=800&auto=format&fit=crop', description: 'Fresh white cauliflower heads.', unit: 'kg', pairsWith: ['v-15', 'v-11'], tags: ['curry'] },
  { id: 'v-9', name: 'Coriander Leaves', category: 'Vegetables', price: 10.00, image_url: 'https://images.unsplash.com/photo-1588877329710-d86f787b83f1?q=80&w=800&auto=format&fit=crop', description: 'Fresh and aromatic coriander leaves.', unit: 'bundle', pairsWith: ['v-20', 'v-11'], tags: ['daily', 'essential'] },
  { id: 'v-10', name: 'Drumstick', category: 'Vegetables', price: 15.00, image_url: 'https://images.unsplash.com/photo-1592394933243-951d39a51535?q=80&w=800&auto=format&fit=crop', description: 'Fresh drumsticks for sambar and curries.', unit: 'piece', pairsWith: ['v-20', 'v-14'], tags: ['sambar'] },
  { id: 'v-11', name: 'Green Chilli', category: 'Vegetables', price: 40.00, image_url: 'https://images.unsplash.com/photo-1589252086386-81589f81f1e8?q=80&w=800&auto=format&fit=crop', description: 'Spicy fresh green chillies.', unit: 'kg', pairsWith: ['v-14', 'v-20'], tags: ['essential', 'daily'] },
  { id: 'v-12', name: 'Ladies Finger', category: 'Vegetables', price: 35.00, image_url: 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?q=80&w=800&auto=format&fit=crop', description: 'Fresh okra, perfect for fry or curry.', unit: 'kg', pairsWith: ['v-14', 'v-11'], tags: ['daily'] },
  { id: 'v-13', name: 'Mint Leaves', category: 'Vegetables', price: 10.00, image_url: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=800&auto=format&fit=crop', description: 'Fresh mint leaves for chutney and tea.', unit: 'bundle', pairsWith: ['v-11', 'v-14'], tags: ['daily', 'essential'] },
  { id: 'v-14', name: 'Onion', category: 'Vegetables', price: 45.00, image_url: 'https://images.unsplash.com/photo-1508747703725-71977713d540?q=80&w=800&auto=format&fit=crop', description: 'Farm fresh red onions.', unit: 'kg', pairsWith: ['v-15', 'v-20'], tags: ['essential', 'daily'] },
  { id: 'v-15', name: 'Potato', category: 'Vegetables', price: 35.00, image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=800&auto=format&fit=crop', description: 'Quality potatoes from local farms.', unit: 'kg', pairsWith: ['v-14', 'v-11'], tags: ['essential', 'daily'] },
  { id: 'v-16', name: 'Pumpkin', category: 'Vegetables', price: 30.00, image_url: 'https://images.unsplash.com/photo-1506815444479-bfdb1e96c566?q=80&w=800&auto=format&fit=crop', description: 'Sweet and fresh orange pumpkin.', unit: 'kg', pairsWith: ['v-14', 'v-20'], tags: ['traditional'] },
  { id: 'v-17', name: 'Radish', category: 'Vegetables', price: 25.00, image_url: 'https://images.unsplash.com/photo-1592394933243-951d39a51535?q=80&w=800&auto=format&fit=crop', description: 'Fresh white radish with greens.', unit: 'kg', pairsWith: ['v-14', 'v-11'], tags: ['daily'] },
  { id: 'v-18', name: 'Snake Gourd', category: 'Vegetables', price: 30.00, image_url: 'https://images.unsplash.com/photo-1594282486512-ad58f49bad70?q=80&w=800&auto=format&fit=crop', description: 'Fresh and long snake gourds.', unit: 'kg', pairsWith: ['v-14', 'v-11'], tags: ['traditional'] },
  { id: 'v-19', name: 'Spinach', category: 'Vegetables', price: 15.00, image_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=800&auto=format&fit=crop', description: 'Nutritious green spinach leaves.', unit: 'bundle', pairsWith: ['v-15', 'v-14'], tags: ['healthy', 'daily'] },
  { id: 'v-20', name: 'Tomato', category: 'Vegetables', price: 30.00, image_url: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?q=80&w=800&auto=format&fit=crop', description: 'Juicy red farm tomatoes.', unit: 'kg', pairsWith: ['v-14', 'v-11'], tags: ['essential', 'daily'] },
  
  // FRUITS (14)
  { id: 'f-1', name: 'Apple', category: 'Fruits', price: 180.00, image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?q=80&w=800&auto=format&fit=crop', description: 'Sweet and crunchy premium apples.', unit: 'kg', is_seasonal: true, pairsWith: ['f-2', 'f-11'], tags: ['breakfast', 'healthy'] },
  { id: 'f-2', name: 'Banana', category: 'Fruits', price: 60.00, image_url: 'https://images.unsplash.com/photo-1571771894821-ad99026107b8?q=80&w=800&auto=format&fit=crop', description: 'Ripe and sweet yellow bananas.', unit: 'dozen', pairsWith: ['f-1', 'f-9'], tags: ['breakfast', 'essential'] },
  { id: 'f-3', name: 'Custard Apple', category: 'Fruits', price: 120.00, image_url: 'https://images.unsplash.com/photo-1589146182301-447551064609?q=80&w=800&auto=format&fit=crop', description: 'Sweet and creamy custard apples.', unit: 'kg', is_seasonal: true, pairsWith: ['f-1', 'f-6'], tags: ['seasonal'] },
  { id: 'f-4', name: 'Grapes', category: 'Fruits', price: 90.00, image_url: 'https://images.unsplash.com/photo-1596363505729-4190a9506133?q=80&w=800&auto=format&fit=crop', description: 'Fresh green seedless grapes.', unit: 'kg', pairsWith: ['f-1', 'f-14'], tags: ['snack'] },
  { id: 'f-5', name: 'Guava', category: 'Fruits', price: 70.00, image_url: 'https://images.unsplash.com/photo-1536591375315-1b83cc9065ce?q=80&w=800&auto=format&fit=crop', description: 'Fresh and sweet pink guavas.', unit: 'kg', pairsWith: ['f-1', 'f-9'], tags: ['healthy'] },
  { id: 'f-6', name: 'Mango', category: 'Fruits', price: 150.00, image_url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=800&auto=format&fit=crop', description: 'Premium Alphonso mangoes.', unit: 'kg', is_seasonal: true, pairsWith: ['f-14', 'f-2'], tags: ['seasonal', 'favorite'] },
  { id: 'f-7', name: 'Muskmelon', category: 'Fruits', price: 50.00, image_url: 'https://images.unsplash.com/photo-1571771894821-ad99026107b8?q=80&w=800&auto=format&fit=crop', description: 'Sweet and hydrating muskmelons.', unit: 'kg', is_seasonal: true, pairsWith: ['f-14', 'f-1'], tags: ['seasonal', 'hydrating'] },
  { id: 'f-8', name: 'Orange', category: 'Fruits', price: 110.00, image_url: 'https://images.unsplash.com/photo-1582515073490-39981397c445?q=80&w=800&auto=format&fit=crop', description: 'Juicy and vitamin C rich oranges.', unit: 'kg', pairsWith: ['f-13', 'f-1'], tags: ['breakfast', 'juice'] },
  { id: 'f-9', name: 'Papaya', category: 'Fruits', price: 40.00, image_url: 'https://images.unsplash.com/photo-1526600329882-0fe7910b852a?q=80&w=800&auto=format&fit=crop', description: 'Ripe and sweet farm papayas.', unit: 'kg', pairsWith: ['f-13', 'f-1'], tags: ['breakfast', 'healthy'] },
  { id: 'f-10', name: 'Pineapple', category: 'Fruits', price: 60.00, image_url: 'https://images.unsplash.com/photo-1550258114-68bd484829fa?q=80&w=800&auto=format&fit=crop', description: 'Sweet and tangy fresh pineapples.', unit: 'piece', pairsWith: ['f-1', 'f-8'], tags: ['seasonal', 'juice'] },
  { id: 'f-11', name: 'Pomegranate', category: 'Fruits', price: 160.00, image_url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800&auto=format&fit=crop', description: 'Premium red pomegranates.', unit: 'kg', pairsWith: ['f-1', 'f-4'], tags: ['premium', 'healthy'] },
  { id: 'f-12', name: 'Sapota', category: 'Fruits', price: 60.00, image_url: 'https://images.unsplash.com/photo-1571771894821-ad99026107b8?q=80&w=800&auto=format&fit=crop', description: 'Sweet and grainy sapota (chikoo).', unit: 'kg', pairsWith: ['f-2', 'f-1'], tags: ['sweet'] },
  { id: 'f-13', name: 'Sweet Lime', category: 'Fruits', price: 80.00, image_url: 'https://images.unsplash.com/photo-1582515073490-39981397c445?q=80&w=800&auto=format&fit=crop', description: 'Fresh and juicy mosambi.', unit: 'kg', pairsWith: ['f-8', 'f-9'], tags: ['juice', 'healthy'] },
  { id: 'f-14', name: 'Watermelon', category: 'Fruits', price: 40.00, image_url: 'https://images.unsplash.com/photo-1587049633562-ad3002f025f1?q=80&w=800&auto=format&fit=crop', description: 'Refreshing sweet watermelons.', unit: 'piece', is_seasonal: true, pairsWith: ['f-7', 'f-10'], tags: ['seasonal', 'hydrating'] },
  
  // VALLUVAM PRODUCTS (10)
  { id: 'val-1', name: 'Coconut Oil', category: 'Valluvam Products', price: 280, image_url: 'https://images.unsplash.com/photo-1546549032-637110b50193?q=80&w=800&auto=format&fit=crop', description: 'Pure, unrefined cold pressed coconut oil.', unit: '1L', pairsWith: ['v-11', 'v-14'], tags: ['cooking', 'essential'] },
  { id: 'val-2', name: 'Groundnut Oil', category: 'Valluvam Products', price: 320, image_url: 'https://images.unsplash.com/photo-1546549032-637110b50193?q=80&w=800&auto=format&fit=crop', description: 'Traditional cold pressed groundnut oil.', unit: '1L', pairsWith: ['v-15', 'v-20'], tags: ['cooking', 'essential'] },
  { id: 'val-3', name: 'Sesame Oil', category: 'Valluvam Products', price: 450, image_url: 'https://images.unsplash.com/photo-1546549032-637110b50193?q=80&w=800&auto=format&fit=crop', description: 'Rich and aromatic cold pressed sesame oil.', unit: '1L', pairsWith: ['v-11', 'v-20'], tags: ['cooking', 'healthy'] },
  { id: 'val-4', name: 'Palm Jaggery', category: 'Valluvam Products', price: 180, image_url: 'https://images.unsplash.com/photo-1546549032-637110b50193?q=80&w=800&auto=format&fit=crop', description: 'Authentic palm jaggery with no additives.', unit: '500g', pairsWith: ['val-9', 'val-10'], tags: ['sweetener', 'healthy'] },
  { id: 'val-5', name: 'Forest Honey', category: 'Valluvam Products', price: 350, image_url: 'https://images.unsplash.com/photo-1546549032-637110b50193?q=80&w=800&auto=format&fit=crop', description: 'Raw, unprocessed honey from deep forests.', unit: '500g', pairsWith: ['f-1', 'f-2'], tags: ['superfood', 'healthy'] },
  { id: 'val-6', name: 'Traditional Millets', category: 'Valluvam Products', price: 120, image_url: 'https://images.unsplash.com/photo-1546549032-637110b50193?q=80&w=800&auto=format&fit=crop', description: 'High-fiber traditional millets breakfast mix.', unit: '500g', pairsWith: ['val-10', 'val-1'], tags: ['breakfast', 'healthy'] },
  { id: 'val-7', name: 'Cashew Nuts', category: 'Valluvam Products', price: 450, image_url: 'https://images.unsplash.com/photo-1546549032-637110b50193?q=80&w=800&auto=format&fit=crop', description: 'Large, crunchy premium quality cashew nuts.', unit: '250g', pairsWith: ['val-5', 'f-4'], tags: ['snack', 'premium'] },
  { id: 'val-8', name: 'Turmeric Powder', category: 'Valluvam Products', price: 85, image_url: 'https://images.unsplash.com/photo-1546549032-637110b50193?q=80&w=800&auto=format&fit=crop', description: 'Pure turmeric powder with high curcumin content.', unit: '200g', pairsWith: ['val-1', 'val-10'], tags: ['spice', 'essential'] },
  { id: 'val-9', name: 'Natural Palm Sugar', category: 'Valluvam Products', price: 220, image_url: 'https://images.unsplash.com/photo-1546549032-637110b50193?q=80&w=800&auto=format&fit=crop', description: 'Healthy alternative to white sugar.', unit: '500g', pairsWith: ['val-6', 'val-5'], tags: ['sweetener', 'healthy'] },
  { id: 'val-10', name: 'Pure Desi Ghee', category: 'Valluvam Products', price: 650, image_url: 'https://images.unsplash.com/photo-1546549032-637110b50193?q=80&w=800&auto=format&fit=crop', description: 'Pure A2 ghee made using traditional bilona method.', unit: '500ml', pairsWith: ['val-6', 'v-15'], tags: ['superfood', 'essential'] }
].map(p => ({ ...p, stock: 100, is_active: true }));

export const VERIFIED_INVENTORY = FALLBACK_PRODUCTS.map(p => ({
  name: p.name,
  category: p.category,
  price: p.price,
  image_url: p.image_url,
  description: p.description,
  stock: 100,
  unit: p.unit,
  is_active: true,
  is_seasonal: p.is_seasonal || false
}));

export const getRelatedFallback = (category: string, excludeId: string, limit: number = 8) => {
  return FALLBACK_PRODUCTS
    .filter(p => p.category === category && p.id !== excludeId)
    .slice(0, limit);
};

export const getSmartRecommendations = (product: any, limit: number = 24) => {
  if (!product) return FALLBACK_PRODUCTS.slice(0, limit);
  const paired = FALLBACK_PRODUCTS.filter(p => product.pairsWith?.includes(p.id));
  const tagged = FALLBACK_PRODUCTS.filter(p => p.id !== product.id && p.tags?.some(tag => product.tags?.includes(tag)) && !paired.some(pp => pp.id === p.id));
  const categorized = FALLBACK_PRODUCTS.filter(p => p.id !== product.id && p.category === product.category && !paired.some(pp => pp.id === p.id) && !tagged.some(pp => pp.id === p.id));
  return [...paired, ...tagged, ...categorized].slice(0, limit);
};

export const getTrendingProducts = (limit: number = 12, excludeIds: string[] = []) => {
  return FALLBACK_PRODUCTS.filter(p => !excludeIds.includes(p.id)).sort(() => 0.5 - Math.random()).slice(0, limit);
};
