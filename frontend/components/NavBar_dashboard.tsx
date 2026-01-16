"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes"; // Import the dark theme
import { Cloud, Menu, X } from "lucide-react";
import { useState } from "react";

export function NavBar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: "Dashboard", href: "/" },
    { name: "Expenses", href: "/expenses" },
    { name: "Income", href: "/income" },
    { name: "Settings", href: "/settings" },
  ];

  const clerkAppearance = {
    baseTheme: dark,
    variables: {
      colorPrimary: "#22c55e", // Standard green-500
      colorBackground: "#09090b", // Dark background
    },
    elements: {
      userButtonAvatarBox: "border border-green-900/50", 
      userButtonPopoverCard: "bg-background border border-green-900/30 shadow-2xl",
      userButtonPopoverActionButtonText: "text-foreground hover:text-green-400",
      userButtonPopoverFooter: "hidden", 
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-green-900/20 bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 h-16 max-w-7xl mx-auto w-full">

        <div className="flex items-center gap-2">
          <Cloud className="w-6 h-6 text-green-400 fill-green-400/10" />
          <span className="font-bold text-xl tracking-tight">
            <Link href={"/"}>CashTrail</Link>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-bold transition-colors hover:text-green-400 ${
                pathname === item.href ? "text-green-400" : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile menu button and Avatar */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-muted-foreground hover:text-green-400 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <UserButton 
            afterSignOutUrl="/" 
            appearance={clerkAppearance} 
          />
        </div>

        {/* Desktop Avatar */}
        <div className="hidden md:flex items-center">
          <UserButton 
            afterSignOutUrl="/" 
            appearance={clerkAppearance}
          />
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-green-900/20 bg-background">
          <div className="px-6 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block text-sm font-bold transition-colors hover:text-green-400 py-2 ${
                  pathname === item.href ? "text-green-400" : "text-muted-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}