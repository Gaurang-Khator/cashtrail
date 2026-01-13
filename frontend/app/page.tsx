'use client';

import { useUser } from "@clerk/nextjs";
import { Dashboard } from './dashboard';
import { Landing } from './landing';

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isSignedIn ? <Dashboard /> : <Landing />;
}


