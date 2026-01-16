'use client';

import { useState, useEffect, useMemo } from "react";
import { getExpenses, getMonthlyIncome, Expense } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { TrendingUp, Wallet, PiggyBank, PieChart as PieChartIcon } from "lucide-react";
import { KPICard } from "@/components/kpicard";
import { NavBar } from "@/components/NavBar_dashboard";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Cell as PieCell, Legend 
} from "recharts";

export function Dashboard() {
  const { user, isLoaded } = useUser();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12 && hour > 4) return "Good Morning";
    if (hour < 18 && hour >= 12) return "Good Afternoon";
    return "Good Evening";
  };

  async function loadDashboardData() {
    if (!user?.id) return;
    try {
      const now = new Date();
      const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      
      const [expensesData, incomeData] = await Promise.all([
        getExpenses(user.id),
        getMonthlyIncome(user.id, monthStr)
      ]);

      setExpenses(expensesData);
      setIncome(incomeData.income || 0);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isLoaded) loadDashboardData();
  }, [isLoaded, user?.id]);

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyExpenses = expenses
      .filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, e) => sum + e.amount, 0);

    const totalSavings = income - monthlyExpenses;

    return {
      monthlyIncome: income,
      monthlyExpenses: monthlyExpenses,
      totalSavings: totalSavings > 0 ? totalSavings : 0
    };
  }, [expenses, income]);

  // Data for the Pie Chart
  const pieData = useMemo(() => [
    { name: 'Expenses', value: stats.monthlyExpenses, color: '#ef4444' }, // Red for expenses
    { name: 'Savings', value: stats.totalSavings, color: '#22c55e' },   // Green for savings
  ], [stats]);

  // Last 7 Days Chart Data
  const last7DaysData = useMemo(() => {
    const days = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      days.push(date);
    }

    const dataMap: Record<string, number> = {};
    days.forEach(d => {
      const dateStr = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      dataMap[dateStr] = 0;
    });

    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      const diffTime = Math.abs(now.getTime() - expenseDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 7) {
        const dateStr = expenseDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        if (dataMap[dateStr] !== undefined) {
          dataMap[dateStr] += expense.amount;
        }
      }
    });

    return Object.entries(dataMap).map(([date, amount]) => ({ date, amount }));
  }, [expenses]);

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
      <NavBar />
      <header className="space-y-1 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {getGreeting()}, <span className="text-green-400">{user?.firstName || "User"}</span>!
          </h1>
          <p className="text-muted-foreground">Detailed summary of your monthly financial health.</p>
        </div>
        <button
          onClick={() => window.location.href = '/expenses'}
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors whitespace-nowrap"
        >
          Add New Expense
        </button>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          title="Monthly Income" 
          value={`₹${stats.monthlyIncome.toLocaleString('en-IN')}`} 
          icon={<Wallet className="w-4 h-4" />} 
        />
        <KPICard 
          title="Total Expenses"
          value={`₹${stats.monthlyExpenses.toLocaleString('en-IN')}`} 
          icon={<TrendingUp className="w-4 h-4 text-red-400" />} 
        />
        <KPICard 
          title="Total Savings" 
          value={`₹${stats.totalSavings.toLocaleString('en-IN')}`} 
          icon={<PiggyBank className="w-4 h-4 text-green-400" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart: */}
        <Card className="bg-card/40 border-border border-2 border-dashed">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Spending Trend</CardTitle>
            <p className="text-sm text-muted-foreground">Last 7 days daily spending</p>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7DaysData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                   contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                   itemStyle={{ color: '#22c55e' }}
                   cursor={{ fill: 'rgba(34, 197, 94, 0.1)' }}
                />
                <Bar dataKey="amount" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart: */}
        <Card className="bg-card/40 border-border border-2 border-dashed">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Budget Allocation</CardTitle>
            <p className="text-sm text-muted-foreground">Savings vs Expenses for this month</p>
          </CardHeader>
          <CardContent className="h-[300px]">
            {stats.monthlyIncome > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <PieCell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <PieChartIcon className="w-12 h-12 mb-2 opacity-20" />
                <p>Add income to see budget allocation</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}