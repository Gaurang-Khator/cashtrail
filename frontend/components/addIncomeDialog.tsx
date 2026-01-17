'use client';

import { useState } from "react";
import { setMonthlyIncome } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";

const SOURCES = ["Salary", "Freelance", "Dividend", "Profit", "Other"];

export function AddIncomeDialog({ onSuccess }: { onSuccess: () => void }) {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [source, setSource] = useState("");

    async function handleSubmit(formData: FormData) {
        if (!user) return;
        setLoading(true);

        const income = { 
            userId: user.id,
            income: Number(formData.get('amount')),
            source: source,
            month: String(formData.get('date')),
        }

        try {
            await setMonthlyIncome(income);
            setOpen(false); // Close dialog
            onSuccess();    // Refresh parent state
        } catch(error) {
            alert("Failed to add income");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="h-4 w-4" /> Add Income
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] bg-card border-border text-foreground">
                <DialogHeader>
                    <DialogTitle>Add New Income</DialogTitle>
                </DialogHeader>

                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input name="amount" type="number" placeholder="0.00" required className="bg-background" />
                    </div>

                    <div className="space-y-2">
                        <Label>Source</Label>
                        <Select onValueChange={setSource} required>
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select source of income" />
                            </SelectTrigger>
                            <SelectContent>
                                {SOURCES.map((s) => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">Month</Label>
                        <Input name="date" type="month" required className="bg-background" />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading || !source}>
                        {loading ? "Adding..." : "Confirm Income"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}