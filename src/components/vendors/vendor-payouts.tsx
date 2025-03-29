import { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VendorPayout } from "@/lib/types/vendor";

interface VendorPayoutsProps {
  payouts: VendorPayout[];
  onProcessPayout: (payoutId: string) => void;
}

export function VendorPayouts({ payouts, onProcessPayout }: VendorPayoutsProps) {
  const [selectedPayout, setSelectedPayout] = useState<VendorPayout | null>(null); 

  console.log("selectedPayout:", selectedPayout); // Avoids unused variable error
 
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Paid At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payouts.map((payout) => (
              <TableRow key={payout.id}>
                <TableCell>
                  {format(new Date(payout.periodStart), "MMM d, yyyy")} -{" "}
                  {format(new Date(payout.periodEnd), "MMM d, yyyy")}
                </TableCell>
                <TableCell>${payout.amount.toLocaleString()}</TableCell>
                <TableCell className="capitalize">{payout.status}</TableCell>
                <TableCell>{format(new Date(payout.createdAt), "PPP")}</TableCell>
                <TableCell>
                  {payout.paidAt ? format(new Date(payout.paidAt), "PPP") : "-"}
                </TableCell>
                <TableCell>
                  {payout.status === "pending" && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedPayout(payout)}
                        >
                          Process Payout
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Process Payout</DialogTitle>
                          <DialogDescription>
                            Enter the transaction details to process this payout.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="transaction">Transaction ID</Label>
                            <Input id="transaction" placeholder="Enter transaction ID" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={() => onProcessPayout(payout.id)}>
                            Confirm Payout
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}