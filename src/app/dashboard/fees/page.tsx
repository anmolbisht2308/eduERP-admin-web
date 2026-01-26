'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFeeStructures, useInvoices } from '@/features/finance/hooks/use-finance';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

export default function FeesPage() {
    const { data: structures } = useFeeStructures();
    const { data: invoicesData } = useInvoices({ limit: 10 });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Fees & Finance</h1>

            <Tabs defaultValue="invoices" className="w-full">
                <TabsList>
                    <TabsTrigger value="invoices">Invoices</TabsTrigger>
                    <TabsTrigger value="structures">Fee Structures</TabsTrigger>
                </TabsList>

                <TabsContent value="invoices">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Invoices</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Invoice #</TableHead>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoicesData?.invoices?.map((inv: any) => (
                                        <TableRow key={inv._id}>
                                            <TableCell>{inv.invoiceNumber}</TableCell>
                                            <TableCell>{inv.studentId?.firstName}</TableCell>
                                            <TableCell>{format(new Date(inv.dueDate), 'dd MMM yyyy')}</TableCell>
                                            <TableCell>₹ {inv.totalAmount}</TableCell>
                                            <TableCell>
                                                <Badge variant={inv.status === 'paid' ? 'default' : 'destructive'}>
                                                    {inv.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="outline" size="sm">View</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {invoicesData?.invoices?.length === 0 && (
                                        <TableRow><TableCell colSpan={6} className="text-center">No invoices found</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="structures">
                    <Card>
                        <CardHeader>
                            <CardTitle>Fee Structures</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {structures?.map((st: any) => (
                                    <Card key={st._id}>
                                        <CardHeader>
                                            <CardTitle className="text-lg">{st.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-2xl font-bold">₹ {st.amount}</p>
                                            <p className="text-sm text-muted-foreground">{st.frequency}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
