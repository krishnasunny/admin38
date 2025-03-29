import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductCategory, ProductStatus } from '@/lib/types/product';
import { ProductFiltersProps } from '@/lib/types/product-filters';

const categories: (ProductCategory | 'all')[] = ['all', 'electronics', 'clothing', 'books', 'food', 'other'];
const statuses: (ProductStatus | 'all')[] = ['all', 'active', 'draft', 'archived'];

export function ProductFilters({ filters, onFilterChange }: ProductFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Input
        placeholder="Search products..."
        value={filters.search}
        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
      />
      
      <Select
        value={filters.category}
        onValueChange={(value) => 
          onFilterChange({ ...filters, category: value as ProductCategory | 'all' })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status}
        onValueChange={(value) => 
          onFilterChange({ ...filters, status: value as ProductStatus | 'all' })
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

      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Min price"
          value={filters.minPrice || ''}
          onChange={(e) => 
            onFilterChange({ 
              ...filters, 
              minPrice: e.target.value ? Number(e.target.value) : undefined 
            })
          }
        />
        <Input
          type="number"
          placeholder="Max price"
          value={filters.maxPrice || ''}
          onChange={(e) => 
            onFilterChange({ 
              ...filters, 
              maxPrice: e.target.value ? Number(e.target.value) : undefined 
            })
          }
        />
      </div>
    </div>
  );
}