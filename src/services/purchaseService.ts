import { supabase } from '@/lib/supabase';
import type { Purchase } from '@/types';

export type CreatePurchasePayload = Omit<Purchase, 'id' | 'created_at' | 'products' | 'suppliers'>;

export const purchaseService = {
  async getPurchases(): Promise<Purchase[]> {
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        products ( name ),
        suppliers ( name )
      `)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as unknown as Purchase[];
  },

  async createPurchaseWithStockUpdate(payload: CreatePurchasePayload): Promise<Purchase> {
    // 1. Fetch current product stock
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('stock_quantity')
      .eq('id', payload.product_id)
      .single();

    if (productError) throw new Error(`Failed to fetch product stock: ${productError.message}`);

    const newStock = (product.stock_quantity || 0) + payload.quantity;

    // 2. Insert purchase record
    const { data: purchaseData, error: purchaseError } = await supabase
      .from('purchases')
      .insert([payload])
      .select()
      .single();

    if (purchaseError) throw new Error(`Failed to create purchase: ${purchaseError.message}`);

    // 3. Update product stock
    const { error: updateError } = await supabase
      .from('products')
      .update({ stock_quantity: newStock })
      .eq('id', payload.product_id);

    if (updateError) throw new Error(`Failed to update product stock: ${updateError.message}`);

    return purchaseData as Purchase;
  }
};
