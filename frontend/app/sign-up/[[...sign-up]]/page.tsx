import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Cloud } from "lucide-react";

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/95 flex flex-col">

            {/* Sign Up Content */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-bold">Create Account</h1>
                            <p className="text-muted-foreground">Join CashTrail and start managing your finances</p>
                        </div>
                        
                        <div className="bg-card/40 border border-border rounded-lg p-8">
                            <SignUp />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}