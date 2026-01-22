'use client';

import { useEffect, useState } from "react";
import { updateIncome, Income } from "@/lib/api";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
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
  onUpdated: () => void;
}

export function EditIncomeDialog({ income, open, onClose, onUpdated }: Props) {
  const [form, setForm] = useState(income);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(income);
  }, [income]);

  async function handleSave() {
    setLoading(true);
    try {
      await updateIncome(income.incomeId, {
        userId: income.userId,
        amount: form.amount,
        source: form.source,
        date: form.date
      });

      onUpdated();
      onClose();
    } catch {
      alert("Failed to update income");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Income</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label>Source</Label>
            <Select
              value={form.source}
              onValueChange={v => setForm({ ...form, source: v })}
            >
              <SelectTrigger>
                <SelectValue />
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
            <Input
              type="date"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading} className="flex-1">
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
