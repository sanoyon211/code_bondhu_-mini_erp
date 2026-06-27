import React from 'react';
import { ContactManager } from '@/components/shared/ContactManager';
import { customerService } from '@/services/customerService';

export default function Customers() {
  return (
    <ContactManager
      type="customer"
      title="Customers"
      description="Manage your customer directory."
      fetchData={customerService.getAll}
      createData={customerService.create}
      updateData={customerService.update}
      deleteData={customerService.delete}
    />
  );
}
