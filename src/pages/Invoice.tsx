import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { salesService } from '@/services/salesService';
import type { Sale } from '@/types';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Printer } from 'lucide-react';
import { toast } from 'sonner';

export default function Invoice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sale, setSale] = useState<Sale | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSale = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await salesService.getSaleById(id);
        setSale(data);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load invoice');
        navigate('/sales');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSale();
  }, [id, navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-700">Invoice not found</h2>
        <Button onClick={() => navigate('/sales')} className="mt-4">
          Return to Sales
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Non-printable header actions */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <Button variant="ghost" onClick={() => navigate('/sales')} className="text-slate-600 hover:text-blue-600">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sales
        </Button>
        <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
          <Printer className="w-4 h-4 mr-2" />
          Print Invoice
        </Button>
      </div>

      {/* Printable Invoice Area */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-8 print:shadow-none print:border-none print:p-0">
        <div className="flex justify-between items-start border-b border-slate-200 pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">INVOICE</h1>
            <p className="text-slate-500 mt-1">{sale.invoice_no}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-blue-600">Mini ERP</h2>
            <p className="text-slate-500 text-sm mt-1">123 Business Road<br/>Tech City, 10001<br/>contact@minierp.com</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Billed To</h3>
            <div className="text-slate-900">
              <p className="font-bold">{sale.customers?.name}</p>
              {sale.customers?.company && <p>{sale.customers.company}</p>}
              {sale.customers?.address && <p className="mt-1">{sale.customers.address}</p>}
              {sale.customers?.email && <p className="mt-1">{sale.customers.email}</p>}
              {sale.customers?.phone && <p>{sale.customers.phone}</p>}
            </div>
          </div>
          <div className="text-right">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Invoice Details</h3>
            <div className="text-slate-900">
              <p><span className="font-semibold text-slate-600 mr-2">Date:</span> {new Date(sale.created_at).toLocaleDateString()}</p>
              <p className="mt-1"><span className="font-semibold text-slate-600 mr-2">Status:</span> {sale.status}</p>
            </div>
          </div>
        </div>

        <table className="w-full mb-8">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 font-semibold text-slate-900">Item Description</th>
              <th className="text-center py-3 font-semibold text-slate-900">Quantity</th>
              <th className="text-right py-3 font-semibold text-slate-900">Unit Price</th>
              <th className="text-right py-3 font-semibold text-slate-900">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="py-4 text-slate-900">{sale.products?.name}</td>
              <td className="py-4 text-center text-slate-600">{sale.quantity}</td>
              <td className="py-4 text-right text-slate-600">${Number(sale.unit_price).toFixed(2)}</td>
              <td className="py-4 text-right font-medium text-slate-900">${Number(sale.total_amount).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-1/2">
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="font-semibold text-slate-600">Subtotal</span>
              <span className="text-slate-900">${Number(sale.total_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="font-bold text-lg text-slate-900">Total</span>
              <span className="font-bold text-lg text-blue-600">${Number(sale.total_amount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {sale.notes && (
          <div className="mt-8 border-t border-slate-200 pt-8">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Notes</h3>
            <p className="text-slate-600">{sale.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
