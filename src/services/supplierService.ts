import { supabase } from '@/lib/supabase';
import type { Supplier } from '@/types';

export type CreateSupplierPayload = Omit<Supplier, 'id' | 'created_at'>;
export type UpdateSupplierPayload = Partial<CreateSupplierPayload>;

export const supplierService = {
  async getAll(): Promise<Supplier[]> {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as Supplier[];
  },

  async create(payload: CreateSupplierPayload): Promise<Supplier> {
    const { data, error } = await supabase
      .from('suppliers')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Supplier;
  },

  async update(id: string, payload: UpdateSupplierPayload): Promise<Supplier> {
    const { data, error } = await supabase
      .from('suppliers')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Supplier;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
};
