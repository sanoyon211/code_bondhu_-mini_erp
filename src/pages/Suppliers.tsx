import React from 'react';
import { ContactManager } from '@/components/shared/ContactManager';
import { supplierService } from '@/services/supplierService';

export default function Suppliers() {
  return (
    <ContactManager
      type="supplier"
      title="Suppliers"
      description="Manage your supplier directory."
      fetchData={supplierService.getAll}
      createData={supplierService.create}
      updateData={supplierService.update}
      deleteData={supplierService.delete}
    />
  );
}
