'use client';

import { useState } from "react";
import { setMonthlyIncome } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import { useUser } from "@clerk/nextjs";

export function MonthlyIncomeDialog() {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        if (!user) {
            alert("You must be logged in to add your income");
            return;
        }
        
        setLoading(true);

        const income = { 
            // userId: "user123",  //temporary hardcoded userId
            userId: user.id,
            month: String(formData.get('month')),
            income: Number(formData.get('income')),
        }

        try {
            await setMonthlyIncome(income);
            window.location.reload();

        } catch(error) {
            alert("Failed to add Income");
        } finally {
            setLoading(false);
        }
    }

    return  (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Add Income</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                <DialogTitle>Add Income</DialogTitle>
                </DialogHeader>

                <form action={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="month">Month</Label>
                    <Input name="month" required />
                </div>

                <div>
                    <Label htmlFor="income">Income</Label>
                    <Input name="income" type="number" required />
                </div>

                <Button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Income"}
                </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}