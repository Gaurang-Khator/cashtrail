'use client';

import { useState } from "react";
import { addExpense } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";

const CATEGORIES = ["Shopping", "Food", "Rent", "Utilities", "Entertainment", "Transport", "Fixed", "Other"];

export function AddExpenseDialog({ onSuccess }: { onSuccess: () => void }) {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [category, setCategory] = useState("");

    async function handleSubmit(formData: FormData) {
        if (!user) return;
        setLoading(true);

        const expense = { 
            userId: user.id,
            amount: Number(formData.get('amount')),
            category: category,
            date: String(formData.get('date')),
            note: String(formData.get('note') || "")
        }

        try {
            await addExpense(expense);
            setOpen(false); // Close dialog
            onSuccess();    // Refresh parent state
        } catch(error) {
            alert("Failed to add expense");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="h-4 w-4" /> Add Expense
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] bg-card border-border text-foreground">
                <DialogHeader>
                    <DialogTitle>Add New Expense</DialogTitle>
                </DialogHeader>

                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input name="amount" type="number" placeholder="0.00" required className="bg-background" />
                    </div>

                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select onValueChange={setCategory} required>
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input name="date" type="date" required className="bg-background" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="note">Note</Label>
                        <Textarea name="note" placeholder="What was this for?" className="bg-background" />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading || !category}>
                        {loading ? "Adding..." : "Confirm Expense"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}