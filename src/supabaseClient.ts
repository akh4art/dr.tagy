import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

// ── Orders ───────────────────────────────────────────────────
export async function fetchOrders(): Promise<DbOrder[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('fetchOrders:', error.message); return []; }
  return data ?? [];
}

export async function insertOrder(order: Omit<DbOrder, 'updated_at'>): Promise<DbOrder | null> {
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
  const { error } = await supabase
    .from('orders')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) { console.error('updateOrder:', error.message); return false; }
  return true;
}

export async function deleteOrder(id: string): Promise<boolean> {
  const { error } = await supabase.from('orders').delete().eq('id', id);
  if (error) { console.error('deleteOrder:', error.message); return false; }
  return true;
}

// ── Uploaded Review Images ────────────────────────────────────
export async function fetchUploadedImages(): Promise<{ id: number; image_url: string; caption?: string }[]> {
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
  const { data, error } = await supabase
    .from('uploaded_review_images')
    .insert([{ image_url, caption }])
    .select()
    .single();
  if (error) { console.error('insertUploadedImage:', error.message); return null; }
  return data;
}

export async function deleteUploadedImage(id: number): Promise<boolean> {
  const { error } = await supabase.from('uploaded_review_images').delete().eq('id', id);
  if (error) { console.error('deleteUploadedImage:', error.message); return false; }
  return true;
}
