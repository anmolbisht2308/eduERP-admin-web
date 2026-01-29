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

interface SchoolListProps {
    schools: School[];
}

export function SchoolList({ schools }: SchoolListProps) {
    if (schools.length === 0) {
        return <div className="text-center p-8 text-gray-500">No schools found</div>;
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {schools.map((school) => (
                        <TableRow key={school._id}>
                            <TableCell className="font-medium">{school.name}</TableCell>
                            <TableCell>{school.address}</TableCell>
                            <TableCell>
                                <div className="text-sm">{school.contactEmail}</div>
                                <div className="text-xs text-gray-500">{school.contactPhone}</div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={school.isActive ? 'default' : 'secondary'}>
                                    {school.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </TableCell>
                            <TableCell>{format(new Date(school.createdAt), 'MMM d, yyyy')}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
