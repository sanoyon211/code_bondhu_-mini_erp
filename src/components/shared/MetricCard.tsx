import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subText?: string;
}

export function MetricCard({ title, value, icon: Icon, subText }: MetricCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardHeader className="relative flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-slate-500">
          {title}
        </CardTitle>
        <div className="p-2.5 rounded-xl bg-slate-50/80 text-slate-400 group-hover:bg-violet-100 group-hover:text-violet-600 transition-all duration-300 shadow-sm border border-slate-100/50">
          <Icon className="w-4 h-4" />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-3xl font-bold tracking-tight text-slate-900 group-hover:text-violet-950 transition-colors">{value}</div>
        {subText && (
          <p className="text-xs font-medium text-slate-500 mt-2 flex items-center">
            {subText}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
