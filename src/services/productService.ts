import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';

export type CreateProductPayload = Omit<Product, 'id' | 'created_at'>;
export type UpdateProductPayload = Partial<CreateProductPayload>;

export const productService = {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    
    return data as Product[];
  },

  async createProduct(payload: CreateProductPayload): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert([payload])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    
    return data as Product;
  },

  async updateProduct(id: string, payload: UpdateProductPayload): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    
    return data as Product;
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }
};
