
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import type { Car } from '@/lib/types';
import { AddCarDialog } from './add-car-dialog';
import { ViewCarDialog } from './view-car-dialog';
import { DeleteCarDialog } from './delete-car-dialog';

export function CarActions({ car }: { car: Car }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <ViewCarDialog car={car}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
        </ViewCarDialog>
        <AddCarDialog car={car}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
            </DropdownMenuItem>
        </AddCarDialog>
        <DropdownMenuSeparator />
        <DeleteCarDialog carId={car.id}>
             <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
            </DropdownMenuItem>
        </DeleteCarDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
