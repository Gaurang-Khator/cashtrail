'use client';

import { useState } from "react"
import { updateExpense } from "@/lib/api"
import { Expense } from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
  expense: Expense
  open: boolean
  onClose: () => void
  onUpdated: (updated: Expense) => void
}

export function EditExpenseDialog({
  expense,
  open,
  onClose,
  onUpdated,
}: Props) {
  const [form, setForm] = useState(expense)

  async function handleSave() {
    const res = await updateExpense(expense.expenseId, {
      userId: expense.userId,
      amount: form.amount,
      category: form.category,
      date: form.date,
      note: form.note,
    })

    onUpdated(res.expense)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>

        <Label>Amount</Label>
        <Input
          value={form.amount}
          onChange={e =>
            setForm({ ...form, amount: Number(e.target.value) })
          }
        />

        <Label>Category</Label>
        <Input
          value={form.category}
          onChange={e =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <Label>Date</Label>
        <Input
          type="date"
          value={form.date}
          onChange={e =>
            setForm({ ...form, date: e.target.value })
          }
        />

        <Label>Note</Label>
        <Input
          value={form.note}
          onChange={e =>
            setForm({ ...form, note: e.target.value })
          }
        />

        <Button onClick={handleSave}>Save</Button>
      </DialogContent>
    </Dialog>
  )
}
