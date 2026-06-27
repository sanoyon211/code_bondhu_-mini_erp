import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/shared/MetricCard';
import { Package, Users, Truck, ShoppingCart, TrendingUp, DollarSign, Loader2 } from 'lucide-react';
import { dashboardService, type DashboardMetrics } from '@/services/dashboardService';
import { salesService } from '@/services/salesService';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [dashboardMetrics, salesData] = await Promise.all([
          dashboardService.getMetrics(),
          salesService.getSales()
        ]);
        
        setMetrics(dashboardMetrics);
        
        // Prepare chart data (last 7 sales or so)
        const chartData = salesData.slice(0, 7).reverse().map(sale => ({
          name: sale.invoice_no || sale.id.substring(0, 8),
          total: Number((sale.quantity || 0) * (sale.unit_price || 0))
        }));
        setRecentSales(chartData);

      } catch (error: any) {
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading || !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Welcome to your Mini ERP dashboard.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Total Products"
          value={metrics.totalProducts.toString()}
          icon={Package}
          subText="+4% from last month"
        />
        <MetricCard
          title="Total Customers"
          value={metrics.totalCustomers.toString()}
          icon={Users}
          subText="+12% from last month"
        />
        <MetricCard
          title="Total Suppliers"
          value={metrics.totalSuppliers.toString()}
          icon={Truck}
          subText="+2% from last month"
        />
        <MetricCard
          title="Total Purchases"
          value={metrics.totalPurchases.toString()}
          icon={ShoppingCart}
        />
        <MetricCard
          title="Total Sales"
          value={metrics.totalSales.toString()}
          icon={TrendingUp}
        />
        <MetricCard
          title="Total Revenue"
          value={`$${metrics.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          subText="Calculated from completed sales"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales Activity</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recentSales}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
