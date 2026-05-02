import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isMock = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder') || supabaseUrl.includes('your-project-id');

if (isMock) {
  console.warn('Supabase credentials missing! Using mock data for development. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.');
}

// Create a mock client proxy if credentials are missing
const realClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

// Helper for localStorage persistence in mock mode
const getPersistentData = (key: string, defaultValue: any) => {
  if (typeof window === 'undefined') return defaultValue;
  const saved = localStorage.getItem(`farmers_factory_${key}`);
  return saved ? JSON.parse(saved) : defaultValue;
};

const savePersistentData = (key: string, data: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`farmers_factory_${key}`, JSON.stringify(data));
  }
};

// Initial sample data for mocking
const initialProducts: any[] = [
  // Vegetables
  { id: 'veg-01', name: 'Beetroot', category: 'Vegetables', price: 45, image_url: '/Vegetables/Beetroot.png', description: 'Fresh and earthy beetroots, rich in nutrients.', stock: 100, unit: 'kg', is_active: true },
  { id: 'veg-02', name: 'Bitter Gourd', category: 'Vegetables', price: 35, image_url: '/Vegetables/Bitter Gourd.png', description: 'Fresh bitter gourd, great for healthy cooking.', stock: 100, unit: 'kg', is_active: true },
  { id: 'veg-03', name: 'Bottle Gourd', category: 'Vegetables', price: 30, image_url: '/Vegetables/Bottle Gourd.png', description: 'Hydrating and fresh bottle gourd.', stock: 100, unit: 'kg', is_active: true },
  { id: 'veg-04', name: 'Brinjal', category: 'Vegetables', price: 40, image_url: '/Vegetables/Brinjal.png', description: 'Fresh purple brinjals, perfect for curries.', stock: 100, unit: 'kg', is_active: true },
  { id: 'veg-05', name: 'Cabbage', category: 'Vegetables', price: 25, image_url: '/Vegetables/Cabbage.png', description: 'Crunchy and fresh green cabbage.', stock: 100, unit: 'kg', is_active: true },
  { id: 'veg-06', name: 'Capsicum', category: 'Vegetables', price: 80, image_url: '/Vegetables/Capsicum.png', description: 'Fresh green capsicum, perfect for salads and stir-fry.', stock: 100, unit: 'kg', is_active: true },
  { id: 'veg-07', name: 'Carrot', category: 'Vegetables', price: 60, image_url: '/Vegetables/Carrot.png', description: 'Sweet and crunchy farm carrots.', stock: 100, unit: 'kg', is_active: true },
  { id: 'veg-08', name: 'Cauliflower', category: 'Vegetables', price: 45, image_url: '/Vegetables/Cauliflower.png', description: 'Fresh white cauliflower heads.', stock: 100, unit: 'kg', is_active: true },
  { id: 'veg-09', name: 'Coriander Leaves', category: 'Vegetables', price: 10, image_url: '/Vegetables/Coriander Leaves.png', description: 'Fresh and aromatic coriander leaves.', stock: 100, unit: 'bundle', is_active: true },
  { id: 'veg-10', name: 'Drumstick', category: 'Vegetables', price: 15, image_url: '/Vegetables/Drumstick.png', description: 'Fresh drumsticks for sambar and curries.', stock: 100, unit: 'piece', is_active: true },
  { id: 'veg-11', name: 'Green Chilli', category: 'Vegetables', price: 40, image_url: '/Vegetables/Green Chilli.png', description: 'Spicy fresh green chillies.', stock: 100, unit: 'kg', is_active: true },
  { id: 'veg-12', name: 'Ladies Finger', category: 'Vegetables', price: 35, image_url: '/Vegetables/Ladies Finger (Okra).png', description: 'Fresh okra, perfect for fry or curry.', stock: 100, unit: 'kg', is_active: true },
  { id: 'veg-13', name: 'Mint Leaves', category: 'Vegetables', price: 10, image_url: '/Vegetables/Mint Leaves.png', description: 'Fresh mint leaves for chutney and tea.', stock: 100, unit: 'bundle', is_active: true },
  { id: 'veg-14', name: 'Onion', category: 'Vegetables', price: 45, image_url: '/Vegetables/Onion.png', description: 'Farm fresh red onions.', stock: 100, unit: 'kg', is_active: true },
  { id: 'veg-15', name: 'Potato', category: 'Vegetables', price: 35, image_url: '/Vegetables/Potato.png', description: 'Quality potatoes from local farms.', stock: 100, unit: 'kg', is_active: true },
  { id: 'veg-16', name: 'Pumpkin', category: 'Vegetables', price: 30, image_url: '/Vegetables/Pumpkin.png', description: 'Sweet and fresh orange pumpkin.', stock: 100, unit: 'kg', is_active: true },
  { id: 'veg-17', name: 'Radish', category: 'Vegetables', price: 25, image_url: '/Vegetables/Radish.png', description: 'Fresh white radish with greens.', stock: 100, unit: 'kg', is_active: true },
  { id: 'veg-18', name: 'Snake Gourd', category: 'Vegetables', price: 30, image_url: '/Vegetables/Snake Gourd.png', description: 'Fresh and long snake gourds.', stock: 100, unit: 'kg', is_active: true },
  { id: 'veg-19', name: 'Spinach', category: 'Vegetables', price: 15, image_url: '/Vegetables/Spinach.png', description: 'Nutritious green spinach leaves.', stock: 100, unit: 'bundle', is_active: true },
  { id: 'veg-20', name: 'Tomato', category: 'Vegetables', price: 30, image_url: '/Vegetables/Tomato.png', description: 'Juicy red farm tomatoes.', stock: 100, unit: 'kg', is_active: true },
  
  // Fruits
  { id: 'fruit-01', name: 'Apple', category: 'Fruits', price: 180, image_url: '/Fruits/Apple.png', description: 'Sweet and crunchy premium apples.', stock: 100, unit: 'kg', is_active: true },
  { id: 'fruit-02', name: 'Banana', category: 'Fruits', price: 60, image_url: '/Fruits/Banana.png', description: 'Ripe and sweet yellow bananas.', stock: 100, unit: 'dozen', is_active: true },
  { id: 'fruit-03', name: 'Custard Apple', category: 'Fruits', price: 120, image_url: '/Fruits/Custard Apple.png', description: 'Sweet and creamy custard apples.', stock: 100, unit: 'kg', is_active: true },
  { id: 'fruit-04', name: 'Grapes', category: 'Fruits', price: 90, image_url: '/Fruits/Grapes.png', description: 'Fresh green seedless grapes.', stock: 100, unit: 'kg', is_active: true },
  { id: 'fruit-05', name: 'Guava', category: 'Fruits', price: 70, image_url: '/Fruits/Guava.png', description: 'Fresh and sweet pink guavas.', stock: 100, unit: 'kg', is_active: true },
  { id: 'fruit-06', name: 'Mango', category: 'Fruits', price: 150, image_url: '/Fruits/Mango.png', description: 'Premium Alphonso mangoes.', stock: 100, unit: 'kg', is_active: true },
  { id: 'fruit-07', name: 'Muskmelon', category: 'Fruits', price: 50, image_url: '/Fruits/Muskmelon.png', description: 'Sweet and hydrating muskmelons.', stock: 100, unit: 'kg', is_active: true },
  { id: 'fruit-08', name: 'Orange', category: 'Fruits', price: 110, image_url: '/Fruits/Orange.png', description: 'Juicy and vitamin C rich oranges.', stock: 100, unit: 'kg', is_active: true },
  { id: 'fruit-09', name: 'Papaya', category: 'Fruits', price: 40, image_url: '/Fruits/Papaya.png', description: 'Ripe and sweet farm papayas.', stock: 100, unit: 'kg', is_active: true },
  { id: 'fruit-10', name: 'Pineapple', category: 'Fruits', price: 60, image_url: '/Fruits/Pineapple.png', description: 'Sweet and tangy fresh pineapples.', stock: 100, unit: 'piece', is_active: true },
  { id: 'fruit-11', name: 'Pomegranate', category: 'Fruits', price: 160, image_url: '/Fruits/Pomegranate.png', description: 'Premium red pomegranates.', stock: 100, unit: 'kg', is_active: true },
  { id: 'fruit-12', name: 'Sapota', category: 'Fruits', price: 60, image_url: '/Fruits/Sapota (Chikoo).png', description: 'Sweet and grainy sapota (chikoo).', stock: 100, unit: 'kg', is_active: true },
  { id: 'fruit-13', name: 'Sweet Lime', category: 'Fruits', price: 80, image_url: '/Fruits/Sweet Lime (Mosambi).png', description: 'Fresh and juicy mosambi.', stock: 100, unit: 'kg', is_active: true },
  { id: 'fruit-14', name: 'Watermelon', category: 'Fruits', price: 40, image_url: '/Fruits/Watermelon.png', description: 'Refreshing sweet watermelons.', stock: 100, unit: 'piece', is_active: true },
  
  // Valluvam Products
  { id: 'val-01', name: 'Cold Pressed Groundnut Oil', category: 'Valluvam Products', price: 220, image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5', description: 'Pure cold-pressed groundnut oil.', stock: 30, unit: 'litre', is_active: true },
  { id: 'val-02', name: 'Proso Millet', category: 'Valluvam Products', price: 85, image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c', description: 'Nutritious Proso Millet (Panivaragu).', stock: 40, unit: 'kg', is_active: true },
  { id: 'val-03', name: 'Organic Honey', category: 'Valluvam Products', price: 450, image_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38', description: '100% natural forest honey.', stock: 25, unit: 'bottle', is_active: true }
];

const initialProfiles: any[] = [
  { id: 'mock-user-id', role: 'admin', full_name: 'Admin User', email: 'admin@farmersfactory.com', phone: '+91 98765 43210', address: 'Main Office', last_visited_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const initialOrders: any[] = [];
const initialOrderItems: any[] = [];

// Live state management for mock data with cross-tab persistence
let sampleProducts = getPersistentData('products', initialProducts);

// AUTO-SEED: If products list is empty, force load the initial catalog
if (isMock && (!sampleProducts || sampleProducts.length === 0)) {
  sampleProducts = [...initialProducts];
  if (typeof window !== 'undefined') {
    savePersistentData('products', sampleProducts);
  }
}

let sampleProfiles = getPersistentData('profiles', initialProfiles);
let sampleOrders = getPersistentData('orders', initialOrders);
let sampleOrderItems = getPersistentData('order_items', initialOrderItems);
let mockCart = getPersistentData('cart', []);
let mockSession = getPersistentData('session', null);
let authListeners: any[] = [];

// --- MOCK REALTIME SYSTEM ---
type Subscriber = {
  table: string;
  event: string;
  callback: (payload: any) => void;
};

const subscribers: Subscriber[] = [];

const notifySubscribers = (table: string, event: 'INSERT' | 'UPDATE' | 'DELETE', payload: any) => {
  console.log(`[Mock Realtime] ${event} on ${table}:`, payload);
  subscribers.forEach(sub => {
    if (sub.table === table && (sub.event === '*' || sub.event === event)) {
      sub.callback({
        new: event === 'DELETE' ? {} : payload,
        old: event === 'INSERT' ? {} : payload,
        eventType: event
      });
    }
  });

  // Cross-tab notification
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('supabase_mock_realtime', {
      detail: { table, event, payload }
    }));
  }
};

// Listen for changes from other tabs
if (typeof window !== 'undefined') {
  window.addEventListener('supabase_mock_realtime', (e: any) => {
    const { table, event, payload } = e.detail;
    // Re-fetch data from localStorage to ensure consistency
    sampleProducts = getPersistentData('products', initialProducts);
    sampleProfiles = getPersistentData('profiles', initialProfiles);
    sampleOrders = getPersistentData('orders', initialOrders);
    sampleOrderItems = getPersistentData('order_items', initialOrderItems);

    // Notify local subscribers
    subscribers.forEach(sub => {
      if (sub.table === table && (sub.event === '*' || sub.event === event)) {
        sub.callback({
          new: event === 'DELETE' ? {} : payload,
          old: event === 'INSERT' ? {} : payload,
          eventType: event
        });
      }
    });
  });

  window.addEventListener('storage', (e) => {
    if (e.key?.startsWith('farmers_factory_')) {
      sampleProducts = getPersistentData('products', initialProducts);
      sampleProfiles = getPersistentData('profiles', initialProfiles);
      sampleOrders = getPersistentData('orders', initialOrders);
      sampleOrderItems = getPersistentData('order_items', initialOrderItems);
      mockCart = getPersistentData('cart', []);
      mockSession = getPersistentData('session', null);
    }
  });
}

const notifyAuthChange = (event: string) => {
  authListeners.forEach(listener => listener(event, mockSession));
};

export const supabase = isMock ? new Proxy(realClient, {
  get(target, prop) {
    if (prop === 'from') {
      return (table: string) => {
        const createBuilder = (currentData: any[]) => {
          const builder: any = {
            data: currentData,
            error: null,
            limit: (n: number) => {
              builder.data = builder.data.slice(0, n);
              return builder;
            },
            order: (col: string, { ascending = true } = {}) => {
              builder.data = [...builder.data].sort((a: any, b: any) => {
                const valA = a[col];
                const valB = b[col];
                if (valA === valB) return 0;
                if (valA == null) return 1;
                if (valB == null) return -1;
                return ascending ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
              });
              return builder;
            },
            eq: (col: string, val: any) => {
              builder.data = builder.data.filter((item: any) => item[col] === val);
              // Handle joins for mock data
              if (table === 'order_items') {
                builder.data = builder.data.map((item: any) => ({
                  ...item,
                  products: sampleProducts.find((p: any) => p.id === item.product_id)
                }));
              }
              if (table === 'cart') {
                builder.data = builder.data.map((item: any) => ({
                  ...item,
                  products: sampleProducts.find((p: any) => p.id === item.product_id)
                }));
              }
              return builder;
            },
            or: (query: string) => {
              // Basic mock implementation of .or('is_active.eq.true,is_active.is.null')
              if (query.includes('is_active.eq.true,is_active.is.null')) {
                builder.data = builder.data.filter((item: any) => item.is_active !== false);
              }
              return builder;
            },
            in: (col: string, vals: any[]) => {
              builder.data = builder.data.filter((item: any) => vals.includes(item[col]));
              return builder;
            },
            single: () => {
              return Promise.resolve({ data: builder.data[0] || null, error: builder.data[0] ? null : { message: 'Not found', code: 'PGRST116' } });
            },
            then: (onfulfilled?: (value: any) => any) => {
              return Promise.resolve({ data: builder.data, error: null }).then(onfulfilled);
            }
          };
          return builder;
        };

        return {
          select: (query: string = '*') => {
            let initialData: any[] = [];
            if (table === 'products') initialData = [...sampleProducts];
            else if (table === 'orders') initialData = [...sampleOrders];
            else if (table === 'profiles') initialData = [...sampleProfiles];
            else if (table === 'order_items') initialData = [...sampleOrderItems];
            else if (table === 'cart') initialData = [...mockCart];

            const builder = createBuilder(initialData);
            if (query.includes('products(*)')) {
              // Simulated join logic already handled in createBuilder/eq if needed, 
              // but for general select we might need it too
              if (table === 'cart' || table === 'order_items') {
                builder.data = builder.data.map((item: any) => ({
                  ...item,
                  products: sampleProducts.find((p: any) => p.id === item.product_id)
                }));
              }
            }
            return builder;
          },
          insert: (items: any) => {
            const itemsArray = Array.isArray(items) ? items : [items];
            const results = itemsArray.map((item: any) => {
              const numericId = Math.floor(100000 + Math.random() * 900000);
              return {
                id: table === 'orders' ? `FF-${numericId}` : Math.random().toString(36).substring(7),
                created_at: new Date().toISOString(),
                ...item
              };
            });

            if (table === 'cart') {
              mockCart.push(...results);
              savePersistentData('cart', mockCart);
            } else if (table === 'orders') {
              sampleOrders.push(...results);
              savePersistentData('orders', sampleOrders);
              results.forEach(r => notifySubscribers('orders', 'INSERT', r));
            } else if (table === 'order_items') {
              sampleOrderItems.push(...results);
              savePersistentData('order_items', sampleOrderItems);
            } else if (table === 'products') {
              sampleProducts.push(...results);
              savePersistentData('products', sampleProducts);
              results.forEach(r => notifySubscribers('products', 'INSERT', r));
            }

            const res = { data: Array.isArray(items) ? results : results[0], error: null };
            const promise = Promise.resolve(res);
            (promise as any).select = () => ({ single: () => promise });
            return promise;
          },
          update: (updates: any) => ({
            eq: (col: string, val: any) => {
              let updatedItem: any = null;
              if (table === 'cart') {
                mockCart = mockCart.map((item: any) => item[col] === val ? { ...item, ...updates } : item);
                savePersistentData('cart', mockCart);
              } else if (table === 'products') {
                const index = sampleProducts.findIndex((p: any) => p[col] === val);
                if (index !== -1) {
                  sampleProducts[index] = { ...sampleProducts[index], ...updates };
                  updatedItem = sampleProducts[index];
                  savePersistentData('products', sampleProducts);
                  notifySubscribers('products', 'UPDATE', updatedItem);
                }
              } else if (table === 'profiles') {
                const index = sampleProfiles.findIndex((p: any) => p[col] === val);
                if (index !== -1) {
                  sampleProfiles[index] = { ...sampleProfiles[index], ...updates };
                  savePersistentData('profiles', sampleProfiles);
                }
              } else if (table === 'orders') {
                const index = sampleOrders.findIndex((o: any) => o[col] === val);
                if (index !== -1) {
                  sampleOrders[index] = { ...sampleOrders[index], ...updates };
                  updatedItem = sampleOrders[index];
                  savePersistentData('orders', sampleOrders);
                  notifySubscribers('orders', 'UPDATE', updatedItem);
                }
              }

              const res = { data: updatedItem || updates, error: null };
              const promise = Promise.resolve(res);
              (promise as any).select = () => ({ single: () => promise });
              return promise;
            }
          }),
          delete: () => ({
            eq: (col: string, val: any) => {
              let deletedItem: any = null;
              if (table === 'cart') {
                mockCart = mockCart.filter((item: any) => item[col] !== val);
                savePersistentData('cart', mockCart);
              } else if (table === 'products') {
                deletedItem = sampleProducts.find((item: any) => item[col] === val);
                sampleProducts = sampleProducts.filter((item: any) => item[col] !== val);
                savePersistentData('products', sampleProducts);
                if (deletedItem) notifySubscribers('products', 'DELETE', deletedItem);
              }
              return Promise.resolve({ error: null });
            }
          })
        };
      };
    }
    if (prop === 'auth') {
      return {
        getSession: () => Promise.resolve({ data: { session: mockSession }, error: null }),
        onAuthStateChange: (callback: any) => {
          authListeners.push(callback);
          setTimeout(() => callback('INITIAL_SESSION', mockSession), 0);
          return {
            data: {
              subscription: {
                unsubscribe: () => {
                  const index = authListeners.indexOf(callback);
                  if (index > -1) authListeners.splice(index, 1);
                }
              }
            }
          };
        },
        signInWithOtp: () => Promise.resolve({ error: null }),
        signInWithPassword: ({ email }: any) => {
          mockSession = { user: { id: 'mock-user-id', email }, expires_at: 9999999999 };
          savePersistentData('session', mockSession);
          notifyAuthChange('SIGNED_IN');
          return Promise.resolve({ data: { session: mockSession, user: mockSession.user }, error: null });
        },
        signUp: ({ email, options }: any) => {
          const userId = `mock-user-${Math.random().toString(36).substring(7)}`;
          mockSession = { user: { id: userId, email }, expires_at: 9999999999 };

          // Create a mock profile
          const newProfile = {
            id: userId,
            email,
            full_name: options?.data?.full_name || email.split('@')[0],
            phone: options?.data?.phone || '',
            last_visited_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          sampleProfiles.unshift(newProfile);
          savePersistentData('profiles', sampleProfiles);

          savePersistentData('session', mockSession);
          notifyAuthChange('SIGNED_UP');
          return Promise.resolve({ data: { session: mockSession, user: mockSession.user }, error: null });
        },
        signOut: () => {
          mockSession = null;
          savePersistentData('session', null);
          notifyAuthChange('SIGNED_OUT');
          return Promise.resolve({ error: null });
        },
      };
    }
    if (prop === 'channel') {
      return (channelName: string) => {
        const mockChannel: any = {
          on: (type: string, filter: any, callback: (p: any) => void) => {
            const table = filter.table;
            const event = filter.event;
            subscribers.push({ table, event, callback });
            return mockChannel;
          },
          subscribe: () => {
            console.log(`[Mock Realtime] Subscribed to ${channelName}`);
            return mockChannel;
          },
          unsubscribe: () => {
            console.log(`[Mock Realtime] Unsubscribed from ${channelName}`);
          }
        };
        return mockChannel;
      };
    }
    if (prop === 'removeChannel') return () => { };
    return (target as any)[prop];
  }
}) : realClient;
