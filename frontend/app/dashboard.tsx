'use client';

import { useState, useEffect, useMemo } from "react";
import { getExpenses, getIncome, Expense, Income } from "@/lib/api"; // ✅ import Income
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { TrendingUp, Wallet, PiggyBank, PieChart as PieChartIcon } from "lucide-react";
import { KPICard } from "@/components/kpicard";
import { NavBar } from "@/components/NavBar_dashboard";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell as PieCell, Legend
} from "recharts";

export function Dashboard() {
  const { user, isLoaded } = useUser();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]); // ✅ FIX
  const [loading, setLoading] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12 && hour > 4) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  async function loadDashboardData() {
    if (!user?.id) return;
    try {
      const [expensesData, incomeData] = await Promise.all([
        getExpenses(user.id),
        getIncome(user.id) // ✅ returns Income[]
      ]);

      setExpenses(expensesData);
      setIncome(incomeData);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isLoaded) loadDashboardData();
  }, [isLoaded, user?.id]);

  // ✅ CORRECT MONTHLY CALCULATIONS
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

    const monthlyIncome = income
      .filter(i => {
        const d = new Date(i.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, i) => sum + i.amount, 0);

    const totalSavings = monthlyIncome - monthlyExpenses;

    return {
      monthlyIncome,
      monthlyExpenses,
      totalSavings: totalSavings > 0 ? totalSavings : 0
    };
  }, [expenses, income]);

  const pieData = useMemo(() => [
    { name: 'Expenses', value: stats.monthlyExpenses, color: '#ef4444' },
    { name: 'Savings', value: stats.totalSavings, color: '#22c55e' },
  ], [stats]);

  const BarTooltip = ({ active, payload, label }: any) => { 
    if (active && payload && payload.length) { 
      return ( 
        <div className="p-3 border border-green-900/30 bg-zinc-950 rounded-lg shadow-xl backdrop-blur-md"> 
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</p> 
          <p className="text-sm font-bold text-green-400"> ₹{payload[0].value.toLocaleString('en-IN')} </p> 
        </div> 
      ); 
    } 
    return null; 
};

const PieTooltip = ({ active, payload }: any) => { 
  if (active && payload && payload.length) { 
    const data = payload[0].payload; 
    return ( 
      <div className="p-3 border border-green-900/30 bg-zinc-950 rounded-lg shadow-xl backdrop-blur-md"> 
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{data.name}</p> 
        <p className="text-sm font-bold" style={{ color: data.color }}> ₹{data.value.toLocaleString('en-IN')} </p> 
      </div> 
    );
  } 
  return null; 
};

  const last7DaysData = useMemo(() => {
    const now = new Date();
    const map: Record<string, number> = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      map[key] = 0;
    }

    expenses.forEach(e => {
      const d = new Date(e.date);
      const key = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      if (map[key] !== undefined) {
        map[key] += e.amount;
      }
    });

    return Object.entries(map).map(([date, amount]) => ({ date, amount }));
  }, [expenses]);

  if (!isLoaded || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
        <p className="text-muted-foreground mt-4">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-10 space-y-6 md:space-y-10">
      <NavBar />

      <header className="space-y-2 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {getGreeting()}, <span className="text-green-400">{user?.firstName || "User"}</span>!
          </h1>
          <p className="text-sm text-muted-foreground">
            Your financial summary for this month.
          </p>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
        {/* Bar Chart Card */}
        <Card className="bg-card/40 border-border border-2 border-dashed overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Spending Trend</CardTitle>
            <p className="text-xs text-muted-foreground">Daily transactions (Last 7 Days)</p>
          </CardHeader>
          <CardContent className="h-[250px] md:h-[300px] w-full pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7DaysData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 197, 94, 0.05)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#71717a" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(34, 197, 94, 0.05)' }} />
                <Bar dataKey="amount" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart Card */}
        <Card className="bg-card/40 border-border border-2 border-dashed overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Budget Allocation</CardTitle>
            <p className="text-xs text-muted-foreground">Monthly Savings vs Expenses</p>
          </CardHeader>
          <CardContent className="h-[250px] md:h-[300px] w-full">
            {stats.monthlyIncome > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius="60%"
                    outerRadius="80%"
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <PieCell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <PieChartIcon className="w-10 h-10 mb-2 opacity-20" />
                <p className="text-xs">Add income to see budget allocation</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
