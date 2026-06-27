import { supabase } from '@/lib/supabase';
import type { Sale } from '@/types';

export type CreateSalePayload = Omit<Sale, 'id' | 'created_at' | 'products' | 'customers' | 'invoice_no'>;

export const salesService = {
  async getSales(): Promise<Sale[]> {
    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        products ( name ),
        customers ( name )
      `)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as unknown as Sale[];
  },

  async getSaleById(id: string): Promise<Sale> {
    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        products ( name ),
        customers ( name, email, phone, address )
      `)
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data as unknown as Sale;
  },

  async createSaleWithStockUpdate(payload: CreateSalePayload): Promise<Sale> {
    // 1. Fetch current product stock
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('stock')
      .eq('id', payload.product_id)
      .single();

    if (productError) throw new Error(`Failed to fetch product stock: ${productError.message}`);

    const currentStock = product.stock || 0;

    // 2. Check stock
    if (currentStock < payload.quantity) {
      throw new Error(`Not enough stock. Available: ${currentStock}, Requested: ${payload.quantity}`);
    }

    const newStock = currentStock - payload.quantity;

    // 3. Generate Invoice Number
    const invoice_no = `INV-${Date.now()}`;

    // 4. Insert sale record
    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .insert([{ ...payload, invoice_no }])
      .select()
      .single();

    if (saleError) throw new Error(`Failed to create sale: ${saleError.message}`);

    // 5. Update product stock
    const { error: updateError } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', payload.product_id);

    if (updateError) throw new Error(`Failed to update product stock: ${updateError.message}`);

    return saleData as Sale;
  }
};
