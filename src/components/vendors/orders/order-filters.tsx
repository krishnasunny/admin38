import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatus } from "@/lib/types/order";

interface OrderFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: OrderStatus | "all";
  onStatusChange: (value: OrderStatus | "all") => void;
}

export function OrderFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: OrderFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <Input
        placeholder="Search orders..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-xs"
      />
      <Select
        value={statusFilter}
        onValueChange={(value) => onStatusChange(value as OrderStatus | "all")}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="processing">Processing</SelectItem>
          <SelectItem value="shipped">Shipped</SelectItem>
          <SelectItem value="delivered">Delivered</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}