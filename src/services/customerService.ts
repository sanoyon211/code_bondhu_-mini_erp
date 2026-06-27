import { supabase } from '@/lib/supabase';
import type { Customer } from '@/types';

export type CreateCustomerPayload = Omit<Customer, 'id' | 'created_at'>;
export type UpdateCustomerPayload = Partial<CreateCustomerPayload>;

export const customerService = {
  async getAll(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as Customer[];
  },

  async create(payload: CreateCustomerPayload): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Customer;
  },

  async update(id: string, payload: UpdateCustomerPayload): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Customer;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
};
