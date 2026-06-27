import { supabase } from '@/lib/supabase';

export interface DashboardMetrics {
  totalProducts: number;
  totalCustomers: number;
  totalSuppliers: number;
  totalPurchases: number;
  totalSales: number;
  revenue: number;
}

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    const [
      { count: productsCount },
      { count: customersCount },
      { count: suppliersCount },
      { count: purchasesCount },
      { count: salesCount },
      { data: salesData }
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('customers').select('*', { count: 'exact', head: true }),
      supabase.from('suppliers').select('*', { count: 'exact', head: true }),
      supabase.from('purchases').select('*', { count: 'exact', head: true }),
      supabase.from('sales').select('*', { count: 'exact', head: true }),
      supabase.from('sales').select('quantity, unit_price')
    ]);

    const revenue = salesData?.reduce((sum, sale) => sum + ((Number(sale.quantity) || 0) * (Number(sale.unit_price) || 0)), 0) || 0;

    return {
      totalProducts: productsCount || 0,
      totalCustomers: customersCount || 0,
      totalSuppliers: suppliersCount || 0,
      totalPurchases: purchasesCount || 0,
      totalSales: salesCount || 0,
      revenue,
    };
  }
};
