import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
// import { Badge } from '@/components/ui/badge';
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
          <TableHead>Store</TableHead>
          {/* <TableHead>Status</TableHead> */}
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.product_id}>
            <TableCell>
              <Checkbox
                checked={selectedIds.includes(product.product_id.toString())}
                onCheckedChange={(checked) => onSelectOne(product.product_id.toString(), checked as boolean)}
              />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                {product.images.length > 0 && (
                  <img
                    src={product.images[0].image_url}
                    alt={product.product_name}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">{product.product_name}</p>
                  <p className="text-sm text-muted-foreground">{product.sku}</p>
                </div>
              </div>
            </TableCell>
            <TableCell className="capitalize">
              {product.category_name}
              {product.subcategory_name && (
                <span className="text-muted-foreground"> / {product.subcategory_name}</span>
              )}
            </TableCell>
            <TableCell>{formatCurrency(Number(product.base_price))}</TableCell>
            <TableCell>
              {product.variants.reduce((total, variant) => total + variant.stock_quantity, 0)}
            </TableCell>
            <TableCell>{product.store_name}</TableCell>
            {/* <TableCell>{"active"}</TableCell> */}
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



// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Pencil, Trash2 } from 'lucide-react';
// import { Product } from '@/lib/types/product';
// import { formatCurrency } from '@/lib/utils';

// interface ProductTableProps {
//   products: Product[];
//   selectedIds: string[];
//   onSelectOne: (productId: string, selected: boolean) => void;
//   onEdit: (product: Product) => void;
//   onDelete: (product: Product) => void;
// }

// export function ProductTable({ 
//   products, 
//   selectedIds,
//   onSelectOne,
//   onEdit, 
//   onDelete 
// }: ProductTableProps) {

//   console.log(products);
//   return (
//     <Table>
//       <TableHeader>
//         <TableRow>
//           <TableHead className="w-[50px]">
//             <span className="sr-only">Select</span>
//           </TableHead>
//           <TableHead>Product</TableHead>
//           {/* <TableHead>Sku</TableHead> */}
//           <TableHead>Price</TableHead>
//           <TableHead>Description</TableHead>
//           <TableHead>Status</TableHead>
//           <TableHead>Actions</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {products.map((product) => (
//           <TableRow key={product.product_id}>
//             <TableCell>
//               <Checkbox
//                 checked={selectedIds.includes(product.product_id)}
//                 onCheckedChange={(checked) => onSelectOne(product.product_id, checked as boolean)}
//               />
//             </TableCell>
//             <TableCell>
//               <div className="flex items-center gap-3">
//                 {product.images && (
//                   <img
//                     src={product.images[0].image_url}
//                     alt={product.product_name}
//                     className="h-10 w-10 rounded-md object-cover"
//                   />
//                 )}
//                 <div>
//                   <p className="font-medium">{product.product_name} </p>
//                   <p className="text-sm text-muted-foreground">{product.sku}</p>
//                 </div>
//               </div>
//             </TableCell>
//             {/* <TableCell className="capitalize">{product.sku}</TableCell> */}
//             <TableCell>{formatCurrency(product.base_price)}</TableCell>
//             <TableCell>{product.description}</TableCell>
//             <TableCell>
//               <Badge variant={product.status == null ? 'default' : 'secondary'}>
//                 {/* {product.status} */}
//                 active
//               </Badge>
//             </TableCell>
//             <TableCell>
//               <div className="flex gap-2">
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => onEdit(product)}
//                 >
//                   <Pencil className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => {
             
//                     onDelete(product)
//                     }
//                   }
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// }