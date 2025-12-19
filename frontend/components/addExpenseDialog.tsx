'use client';

import { useState } from "react";
import { addExpense } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

import { useUser } from "@clerk/nextjs";

export function AddExpenseDialog() {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        if (!user) {
            alert("You must be logged in to add an expense");
            return;
        }
        
        setLoading(true);

        const expense = { 
            // userId: "user123",  //temporary hardcoded userId
            userId: user.id,
            amount: Number(formData.get('amount')),
            category: String(formData.get('category')),
            date: String(formData.get('date')),
            note: String(formData.get('note') || "")
        }

        try {
            await addExpense(expense);
            window.location.reload();

        } catch(error) {
            alert("Failed to add expense");
        } finally {
            setLoading(false);
        }
    }


    return  (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Add Expense</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                </DialogHeader>

                <form action={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input name="amount" type="number" required />
                </div>

                <div>
                    <Label htmlFor="category">Category</Label>
                    <Input name="category" required />
                </div>

                <div>
                    <Label htmlFor="date">Date</Label>
                    <Input name="date" type="date" required />
                </div>

                <div>
                    <Label htmlFor="note">Note</Label>
                    <Textarea name="note" />
                </div>

                <Button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Expense"}
                </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}