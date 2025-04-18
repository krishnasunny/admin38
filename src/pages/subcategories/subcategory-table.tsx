import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {  Subcategory } from '@/lib/types/category';

interface CategoryTableProps {
  subcategory: Subcategory[];
  onEdit: (subcategory: Subcategory) => void;
  onDelete: (subcategory: Subcategory) => void;
  // onAddSubcategory: (category: Category) => void;
}

export function CategoryTable({
  subcategory,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subcategory.map((subcategory) => (
            <TableRow key={subcategory.subcategory_id}>
              <TableCell>
                {subcategory.image_url && (
                  <img
                    src={subcategory?.image_url}
                    alt={subcategory.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                )}
              </TableCell>
              <TableCell className="font-medium">{subcategory.name}</TableCell>
              <TableCell>{subcategory.description}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(subcategory)}>
                      Edit
                    </DropdownMenuItem>
                
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onDelete(subcategory)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

















// import { useEffect, useState } from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Button } from '@/components/ui/button';
// import { MoreHorizontal, Plus } from 'lucide-react';
// import { Category } from '@/lib/types/category';

// interface CategoryTableProps {
//   onEdit: (category: Category) => void;
//   onDelete: (category: Category) => void;
//   onAddSubcategory: (category: Category) => void;
// }

// export function CategoryTable({ onEdit, onDelete, onAddSubcategory }: CategoryTableProps) {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/api/categories');
//         const data = await response.json();
//         setCategories(data);
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategories();
//   }, []);

//   if (loading) {
//     return <p className="text-center p-4">Loading categories...</p>;
//   }

//   return (
//     <div className="rounded-md border">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Image</TableHead>
//             <TableHead>Name</TableHead>
//             <TableHead>Description</TableHead>
//             <TableHead>Subcategories</TableHead>
//             <TableHead className="w-[100px]">Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {categories.map((category) => (
//             <TableRow key={category.id}>
//               <TableCell>
//                 {category.imageUrl && (
//                   <img
//                     src={category.imageUrl}
//                     alt={category.name}
//                     className="w-10 h-10 rounded object-cover"
//                   />
//                 )}
//               </TableCell>
//               <TableCell className="font-medium">{category.name}</TableCell>
//               <TableCell>{category.description}</TableCell>
//               <TableCell>
//                 <div className="flex flex-wrap gap-1">
//                   {category.subcategories.map((sub) => (
//                     <span
//                       key={sub.id}
//                       className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs"
//                     >
//                       {sub.name}
//                     </span>
//                   ))}
//                 </div>
//               </TableCell>
//               <TableCell>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" className="h-8 w-8 p-0">
//                       <MoreHorizontal className="h-4 w-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuItem onClick={() => onEdit(category)}>
//                       Edit
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => onAddSubcategory(category)}>
//                       <Plus className="mr-2 h-4 w-4" />
//                       Add Subcategory
//                     </DropdownMenuItem>
//                     <DropdownMenuItem
//                       className="text-red-600"
//                       onClick={() => onDelete(category)}
//                     >
//                       Delete
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }








// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Button } from '@/components/ui/button';
// import { MoreHorizontal, Plus } from 'lucide-react';
// import { Category } from '@/lib/types/category';

// interface CategoryTableProps {
//   categories: Category[];
//   onEdit: (category: Category) => void;
//   onDelete: (category: Category) => void;
//   onAddSubcategory: (category: Category) => void;
// }

// export function CategoryTable({
//   categories,
//   onEdit,
//   onDelete,
//   onAddSubcategory,
// }: CategoryTableProps) {
//   return (
//     <div className="rounded-md border">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Image</TableHead>
//             <TableHead>Name</TableHead>
//             <TableHead>Description</TableHead>
//             <TableHead>Subcategories</TableHead>
//             <TableHead className="w-[100px]">Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {categories.map((category) => (
//             <TableRow key={category.id}>
//               <TableCell>
//                 {category.imageUrl && (
//                   <img
//                     src={category.imageUrl}
//                     alt={category.name}
//                     className="w-10 h-10 rounded object-cover"
//                   />
//                 )}
//               </TableCell>
//               <TableCell className="font-medium">{category.name}</TableCell>
//               <TableCell>{category.description}</TableCell>
//               <TableCell>
//                 <div className="flex flex-wrap gap-1">
//                   {category.subcategories.map((sub) => (
//                     <span
//                       key={sub.id}
//                       className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs"
//                     >
//                       {sub.name}
//                     </span>
//                   ))}
//                 </div>
//               </TableCell>
//               <TableCell>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" className="h-8 w-8 p-0">
//                       <MoreHorizontal className="h-4 w-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuItem onClick={() => onEdit(category)}>
//                       Edit
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => onAddSubcategory(category)}>
//                       <Plus className="mr-2 h-4 w-4" />
//                       Add Subcategory
//                     </DropdownMenuItem>
//                     <DropdownMenuItem
//                       className="text-red-600"
//                       onClick={() => onDelete(category)}
//                     >
//                       Delete
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }