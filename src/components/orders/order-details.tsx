import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/lib/types/order';
import { formatCurrency } from '@/lib/utils';

interface OrderDetailsProps {
  order: Order;
  open: boolean;
  onClose: () => void;
}

export function OrderDetails({ order, open, onClose }: OrderDetailsProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Order Details - #{order.id}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Customer Information</h3>
              <p>{order.customerName}</p>
              <p>{order.customerEmail}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <p className="whitespace-pre-line">{order.shippingAddress}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Order Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell>{formatCurrency(item.totalPrice)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold mb-2">Order Status</h3>
              <Badge>{order.status}</Badge>
            </div>
            <div className="text-right">
              <div className="space-y-1">
                <p>
                  <span className="text-muted-foreground">Subtotal:</span>{' '}
                  {formatCurrency(order.subtotal)}
                </p>
                <p>
                  <span className="text-muted-foreground">Tax:</span>{' '}
                  {formatCurrency(order.tax)}
                </p>
                <p className="text-lg font-bold">
                  <span className="text-muted-foreground">Total:</span>{' '}
                  {formatCurrency(order.total)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}