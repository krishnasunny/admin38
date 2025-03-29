import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProductTable } from "@/components/products/product-table";
import { ProductForm } from "@/components/products/product-form";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductPagination } from "@/components/products/product-pagination";
import { ProductBatchActions } from "@/components/products/product-batch-actions";
import {
  Product,
  ProductFilters as FilterState,
  ProductSort,
  PaginationState,
  ProductStatus,
} from "@/lib/types/product";
import { useToast } from "@/hooks/use-toast";

// Mock data - replace with actual API calls
const mockProducts: Product[] = Array.from({ length: 50 }, (_, i) => ({
  id: (i + 1).toString(),
  name: `Product ${i + 1}`,
  description: `Description for product ${i + 1}`,
  price: Math.floor(Math.random() * 1000) + 1,
  category: ["electronics", "clothing", "books", "food", "other"][
    Math.floor(Math.random() * 5)
  ] as Product["category"],
  status: ["active", "draft", "archived"][
    Math.floor(Math.random() * 3)
  ] as Product["status"],
  stock: Math.floor(Math.random() * 100),
  sku: `SKU-${i + 1}`,
  images: [],
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  updatedAt: new Date().toISOString(),
}));

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
    status: "all",
  });
  const [
    sort,
    // , setSort
  ] = useState<ProductSort>({
    field: "createdAt",
    order: "desc",
  });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
  });
  const { toast } = useToast();

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          product.sku.toLowerCase().includes(filters.search.toLowerCase());
        const matchesCategory =
          filters.category === "all" || product.category === filters.category;
        const matchesStatus =
          filters.status === "all" || product.status === filters.status;
        const matchesPrice =
          (!filters.minPrice || product.price >= filters.minPrice) &&
          (!filters.maxPrice || product.price <= filters.maxPrice);

        return (
          matchesSearch && matchesCategory && matchesStatus && matchesPrice
        );
      })
      .sort((a, b) => {
        const multiplier = sort.order === "asc" ? 1 : -1;
        if (sort.field === "createdAt") {
          return (
            multiplier *
            (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          );
        }
        return (
          multiplier *
          ((a[sort.field] as any) > (b[sort.field] as any) ? 1 : -1)
        );
      });
  }, [products, filters, sort]);

  // Paginate products
  const paginatedProducts = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, pagination]);

  const handleCreate = (data: any) => {
    const newProduct: Product = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts([newProduct, ...products]);
    setIsFormOpen(false);
    toast({
      title: "Product created",
      description: "The product has been created successfully.",
    });
  };

  const handleUpdate = (data: any) => {
    if (!selectedProduct) return;
    const updatedProduct: Product = {
      ...selectedProduct,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    setProducts(
      products.map((p) => (p.id === selectedProduct.id ? updatedProduct : p))
    );
    setIsFormOpen(false);
    setSelectedProduct(null);
    toast({
      title: "Product updated",
      description: "The product has been updated successfully.",
    });
  };

  const handleDelete = () => {
    if (!selectedProduct) return;
    setProducts(products.filter((p) => p.id !== selectedProduct.id));
    setIsDeleteDialogOpen(false);
    setSelectedProduct(null);
    toast({
      title: "Product deleted",
      description: "The product has been deleted successfully.",
    });
  };

  const handleBatchStatusUpdate = (
    productIds: string[],
    status: ProductStatus
  ) => {
    setProducts(
      products.map((product) =>
        productIds.includes(product.id) ? { ...product, status } : product
      )
    );
    setSelectedIds([]);
    toast({
      title: "Products updated",
      description: `Selected products have been marked as ${status}.`,
    });
  };

  const handleBatchDelete = (productIds: string[]) => {
    setProducts(products.filter((product) => !productIds.includes(product.id)));
    setSelectedIds([]);
    toast({
      title: "Products deleted",
      description: "Selected products have been deleted.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <ProductFilters filters={filters} onFilterChange={setFilters} />

      <ProductBatchActions
        products={products}
        selectedIds={selectedIds}
        onSelectAll={(selected) => {
          setSelectedIds(selected ? products.map((p) => p.id) : []);
        }}
        onSelectOne={(productId, selected) => {
          setSelectedIds(
            selected
              ? [...selectedIds, productId]
              : selectedIds.filter((id) => id !== productId)
          );
        }}
        onUpdateStatus={handleBatchStatusUpdate}
        onDeleteMany={handleBatchDelete}
      />

      <ProductTable
        products={paginatedProducts}
        selectedIds={selectedIds}
        onSelectOne={(productId, selected) => {
          setSelectedIds(
            selected
              ? [...selectedIds, productId]
              : selectedIds.filter((id) => id !== productId)
          );
        }}
        onEdit={(product) => {
          setSelectedProduct(product);
          setIsFormOpen(true);
        }}
        onDelete={(product) => {
          setSelectedProduct(product);
          setIsDeleteDialogOpen(true);
        }}
      />

      <ProductPagination
        currentPage={pagination.page}
        pageSize={pagination.pageSize}
        totalItems={filteredProducts.length}
        onPageChange={(page) => setPagination({ ...pagination, page })}
        onPageSizeChange={(pageSize) => setPagination({ page: 1, pageSize })}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            // initialData={selectedProduct || undefined}
            initialData={
              selectedProduct
                ? {
                    ...selectedProduct,
                    images: selectedProduct.images.map((img) => img.url),
                  }
                : undefined
            }
            onSubmit={selectedProduct ? handleUpdate : handleCreate}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedProduct(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedProduct(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
