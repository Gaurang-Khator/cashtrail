'use client';

import { useState, useEffect, useMemo } from "react";
import { getExpenses, deleteExpense, Expense } from "@/lib/api";
import { ExpenseTable } from "@/components/expenseTable";
import { EditExpenseDialog } from "@/components/editExpenseDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { TrendingUp, Wallet, ArrowUpRight } from "lucide-react";
import { KPICard } from "@/components/kpicard";

export function Dashboard() {
  const { user, isLoaded } = useUser();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Expense | null>(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12 && hour > 4) return "Good Morning";
    if (hour < 18 && hour >= 12) return "Good Afternoon";
    return "Good Evening";
  };

  // 1. FETCH DATA
  async function loadExpenses() {
    if (!user?.id) return;
    try {
      const data = await getExpenses(user.id);
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setExpenses(data);
    } catch (error) {
      console.error("Failed to load expenses", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isLoaded) loadExpenses();
  }, [isLoaded, user?.id]);

  // 2. REAL-TIME CALCULATIONS
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter for current month only
    const monthlyItems = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    // Calculate Total Monthly Expenses
    const totalMonthly = monthlyItems.reduce((sum, e) => sum + e.amount, 0);

    // Calculate Top Category
    const categoryMap: Record<string, number> = {};
    monthlyItems.forEach(e => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    });

    const topCat = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];

    return {
      monthlyTotal: totalMonthly,
      topCategory: topCat ? topCat[0] : "N/A"
    };
  }, [expenses]);

  // Actions
  async function handleDelete(expenseId: string) {
    if (!user) return;
    setExpenses((prev) => prev.filter((e) => e.expenseId !== expenseId));
    try {
      await deleteExpense(user.id, expenseId);
    } catch (error) {
      loadExpenses(); 
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <p className="text-muted-foreground mt-4">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-6 lg:p-10 space-y-10">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          {getGreeting()}, <span className=" text-green-400">{user?.firstName || "User"}</span> !
        </h1>
        <p className="text-muted-foreground">Here is what is happening with your money today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
        <KPICard 
          title="Total Balance" 
          value="₹0" // Update income fetching 
          icon={<Wallet className="w-4 h-4" />} 
        />
        <KPICard 
          title={ "Monthly Expenses" }
          value={`₹${stats.monthlyTotal.toLocaleString('en-IN')}`} 
          icon={<TrendingUp className="w-4 h-4" />} 
        />
        <KPICard 
          title="Top Category" 
          value={stats.topCategory} 
          icon={<ArrowUpRight className="w-4 h-4" />} 
        />
      </div>

      <Card className="bg-card/40 border-border border-2 border-dashed">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Spending Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground italic">Charts coming soon based on your {expenses.length} transactions.</p>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Recent Transactions</h2>
          <button 
            onClick={() => window.location.href = '/expenses'}
            className="text-sm text-primary hover:underline"
          >
            View all
          </button>
        </div>
        
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {expenses.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">No transactions recorded yet.</div>
          ) : (
            <ExpenseTable
              expenses={expenses.slice(0, 3)} 
              onDelete={handleDelete}
              onEdit={(e) => setEditing(e)}
            />
          )}
        </div>
      </section>

      {editing && (
        <EditExpenseDialog
          expense={editing}
          open={!!editing}
          onClose={() => setEditing(null)}
          onUpdated={(updated) => {
            setExpenses(prev => prev.map(e => e.expenseId === updated.expenseId ? updated : e));
          }}
        />
      )}
    </main>
  );
}
