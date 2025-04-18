//new working code
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MultipleImageUpload } from './image-upload/multiple-image-upload';
import { ProductStatus } from '@/lib/types/product';
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";


import { Subcategory,Category } from "@/lib/types/category";

const variantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  price: z.number().min(0, "Price must be positive"),
  stock_quantity: z.number().min(0, "Stock must be positive"),
  sku: z.string().min(1, "SKU is required"),
});

const productSchema = z.object({
  product_name: z.string().min(1, 'Name is required'),
  description: z.string(),
  base_price: z.number().min(0, 'Price must be positive'),
  category_id: z.number(),
  subcategory_id: z.string(),
  sku: z.string().min(1, 'SKU is required'),
  status: z.enum(['active', 'draft', 'archived']),
  variants: z.array(variantSchema),
  images: z.array(z.string()).min(1, 'At least one image is required'),
});

type ProductFormData = z.infer<typeof productSchema>;



interface ProductFormProps {
  categories:Category[];
  subcategories:Subcategory[];
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}

const statuses: ProductStatus[] = ['active', 'draft', 'archived'];

export function ProductForm({ initialData, onSubmit, onCancel,categories,subcategories }: ProductFormProps) {

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [variants, setVariants] = useState<Array<typeof variantSchema._type>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      product_name: '',
      description: '',
      base_price: 0,
      category_id: 0,
      subcategory_id: '',
      sku: '',
      status: 'draft',
      variants: [],
      images: [],
    },
  });

  // Track form values for debugging
  const watchSubcategory = form.watch('subcategory_id');
  const watchCategory = form.watch('category_id');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // await Promise.all([fetchCategories(), fetchSubcategories()]);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Initialize selectedCategory from initialData if available
    if (initialData?.category_id && !selectedCategory) {
      setSelectedCategory(initialData.category_id);
    }
    
    // Initialize selectedSubcategory from initialData if available
    if (initialData?.subcategory_id && !selectedSubcategory) {
      setSelectedSubcategory(initialData.subcategory_id);
    }
  }, [initialData, selectedCategory, selectedSubcategory]);

  useEffect(() => {
    // Initialize variants from initialData if available
    if (initialData?.variants && initialData.variants.length > 0 && variants.length === 0) {
      setVariants(initialData.variants);
    }
  }, [initialData, variants]);

  // Debug logging
  useEffect(() => {
    console.log("Form values changed:", {
      category: watchCategory,
      subcategory: watchSubcategory,
      selectedCategory,
      selectedSubcategory
    });
  }, [watchCategory, watchSubcategory, selectedCategory, selectedSubcategory]);

  // const fetchCategories = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await axios.get(`${url.api}/api/categories`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setCategories(response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Failed to fetch categories:", error);
  //     return [];
  //   }
  // };

  // const fetchSubcategories = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await axios.get(`${url.api}/api/subcategories`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setSubcategories(response.data);
  //     console.log(response.data)
  //     return response.data;
  //   } catch (error) {
  //     console.error("Failed to fetch subcategories:", error);
  //     return [];
  //   }
  // };

  const addVariant = () => {
    const newVariant = { name: '', price: 0, stock_quantity: 0, sku: '' };
    const updatedVariants = [...variants, newVariant];
    setVariants(updatedVariants);
    
    // Update form value
    const currentVariants = form.getValues('variants') || [];
    form.setValue('variants', [...currentVariants, newVariant]);
  };

  const removeVariant = (index: number) => {
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);
    
    // Update form value
    form.setValue('variants', updatedVariants);
  };

  const handleCategoryChange = (categoryId: string) => {
    const numericCategoryId = Number(categoryId);
    console.log("Setting category to:", numericCategoryId);
    setSelectedCategory(numericCategoryId);
    
    // Clear subcategory when changing category
    setSelectedSubcategory('');
    
    // Update form values
    form.setValue('category_id', numericCategoryId);
    form.setValue('subcategory_id', '');
  };

  const handleSubcategoryChange = (subcategoryId: string) => {
    console.log("Setting subcategory to:", subcategoryId);
    setSelectedSubcategory(subcategoryId);
    form.setValue('subcategory_id', subcategoryId);
  };

  const filteredSubcategories = subcategories.filter(
    sub => sub.category_id === selectedCategory
  );

  if (isLoading) {
    return <div>Loading form data...</div>;
  }

  return (
    <div className="h-[600px] overflow-y-auto p-4 border rounded-lg shadow-md">
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Images</FormLabel>
              <FormControl>
                <MultipleImageUpload
                  images={field.value}
                  onImagesChange={field.onChange}
                  maxImages={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="product_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="base_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category_id"
            render={(
              // { field }
            ) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={handleCategoryChange}
                  value={selectedCategory ? selectedCategory.toString() : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem 
                        key={category.id} 
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subcategory_id"
            render={() => (
              <FormItem>
                <FormLabel>Subcategory</FormLabel>
                <Select
                  onValueChange={handleSubcategoryChange}
                  value={selectedSubcategory}
                  // disabled={!selectedCategory}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredSubcategories.length > 0 ? (
                      filteredSubcategories.map((sub) => (
                        <SelectItem key={sub.subcategory_id} value={sub.subcategory_id}>
                          {sub.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-subcategories" disabled>
                        No subcategories available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel>Variants</FormLabel>
            <Button type="button" variant="outline" onClick={addVariant}>
              Add Variant
            </Button>
          </div>
          
          {variants.length!==0&&
          variants.map((_variant, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
              <FormField
                control={form.control}
                name={`variants.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name {variants.length}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name={`variants.${index}.price`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name={`variants.${index}.stock_quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name={`variants.${index}.sku`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeVariant(index)}
                className="mt-6"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Form>
    </div>
  );
}





// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { MultipleImageUpload } from './image-upload/multiple-image-upload';
// import { ProductStatus } from '@/lib/types/product';
// import { Textarea } from "@/components/ui/textarea";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { url } from "@/lib/utils";

// const variantSchema = z.object({
//   name: z.string().min(1, "Variant name is required"),
//   price: z.number().min(0, "Price must be positive"),
//   stock_quantity: z.number().min(0, "Stock must be positive"),
//   sku: z.string().min(1, "SKU is required"),
// });

// const productSchema = z.object({
//   product_name: z.string().min(1, 'Name is required'),
//   description: z.string(),
//   base_price: z.number().min(0, 'Price must be positive'),
//   category_id: z.number(),
//   subcategory_id: z.string(),
//   sku: z.string().min(1, 'SKU is required'),
//   status: z.enum(['active', 'draft', 'archived']),
//   variants: z.array(variantSchema),
//   images: z.array(z.string()).min(1, 'At least one image is required'),
// });

// type ProductFormData = z.infer<typeof productSchema>;

// interface Category {
//   id: number;
//   name: string;
// }

// interface Subcategory {
//   id: string;
//   name: string;
//   category_id: number;
// }

// interface ProductFormProps {
//   initialData?: ProductFormData;
//   onSubmit: (data: ProductFormData) => void;
//   onCancel: () => void;
// }

// const statuses: ProductStatus[] = ['active', 'draft', 'archived'];

// export function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
//   const [variants, setVariants] = useState<Array<typeof variantSchema._type>>([]);

//   const form = useForm<ProductFormData>({
//     resolver: zodResolver(productSchema),
//     defaultValues: initialData || {
//       product_name: '',
//       description: '',
//       base_price: 0,
//       category_id: 0,
//       sku: '',
//       status: 'draft',
//       variants: [],
//       images: [],
//     },
//   });

//   useEffect(() => {
//     fetchCategories();
//     fetchSubcategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`${url.api}/api/categories`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setCategories(response.data);
//     } catch (error) {
//       console.error("Failed to fetch categories:", error);
//     }
//   };

//   const fetchSubcategories = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`${url.api}/api/subcategories`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setSubcategories(response.data);
//     } catch (error) {
//       console.error("Failed to fetch subcategories:", error);
//     }
//   };

//   const addVariant = () => {
//     setVariants([...variants, { name: '', price: 0, stock_quantity: 0, sku: '' }]);
//   };

//   const removeVariant = (index: number) => {
//     setVariants(variants.filter((_, i) => i !== index));
//   };

//   const handleCategoryChange = (categoryId: string) => {
//     const numericCategoryId = Number(categoryId);
//     setSelectedCategory(numericCategoryId);
//     form.setValue('category_id', numericCategoryId);
//     form.setValue('subcategory_id', '');
//   };

//   const filteredSubcategories = subcategories.filter(
//     sub => sub.category_id === selectedCategory
//   );

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         <FormField
//           control={form.control}
//           name="images"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Product Images</FormLabel>
//               <FormControl>
//                 <MultipleImageUpload
//                   images={field.value}
//                   onImagesChange={field.onChange}
//                   maxImages={5}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="product_name"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Name</FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="description"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Description</FormLabel>
//               <FormControl>
//                 <Textarea {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className="grid grid-cols-2 gap-4">
//           <FormField
//             control={form.control}
//             name="base_price"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Base Price</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="number"
//                     step="0.01"
//                     {...field}
//                     onChange={(e) => field.onChange(parseFloat(e.target.value))}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="sku"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>SKU</FormLabel>
//                 <FormControl>
//                   <Input {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <FormField
//             control={form.control}
//             name="category_id"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Category</FormLabel>
//                 <Select
//                   onValueChange={handleCategoryChange}
//                   value={field.value.toString()}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select category" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {categories.map((category) => (
//                       <SelectItem 
//                         key={category.id} 
//                         value={category.id.toString()}
//                       >
//                         {category.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="subcategory_id"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Subcategory</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   value={field.value}
//                   disabled={!selectedCategory}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select subcategory" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {filteredSubcategories.map((sub) => (
//                       <SelectItem key={sub.id} value={sub.id}>
//                         {sub.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <FormField
//           control={form.control}
//           name="status"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Status</FormLabel>
//               <Select
//                 onValueChange={field.onChange}
//                 defaultValue={field.value}
//               >
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select status" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   {statuses.map((status) => (
//                     <SelectItem key={status} value={status}>
//                       {status}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className="space-y-4">
//           <div className="flex justify-between items-center">
//             <FormLabel>Variants</FormLabel>
//             <Button type="button" variant="outline" onClick={addVariant}>
//               Add Variant
//             </Button>
//           </div>
          
//           {variants.map((variant, index) => (
//             <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
//               <FormField
//                 control={form.control}
//                 name={`variants.${index}.name`}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Name</FormLabel>
//                     <FormControl>
//                       <Input {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
              
//               <FormField
//                 control={form.control}
//                 name={`variants.${index}.price`}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Price</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="number"
//                         step="0.01"
//                         {...field}
//                         onChange={(e) => field.onChange(parseFloat(e.target.value))}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
              
//               <FormField
//                 control={form.control}
//                 name={`variants.${index}.stock_quantity`}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Stock</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="number"
//                         {...field}
//                         onChange={(e) => field.onChange(parseInt(e.target.value))}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
              
//               <FormField
//                 control={form.control}
//                 name={`variants.${index}.sku`}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>SKU</FormLabel>
//                     <FormControl>
//                       <Input {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
              
//               <Button
//                 type="button"
//                 variant="destructive"
//                 onClick={() => removeVariant(index)}
//                 className="mt-6"
//               >
//                 Remove
//               </Button>
//             </div>
//           ))}
//         </div>

//         <div className="flex justify-end gap-2">
//           <Button variant="outline" onClick={onCancel}>
//             Cancel
//           </Button>
//           <Button type="submit">
//             {initialData ? 'Update Product' : 'Create Product'}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// }


// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Button } from '@/components/ui/button';
// import { MultipleImageUpload } from './image-upload/multiple-image-upload';
// import { ProductCategory, ProductStatus } from '@/lib/types/product';

// const productSchema = z.object({
//   name: z.string().min(1, 'Name is required'),
//   description: z.string(),
//   price: z.number().min(0, 'Price must be positive'),
//   category: z.enum(['electronics', 'clothing', 'books', 'food', 'other']),
//   status: z.enum(['active', 'draft', 'archived']),
//   stock: z.number().min(0, 'Stock must be positive'),
//   sku: z.string().min(1, 'SKU is required'),
//   images: z.array(z.string()).min(1, 'At least one image is required'),
// });

// type ProductFormData = z.infer<typeof productSchema>;

// interface ProductFormProps {
//   initialData?: ProductFormData;
//   onSubmit: (data: ProductFormData) => void;
//   onCancel: () => void;
// }

// const categories: ProductCategory[] = ['electronics', 'clothing', 'books', 'food', 'other'];
// const statuses: ProductStatus[] = ['active', 'draft', 'archived'];

// export function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
//   const form = useForm<ProductFormData>({
//     resolver: zodResolver(productSchema),
//     defaultValues: initialData || {
//       name: '',
//       description: '',
//       price: 0,
//       category: 'other',
//       status: 'draft',
//       stock: 0,
//       sku: '',
//       images: [],
//     },
//   });

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         <FormField
//           control={form.control}
//           name="images"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Product Images</FormLabel>
//               <FormControl>
//                 <MultipleImageUpload
//                   images={field.value}
//                   onImagesChange={field.onChange}
//                   maxImages={5}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="name"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Name</FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="description"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Description</FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className="grid grid-cols-2 gap-4">
//           <FormField
//             control={form.control}
//             name="price"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Price</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="number"
//                     {...field}
//                     onChange={(e) => field.onChange(parseFloat(e.target.value))}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="stock"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Stock</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="number"
//                     {...field}
//                     onChange={(e) => field.onChange(parseInt(e.target.value))}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <FormField
//             control={form.control}
//             name="category"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Category</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select category" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {categories.map((category) => (
//                       <SelectItem key={category} value={category}>
//                         {category}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="status"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Status</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {statuses.map((status) => (
//                       <SelectItem key={status} value={status}>
//                         {status}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <FormField
//           control={form.control}
//           name="sku"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>SKU</FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className="flex justify-end gap-2">
//           <Button variant="outline" onClick={onCancel}>
//             Cancel
//           </Button>
//           <Button type="submit">
//             {initialData ? 'Update Product' : 'Create Product'}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// }