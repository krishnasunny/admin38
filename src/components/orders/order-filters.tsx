import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderStatus } from '@/lib/types/order';
import { OrderFiltersProps } from '@/lib/types/order-filters';

const statuses: (OrderStatus | 'all')[] = [
  'all',
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

export function OrderFilters({ filters, onFilterChange }: OrderFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-5">
      <Input
        placeholder="Search orders..."
        value={filters.search}
        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
      />
      
      <Select
        value={filters.status}
        onValueChange={(value) => 
          onFilterChange({ ...filters, status: value as OrderStatus | 'all' })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((status) => (
            <SelectItem key={status} value={status}>
              {status === 'all' ? 'All Statuses' : status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="date"
        value={filters.dateFrom}
        onChange={(e) => 
          onFilterChange({ ...filters, dateFrom: e.target.value })
        }
      />

      <Input
        type="date"
        value={filters.dateTo}
        onChange={(e) => 
          onFilterChange({ ...filters, dateTo: e.target.value })
        }
      />

      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Min total"
          value={filters.minTotal || ''}
          onChange={(e) => 
            onFilterChange({ 
              ...filters, 
              minTotal: e.target.value ? Number(e.target.value) : undefined 
            })
          }
        />
        <Input
          type="number"
          placeholder="Max total"
          value={filters.maxTotal || ''}
          onChange={(e) => 
            onFilterChange({ 
              ...filters, 
              maxTotal: e.target.value ? Number(e.target.value) : undefined 
            })
          }
        />
      </div>
    </div>
  );
}