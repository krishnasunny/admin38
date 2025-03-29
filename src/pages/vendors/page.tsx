import { Suspense } from "react"
import { Plus } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { VendorTable } from "./vendor-table"
import { CreateVendorDialog } from "./create-vendor-dialog"

export default function VendorsPage() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Vendors</h2>
          <p className="text-muted-foreground">
            Manage your vendor list and their details here.
          </p>
        </div>
        <CreateVendorDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Vendor
          </Button>
        </CreateVendorDialog>
      </div>
      <Separator />
      <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
        <VendorTable />
      </Suspense>
    </div>
  )
}

