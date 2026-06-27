import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, AlertCircle, FileText } from 'lucide-react';
import { salesService } from '@/services/salesService';
import { productService } from '@/services/productService';
import { customerService } from '@/services/customerService';
import type { Sale, Product, Customer } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_id: '',
    product_id: '',
    quantity: 1,
    unit_price: 0,
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [salesData, productsData, customersData] = await Promise.all([
        salesService.getSales(),
        productService.getProducts(),
        customerService.getAll(),
      ]);
      setSales(salesData);
      setProducts(productsData);
      setCustomers(customersData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenDialog = () => {
    setFormData({
      customer_id: '',
      product_id: '',
      quantity: 1,
      unit_price: 0,
    });
    setIsDialogOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'unit_price' 
        ? parseFloat(value) || 0 
        : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const updates = { ...prev, [name]: value };
      
      // Auto-fill unit price if product is selected
      if (name === 'product_id') {
        const selectedProduct = products.find(p => p.id === value);
        if (selectedProduct) {
          updates.unit_price = selectedProduct.selling_price || 0;
        }
      }
      return updates;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_id || !formData.product_id) {
      toast.error('Please select both a customer and a product.');
      return;
    }
    if (formData.quantity <= 0) {
      toast.error('Quantity must be greater than 0.');
      return;
    }

    try {
      setIsSubmitting(true);
      const newSale = await salesService.createSaleWithStockUpdate({
        customer_id: formData.customer_id,
        product_id: formData.product_id,
        quantity: formData.quantity,
        unit_price: formData.unit_price,
      });
      toast.success('Sale completed successfully!', {
        action: {
          label: 'View Invoice',
          onClick: () => navigate(`/sales/${newSale.id}/invoice`)
        },
        duration: 5000,
      });
      setIsDialogOpen(false);
      loadData(); // Reload to get updated stock and sales list
    } catch (error: any) {
      toast.error(error.message || 'Failed to record sale');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <PageHeader 
        title="Sales" 
        description="Record new sales and manage invoices."
        action={
          <Button onClick={handleOpenDialog} className="bg-violet-600 hover:bg-violet-700">
            <Plus className="w-4 h-4 mr-2" />
            New Sale
          </Button>
        }
      />

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold text-slate-900">Date</TableHead>
                <TableHead className="font-semibold text-slate-900">Invoice No</TableHead>
                <TableHead className="font-semibold text-slate-900">Customer</TableHead>
                <TableHead className="font-semibold text-slate-900">Product</TableHead>
                <TableHead className="font-semibold text-slate-900 text-right">Qty</TableHead>
                <TableHead className="font-semibold text-slate-900 text-right">Total</TableHead>
                <TableHead className="font-semibold text-slate-900 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400 mx-auto" />
                    <span className="text-slate-500 mt-2 block">Loading sales...</span>
                  </TableCell>
                </TableRow>
              ) : sales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <AlertCircle className="w-8 h-8 mb-2 text-slate-400" />
                      <p>No sales yet.</p>
                      <Button variant="link" onClick={handleOpenDialog} className="mt-1 text-violet-600">
                        Record your first sale
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="text-slate-500">
                      {new Date(sale.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      {sale.invoice_no || '-'}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {sale.customers?.name || 'Unknown'}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      {sale.products?.name || 'Unknown'}
                    </TableCell>
                    <TableCell className="text-right">{sale.quantity}</TableCell>
                    <TableCell className="text-right font-medium">${Number((sale.quantity || 0) * (sale.unit_price || 0)).toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate(`/sales/${sale.id}/invoice`)}
                        className="h-8 px-2 text-slate-600 hover:text-violet-600"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Invoice
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Record New Sale</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Customer *</Label>
                <Select onValueChange={(val) => handleSelectChange('customer_id', val)} value={formData.customer_id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer">
                      {formData.customer_id ? customers.find(c => c.id === formData.customer_id)?.name : "Select a customer"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Product *</Label>
                <Select onValueChange={(val) => handleSelectChange('product_id', val)} value={formData.product_id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product">
                      {formData.product_id ? products.find(p => p.id === formData.product_id)?.name : "Select a product"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} (Stock: {p.stock})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input 
                    id="quantity" 
                    name="quantity" 
                    type="number" 
                    min="1"
                    step="1"
                    value={formData.quantity || ''} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unit_price">Unit Price *</Label>
                  <Input 
                    id="unit_price" 
                    name="unit_price" 
                    type="number" 
                    min="0"
                    step="0.01"
                    value={formData.unit_price || ''} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>

              <div className="mt-2 text-right">
                <span className="text-sm text-slate-500">Total Amount: </span>
                <span className="text-lg font-bold text-slate-900">
                  ${(formData.quantity * formData.unit_price || 0).toFixed(2)}
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" className="bg-violet-600 hover:bg-violet-700" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Confirm Sale
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
