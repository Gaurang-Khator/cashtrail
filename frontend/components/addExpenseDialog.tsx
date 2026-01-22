'use client';

import { useState } from "react";
import { addExpense } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";

const CATEGORIES = [
  "Shopping",
  "Food",
  "Rent",
  "Utilities",
  "Entertainment",
  "Transport",
  "Fixed",
  "Other",
];

export function AddExpenseDialog({ onSuccess }: { onSuccess: () => void }) {
  const { user } = useUser();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [amountError, setAmountError] = useState<string>("");

  
  function validateAmount(value: string) {
    if (!value) {
      setAmountError("Expense amount is required");
      return false;
    }

    if (Number(value) <= 0) {
      setAmountError("Expense amount should be greater than 0");
      return false;
    }

    setAmountError("");
    return true;
  }

  async function handleSubmit(formData: FormData) {
    if (!user) return;

    if (!validateAmount(amount)) return;

    setLoading(true);

    try {
      await addExpense({
        userId: user.id,
        amount: Number(amount),
        category,
        date: String(formData.get("date")),
        note: String(formData.get("note") || ""),
      });

      // reset state after success
      setOpen(false);
      setAmount("");
      setCategory("");
      setAmountError("");
      onSuccess();
    } catch {
      setAmountError("Failed to add expense. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white">
          <Plus className="h-4 w-4" /> Add Expense
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                validateAmount(e.target.value); 
              }}
              className={
                amountError
                  ? "bg-background border-red-500 focus-visible:ring-red-500"
                  : "bg-background"
              }
              required
            />
            {amountError && (
              <p className="text-xs text-red-500">{amountError}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select onValueChange={setCategory} required>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              name="date"
              type="date"
              required
              className="bg-background"
            />
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              name="note"
              placeholder="What was this for?"
              className="bg-background"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Adding..." : "Confirm Expense"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
