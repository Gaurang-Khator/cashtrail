'use client';

import { NavBar } from "@/components/NavBar_dashboard";
import { UserProfile } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings2, ShieldCheck, UserCircle, BellRing } from "lucide-react";
import { dark } from "@clerk/themes";

export default function Settings() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8">
        <NavBar />

        <header>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Settings2 className="h-8 w-8 text-green-400" />
            Account Settings
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none bg-card shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-green-300">
                  <UserCircle className="h-5 w-5" /> Profile Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-4">
                <p>Your data is encrypted and used only for your dashboard.</p>
                <div className="flex items-center gap-2 text-green-500 font-medium">
                  <ShieldCheck className="h-4 w-4" /> Verified Account
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-card shadow-md opacity-60">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-muted-foreground">
                  <BellRing className="h-5 w-5" /> Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Email alerts coming soon.</p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="border-none bg-card shadow-xl overflow-hidden min-h-[600px]">
              <CardContent className="p-0 flex justify-center bg-zinc-950/20">
                <UserProfile 
                  routing="hash" 
                  appearance={{
                    baseTheme: dark,
                    layout: {
                      shimmer: true,
                    },
                    variables: {
                      colorPrimary: "#22c55e",
                      colorBackground: "#0c0c0e", 
                    },
                    elements: {
                      rootBox: "w-full", 
                      card: "w-full bg-transparent shadow-none border-none",
                      navbar: "hidden", 
                      scrollBox: "bg-transparent rounded-none",
                      pageScrollBox: "p-4 sm:p-8",
                      headerTitle: "text-green-400 font-bold",
                      headerSubtitle: "text-muted-foreground",
                      formButtonPrimary: "bg-green-600 hover:bg-green-700 text-black font-bold",
                    }
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}