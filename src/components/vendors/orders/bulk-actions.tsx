import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatus } from "@/lib/types/order";

interface BulkActionsProps {
  selectedCount: number;
  onStatusUpdate: (status: OrderStatus) => void;
}

export function BulkActions({ selectedCount, onStatusUpdate }: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {selectedCount} orders selected
      </span>
      <Select onValueChange={(value) => onStatusUpdate(value as OrderStatus)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Update status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="processing">Mark as Processing</SelectItem>
          <SelectItem value="shipped">Mark as Shipped</SelectItem>
          <SelectItem value="delivered">Mark as Delivered</SelectItem>
          <SelectItem value="cancelled">Mark as Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}