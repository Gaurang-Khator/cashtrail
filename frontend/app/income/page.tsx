'use client';

import { useState, useEffect, useMemo } from "react";
import { getMonthlyIncome, deleteExpense, Income, setMonthlyIncome } from "@/lib/api";
import { useUser } from "@clerk/nextjs";
import { IncomeTable } from "@/components/incomeTable";
import { AddIncomeDialog } from "@/components/addIncomeDialog";
import { EditIncomeDialog } from "@/components/editIncomeDialog"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { KPICard } from "@/components/kpicard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ShoppingCart, Receipt, CreditCard } from "lucide-react";
import { NavBar } from "@/components/NavBar_dashboard";

export default function IncomePage() {
    const { user, isLoaded } = useUser();
    const [income, setIncome] = useState<Income[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Income | null>(null);
    
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const [filterMonth, setFilterMonth] = useState<string>(`${currentYear}-${String(currentMonth).padStart(2, '0')}`);

    const fetchIncome = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const data = await getMonthlyIncome(user.id, filterMonth);
            // data.sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime());
            setIncome(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoaded) fetchIncome();
    }, [isLoaded, user?.id]);

    const filteredIncome = useMemo(() => {
        return income.filter(e => {
            const month = new Date(e.month);
            const m = String(month.getMonth() + 1).padStart(2, '0');
            const y = month.getFullYear();
            return `${y}-${m}` === filterMonth;
        });
    }, [income, filterMonth]);

    const monthlyTotal = useMemo(() => {
        return filteredIncome.reduce((sum, e) => sum + e.income, 0);
    }, [filteredIncome]);

    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8">
                <NavBar />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Income</h1>
                        <p className="text-muted-foreground">Detailed breakdown of your holdings.</p>
                    </div>
                    <AddIncomeDialog onSuccess={fetchIncome} />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <KPICard 
                        title="Aggregated Income for this Month" 
                        value={`₹${monthlyTotal.toLocaleString()}`} 
                        icon={<Receipt className="h-4 w-4" />} 
                    />
                    <KPICard 
                        title="Transactions" 
                        value={filteredIncome.length.toString()} 
                        icon={<ShoppingCart className="h-4 w-4" />} 
                    />
                    <KPICard 
                        title="Avg. per Expense" 
                        value={`₹${filteredIncome.length > 0 ? Math.round(monthlyTotal / filteredIncome.length).toLocaleString() : 0}`} 
                        icon={<CreditCard className="h-4 w-4" />} 
                    />
                </div>

                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-xl">Income Overview</CardTitle>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    {new Date(parseInt(filterMonth.split('-')[0]), parseInt(filterMonth.split('-')[1]) - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                                    <CalendarIcon className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-1">
                                <Calendar 
                                    month={parseInt(filterMonth.split('-')[1]) - 1}
                                    year={parseInt(filterMonth.split('-')[0])}
                                    onMonthYearChange={(m, y) => setFilterMonth(`${y}-${String(m + 1).padStart(2, '0')}`)}
                                />
                            </PopoverContent>
                        </Popover>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="py-20 text-center animate-pulse">Syncing Records...</div>
                        ) : (
                            <IncomeTable 
                                income={filteredIncome} 
                                onDelete={async (id) => {
                                    await deleteExpense(user!.id, id);
                                    fetchIncome();
                                }} 
                                onEdit={(income) => setEditing(income)} 
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