import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Loader2, AlertCircle } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export type ContactType = 'customer' | 'supplier';

export interface ContactData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at?: string;
}

interface ContactManagerProps {
  type: ContactType;
  title: string;
  description: string;
  fetchData: () => Promise<ContactData[]>;
  createData: (data: any) => Promise<any>;
  updateData: (id: string, data: any) => Promise<any>;
  deleteData: (id: string) => Promise<void>;
}

export function ContactManager({
  type,
  title,
  description,
  fetchData,
  createData,
  updateData,
  deleteData,
}: ContactManagerProps) {
  const [dataList, setDataList] = useState<ContactData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingItem, setEditingItem] = useState<ContactData | null>(null);
  
  const defaultFormData = {
    name: '',
    email: '',
    phone: '',
    address: '',
  };
  
  const [formData, setFormData] = useState(defaultFormData);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ContactData | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchData();
      setDataList(data);
    } catch (error: any) {
      toast.error(error.message || `Failed to fetch ${type}s`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenDialog = (item?: ContactData) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        email: item.email,
        phone: item.phone || '',
        address: item.address || '',
      });
    } else {
      setEditingItem(null);
      setFormData(defaultFormData);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const payload: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        address: formData.address || null,
      };

      if (editingItem) {
        await updateData(editingItem.id, payload);
        toast.success(`${type === 'customer' ? 'Customer' : 'Supplier'} updated successfully`);
      } else {
        await createData(payload);
        toast.success(`${type === 'customer' ? 'Customer' : 'Supplier'} created successfully`);
      }
      handleCloseDialog();
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePrompt = (item: ContactData) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      setIsSubmitting(true);
      await deleteData(itemToDelete.id);
      toast.success(`${type === 'customer' ? 'Customer' : 'Supplier'} deleted successfully`);
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <PageHeader 
        title={title} 
        description={description}
        action={
          <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add {type === 'customer' ? 'Customer' : 'Supplier'}
          </Button>
        }
      />

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold text-slate-900">Name</TableHead>
                <TableHead className="font-semibold text-slate-900">Email</TableHead>
                <TableHead className="font-semibold text-slate-900">Phone</TableHead>
                <TableHead className="font-semibold text-slate-900">Address</TableHead>
                <TableHead className="font-semibold text-slate-900 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400 mx-auto" />
                    <span className="text-slate-500 mt-2 block">Loading {type}s...</span>
                  </TableCell>
                </TableRow>
              ) : dataList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <AlertCircle className="w-8 h-8 mb-2 text-slate-400" />
                      <p>No {type}s found.</p>
                      <Button variant="link" onClick={() => handleOpenDialog()} className="mt-1 text-blue-600">
                        Add your first {type}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                dataList.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-slate-900">{item.name}</TableCell>
                    <TableCell className="text-slate-500">{item.email}</TableCell>
                    <TableCell className="text-slate-500">{item.phone || '-'}</TableCell>
                    <TableCell className="text-slate-500 max-w-xs truncate" title={item.address}>{item.address || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleOpenDialog(item)}
                          className="h-8 px-2 text-slate-600 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeletePrompt(item)}
                          className="h-8 px-2 text-slate-600 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingItem ? `Edit ${type === 'customer' ? 'Customer' : 'Supplier'}` : `Add New ${type === 'customer' ? 'Customer' : 'Supplier'}`}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">{type === 'customer' ? 'Customer Name' : 'Supplier Name'} *</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email"
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Textarea 
                  id="address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingItem ? 'Save Changes' : `Create ${type === 'customer' ? 'Customer' : 'Supplier'}`}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete {type === 'customer' ? 'Customer' : 'Supplier'}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-600">
              Are you sure you want to delete <span className="font-semibold text-slate-900">{itemToDelete?.name}</span>? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
