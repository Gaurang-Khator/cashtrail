
const Footer = () => {
    return (
        <footer className="border-t border-border bg-background/50 py-8 px-6">
            <div className="max-w-7xl mx-auto text-center text-muted-foreground space-y-3">
                <p className="text-sm">&copy; 2026 CashTrail. All rights reserved.</p>
                <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full border border-zinc-700 bg-zinc-800/50">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <p className="text-sm text-green-300">Made by Gaurang Khator</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;