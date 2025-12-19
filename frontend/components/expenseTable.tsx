import { Expense } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";

interface Props {
  expenses: Expense[]
  onDelete: (expenseId: string) => void
  onEdit: (expense: Expense) => void
}

export function ExpenseTable({ expenses, onDelete, onEdit} : Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Note</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {expenses.map((expense) => (
          <TableRow key={expense.expenseId}>
            <TableCell>{expense.date}</TableCell>
            <TableCell>{expense.category}</TableCell>
            <TableCell>{expense.note}</TableCell>
            <TableCell className="text-right">
              ₹{expense.amount}
            </TableCell>

            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(expense)}>Edit</Button>
              <Button variant="outline" size="sm" onClick={() => onDelete(expense.expenseId)}>Delete</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}