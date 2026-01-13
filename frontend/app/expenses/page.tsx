'use client';

import { useState, useEffect, useMemo } from "react";
import { getExpenses, deleteExpense, Expense } from "@/lib/api";
import { useUser } from "@clerk/nextjs";
import { ExpenseTable } from "@/components/expenseTable";
import { AddExpenseDialog } from "@/components/addExpenseDialog";
import { EditExpenseDialog } from "@/components/editExpenseDialog"; 
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";

export default function ExpensesPage() {
    const { user, isLoaded } = useUser();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Expense | null>(null);
    const [filterCategory, setFilterCategory] = useState<string>("");
    
    // Initialize with current month
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

    // Get unique categories for filter
    const categories = useMemo(() => {
        const cats = new Set(expenses.map(e => e.category));
        return Array.from(cats).sort();
    }, [expenses]);

    // Get unique months and years for filter
    const monthYears = useMemo(() => {
        const months = new Set<string>();
        expenses.forEach(e => {
            const date = new Date(e.date);
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            months.add(`${year}-${month}`);
        });
        return Array.from(months).sort().reverse();
    }, [expenses]);

    // Filter expenses based on selected filters
    const filteredExpenses = useMemo(() => {
        return expenses.filter(e => {
            // Category filter
            if (filterCategory && e.category !== filterCategory) return false;
            
            // Month/Year filter
            if (filterMonth) {
                const date = new Date(e.date);
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                if (`${year}-${month}` !== filterMonth) return false;
            }
            
            return true;
        });
    }, [expenses, filterCategory, filterMonth]);

    const monthlyTotal = useMemo(() => {
        return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    }, [filteredExpenses]);

    return (
        <main className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">All Expenses</h1>
                    <p className="text-muted-foreground">Manage and track your spending history.</p>
                </div>
                <AddExpenseDialog onSuccess={fetchExpenses} />
            </div>

            <Card className="bg-card border-none shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-semibold text-muted-foreground">Total for the Month:</h2>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="flex justify-center font-normal gap-4">
                                        
                                        {filterMonth ? new Date(parseInt(filterMonth.split('-')[0]), parseInt(filterMonth.split('-')[1]) - 1).toLocaleString('default', { month: 'long', year: 'numeric' }) : new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-1" align="start">
                                    <Calendar 
                                        month={filterMonth ? parseInt(filterMonth.split('-')[1]) - 1 : new Date().getMonth()}
                                        year={filterMonth ? parseInt(filterMonth.split('-')[0]) : new Date().getFullYear()}
                                        onMonthYearChange={(month, year) => {
                                            const monthStr = String(month + 1).padStart(2, '0');
                                            setFilterMonth(`${year}-${monthStr}`);
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <span className="text-2xl font-bold text-green-400">₹{monthlyTotal.toLocaleString()}</span>
                    </div>
                    
                    {loading ? (
                        <div className="py-20 text-center text-muted-foreground animate-pulse">Updating records...</div>
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
        </main>
    );
}