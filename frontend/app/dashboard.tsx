'use client';

import { useState, useEffect, useMemo } from "react";
import { getExpenses, Expense } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { TrendingUp, Wallet, ArrowUpRight } from "lucide-react";
import { KPICard } from "@/components/kpicard";
import { NavBar } from "@/components/NavBar_dashboard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export function Dashboard() {
  const { user, isLoaded } = useUser();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

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

  // 3. LAST 7 DAYS CHART DATA
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
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - expenseDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 6) {
        const dateStr = expenseDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        dataMap[dateStr] = (dataMap[dateStr] || 0) + expense.amount;
      }
    });

    return Object.entries(dataMap).map(([date, amount]) => ({
      date,
      amount
    }));
  }, [expenses]);


  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const amount = payload[0].value;
      if (amount === 0) return null;
      const color = "#22c55e";
      return (
        <div className="p-2 border border-border bg-background rounded-md shadow-md">
          <p style={{ color }}>Amount: ₹{amount.toLocaleString('en-IN')}</p>
        </div>
      );
    }
    return null;
  };

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
            {getGreeting()}, <span className=" text-green-400">{user?.firstName || "User"}</span> !
          </h1>
          <p className="text-muted-foreground">Here is what is happening with your money today.</p>
        </div>
        <button
          onClick={() => window.location.href = '/expenses'}
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors whitespace-nowrap"
        >
          Click here to Add Expense
        </button>
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
          <p className="text-sm text-muted-foreground">Last 7 days transactions</p>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7DaysData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
              <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={false}
                wrapperStyle={{ outline: 'none' }}
              />
              <Bar 
                dataKey="amount" 
                radius={[8, 8, 0, 0]}
                isAnimationActive={true}
              >
                {last7DaysData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#22c55e" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </main>
  );
}
