'use client';

import { useState, useEffect } from "react";
import { updateIncome, Income } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SOURCES = ["Salary", "Freelance", "Dividend", "Profit", "Other"];

interface Props {
  income: Income;
  open: boolean;
  onClose: () => void;
  onUpdated: (updated: Income) => void;
}

export function EditIncomeDialog({
  income,
  open,
  onClose,
  onUpdated,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Income>(income);

  // Sync form state if the income prop changes
  useEffect(() => {
    setForm(income);
  }, [income]);

  async function handleSave() {
    setLoading(true);
    try {
      const res = await updateIncome(income.incomeId, {
        userId: income.userId,
        income: form.income,
        source: form.source,
        month: form.month,
      });

      onUpdated(res.income);
      onClose();
    } catch (error) {
      alert("Failed to update income");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle>Edit Income</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Amount Field */}
          <div className="space-y-2">
            <Label htmlFor="edit-amount">Amount (₹)</Label>
            <Input
              id="edit-amount"
              type="number"
              value={form.income}
              className="bg-background"
              onChange={e => setForm({ ...form, income: Number(e.target.value) })}
            />
          </div>

          {/* Source Field (Dropdown) */}
          <div className="space-y-2">
            <Label>Source</Label>
            <Select 
              value={form.source} 
              onValueChange={(val) => setForm({ ...form, source: val })}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {SOURCES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Month Field */}
          <div className="space-y-2">
            <Label htmlFor="edit-date">Month</Label>
            <Input
              id="edit-month"
              type="month"
              value={form.month}
              className="bg-background"
              onChange={e => setForm({ ...form, month: e.target.value })}
            />
          </div>

        </div>

        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading} className="flex-1">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}