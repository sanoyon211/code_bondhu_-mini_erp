import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

interface StatusBadgeProps {
  status: StockStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  let badgeColorClass = '';

  switch (status) {
    case 'In Stock':
      badgeColorClass = 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200';
      break;
    case 'Low Stock':
      badgeColorClass = 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200';
      break;
    case 'Out of Stock':
      badgeColorClass = 'bg-red-100 text-red-800 hover:bg-red-200 border-red-200';
      break;
    default:
      badgeColorClass = 'bg-slate-100 text-slate-800 border-slate-200';
  }

  return (
    <Badge 
      variant="outline" 
      className={cn("font-medium", badgeColorClass, className)}
    >
      {status}
    </Badge>
  );
}

// Helper to determine status based on quantity
export function getStockStatus(quantity: number, lowStockThreshold: number = 10): StockStatus {
  if (quantity <= 0) return 'Out of Stock';
  if (quantity <= lowStockThreshold) return 'Low Stock';
  return 'In Stock';
}
