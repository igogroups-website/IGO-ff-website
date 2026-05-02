'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Truck, CreditCard, ShieldCheck, ArrowRight, MapPin, Phone, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Checkout() {
  const { user, loading: authLoading } = useAuth();
  const { cartItems, cartTotal, loading: cartLoading } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [address, setAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    zip: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'CARD'>('COD');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: ''
  });

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

  const subtotal = cartTotal;

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

    setLoading(true);
    try {
      // Create Order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: subtotal,
          delivery_address: `${address.name}, ${address.street}, ${address.city} - ${address.zip}`,
          payment_method: paymentMethod,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;
      if (!order) throw new Error('Failed to create order record');

      // Add order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.products.price
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // Clear cart
      if (user) {
        await supabase.from('cart').delete().eq('user_id', user.id);
      } else {
        localStorage.removeItem('farmers_factory_guest_cart');
      }

      toast.success('Order placed successfully!');
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

              <div className="space-y-3 border-t border-border pt-6 mb-8">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span className="text-primary font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-4">
                  <span>Total</span>
                  <span className="text-primary">₹{subtotal}</span>
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
