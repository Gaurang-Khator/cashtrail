'use client';

import { useState, useEffect } from "react";
import { getExpenses, deleteExpense } from "@/lib/api";
import { Expense } from "@/lib/api";
import { ExpenseTable } from "@/components/expenseTable";
import { AddExpenseDialog } from "@/components/addExpenseDialog";
import { EditExpenseDialog } from "@/components/editExpenseDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export default function Home() {
  const userId = "user123" // temporary

  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Expense | null>(null)

  useEffect(() => {
    async function loadExpenses() {
      const data = await getExpenses(userId)
      // optional sorting
      data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      setExpenses(data)
      setLoading(false)
    }

    loadExpenses()
  }, [])

  async function handleDelete(expenseId: string) {
    // optimistic update
    setExpenses((prev) =>
      prev.filter((e) => e.expenseId !== expenseId)
    )

    try {
      await deleteExpense(userId, expenseId)
    } catch (error) {
      alert("Failed to delete expense")
      // rollback if needed
      const data = await getExpenses(userId)
      setExpenses(data)
    }
  }

  function handleEdit(expense: Expense) {
    setEditing(expense)
  }

  function handleUpdated(updated: Expense) {
    setExpenses((prev) =>
      prev.map((e) =>
        e.expenseId === updated.expenseId ? updated : e
      )
    )
  }

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>CashTrail — Expenses</CardTitle>
          <AddExpenseDialog />
        </CardHeader>

        <CardContent>
          <ExpenseTable
            expenses={expenses}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </CardContent>
      </Card>

      {editing && (
        <EditExpenseDialog
          expense={editing}
          open={true}
          onClose={() => setEditing(null)}
          onUpdated={handleUpdated}
        />
      )}
    </main>
  )
}
