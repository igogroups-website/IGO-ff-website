'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Truck, CreditCard, ShieldCheck, ArrowRight, MapPin, Phone, User, Crosshair, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Checkout() {
  const { user, loading: authLoading } = useAuth();
  const { 
    cartItems, cartTotal, loading: cartLoading,
    couponCode, setCouponCode, discount, appliedCoupon, isValidatingCoupon, applyCoupon, removeCoupon 
  } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [address, setAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    zip: ''
  });
  const [isLocating, setIsLocating] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'CARD'>('COD');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: ''
  });

  // Local states removed in favor of global cart context for coupons

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please login to checkout');
      router.push('/');
      return;
    }

    if (user) {
      const fetchProfile = async () => {
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (prof) {
          setAddress({
            name: prof.full_name || '',
            phone: prof.phone || '',
            street: prof.address || '',
            city: prof.city || '',
            zip: prof.zip || ''
          });
        }
      };
      fetchProfile();
    }
  }, [user, authLoading, router]);
  
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Use Nominatim (OpenStreetMap) for free reverse geocoding
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
          const data = await response.json();
          
          if (data.address) {
            const addr = data.address;
            setAddress(prev => ({
              ...prev,
              street: `${addr.road || ''} ${addr.suburb || addr.neighbourhood || ''}`.trim() || prev.street,
              city: addr.city || addr.town || addr.village || prev.city,
              zip: addr.postcode || prev.zip
            }));
            toast.success('Location captured successfully!');
          }
        } catch (error) {
          toast.error('Failed to get address details, but coordinates captured.');
          setAddress(prev => ({
            ...prev,
            street: `${prev.street} (Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)})`.trim()
          }));
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        toast.error('Please enable location permissions in your browser');
      },
      { enableHighAccuracy: true }
    );
  };

  // handleApplyCoupon is now handled globally in CartContext

  const subtotal = cartTotal;
  const total = Math.max(0, subtotal - discount);

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Session expired. Please login again.');
      return;
    }

    if (!address.street || !address.phone || !address.name) {
      toast.error('Please fill in your delivery details');
      return;
    }

    if (paymentMethod === 'CARD') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv) {
        toast.error('Please fill in your card details');
        return;
      }
      if (cardDetails.number.length < 16) {
        toast.error('Invalid card number');
        return;
      }
    }

    // Business Rule: Onion Order Constraint
    const onionItems = cartItems.filter(item => item.products.name.toLowerCase().includes('onion'));
    if (onionItems.length > 0) {
      const totalOnionKg = onionItems.reduce((sum, item) => sum + item.quantity, 0);
      if (totalOnionKg < 5) {
        toast.error('Logistics Notice: Onion orders must be at least 5kg for bulk delivery.', {
          icon: '🧅',
          duration: 5000
        });
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    try {
      // Generate professional order number
      const orderNumber = 'FF-' + Math.random().toString(36).substring(2, 8).toUpperCase();

      // Create Order
      // 1. Sync user to public.users table to satisfy the database foreign key constraint
      const syncRes = await fetch('/api/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer'
        })
      });
      if (!syncRes.ok) {
        const syncErrData = await syncRes.json().catch(() => ({}));
        console.error('[Checkout] User sync failed:', syncErrData);
        throw new Error(syncErrData.error || 'Failed to synchronize account credentials. Please refresh and try again.');
      }
      console.log('[Checkout] User synced successfully to public.users');

      // Create Order with uppercase 'PLACED' status matching database constraint
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          subtotal: subtotal,
          total: total,
          total_amount: total,
          delivery_address: `${address.name}, ${address.street}, ${address.city} - ${address.zip}`,
          payment_method: paymentMethod,
          status: 'PLACED'
          // Note: coupon_id column not yet in schema — applied discount already reflected in total_amount
        })
        .select()
        .single();

      if (orderError) {
        console.error('[Checkout] Order create error:', orderError);
        throw new Error(orderError.message || 'Failed to create order. Please try again.');
      }
      if (!order) throw new Error('Failed to create order record');

      // Add order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.products.price
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) {
        console.error('[Checkout] Order items insert error:', itemsError);
        // Still delete the orphaned order if items insert fails
        await supabase.from('orders').delete().eq('id', order.id);
        throw new Error(itemsError.message || 'Failed to save order items. Please try again.');
      }

      // Clear cart
      if (user) {
        await supabase.from('cart').delete().eq('user_id', user.id);
      } else {
        localStorage.removeItem('farmers_factory_guest_cart');
      }

      toast.success('Order placed successfully!');
      
      // Dispatch event to clear global UI (Navbar, Sticky Footer)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cart-updated'));
      }

      // Add to notifications inbox
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: 'Order Confirmed! 🌿',
        message: `Your order #${order.order_number || String(order.id).slice(0, 8)} has been successfully placed and is being prepared.`,
        type: 'order_status',
        link: '/profile?tab=orders'
      });

      // Send Order Confirmation Email
      import('@/lib/email').then(({ sendOrderConfirmation }) => {
        sendOrderConfirmation(user.email || address.name, order.id, total);
      });

      router.push(`/checkout/success?id=${order.id}`);
    } catch (error: any) {
      console.error('Order placement error:', error);
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || cartLoading) return <div className="h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <main className="min-h-screen bg-muted/30 pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32">
        <h1 className="text-4xl font-bold mb-10">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2rem] p-8 border border-border"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <h2 className="text-xl font-bold">Delivery Address</h2>
                <button 
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="ml-auto flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/20 transition-all border border-primary/10"
                >
                  {isLocating ? <Loader2 size={14} className="animate-spin" /> : <Crosshair size={14} />}
                  {isLocating ? 'Locating...' : 'Use Live Location'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      className="w-full bg-muted/50 border border-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      value={address.name}
                      onChange={e => setAddress({...address, name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      type="tel" 
                      placeholder="9876543210"
                      className="w-full bg-muted/50 border border-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      value={address.phone}
                      onChange={e => setAddress({...address, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-muted-foreground ml-1">Street Address</label>
                  <input 
                    type="text" 
                    placeholder="House No, Street Name"
                    className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={address.street}
                    onChange={e => setAddress({...address, street: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground ml-1">City</label>
                  <input 
                    type="text" 
                    placeholder="Chennai"
                    className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={address.city}
                    onChange={e => setAddress({...address, city: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground ml-1">Zip Code</label>
                  <input 
                    type="text" 
                    placeholder="600001"
                    className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={address.zip}
                    onChange={e => setAddress({...address, zip: e.target.value})}
                  />
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[2rem] p-8 border border-border"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-xl font-bold">Payment Method</h2>
              </div>

              <div className="space-y-4">
                <div 
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-6 border-2 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'COD' 
                      ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' 
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 border-4 rounded-full bg-white transition-all ${
                      paymentMethod === 'COD' ? 'border-primary' : 'border-muted'
                    }`} />
                    <div>
                      <p className="font-bold">Cash on Delivery (COD)</p>
                      <p className="text-sm text-muted-foreground">Pay when your farm goods arrive</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-6 border-2 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'CARD' 
                      ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' 
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 border-4 rounded-full bg-white transition-all ${
                      paymentMethod === 'CARD' ? 'border-primary' : 'border-muted'
                    }`} />
                    <div>
                      <p className="font-bold">Credit / Debit Card</p>
                      <p className="text-sm text-muted-foreground">Secure payment via encrypted gateway</p>
                    </div>
                  </div>
                </div>

                {/* Card Details Form */}
                {paymentMethod === 'CARD' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="overflow-hidden"
                  >
                    <div className="p-8 bg-muted/20 rounded-[2rem] border border-border mt-4 space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Card Number</label>
                        <input 
                          type="text" 
                          placeholder="0000 0000 0000 0000"
                          maxLength={16}
                          className="w-full bg-white border border-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono tracking-widest"
                          value={cardDetails.number}
                          onChange={e => setCardDetails({...cardDetails, number: e.target.value.replace(/\D/g, '')})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Expiry Date</label>
                          <input 
                            type="text" 
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full bg-white border border-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
                            value={cardDetails.expiry}
                            onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">CVV</label>
                          <input 
                            type="password" 
                            placeholder="***"
                            maxLength={3}
                            className="w-full bg-white border border-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
                            value={cardDetails.cvv}
                            onChange={e => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '')})}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[2rem] p-8 border border-border sticky top-32"
            >
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.products.image_url} alt={item.products.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{item.products.name}</p>
                      <p className="text-xs text-muted-foreground">{item.quantity} x ₹{item.products.price}</p>
                    </div>
                    <p className="font-bold text-sm">₹{item.products.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              {/* Coupon Field */}
              <div className="mb-8 p-6 bg-primary/5 rounded-3xl border border-primary/10">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">Promotional Code</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="ENTER CODE"
                    className="flex-1 bg-white border border-border rounded-xl px-4 py-2 text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20 outline-none"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    disabled={appliedCoupon}
                  />
                  <button 
                    onClick={appliedCoupon ? removeCoupon : applyCoupon}
                    disabled={isValidatingCoupon}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      appliedCoupon 
                        ? 'bg-red-50 text-red-600 hover:bg-red-500 hover:text-white' 
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    {isValidatingCoupon ? <Loader2 size={14} className="animate-spin" /> : (appliedCoupon ? 'REMOVE' : 'APPLY')}
                  </button>
                </div>
              </div>

              <div className="space-y-3 border-t border-border pt-6 mb-8">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span className="text-primary font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-4">
                  <span>Total</span>
                  <span className="text-primary">₹{total}</span>
                </div>
              </div>

              <div className="bg-muted/50 rounded-2xl p-4 mb-8 flex items-center gap-3">
                <Truck className="text-primary" size={20} />
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">Fast Delivery</p>
                  <p className="text-xs text-muted-foreground">Within 24 hours guaranteed</p>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all transform active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Place Order'}
                {!loading && <ArrowRight size={20} />}
              </button>

              <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground">
                <ShieldCheck size={14} className="text-primary" />
                <span>Secure Checkout with Farmers Factory</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
