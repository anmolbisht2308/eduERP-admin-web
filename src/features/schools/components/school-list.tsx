'use client';

import { School } from '../services/school-service';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Building2, Mail, MapPin, Phone } from 'lucide-react';

interface SchoolListProps {
    schools: School[];
}

export function SchoolList({ schools }: SchoolListProps) {
    if (schools.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl border-muted bg-muted/20">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Building2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">No schools found</h3>
                <p className="text-muted-foreground max-w-sm mt-2">
                    Get started by creating your first school using the "Add School" button above.
                </p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden"
        >
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[300px]">School Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Contact Info</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Joined</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {schools.map((school) => (
                        <TableRow key={school._id} className="hover:bg-muted/50 transition-colors">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                                        <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-foreground">{school.name}</div>
                                        <div className="text-xs text-muted-foreground">ID: {school._id.slice(-6)}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-start gap-2 text-sm text-muted-foreground max-w-[200px] truncate">
                                    <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                                    {school.address}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span>{school.contactEmail}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Phone className="h-3 w-3" />
                                        <span>{school.contactPhone}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    className={`${school.isActive
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100'
                                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-100'
                                        } border-0 shadow-none`}
                                >
                                    <div className={`h-1.5 w-1.5 rounded-full mr-2 ${school.isActive ? 'bg-emerald-500' : 'bg-zinc-500'}`} />
                                    {school.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground text-sm">
                                {format(new Date(school.createdAt), 'MMM d, yyyy')}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </motion.div>
    );
}
