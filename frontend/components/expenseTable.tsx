'use client';

import { useState, useMemo } from "react";
import { Expense } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { MoreHorizontal, Edit2, Trash2, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  expenses: Expense[];
  onDelete: (expenseId: string) => void;
  onEdit: (expense: Expense) => void;
}

export function ExpenseTable({ expenses, onDelete, onEdit }: Props) {
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const categories = useMemo(() => {
    const cats = new Set(expenses.map(e => e.category));
    return Array.from(cats).sort();
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    if (!categoryFilter) return expenses;
    return expenses.filter(e => e.category === categoryFilter);
  }, [expenses, categoryFilter]);
  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 p-0 hover:bg-transparent">
                    <span className="flex items-center gap-1">
                      Category <ChevronDown className="h-4 w-4" />
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => setCategoryFilter("")}>
                    <span className={categoryFilter === "" ? "font-semibold" : ""}>All Categories</span>
                  </DropdownMenuItem>
                  {categories.map(cat => (
                    <DropdownMenuItem key={cat} onClick={() => setCategoryFilter(cat)}>
                      <span className={categoryFilter === cat ? "font-semibold" : ""}>{cat}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableHead>
            <TableHead>Note</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredExpenses.map((expense) => (
            <TableRow key={expense.expenseId}>
              <TableCell>{expense.date}</TableCell>
              <TableCell>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                    {expense.category}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">{expense.note}</TableCell>
              <TableCell className="text-right font-bold">₹{expense.amount}</TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(expense)}>
                      <Edit2 className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(expense.expenseId)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}