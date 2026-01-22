'use client';

import { useMemo, useState } from "react";
import { Income } from "@/lib/api";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "./ui/table";
import { Button } from "./ui/button";
import { MoreHorizontal, Edit2, Trash2, ChevronDown } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  income: Income[];
  onDelete: (incomeId: string) => void;
  onEdit: (income: Income) => void;
}

export function IncomeTable({ income, onDelete, onEdit }: Props) {
  const [sourceFilter, setSourceFilter] = useState("");

  const sources = useMemo(() => {
    return Array.from(new Set(income.map(i => i.source))).sort();
  }, [income]);

  const filtered = useMemo(() => {
    if (!sourceFilter) return income;
    return income.filter(i => i.source === sourceFilter);
  }, [income, sourceFilter]);

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 p-0">
                    Source <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSourceFilter("")}>
                    All Sources
                  </DropdownMenuItem>
                  {sources.map(s => (
                    <DropdownMenuItem key={s} onClick={() => setSourceFilter(s)}>
                      {s}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filtered.map(i => (
            <TableRow key={i.incomeId}>
              <TableCell>{i.date}</TableCell>
              <TableCell>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                  {i.source}
                </span>
              </TableCell>
              <TableCell className="text-right font-bold">
                ₹{i.amount}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(i)}>
                      <Edit2 className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(i.incomeId)}
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
