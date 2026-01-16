'use client';

import { useState, useEffect, useMemo } from "react";
import { getExpenses, deleteExpense, Expense } from "@/lib/api";
import { useUser } from "@clerk/nextjs";
import { ExpenseTable } from "@/components/expenseTable";
import { AddExpenseDialog } from "@/components/addExpenseDialog";
import { EditExpenseDialog } from "@/components/editExpenseDialog"; 
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

export default function ExpensesPage() {
    const { user, isLoaded } = useUser();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Expense | null>(null);
    
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const [filterMonth, setFilterMonth] = useState<string>(`${currentYear}-${String(currentMonth).padStart(2, '0')}`);

    const fetchExpenses = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const data = await getExpenses(user.id);
            data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setExpenses(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoaded) fetchExpenses();
    }, [isLoaded, user?.id]);

    const filteredExpenses = useMemo(() => {
        return expenses.filter(e => {
            const date = new Date(e.date);
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const y = date.getFullYear();
            return `${y}-${m}` === filterMonth;
        });
    }, [expenses, filterMonth]);

    const monthlyTotal = useMemo(() => {
        return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    }, [filteredExpenses]);

    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8">
                <NavBar />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Expenses</h1>
                        <p className="text-muted-foreground">Detailed breakdown of your spending.</p>
                    </div>
                    <AddExpenseDialog onSuccess={fetchExpenses} />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <KPICard 
                        title="Total Spent" 
                        value={`₹${monthlyTotal.toLocaleString()}`} 
                        icon={<Receipt className="h-4 w-4" />} 
                    />
                    <KPICard 
                        title="Transactions" 
                        value={filteredExpenses.length.toString()} 
                        icon={<ShoppingCart className="h-4 w-4" />} 
                    />
                    <KPICard 
                        title="Avg. per Expense" 
                        value={`₹${filteredExpenses.length > 0 ? Math.round(monthlyTotal / filteredExpenses.length).toLocaleString() : 0}`} 
                        icon={<CreditCard className="h-4 w-4" />} 
                    />
                </div>

                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-xl">Transaction History</CardTitle>
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
                            <div className="py-20 text-center animate-pulse">Loading transactions...</div>
                        ) : (
                            <ExpenseTable 
                                expenses={filteredExpenses} 
                                onDelete={async (id) => {
                                    await deleteExpense(user!.id, id);
                                    fetchExpenses();
                                }} 
                                onEdit={(expense) => setEditing(expense)} 
                            />
                        )}
                    </CardContent>
                </Card>

                {editing && (
                    <EditExpenseDialog
                        expense={editing}
                        open={!!editing}
                        onClose={() => setEditing(null)}
                        onUpdated={() => {
                            setEditing(null);
                            fetchExpenses(); 
                        }}
                    />
                )}
            </div>
        </main>
    );
}