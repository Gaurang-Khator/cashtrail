import Link from "next/link";
import { Cloud } from "lucide-react";

const NavBar_landing = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
            <div className="flex items-center justify-between px-6 h-16 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2">
                    <Cloud className="w-6 h-6 text-green-400 fill-green-400/10" />
                    <span className="font-bold text-xl tracking-tight"><Link href={"/"}>CashTrail</Link></span>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-green-400 active:text-green-400 transition-colors px-2 py-2">
                    Sign In
                    </Link>
                    <Link href="/sign-up" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-sm hover:bg-primary/90 active:bg-primary/90 transition-colors">
                    Sign Up
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default NavBar_landing;