import { SignIn } from "@clerk/nextjs";
import Footer  from "@/components/Footer";
import NavBar_landing  from "@/components/NavBar_landing";

export default function SignInPage() {
    return (
        <main className="min-h-screen bg-background/95 flex flex-col">
            
            <NavBar_landing />

            <div className="flex-1 flex items-center justify-center px-4 py-6">
                <div className="w-full max-w-md">
                    <SignIn 
                        appearance={{
                            elements: {
                                card: "bg-background/60 border border-border/50 shadow-none rounded-2xl p-6 sm:p-8 backdrop-blur-sm",
                                rootBox: "w-full",
                                headerTitle: "text-xl sm:text-2xl font-bold text-foreground",
                                headerSubtitle: "text-xs sm:text-sm text-muted-foreground",
                                socialButtonsBlockButton: "border border-border bg-background/30 hover:bg-background/50 text-foreground font-medium rounded-lg py-2 sm:py-2.5 px-4 text-sm",
                                formButtonPrimary: "bg-green-400 hover:bg-green-500 text-foreground font-semibold rounded-lg py-2 sm:py-2.5 w-full text-sm",
                                formFieldInput: "bg-background/30 border border-border/30 text-foreground placeholder:text-muted-foreground rounded-lg text-sm",
                                formFieldLabel: "text-xs sm:text-sm font-medium text-foreground",
                                footerActionLink: "text-green-400 hover:text-green-300 font-medium text-sm",
                                dividerLine: "bg-border/30",
                                dividerText: "text-muted-foreground text-xs sm:text-sm",
                            },
                            variables: {
                                colorPrimary: "#4ade80",
                            }
                        }}
                    />
                </div>
            </div>
            
            <Footer />

        </main>
    );
}