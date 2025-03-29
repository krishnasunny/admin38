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
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Trash2 } from 'lucide-react';
import { Product } from '@/lib/types/product';
import { formatCurrency } from '@/lib/utils';

interface ProductTableProps {
  products: Product[];
  selectedIds: string[];
  onSelectOne: (productId: string, selected: boolean) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({ 
  products, 
  selectedIds,
  onSelectOne,
  onEdit, 
  onDelete 
}: ProductTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <span className="sr-only">Select</span>
          </TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <Checkbox
                checked={selectedIds.includes(product.id)}
                onCheckedChange={(checked) => onSelectOne(product.id, checked as boolean)}
              />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.sku}</p>
                </div>
              </div>
            </TableCell>
            <TableCell className="capitalize">{product.category}</TableCell>
            <TableCell>{formatCurrency(product.price)}</TableCell>
            <TableCell>{product.stock}</TableCell>
            <TableCell>
              <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                {product.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(product)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(product)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}