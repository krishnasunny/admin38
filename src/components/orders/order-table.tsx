import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, ArrowUpDown } from 'lucide-react';
import { Order, OrderSort } from '@/lib/types/order';
import { formatCurrency } from '@/lib/utils';

interface OrderTableProps {
  orders: Order[];
  sort: OrderSort;
  onSort: (sort: OrderSort) => void;
  onViewDetails: (order: Order) => void;
}

const statusColors = {
  pending: 'bg-yellow-500',
  processing: 'bg-blue-500',
  shipped: 'bg-purple-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};

export function OrderTable({ 
  orders, 
  sort,
  onSort,
  onViewDetails,
}: OrderTableProps) {
  const handleSort = (field: keyof Order) => {
    onSort({
      field,
      order: sort.field === field && sort.order === 'asc' ? 'desc' : 'asc',
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => handleSort('id')}
            >
              Order ID
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => handleSort('customerName')}
            >
              Customer
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => handleSort('status')}
            >
              Status
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => handleSort('total')}
            >
              Total
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => handleSort('createdAt')}
            >
              Date
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>
              <div>
                <p className="font-medium">{order.customerName}</p>
                <p className="text-sm text-muted-foreground">
                  {order.customerEmail}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                className={statusColors[order.status]}
              >
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>{formatCurrency(order.total)}</TableCell>
            <TableCell>
              {new Date(order.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onViewDetails(order)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}