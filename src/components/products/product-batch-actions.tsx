import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Product, ProductStatus } from '@/lib/types/product';

interface ProductBatchActionsProps {
  products: Product[];
  selectedIds: string[];
  onSelectAll: (selected: boolean) => void;
  onSelectOne: (productId: string, selected: boolean) => void;
  onUpdateStatus: (productIds: string[], status: ProductStatus) => void;
  onDeleteMany: (productIds: string[]) => void;
}

export function ProductBatchActions({
  // products,
  selectedIds,
  onSelectAll,
  // onUpdateStatus,
  onDeleteMany,
}: ProductBatchActionsProps) {
  const [isAllSelected, setIsAllSelected] = useState(false);

  const handleSelectAll = () => {
    const newValue = !isAllSelected;
    setIsAllSelected(newValue);
    onSelectAll(newValue);
  };

  return (
    <div className="flex items-center gap-4">
      <Checkbox
        checked={isAllSelected}
        onCheckedChange={handleSelectAll}
      />
      
      {selectedIds.length > 0 && (
        <>
          <span className="text-sm text-muted-foreground">
            {selectedIds.length} selected
          </span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Bulk Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* <DropdownMenuItem onClick={() => onUpdateStatus(selectedIds, 'active')}>
                Set Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdateStatus(selectedIds, 'draft')}>
                Set Draft
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdateStatus(selectedIds, 'archived')}>
                Archive
              </DropdownMenuItem> */}
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDeleteMany(selectedIds)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  );
}









// import { useState } from 'react';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import {  Product, ProductStatus } from '@/lib/types/product';

// // interface ProductBatchActionsProps {
// //   selectedIds: string[];
// //   onSelectAll: (selected: boolean) => void;
// //   onUpdateStatus: (productIds: string[], status: ProductStatus) => void;
// //   onDeleteMany: (productIds: string[]) => void;
// // }

// interface ProductBatchActionsProps {
//   products: Product[];
//   selectedIds: string[];
//   onSelectAll: (selected: boolean) => void;
//   onSelectOne: (productId: string, selected: boolean) => void;
//   onUpdateStatus: (productIds: string[], status: ProductStatus) => void;
//   onDeleteMany: (productIds: string[]) => void;
// }


// export function ProductBatchActions({
//   selectedIds,
//   onSelectAll,
//   onUpdateStatus,
//   onDeleteMany,
// }: ProductBatchActionsProps) {
//   const [isAllSelected, setIsAllSelected] = useState(false);

//   const handleSelectAll = () => {
//     const newValue = !isAllSelected;
//     setIsAllSelected(newValue);
//     onSelectAll(newValue);
//   };

//   return (
//     <div className="flex items-center gap-4">
//       <Checkbox
//         checked={isAllSelected}
//         onCheckedChange={handleSelectAll}
//       />
      
//       {selectedIds.length > 0 && (
//         <>
//           <span className="text-sm text-muted-foreground">
//             {selectedIds.length} selected
//           </span>
          
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="sm">
//                 Bulk Actions
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent>
//               <DropdownMenuItem onClick={() => onUpdateStatus(selectedIds, 'active')}>
//                 Set Active
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => onUpdateStatus(selectedIds, 'draft')}>
//                 Set Draft
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => onUpdateStatus(selectedIds, 'archived')}>
//                 Archive
//               </DropdownMenuItem>
//               <DropdownMenuItem
//                 className="text-destructive"
//                 onClick={() => onDeleteMany(selectedIds)}
//               >
//                 Delete
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </>
//       )}
//     </div>
//   );
// }