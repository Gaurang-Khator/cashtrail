"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Cloud } from "lucide-react";

export function NavBar() {
  const pathname = usePathname();
  const navItems = [
    { name: "Dashboard", href: "/" },
    { name: "Expenses", href: "/expenses" },
    { name: "Income", href: "/income" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 h-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Cloud className="w-6 h-6 text-primary fill-primary/20" />
          <span className="font-bold text-xl tracking-tight"><Link href={"/"}>CashTrail</Link></span>
        </div>

        <div className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-bold transition-colors hover:text-primary ${
                pathname === item.href ? "text-green-400 " : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center">
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </nav>
  );
}