"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";

export function GoogleSignInButton({ callbackUrl = "/" }: { callbackUrl?: string }) {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl });
  };

  return (
    <Button
      disabled={loading}
      onClick={handleGoogleSignIn}
      className="w-full cursor-pointer"
      variant="outline"
    >
      {loading ? "Redirecting to Google..." : "Sign In with Google"}
    </Button>
  );
}
