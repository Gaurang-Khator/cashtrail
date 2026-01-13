import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function KPICard({ title, value, icon, active }: { title: string; value: string; icon: React.ReactNode; active?: boolean }) {
  return (
    <Card className="relative overflow-hidden border-none bg-card shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="opacity-70 text-green-400">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-green-300">{value}</div>
      </CardContent>
    </Card>
  );
}