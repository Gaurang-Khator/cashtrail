'use client';

import { useState, useEffect } from 'react';
import { getMonthlyIncome, setMonthlyIncome } from '@/lib/api';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KPICard } from "@/components/kpicard";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription 
} from '@/components/ui/dialog';
import { NavBar } from '@/components/NavBar_dashboard';
import { 
  TrendingUp, 
  Wallet, 
  Plus,
  Briefcase,
  History,
  ArrowUpRight
} from 'lucide-react';

export default function IncomePage() {
  const { user, isLoaded } = useUser();
  const [income, setIncome] = useState<number>(0);
  const [incomeHistory, setIncomeHistory] = useState<{ month: string, amount: number }[]>([]);
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

  const fetchData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // Fetch current month
      const currentData = await getMonthlyIncome(user.id, selectedMonth);
      setIncome(currentData.income || 0);

      // Generate last 6 months for the history list
      const history = [];
      for (let i = 0; i < 6; i++) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const mStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const data = await getMonthlyIncome(user.id, mStr);
        history.push({ month: mStr, amount: data.income || 0 });
      }
      setIncomeHistory(history);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user?.id) {
      fetchData();
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
      await fetchData();
    } catch (error) {
      alert('Failed to save income');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const getMonthName = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { 
      month: 'long', year: 'numeric' 
    });
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8">
        <NavBar />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Monthly Income</h1>
            <p className="text-muted-foreground mt-1">Track and manage your monthly earnings.</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                <Plus className="h-4 w-4" />
                {income > 0 ? 'Update Monthly Income' : 'Add Monthly Income'}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-none">
              <DialogHeader>
                <DialogTitle className="text-green-400">Manage Income</DialogTitle>
                <DialogDescription>Set your income for the selected month.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-white">Month</Label>
                  <Input type="month" className="bg-background border-none text-white" value={formData.month} onChange={(e) => setFormData({...formData, month: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Amount (₹)</Label>
                  <Input type="number" className="bg-background border-none text-white" value={formData.income} onChange={(e) => setFormData({...formData, income: e.target.value})} />
                </div>
                <Button onClick={handleSubmit} disabled={submitting} className="w-full bg-green-500 text-black font-bold">
                  {submitting ? 'Saving...' : 'Save Income'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <KPICard title="Current Month" value={formatCurrency(income)} icon={<Wallet className="h-4 w-4" />} />
          <KPICard title="Status" value={income > 0 ? 'Active' : 'Not Set'} icon={<Briefcase className="h-4 w-4" />} />
          <KPICard title="6-Month Avg" value={formatCurrency(Math.round(incomeHistory.reduce((s,i)=>s+i.amount,0)/6))} icon={<TrendingUp className="h-4 w-4" />} />
        </div>

        {/* Income History */}
        <Card className="border-none bg-card shadow-md">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-green-400" />
              <CardTitle className="text-xl text-green-300">Income History</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">Last 6 months recorded revenue</p>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="animate-spin h-8 w-8 border-b-2 border-green-500 rounded-full" />
                <p className="text-sm text-muted-foreground tracking-widest">FETCHING RECORDS...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {incomeHistory.map((item, index) => (
                  <div 
                    key={item.month} 
                    className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/40 border border-white/5 hover:border-green-500/30 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${item.amount > 0 ? 'bg-green-500/10 text-green-400' : 'bg-zinc-800 text-muted-foreground'}`}>
                         <ArrowUpRight className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-green-400 transition-colors">
                          {getMonthName(item.month)}
                        </p>
                        <p className="text-[10px] uppercase text-muted-foreground tracking-widest">
                          {item.amount > 0 ? 'Verified Payment' : 'No Data Recorded'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-black tracking-tight ${item.amount > 0 ? 'text-white' : 'text-muted-foreground/30'}`}>
                        {item.amount > 0 ? formatCurrency(item.amount) : '₹0'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}