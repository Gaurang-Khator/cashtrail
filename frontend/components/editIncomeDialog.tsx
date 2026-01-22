'use client';

import { useEffect, useState } from "react";
import { updateIncome, Income } from "@/lib/api";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [amountError, setAmountError] = useState<string>("");

  useEffect(() => {
    setForm(income);
    setAmountError(""); 
  }, [income]);

  function validateAmount(value: number) {
    if (value <= 0) {
      setAmountError("Income amount should be greater than 0");
      return false;
    }
    setAmountError("");
    return true;
  }

  async function handleSave() {
    // 🛑 FINAL CHECK BEFORE API CALL
    if (!validateAmount(form.amount)) return;

    setLoading(true);
    try {
      await updateIncome(income.incomeId, {
        userId: income.userId,
        amount: form.amount,
        source: form.source,
        date: form.date,
      });

      onUpdated();
      onClose();
    } catch {
      setAmountError("Failed to update income");
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
          {/* Amount */}
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              value={form.amount}
              onChange={e => {
                const val = Number(e.target.value);
                setForm({ ...form, amount: val });
                validateAmount(val); 
              }}
              className={amountError ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {amountError && (
              <p className="text-xs text-red-500">{amountError}</p>
            )}
          </div>

          {/* Source */}
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

          {/* Date */}
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
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
