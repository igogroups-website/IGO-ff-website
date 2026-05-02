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
    console.error('Error fetching admin stats:', { ordersError, productsError, customersError });
    return null;
  }

  const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
  const totalOrders = orders?.length || 0;

  const { count: outOfStockCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('stock', 0);

  return {
    totalRevenue: `₹${totalRevenue.toLocaleString()}`,
    totalOrders: totalOrders.toString(),
    activeProducts: (productCount || 0).toString(),
    totalCustomers: (customerCount || 0).toString(),
    outOfStockCount: (outOfStockCount || 0).toString(),
  };
}

export async function getAllOrders() {
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (ordersError) {
    console.error('Error fetching orders:', ordersError);
    return [];
  }

  // Fetch profiles for these orders
  const userIds = [...new Set(orders.map(o => o.user_id))];
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, email')
    .in('id', userIds);

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
  }

  return orders.map(order => ({
    ...order,
    customer: profiles?.find(p => p.id === order.user_id) || { full_name: 'Unknown Customer' }
  }));
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
  return { data, error };
}

export async function updateProductStock(productId: string, inStock: boolean) {
  const { error } = await supabase
    .from('products')
    .update({ stock: inStock ? 100 : 0 }) 
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
