'use client';

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Footer from "@/components/Footer";
import NavBar_landing from "@/components/NavBar_landing";

export default function SignUpPage() {
    return (
        <main className="min-h-screen bg-background flex flex-col">
            <NavBar_landing />

            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <SignUp 
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
                                formButtonPrimary: "bg-green-500 hover:bg-green-600 text-black font-bold py-2.5",
                                footerActionLink: "text-green-400 hover:text-green-300",
                            }
                        }}
                    />
                </div>
            </div>
            
            <Footer />
        </main>
    );
}