import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://aitqgdjdpobbaijtwmxm.supabase.co';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdHFnZGpkcG9iYmFpanR3bXhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MzE0NDUsImV4cCI6MjA5OTEwNzQ0NX0.Dt6984bbTKFLhU6CbSjyJQvGIWoHfj209_VwfcMzLpc';

const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ── Types ────────────────────────────────────────────────────
export interface DbOrder {
  id: string;
  full_name: string;
  phone: string;
  city: string;
  address: string;
  selected_offer: 'bundle' | 'single';
  selected_product_id?: string;
  selected_product_name?: string;
  quantity: number;
  total_price: number;
  status: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

function noopClient() {
  console.warn('Supabase is not configured (VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing)');
}

// ── Orders ───────────────────────────────────────────────────
export async function fetchOrders(): Promise<DbOrder[]> {
  if (!supabase) { noopClient(); return []; }
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('fetchOrders:', error.message); return []; }
  return data ?? [];
}

export async function insertOrder(order: Omit<DbOrder, 'updated_at'>): Promise<DbOrder | null> {
  if (!supabase) { noopClient(); return null; }
  const { data, error } = await supabase
    .from('orders')
    .insert([{ ...order, updated_at: new Date().toISOString() }])
    .select()
    .single();
  if (error) { console.error('insertOrder:', error.message); return null; }
  return data;
}

export async function updateOrderStatus(
  id: string,
  status: DbOrder['status']
): Promise<boolean> {
  if (!supabase) { noopClient(); return false; }
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) { console.error('updateOrderStatus:', error.message); return false; }
  return true;
}

export async function updateOrder(
  id: string,
  fields: Partial<DbOrder>
): Promise<boolean> {
  if (!supabase) { noopClient(); return false; }
  const { error } = await supabase
    .from('orders')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) { console.error('updateOrder:', error.message); return false; }
  return true;
}

export async function deleteOrder(id: string): Promise<boolean> {
  if (!supabase) { noopClient(); return false; }
  const { error } = await supabase.from('orders').delete().eq('id', id);
  if (error) { console.error('deleteOrder:', error.message); return false; }
  return true;
}

// ── Uploaded Review Images ────────────────────────────────────
export async function fetchUploadedImages(): Promise<{ id: number; image_url: string; caption?: string }[]> {
  if (!supabase) { noopClient(); return []; }
  const { data, error } = await supabase
    .from('uploaded_review_images')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) { console.error('fetchUploadedImages:', error.message); return []; }
  return data ?? [];
}

export async function insertUploadedImage(
  image_url: string,
  caption?: string
): Promise<{ id: number; image_url: string } | null> {
  if (!supabase) { noopClient(); return null; }
  const { data, error } = await supabase
    .from('uploaded_review_images')
    .insert([{ image_url, caption }])
    .select()
    .single();
  if (error) { console.error('insertUploadedImage:', error.message); return null; }
  return data;
}

export async function deleteUploadedImage(id: number): Promise<boolean> {
  if (!supabase) { noopClient(); return false; }
  const { error } = await supabase.from('uploaded_review_images').delete().eq('id', id);
  if (error) { console.error('deleteUploadedImage:', error.message); return false; }
  return true;
}
