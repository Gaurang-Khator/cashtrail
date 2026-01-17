'use client';

import { useState, useMemo } from "react";
import { Income } from "@/lib/api";
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
  income: Income[];
  onDelete: (incomeId: string) => void;
  onEdit: (income: Income) => void;
}

export function IncomeTable({ income, onDelete, onEdit }: Props) {
  const [sourceFilter, setSourceFilter] = useState<string>("");

  const sources = useMemo(() => {
    const cats = new Set(income.map(e => e.source));
    return Array.from(cats).sort();
  }, [income]);

  const filteredIncome = useMemo(() => {
    if (!sourceFilter) return income;
    return income.filter(e => e.source === sourceFilter);
  }, [income, sourceFilter]);
  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 p-0 hover:bg-transparent">
                    <span className="flex items-center gap-1">
                      Source <ChevronDown className="h-4 w-4" />
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => setSourceFilter("")}>
                    <span className={sourceFilter === "" ? "font-semibold" : ""}>All Sources</span>
                  </DropdownMenuItem>
                  {sources.map(s => (
                    <DropdownMenuItem key={s} onClick={() => setSourceFilter(s)}>
                      <span className={sourceFilter === s ? "font-semibold" : ""}>{s}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableHead>
            <TableHead className="text-right">Income</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredIncome.map((income) => (
            <TableRow key={income.incomeId}>
              <TableCell>{income.month}</TableCell>
              <TableCell>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                    {income.source}
                </span>
              </TableCell>
              <TableCell className="text-right font-bold">₹{income.income}</TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(income)}>
                      <Edit2 className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(income.incomeId)}
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