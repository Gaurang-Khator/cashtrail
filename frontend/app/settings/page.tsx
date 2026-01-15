import { NavBar } from "@/components/NavBar_dashboard";
import { UserProfile } from "@clerk/nextjs";

export default function Settings() {
  return (
      <main className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8">
        <NavBar />
        <div className="flex items-center justify-center">
          <UserProfile />
        </div>
      </main>
  )
}