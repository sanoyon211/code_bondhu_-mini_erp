import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, AlertCircle } from 'lucide-react';
import { purchaseService } from '@/services/purchaseService';
import { productService } from '@/services/productService';
import { supplierService } from '@/services/supplierService';
import type { Purchase, Product, Supplier } from '@/types';
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

export default function Purchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    supplier_id: '',
    product_id: '',
    quantity: 1,
    unit_cost: 0,
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [purchasesData, productsData, suppliersData] = await Promise.all([
        purchaseService.getPurchases(),
        productService.getProducts(),
        supplierService.getAll(),
      ]);
      setPurchases(purchasesData);
      setProducts(productsData);
      setSuppliers(suppliersData);
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
      supplier_id: '',
      product_id: '',
      quantity: 1,
      unit_cost: 0,
    });
    setIsDialogOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'unit_cost' 
        ? parseFloat(value) || 0 
        : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const updates = { ...prev, [name]: value };
      
      // Auto-fill unit cost if product is selected
      if (name === 'product_id') {
        const selectedProduct = products.find(p => p.id === value);
        if (selectedProduct) {
          updates.unit_cost = selectedProduct.cost_price || 0;
        }
      }
      return updates;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.supplier_id || !formData.product_id) {
      toast.error('Please select both a supplier and a product.');
      return;
    }
    if (formData.quantity <= 0) {
      toast.error('Quantity must be greater than 0.');
      return;
    }

    try {
      setIsSubmitting(true);
      await purchaseService.createPurchaseWithStockUpdate({
        supplier_id: formData.supplier_id,
        product_id: formData.product_id,
        quantity: formData.quantity,
        unit_cost: formData.unit_cost,
      });
      toast.success('Purchase recorded and stock updated successfully');
      setIsDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to record purchase');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <PageHeader 
        title="Purchases" 
        description="Record new purchases and view history."
        action={
          <Button onClick={handleOpenDialog} className="bg-violet-600 hover:bg-violet-700">
            <Plus className="w-4 h-4 mr-2" />
            New Purchase
          </Button>
        }
      />

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold text-slate-900">Date</TableHead>
                <TableHead className="font-semibold text-slate-900">Product</TableHead>
                <TableHead className="font-semibold text-slate-900">Supplier</TableHead>
                <TableHead className="font-semibold text-slate-900 text-right">Quantity</TableHead>
                <TableHead className="font-semibold text-slate-900 text-right">Unit Cost</TableHead>
                <TableHead className="font-semibold text-slate-900 text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400 mx-auto" />
                    <span className="text-slate-500 mt-2 block">Loading purchases...</span>
                  </TableCell>
                </TableRow>
              ) : purchases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <AlertCircle className="w-8 h-8 mb-2 text-slate-400" />
                      <p>No purchases yet.</p>
                      <Button variant="link" onClick={handleOpenDialog} className="mt-1 text-violet-600">
                        Record your first purchase
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                purchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="text-slate-500">
                      {new Date(purchase.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      {purchase.products?.name || 'Unknown'}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {purchase.suppliers?.name || 'Unknown'}
                    </TableCell>
                    <TableCell className="text-right">{purchase.quantity}</TableCell>
                    <TableCell className="text-right">${Number(purchase.unit_cost || 0).toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">${Number((purchase.quantity || 0) * (purchase.unit_cost || 0)).toFixed(2)}</TableCell>
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
              <DialogTitle>Record New Purchase</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Supplier *</Label>
                <Select onValueChange={(val) => handleSelectChange('supplier_id', val)} value={formData.supplier_id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a supplier">
                      {formData.supplier_id ? suppliers.find(s => s.id === formData.supplier_id)?.name : "Select a supplier"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
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
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
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
                  <Label htmlFor="unit_cost">Unit Cost *</Label>
                  <Input 
                    id="unit_cost" 
                    name="unit_cost" 
                    type="number" 
                    min="0"
                    step="0.01"
                    value={formData.unit_cost || ''} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>

              <div className="mt-2 text-right">
                <span className="text-sm text-slate-500">Total Amount: </span>
                <span className="text-lg font-bold text-slate-900">
                  ${(formData.quantity * formData.unit_cost || 0).toFixed(2)}
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" className="bg-violet-600 hover:bg-violet-700" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Record Purchase
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
