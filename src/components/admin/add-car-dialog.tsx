'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useFirestore } from '@/firebase';
import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const addCarFormSchema = z.object({
  name: z.string().min(1, 'Car name is required.'),
  description: z.string().min(1, 'Description is required.'),
  totalValue: z.coerce.number().min(1, 'Total value must be greater than 0.'),
  roi: z.coerce.number().min(0, 'ROI cannot be negative.'),
  imageId: z.string().min(1, 'Please select an image.'),
});

type AddCarFormValues = z.infer<typeof addCarFormSchema>;

export function AddCarDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<AddCarFormValues>({
    resolver: zodResolver(addCarFormSchema),
    defaultValues: {
      name: '',
      description: '',
      totalValue: 0,
      roi: 0,
      imageId: '',
    },
  });

  async function onSubmit(values: AddCarFormValues) {
    if (!firestore) return;
    setIsLoading(true);

    try {
      const carsCol = collection(firestore, 'cars');
      await addDoc(carsCol, {
        ...values,
        investedAmount: 0,
        status: 'available',
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Car Added!',
        description: `${values.name} is now available for investment.`,
      });

      form.reset();
      setOpen(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Car</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a New Car</DialogTitle>
          <DialogDescription>
            Fill in the details of the new car to make it available for investment.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Car Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Toyota Camry 2023" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A short description of the car..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="totalValue"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Total Value (GHS)</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="roi"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Monthly ROI (%)</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <FormField
                control={form.control}
                name="imageId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Car Image</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a car image" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {PlaceHolderImages.map((image) => (
                            <SelectItem key={image.id} value={image.id}>
                                {image.description}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Car
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
