import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Printer, Loader2 } from 'lucide-react';
import { productService } from '@/services/productService';
import { customerService } from '@/services/customerService';
import { supplierService } from '@/services/supplierService';
import { purchaseService } from '@/services/purchaseService';
import { salesService } from '@/services/salesService';
import type { Product, Customer, Supplier, Purchase, Sale } from '@/types';
import { toast } from 'sonner';

export default function Reports() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const [prodData, custData, suppData, purData, saleData] = await Promise.all([
          productService.getProducts(),
          customerService.getAll(),
          supplierService.getAll(),
          purchaseService.getPurchases(),
          salesService.getSales(),
        ]);
        setProducts(prodData);
        setCustomers(custData);
        setSuppliers(suppData);
        setPurchases(purData);
        setSales(saleData);
      } catch (error) {
        toast.error('Failed to load report data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <PageHeader 
          title="Reports" 
          description="View and print detailed reports across all modules."
        />
        <Button onClick={handlePrint} className="bg-violet-600 hover:bg-violet-700">
          <Printer className="w-4 h-4 mr-2" />
          Print Report
        </Button>
      </div>

      <div className="print:block hidden mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Mini ERP Master Report</h1>
        <p className="text-slate-500">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="flex w-full flex-wrap sm:grid sm:grid-cols-5 h-auto print:hidden">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales">
          <Card className="print:shadow-none print:border-none">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Sales Report</h2>
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice No</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.invoice_no}</TableCell>
                      <TableCell>{new Date(sale.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{sale.customers?.name}</TableCell>
                      <TableCell>{sale.products?.name}</TableCell>
                      <TableCell className="text-right">${Number((sale.quantity || 0) * (sale.unit_price || 0)).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  {sales.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center">No sales found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases">
          <Card className="print:shadow-none print:border-none">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Purchases Report</h2>
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>{new Date(purchase.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{purchase.suppliers?.name}</TableCell>
                      <TableCell>{purchase.products?.name}</TableCell>
                      <TableCell>{purchase.quantity}</TableCell>
                      <TableCell className="text-right">${Number((purchase.quantity || 0) * (purchase.unit_cost || 0)).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  {purchases.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center">No purchases found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card className="print:shadow-none print:border-none">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Products Inventory Report</h2>
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.sku}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right">{product.stock}</TableCell>
                      <TableCell className="text-right">${Number(product.selling_price).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  {products.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center">No products found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card className="print:shadow-none print:border-none">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Customers Report</h2>
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone || '-'}</TableCell>
                    </TableRow>
                  ))}
                  {customers.length === 0 && (
                    <TableRow><TableCell colSpan={3} className="text-center">No customers found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers">
          <Card className="print:shadow-none print:border-none">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Suppliers Report</h2>
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>{supplier.email}</TableCell>
                      <TableCell>{supplier.phone || '-'}</TableCell>
                    </TableRow>
                  ))}
                  {suppliers.length === 0 && (
                    <TableRow><TableCell colSpan={3} className="text-center">No suppliers found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
