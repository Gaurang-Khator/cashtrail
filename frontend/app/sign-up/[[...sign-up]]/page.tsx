import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <main className="min-h-screen bg-background/95 flex flex-col">
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <SignUp 
                        appearance={{
                            elements: {
                                card: "bg-background/60 border border-border/50 shadow-none rounded-2xl p-8 backdrop-blur-sm",
                                rootBox: "w-full",
                                headerTitle: "text-2xl font-bold text-foreground",
                                headerSubtitle: "text-sm text-muted-foreground",
                                socialButtonsBlockButton: "border border-border bg-background/30 hover:bg-background/50 text-foreground font-medium rounded-lg py-2.5 px-4",
                                formButtonPrimary: "bg-green-400 hover:bg-green-500 text-foreground font-semibold rounded-lg py-2.5 w-full",
                                formFieldInput: "bg-background/30 border border-border/30 text-foreground placeholder:text-muted-foreground rounded-lg",
                                formFieldLabel: "text-sm font-medium text-foreground",
                                footerActionLink: "text-green-400 hover:text-green-300 font-medium",
                                dividerLine: "bg-border/30",
                                dividerText: "text-muted-foreground",
                            },
                            variables: {
                                colorPrimary: "#4ade80",
                            }
                        }}
                    />
                </div>
            </div>
            
            {/* Footer */}
            <footer className="border-t border-border bg-background/50 py-6 px-6">
                <div className="max-w-7xl mx-auto text-center text-muted-foreground space-y-3">
                    <p className="text-sm">&copy; 2026 CashTrail. All rights reserved.</p>
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border-2 border-zinc-700 bg-zinc-800/50">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        <p className="text-sm text-zinc-300">Made by Gaurang Khator</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}