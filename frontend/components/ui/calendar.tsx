import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CalendarProps {
  month?: number
  year?: number
  onMonthYearChange?: (month: number, year: number) => void
}

export function Calendar({ month: initialMonth, year: initialYear, onMonthYearChange }: CalendarProps) {
  const [month, setMonth] = React.useState(initialMonth ?? new Date().getMonth())
  const [year, setYear] = React.useState(initialYear ?? new Date().getFullYear())

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  const handleMonthSelect = (selectedMonth: number) => {
    setMonth(selectedMonth)
    onMonthYearChange?.(selectedMonth, year)
  }

  const handleYearSelect = (selectedYear: number) => {
    setYear(selectedYear)
    onMonthYearChange?.(month, selectedYear)
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const years = Array.from({ length: 10 }, (_, i) => year - 5 + i)

  return (
    <div className="p-3 space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevMonth}
          className="h-7 w-7 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold text-sm">{monthNames[month]} {year}</div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextMonth}
          className="h-7 w-7 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-semibold text-muted-foreground">Months</div>
        <div className="grid grid-cols-3 gap-2">
          {monthNames.map((m, idx) => (
            <Button
              key={m}
              variant={month === idx ? "default" : "outline"}
              size="sm"
              className="text-xs h-8"
              onClick={() => handleMonthSelect(idx)}
            >
              {m.slice(0, 3)}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-semibold text-muted-foreground">Year</div>
        <div className="grid grid-cols-2 gap-2 max-h-[120px] overflow-y-auto">
          {years.map((y) => (
            <Button
              key={y}
              variant={year === y ? "default" : "outline"}
              size="sm"
              className="text-xs h-8"
              onClick={() => handleYearSelect(y)}
            >
              {y}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
