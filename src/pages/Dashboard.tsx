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
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1.5 mb-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-violet-800 to-slate-700">
          Dashboard
        </h1>
        <p className="text-slate-500 font-medium">Welcome back! Here's an overview of your business.</p>
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
        <Card className="border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100/50 pb-5">
            <CardTitle className="text-lg font-semibold text-slate-800">Recent Sales Activity</CardTitle>
          </CardHeader>
          <CardContent className="h-[380px] pt-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recentSales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.5}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0,0,0,0.1)' }}
                />
                <Bar dataKey="total" fill="url(#colorTotal)" radius={[6, 6, 0, 0]} barSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
