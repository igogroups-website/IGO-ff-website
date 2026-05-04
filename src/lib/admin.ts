import { supabase } from './supabase';

export async function isAdmin() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return profile?.role === 'admin';
}

export async function getAdminStats() {
  try {
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('total_amount, status');

    const { count: productCount, error: productsError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    const { count: customerCount, error: customersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (ordersError || productsError || customersError) {
      console.warn('Minor error fetching admin stats (likely schema mismatch):', { ordersError, productsError, customersError });
      // Don't return null, return partial data or zeros to keep UI alive
    }

    // Safely calculate revenue handling missing columns
    const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount || 0), 0) || 0;
    const totalOrders = orders?.length || 0;

    const { count: outOfStockCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .or('stock.eq.0,in_stock.eq.false');

    return {
      totalRevenue: `₹${totalRevenue.toLocaleString()}`,
      totalOrders: totalOrders.toString(),
      activeProducts: (productCount || 0).toString(),
      totalCustomers: (customerCount || 0).toString(),
      outOfStockCount: (outOfStockCount || 0).toString(),
    };
  } catch (err) {
    console.error('Fatal error in getAdminStats:', err);
    return {
      totalRevenue: '₹0',
      totalOrders: '0',
      activeProducts: '0',
      totalCustomers: '0',
      outOfStockCount: '0',
    };
  }
}

export async function getAllOrders() {
  try {
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return [];
    }

    if (!orders || orders.length === 0) return [];

    // Fetch profiles for these orders
    const userIds = [...new Set(orders.map(o => o.user_id))];
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url') // Removed email as it might be missing
      .in('id', userIds);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
    }

    return orders.map(order => ({
      ...order,
      customer: profiles?.find(p => p.id === order.user_id) || { full_name: 'Unknown Customer' }
    }));
  } catch (err) {
    console.error('Fatal error in getAllOrders:', err);
    return [];
  }
}

export async function getOrderDetails(orderId: string) {
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*, products(*)')
    .eq('order_id', orderId);

  if (itemsError) {
    console.error('Error fetching order items:', itemsError);
    return [];
  }

  return items;
}

export async function updateOrderStatus(orderId: string, status: string) {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  return { error };
}

export async function getAllProducts(includeInactive = true) {
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (!includeInactive) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  
  // Normalize data for UI if needed (handle complex schema)
  const normalizedData = data?.map((p: any) => ({
    ...p,
    category: p.category || (p.category_id === 'cat-fruit' ? 'Fruits' : p.category_id === 'cat-trad' ? 'Valluvam Products' : 'Vegetables'),
    image_url: p.image_url || (p.image_urls && p.image_urls[0]) || '',
    stock: p.stock !== undefined ? p.stock : (p.in_stock ? 100 : 0)
  }));

  return { data: normalizedData, error };
}

export async function updateProductStock(productId: string, inStock: boolean) {
  const { error } = await supabase
    .from('products')
    .update({ stock: inStock ? 100 : 0, in_stock: inStock }) 
    .eq('id', productId);

  return { error };
}

export async function softDeleteProduct(productId: string) {
  const { error } = await supabase
    .from('products')
    .update({ is_active: false })
    .eq('id', productId);

  return { error };
}

export async function restoreProduct(productId: string) {
  const { error } = await supabase
    .from('products')
    .update({ is_active: true })
    .eq('id', productId);

  return { error };
}

export async function addProduct(product: any) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  return { data, error };
}

export async function updateProduct(productId: string, updates: any) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', productId)
    .select()
    .single();

  return { data, error };
}

export async function getAllCustomers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) return [];

  // Optionally fetch order counts for each customer
  const { data: orders } = await supabase.from('orders').select('user_id');
  
  return data.map(profile => ({
    ...profile,
    orderCount: orders?.filter(o => o.user_id === profile.id).length || 0
  }));
}

export async function getCustomerStats(userId: string) {
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (ordersError) return null;

  const totalSpent = orders?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;
  
  return {
    orders: orders || [],
    totalOrders: orders?.length || 0,
    totalSpent,
    recentOrder: orders?.[0] || null
  };
}

export async function deleteProduct(productId: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  return { error };
}

export async function getRecentVisitors() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('last_visited_at', { ascending: false, nullsFirst: false })
    .limit(5);

  return data || [];
}

export async function deleteAllProducts() {
  try {
    console.log('Initiating total catalog wipe...');
    // 1. Clear dependent tables first to avoid foreign key violations
    // We use neq id '0' as a trick to delete all rows in mock and real Supabase
    const allIds = '00000000-0000-0000-0000-000000000000';
    
    await supabase.from('order_items').delete().neq('id', allIds);
    await supabase.from('cart').delete().neq('id', allIds);
    await supabase.from('wishlist').delete().neq('id', allIds);
    
    // 2. Now safe to delete all products
    const { error } = await supabase
      .from('products')
      .delete()
      .neq('id', allIds);

    if (error) {
      console.error('Delete phase failed:', error);
      return { success: false, error };
    }
    
    console.log('Successfully wiped products and related data.');
    return { success: true };
  } catch (err: any) {
    console.error('Total wipe fatal error:', err);
    return { success: false, error: err };
  }
}

export async function syncVerifiedCatalog(samples: any[]) {
  try {
    console.log('Starting robust catalog sync with', samples.length, 'items');
    
    // 1. Total Wipe - Clear all existing products to ensure no "phantoms" survive
    const result = await deleteAllProducts();
    if (result.error) {
      console.error('CRITICAL: Catalog wipe failed. Aborting sync to prevent duplicates.', result.error);
      return { success: false, error: new Error(`Wipe failed: ${result.error.message || 'Unknown error'}. Products might be locked by active orders.`) };
    }

    // 2. Prepare items for insertion
    await new Promise(resolve => setTimeout(resolve, 500));

    // 3. Try Direct Insert first (Standard Schema)
    let { data: insertedData, error: insertError } = await supabase
      .from('products')
      .insert(samples)
      .select();

    // 4. SMART MAPPING FALLBACK (If Standard Insert Fails)
    if (insertError && (insertError.message.includes('category') || insertError.message.includes('image_url'))) {
      console.log('Detected schema mismatch. Attempting smart mapping...');
      
      const mappedSamples = samples.map(p => {
        // Map category to category_id
        let category_id = 'cat-veg';
        if (p.category === 'Fruits') category_id = 'cat-fruit';
        else if (p.category === 'Valluvam Products') category_id = 'cat-trad';

        return {
          name: p.name,
          slug: p.name.toLowerCase().replace(/\s+/g, '-'),
          description: p.description,
          image_urls: [p.image_url], // Wrap in array
          category_id: category_id,
          category_slug: category_id.replace('cat-', ''),
          price: p.price,
          unit: p.unit,
          in_stock: p.stock > 0, // Convert to boolean
          is_active: p.is_active !== false,
          is_featured: p.is_seasonal || false,
          mrp: p.price * 1.2, // Mock MRP
          created_at: new Date().toISOString()
        };
      });

      const { data: retryData, error: retryError } = await supabase
        .from('products')
        .insert(mappedSamples)
        .select();
      
      if (retryError) throw retryError;
      insertedData = retryData;
    } else if (insertError) {
      throw insertError;
    }

    return { 
      success: true, 
      added: insertedData?.length || 0, 
      updated: 0, 
      removed: 'All previous items' 
    };
  } catch (error) {
    console.error('Sync failed:', error);
    return { success: false, error };
  }
}
