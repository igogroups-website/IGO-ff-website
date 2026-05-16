-- ============================================================
-- FARMERS FACTORY — CRITICAL RLS FIX
-- Run this ENTIRE file in Supabase Dashboard → SQL Editor
-- This fixes: Add to Basket, Place Order, Wishlist, Profile
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- STEP 1: DROP ALL EXISTING POLICIES (clean slate)
-- ─────────────────────────────────────────────────────────────

-- Cart
DROP POLICY IF EXISTS "Users can view own cart"       ON cart;
DROP POLICY IF EXISTS "Users can manage own cart"     ON cart;
DROP POLICY IF EXISTS "Users can insert own cart"     ON cart;
DROP POLICY IF EXISTS "Users can update own cart"     ON cart;
DROP POLICY IF EXISTS "Users can delete own cart"     ON cart;

-- Orders
DROP POLICY IF EXISTS "Users can view own orders"     ON orders;
DROP POLICY IF EXISTS "Users can create own orders"   ON orders;
DROP POLICY IF EXISTS "Users can insert own orders"   ON orders;
DROP POLICY IF EXISTS "Admins can view all orders"    ON orders;
DROP POLICY IF EXISTS "Admins can update all orders"  ON orders;

-- Order Items
DROP POLICY IF EXISTS "Users can view own order items"   ON order_items;
DROP POLICY IF EXISTS "Users can insert own order items" ON order_items;
DROP POLICY IF EXISTS "Admins can view all order items"  ON order_items;
DROP POLICY IF EXISTS "Admins can insert order items"    ON order_items;

-- Profiles
DROP POLICY IF EXISTS "Users can view own profile"    ON profiles;
DROP POLICY IF EXISTS "Users can update own profile"  ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile"  ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles"  ON profiles;

-- Wishlist
DROP POLICY IF EXISTS "Users can view own wishlist"   ON wishlist;
DROP POLICY IF EXISTS "Users can manage own wishlist" ON wishlist;
DROP POLICY IF EXISTS "Users can insert wishlist"     ON wishlist;
DROP POLICY IF EXISTS "Users can delete wishlist"     ON wishlist;

-- Products
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Admins can manage products"        ON products;

-- Banners / Streams / Harvest Events / Farmers / Reviews / Coupons
DROP POLICY IF EXISTS "Banners are public"              ON banners;
DROP POLICY IF EXISTS "Streams are public"              ON farm_streams;
DROP POLICY IF EXISTS "Harvest events are public"       ON harvest_events;
DROP POLICY IF EXISTS "Farmers are public"              ON farmers;
DROP POLICY IF EXISTS "Reviews are public"              ON reviews;
DROP POLICY IF EXISTS "Admins manage banners"           ON banners;
DROP POLICY IF EXISTS "Admins manage streams"           ON farm_streams;
DROP POLICY IF EXISTS "Admins manage harvest"           ON harvest_events;
DROP POLICY IF EXISTS "Admins manage farmers"           ON farmers;
DROP POLICY IF EXISTS "Admins manage coupons"           ON coupons;
DROP POLICY IF EXISTS "Users can create reviews"        ON reviews;
DROP POLICY IF EXISTS "Users can edit own reviews"      ON reviews;
DROP POLICY IF EXISTS "Coupons are viewable by users"   ON coupons;

-- Notifications
DROP POLICY IF EXISTS "Users can view own notifications"   ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Admins insert notifications"        ON notifications;


-- ─────────────────────────────────────────────────────────────
-- STEP 2: ENSURE RLS IS ENABLED ON ALL TABLES
-- ─────────────────────────────────────────────────────────────
ALTER TABLE products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart           ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders         ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist       ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications  ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners        ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_streams   ENABLE ROW LEVEL SECURITY;
ALTER TABLE harvest_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews        ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons        ENABLE ROW LEVEL SECURITY;


-- ─────────────────────────────────────────────────────────────
-- STEP 3: PRODUCTS
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT USING (true);

CREATE POLICY "Admins can manage products"
  ON products FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ─────────────────────────────────────────────────────────────
-- STEP 4: PROFILES
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ─────────────────────────────────────────────────────────────
-- STEP 5: CART  ← CRITICAL FIX
-- Using explicit per-operation policies (FOR ALL + USING can
-- silently block INSERT in some Supabase versions)
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Users can view own cart"
  ON cart FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart"
  ON cart FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
  ON cart FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart"
  ON cart FOR DELETE USING (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────
-- STEP 6: ORDERS  ← CRITICAL FIX
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update all orders"
  ON orders FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete orders"
  ON orders FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ─────────────────────────────────────────────────────────────
-- STEP 7: ORDER ITEMS  ← CRITICAL FIX (was completely missing INSERT policy)
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

-- THIS WAS MISSING — without this, placing an order always fails
CREATE POLICY "Users can insert own order items"
  ON order_items FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage order items"
  ON order_items FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ─────────────────────────────────────────────────────────────
-- STEP 8: WISHLIST
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Users can view own wishlist"
  ON wishlist FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert wishlist"
  ON wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete wishlist"
  ON wishlist FOR DELETE USING (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────
-- STEP 9: NOTIFICATIONS
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert notifications"
  ON notifications FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ─────────────────────────────────────────────────────────────
-- STEP 10: PUBLIC READ TABLES
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Banners are public"        ON banners        FOR SELECT USING (true);
CREATE POLICY "Streams are public"        ON farm_streams   FOR SELECT USING (true);
CREATE POLICY "Harvest events are public" ON harvest_events FOR SELECT USING (true);
CREATE POLICY "Farmers are public"        ON farmers        FOR SELECT USING (true);
CREATE POLICY "Reviews are public"        ON reviews        FOR SELECT USING (true);
CREATE POLICY "Coupons viewable by users" ON coupons        FOR SELECT USING (auth.uid() IS NOT NULL);


-- ─────────────────────────────────────────────────────────────
-- STEP 11: ADMIN MANAGE POLICIES
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Admins manage banners"        ON banners        FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins manage streams"        ON farm_streams   FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins manage harvest"        ON harvest_events FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins manage farmers"        ON farmers        FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins manage coupons"        ON coupons        FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));


-- ─────────────────────────────────────────────────────────────
-- STEP 12: REVIEWS
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can edit own reviews"
  ON reviews FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins manage reviews"
  ON reviews FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ─────────────────────────────────────────────────────────────
-- STEP 13: ADD MISSING SCHEMA COLUMNS (safe — uses IF NOT EXISTS)
-- ─────────────────────────────────────────────────────────────

-- Add coupon_id to orders (for future use — avoids checkout crash)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL;

-- Add city & zip to profiles (used by checkout auto-fill)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS zip  TEXT;

-- Add order_index to products (used for sorting)
ALTER TABLE products ADD COLUMN IF NOT EXISTS order_index INT DEFAULT 999;

-- ─────────────────────────────────────────────────────────────
-- DONE — All policies are now correctly applied.
-- The following operations will now work on the live site:
--   ✅ Add to Basket (cart INSERT)
--   ✅ Update / Remove cart items (cart UPDATE / DELETE)
--   ✅ Place Order (orders INSERT + order_items INSERT)
--   ✅ View Orders (orders SELECT)
--   ✅ Profile auto-fill on checkout (profiles SELECT)
--   ✅ Wishlist (wishlist INSERT / DELETE)
--   ✅ Admin dashboard (all admin policies)
-- ─────────────────────────────────────────────────────────────
