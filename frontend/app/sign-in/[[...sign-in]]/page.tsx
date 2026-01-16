'use client';

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes"; 
import Footer from "@/components/Footer";
import NavBar_landing from "@/components/NavBar_landing";

export default function SignInPage() {
    return (
        <main className="min-h-screen bg-background flex flex-col">
            <NavBar_landing />

            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <SignIn 
                        appearance={{
                            baseTheme: dark,
                            variables: {
                                colorPrimary: "#22c55e", // Standard green-500
                                colorBackground: "#09090b", // Dark background
                            },
                            elements: {
                                card: "bg-background/60 border border-green-900/30 shadow-2xl rounded-2xl p-6 sm:p-8 backdrop-blur-md",
                                rootBox: "w-full",
                                headerTitle: "text-2xl font-bold text-green-400",
                                headerSubtitle: "text-sm text-muted-foreground",
                                socialButtonsBlockButton: "border border-green-900/50 bg-background/30 hover:bg-green-900/20 text-foreground transition-all duration-200",
                                formButtonPrimary: "bg-green-500 hover:bg-green-600 text-black font-bold rounded-lg py-2.5 shadow-[0_0_15px_rgba(34,197,94,0.3)]",
                                formFieldInput: "bg-background/50 border border-green-900/30 text-foreground focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all",
                                footerActionLink: "text-green-400 hover:text-green-300 transition-colors",
                                dividerLine: "bg-green-900/30",
                                dividerText: "text-muted-foreground",
                            }
                        }}
                    />
                </div>
            </div>
            
            <Footer />
        </main>
    );
}