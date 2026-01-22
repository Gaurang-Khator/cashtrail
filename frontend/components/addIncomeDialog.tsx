'use client';

import { useState } from "react";
import { addIncome } from "@/lib/api";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";

const SOURCES = ["Salary", "Freelance", "Dividend", "Profit", "Other"];

export function AddIncomeDialog({ onSuccess }: { onSuccess: () => void }) {
  const { user } = useUser();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [source, setSource] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [amountError, setAmountError] = useState<string>("");

  function validateAmount(value: string) {
    if (!value) {
      setAmountError("Income amount is required");
      return false;
    }

    if (Number(value) <= 0) {
      setAmountError("Income amount should be greater than 0");
      return false;
    }

    setAmountError("");
    return true;
  }

  async function handleSubmit(formData: FormData) {
    if (!user) return;

    if (!validateAmount(amount)) {
      return;
    }

    setLoading(true);

    try {
      await addIncome({
        userId: user.id,
        amount: Number(amount),
        source,
        date: String(formData.get("date")),
      });

      // reset state
      setOpen(false);
      setAmount("");
      setSource("");
      setAmountError("");
      onSuccess();
    } catch {
      setAmountError("Failed to add income. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white">
          <Plus className="h-4 w-4" /> Add Income
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle>Add New Income</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                validateAmount(e.target.value); 
              }}
              className={amountError ? "border-red-500 focus-visible:ring-red-500" : ""}
              required
            />
            {amountError && (
              <p className="text-xs text-red-500 mt-1">
                {amountError}
              </p>
            )}
          </div>

          {/* Source */}
          <div className="space-y-2">
            <Label>Source</Label>
            <Select onValueChange={setSource} required>
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                {SOURCES.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Input name="date" type="date" required />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Adding..." : "Confirm Income"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
