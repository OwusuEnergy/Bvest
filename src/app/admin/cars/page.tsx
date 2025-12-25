
'use client';
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { Car } from "@/lib/types";
import { collection, query, orderBy } from "firebase/firestore";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

export default function AdminCarsPage() {
    const firestore = useFirestore();

    const carsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'cars'), orderBy('name'));
    }, [firestore]);

    const { data: cars, isLoading } = useCollection<Car>(carsQuery);

    const formatCurrency = (amount: number = 0) => {
        return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS', currencyDisplay: 'symbol' }).format(amount);
    }

    return (
        <div className="animate-fade-in-up">
            <PageHeader
                title="Manage Cars"
                description="Add, edit, or remove cars available for investment."
            >
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Car
                </Button>
            </PageHeader>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead style={{ width: '80px' }}>Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Total Value</TableHead>
                                <TableHead>Amount Invested</TableHead>
                                <TableHead>ROI</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={7} className="h-24 text-center">Loading...</TableCell>
                                </TableRow>
                            ))}
                            {cars && cars.map((car) => {
                                const carImage = PlaceHolderImages.find(img => img.id === car.imageId);
                                return (
                                <TableRow key={car.id}>
                                    <TableCell>
                                        <div className="relative h-12 w-16 rounded-md overflow-hidden">
                                        {carImage ? (
                                            <Image src={carImage.imageUrl} alt={car.name} fill className="object-cover" />
                                        ) : (
                                            <div className="h-full w-full bg-muted" />
                                        )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{car.name}</TableCell>
                                    <TableCell>{formatCurrency(car.totalValue)}</TableCell>
                                    <TableCell>{formatCurrency(car.investedAmount)}</TableCell>
                                    <TableCell>{car.roi}%</TableCell>
                                    <TableCell>
                                        <Badge variant={car.status === 'available' ? 'default' : 'secondary'}>{car.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm">Edit</Button>
                                    </TableCell>
                                </TableRow>
                                )
                            })}
                             {cars?.length === 0 && !isLoading && (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">No cars found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

    