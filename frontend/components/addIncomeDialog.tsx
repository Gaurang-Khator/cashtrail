'use client';

import { useState } from "react";
import { addIncome } from "@/lib/api";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";

const SOURCES = ["Salary", "Freelance", "Dividend", "Profit", "Other"];

export function AddIncomeDialog({ onSuccess }: { onSuccess: () => void }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState("");

  async function handleSubmit(formData: FormData) {
    if (!user) return;
    setLoading(true);

    try {
      await addIncome({
        userId: user.id,
        amount: Number(formData.get("amount")),
        source,
        date: String(formData.get("date"))
      });

      setOpen(false);
      onSuccess();
    } catch {
      alert("Failed to add income");
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
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input name="amount" type="number" placeholder="0.00" required />
          </div>

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

          <div className="space-y-2">
            <Label>Date</Label>
            <Input name="date" type="date" required />
          </div>

          <Button type="submit" disabled={loading || !source} className="w-full">
            {loading ? "Adding..." : "Confirm Income"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
