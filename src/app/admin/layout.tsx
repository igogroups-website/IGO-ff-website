'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut, 
  ChevronRight,
  Leaf,
  Bell,
  Lock,
  MessageSquare,
  Zap,
  Image as ImageIcon,
  Ticket,
  User,
  Video,
  Sparkles
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications, setNotifications] = React.useState([
    { id: 1, title: 'New Order Received', message: 'Order #FF-123456 placed by Test User', time: '5m ago', type: 'order', href: '/admin/orders?search=FF-123456' },
    { id: 2, title: 'Stock Alert', message: 'Tomato is running low on stock', time: '2h ago', type: 'stock', href: '/admin/products?search=Tomato' },
  ]);
  
  React.useEffect(() => {
    setMounted(true);
    const checkAuth = () => {
      const auth = localStorage.getItem('admin_auth');
      const isAuth = auth === 'true';
      setIsAuthenticated(isAuth);
      
      if (!isAuth && pathname !== '/admin/login') {
        router.push('/admin/login');
      } else if (isAuth && pathname === '/admin/login') {
        router.push('/admin');
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);

    // Real-time Subscriptions
    const ordersChannel = supabase
      .channel('admin_notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        const newOrder = payload.new;
        setNotifications(prev => [
          { 
            id: Date.now(), 
            title: 'New Order Received', 
            message: `Order #${newOrder.id.slice(0, 8)} for ₹${newOrder.total_amount}`, 
            time: 'Just now', 
            type: 'order', 
            href: `/admin/orders?search=${newOrder.id}` 
          },
          ...prev.slice(0, 4)
        ]);
        toast.success('New Order Received!', { icon: '🛍️', duration: 5000 });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'products' }, (payload) => {
        const product = payload.new;
        if (product.stock === 0) {
          setNotifications(prev => [
            { 
              id: Date.now(), 
              title: 'Out of Stock', 
              message: `${product.name} is now out of stock!`, 
              time: 'Just now', 
              type: 'stock', 
              href: `/admin/products?search=${product.name}` 
            },
            ...prev.slice(0, 4)
          ]);
        }
      })
      .subscribe();

    return () => {
      window.removeEventListener('storage', checkAuth);
      supabase.removeChannel(ordersChannel);
    };
  }, [pathname, router]);

  // Prevent hydration mismatch by returning a simple loader until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogout = () => {
    // Clear both cookie and localStorage
    document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict";
    localStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  // If on login page, just show the login page content
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // If not authenticated and not on login page, show nothing (redirect will happen in useEffect)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/admin' },
    { name: 'Products', icon: <Package size={20} />, href: '/admin/products' },
    { name: 'Inventory', icon: <Zap size={20} />, href: '/admin/inventory' },
    { name: 'Banners', icon: <ImageIcon size={20} />, href: '/admin/banners' },
    { name: 'Live Streams', icon: <Video size={20} />, href: '/admin/streams' },
    { name: 'Farm Stories', icon: <Sparkles size={20} />, href: '/admin/stories' },
    { name: 'Coupons', icon: <Ticket size={20} />, href: '/admin/coupons' },
    { name: 'Farmers', icon: <User size={20} />, href: '/admin/farmers' },
    { name: 'Orders', icon: <ShoppingBag size={20} />, href: '/admin/orders' },
    { name: 'Reviews', icon: <MessageSquare size={20} />, href: '/admin/reviews' },
    { name: 'Customers', icon: <Users size={20} />, href: '/admin/customers' },
    { name: 'Settings', icon: <Settings size={20} />, href: '/admin/settings' },
    { name: 'Back to Store', icon: <Leaf size={20} />, href: '/' },
  ];

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border hidden lg:flex flex-col sticky top-0 h-screen">
        <Link href="/" className="p-8 border-b border-border flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
            <Leaf size={24} />
          </div>
          <span className="text-xl font-black tracking-tight text-primary">Admin FF</span>
        </Link>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold ${
                (pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href)))
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {item.name}
              </div>
              {pathname === item.href && <ChevronRight size={16} />}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 font-bold hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-8 sticky top-0 z-40">
          <h1 className="text-xl font-black text-foreground">
            {navItems.find(item => item.href === pathname)?.name || 'Admin'}
          </h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  localStorage.removeItem('admin_auth');
                  document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                  window.location.href = '/admin/login';
                }}
                className="p-3 bg-muted/50 text-muted-foreground hover:bg-red-500 hover:text-white rounded-2xl transition-all group"
                title="Lock Dashboard"
              >
                <Lock size={20} className="group-hover:scale-110 transition-transform" />
              </button>

              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-3 bg-muted/50 text-muted-foreground hover:text-primary transition-all relative rounded-2xl"
                >
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                      {notifications.length}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowNotifications(false)}
                        className="fixed inset-0 z-40"
                      />
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-3xl border border-border shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="p-5 border-b border-border flex items-center justify-between">
                          <h3 className="font-black uppercase tracking-widest text-xs">Notifications</h3>
                          <button className="text-[10px] font-black text-primary hover:underline">Mark all read</button>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                          {notifications.map((n) => (
                            <Link 
                              key={n.id} 
                              href={n.href}
                              onClick={() => setShowNotifications(false)}
                              className="block p-4 border-b border-border last:border-0 hover:bg-muted/30 transition-all cursor-pointer"
                            >
                              <p className="font-bold text-sm mb-1">{n.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                              <p className="text-[10px] font-black text-primary mt-2 uppercase">{n.time}</p>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">Admin User</p>
                <p className="text-xs text-muted-foreground">Main Store</p>
              </div>
              <div className="w-10 h-10 bg-muted rounded-full overflow-hidden border border-border">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" alt="Admin" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
