'use client';

import { useState, useEffect } from "react";
import { getExpenses, deleteExpense } from "@/lib/api";
import { Expense } from "@/lib/api";
import { ExpenseTable } from "@/components/expenseTable";
import { AddExpenseDialog } from "@/components/addExpenseDialog";
import { EditExpenseDialog } from "@/components/editExpenseDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser, UserButton } from "@clerk/nextjs";
import { MonthlyIncomeDialog } from "@/components/monthlyIncomeDialog";

export default function Home() {
  const { user, isLoaded } = useUser();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Expense | null>(null);


  useEffect(() => {
   
    if (!isLoaded || !user?.id) return;

    async function loadExpenses() {
      try {
        const data = await getExpenses(user!.id);
        // Sort by date descending
        data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setExpenses(data);
      } catch (error) {
        console.error("Failed to load expenses", error);
      } finally {
        setLoading(false);
      }
    }

    loadExpenses();
  }, [isLoaded, user?.id]);

  async function handleDelete(expenseId: string) {
    if (!user) return;
    
    setExpenses((prev) => prev.filter((e) => e.expenseId !== expenseId));

    try {
      await deleteExpense(user.id, expenseId);
    } catch (error) {
      alert("Failed to delete expense");
  
      const data = await getExpenses(user.id);
      setExpenses(data);
    }
  }

  function handleEdit(expense: Expense) {
    setEditing(expense);
  }

  function handleUpdated(updated: Expense) {
    setExpenses((prev) =>
      prev.map((e) => (e.expenseId === updated.expenseId ? updated : e))
    );
  }

  
  if (!isLoaded || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <p className="text-muted-foreground mt-4">Loading CashTrail...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-4xl mx-auto shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b mb-6">
          <CardTitle className="text-2xl font-bold text-gray-800">
            CashTrail — Expenses <br/>
            Hello, <span className="text-blue-600">{user?.firstName}</span>
          </CardTitle>
          <div className="flex items-center gap-4">
            <AddExpenseDialog />
            <MonthlyIncomeDialog />
            
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </CardHeader>

        <CardContent>
          {expenses.length === 0 ? (
            <p className="text-center text-gray-500">No expenses recorded yet.</p>
          ) : (
            <ExpenseTable
              expenses={expenses}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          )}
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
  );
}