'use client';

import { useState, useEffect } from 'react';
import { getMonthlyIncome, setMonthlyIncome } from '@/lib/api';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KPICard } from '@/components/kpicard';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from "@/components/ui/calendar";
import { NavBar } from '@/components/NavBar_dashboard';
import { 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Wallet, 
  Plus,
  DollarSign,
  Briefcase,
  PiggyBank
} from 'lucide-react';

export default function IncomePage() {
  const { user, isLoaded } = useUser();
  const [income, setIncome] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState<string>(
    `${currentYear}-${String(currentMonth).padStart(2, '0')}`
  );

  const [formData, setFormData] = useState({
    month: selectedMonth,
    income: ''
  });

  const fetchIncome = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await getMonthlyIncome(user.id, selectedMonth);
      setIncome(data.income || 0);
    } catch (error) {
      console.error('Failed to fetch income', error);
      setIncome(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user?.id) {
      fetchIncome();
    }
  }, [isLoaded, user?.id, selectedMonth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      await setMonthlyIncome({
        userId: user.id,
        month: formData.month,
        income: Number(formData.income),
      });
      setIsDialogOpen(false);
      setFormData({ month: selectedMonth, income: '' });
      await fetchIncome();
    } catch (error) {
      alert('Failed to add Income');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const getMonthName = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8">
        <NavBar />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Monthly Income</h1>
            <p className="text-muted-foreground mt-1">Track and manage your monthly income.</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-sm">
                <Plus className="h-4 w-4" />
                {income > 0 ? 'Update Income' : 'Add Income'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{income > 0 ? 'Update Income' : 'Add Income'}</DialogTitle>
                <DialogDescription>Set your income for the selected month.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Month</Label>
                  <Input type="month" value={formData.month} onChange={(e) => setFormData({...formData, month: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Income Amount (₹)</Label>
                  <Input type="number" value={formData.income} onChange={(e) => setFormData({...formData, income: e.target.value})} />
                </div>
                <Button onClick={handleSubmit} disabled={submitting} className="w-full">
                  {submitting ? 'Saving...' : 'Save Income'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <KPICard 
            title="Total Income" 
            value={loading ? '...' : formatCurrency(income)} 
            icon={<Wallet className="h-4 w-4" />} 
          />
          <KPICard 
            title="Monthly Status" 
            value={income > 0 ? 'Active' : 'Not Set'} 
            icon={<Briefcase className="h-4 w-4" />} 
          />
          <KPICard 
            title="Growth" 
            value={income > 0 ? "+5.2%" : "0%"} 
            icon={<TrendingUp className="h-4 w-4" />} 
          />
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Income Overview</CardTitle>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  {getMonthName(selectedMonth)}
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-1">
                <Calendar
                  month={parseInt(selectedMonth.split('-')[1]) - 1}
                  year={parseInt(selectedMonth.split('-')[0])}
                  onMonthYearChange={(m, y) => setSelectedMonth(`${y}-${String(m + 1).padStart(2, '0')}`)}
                />
              </PopoverContent>
            </Popover>
          </CardHeader>
          <CardContent>
            {income === 0 && !loading ? (
              <div className="text-center py-12">
                <PiggyBank className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p>No income recorded for this month.</p>
              </div>
            ) : (
              <div className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/10 p-6 rounded-xl border border-green-100 dark:border-green-900/30">
                <div className="flex justify-between items-center">
                   <div>
                      <p className="text-sm text-muted-foreground">Monthly Total</p>
                      <h2 className="text-4xl font-bold text-green-600">{formatCurrency(income)}</h2>
                   </div>
                   <DollarSign className="h-10 w-10 text-green-500 opacity-20" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}