export interface Product {
  id: string; // UUID
  created_at: string;
  name: string;
  sku: string;
  description?: string;
  selling_price: number;
  cost_price: number;
  stock: number;
  category?: string;
  supplier_id?: string;
}

export interface Customer {
  id: string; // UUID
  created_at: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface Supplier {
  id: string; // UUID
  created_at: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface Purchase {
  id: string; // UUID
  created_at: string;
  supplier_id: string;
  product_id: string;
  quantity: number;
  unit_cost: number;
  // Joined fields
  products?: { name: string };
  suppliers?: { name: string };
}

export interface Sale {
  id: string; // UUID
  created_at: string;
  invoice_no?: string;
  customer_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  payment_method?: string;
  // Joined fields
  products?: { name: string };
  customers?: { name: string; email: string; phone: string; address: string };
}
