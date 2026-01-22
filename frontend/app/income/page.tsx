'use client';

import { useEffect, useMemo, useState } from "react";
import { getIncome, deleteIncome, Income } from "@/lib/api"; 
import { useUser } from "@clerk/nextjs";
import { IncomeTable } from "@/components/incomeTable";
import { AddIncomeDialog } from "@/components/addIncomeDialog";
import { EditIncomeDialog } from "@/components/editIncomeDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { KPICard } from "@/components/kpicard";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Receipt, CreditCard } from "lucide-react";
import { NavBar } from "@/components/NavBar_dashboard";

export default function IncomePage() {
  const { user, isLoaded } = useUser();
  const [income, setIncome] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Income | null>(null);

  const now = new Date();
  const [filterMonth, setFilterMonth] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  );

  async function fetchIncome() {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await getIncome(user.id); // ✅ fetch all income
      setIncome(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isLoaded) fetchIncome();
  }, [isLoaded, user?.id]);

  // ✅ filter by selected month (YYYY-MM)
  const filteredIncome = useMemo(() => {
    return income.filter(i => i.date.startsWith(filterMonth));
  }, [income, filterMonth]);

  // ✅ total monthly income
  const monthlyTotal = useMemo(() => {
    return filteredIncome.reduce((sum, i) => sum + i.amount, 0);
  }, [filteredIncome]);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8">
        <NavBar />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Income</h1>
            <p className="text-muted-foreground">
              Track and manage your income sources.
            </p>
          </div>
          <AddIncomeDialog onSuccess={fetchIncome} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <KPICard
            title="Total Income (Month)"
            value={`₹${monthlyTotal.toLocaleString()}`}
            icon={<Receipt className="h-4 w-4" />}
          />
          <KPICard
            title="Transactions"
            value={filteredIncome.length.toString()}
            icon={<CreditCard className="h-4 w-4" />}
          />
          <KPICard
            title="Avg per Income"
            value={`₹${
              filteredIncome.length
                ? Math.round(monthlyTotal / filteredIncome.length).toLocaleString()
                : 0
            }`}
            icon={<CreditCard className="h-4 w-4" />}
          />
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-xl">Income Overview</CardTitle>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  {new Date(
                    parseInt(filterMonth.split("-")[0]),
                    parseInt(filterMonth.split("-")[1]) - 1
                  ).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-1">
                <Calendar
                  month={parseInt(filterMonth.split("-")[1]) - 1}
                  year={parseInt(filterMonth.split("-")[0])}
                  onMonthYearChange={(m, y) =>
                    setFilterMonth(`${y}-${String(m + 1).padStart(2, "0")}`)
                  }
                />
              </PopoverContent>
            </Popover>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="py-20 text-center animate-pulse">
                Loading Income...
              </div>
            ) : (
              <IncomeTable
                income={filteredIncome}
                onDelete={async (id) => {
                  await deleteIncome(user!.id, id);
                  fetchIncome();
                }}
                onEdit={setEditing}
              />
            )}
          </CardContent>
        </Card>

        {editing && (
          <EditIncomeDialog
            income={editing}
            open={!!editing}
            onClose={() => setEditing(null)}
            onUpdated={() => {
              setEditing(null);
              fetchIncome();
            }}
          />
        )}
      </div>
    </main>
  );
}
