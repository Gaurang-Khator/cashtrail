'use client';

import { useState, useEffect, useMemo } from "react";
import { getExpenses, deleteExpense, Expense } from "@/lib/api";
import { useUser } from "@clerk/nextjs";
import { ExpenseTable } from "@/components/expenseTable";
import { AddExpenseDialog } from "@/components/addExpenseDialog";
import { EditExpenseDialog } from "@/components/editExpenseDialog"; 
import { Card, CardContent } from "@/components/ui/card";

export default function ExpensesPage() {
    const { user, isLoaded } = useUser();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Expense | null>(null); 

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

    const monthlyTotal = useMemo(() => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        return expenses
            .filter(e => {
                const d = new Date(e.date);
                return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
            })
            .reduce((sum, e) => sum + e.amount, 0);
    }, [expenses]);

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
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-muted-foreground">Total for the Month: {new Date().toLocaleString('default', { month: 'long' })}</h2>
                        <span className="text-2xl font-bold text-primary">₹{monthlyTotal.toLocaleString()}</span>
                    </div>
                    
                    {loading ? (
                        <div className="py-20 text-center text-muted-foreground animate-pulse">Updating records...</div>
                    ) : (
                        <ExpenseTable 
                            expenses={expenses} 
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