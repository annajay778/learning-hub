"use client";

import { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <div className="flex min-h-svh items-center justify-center bg-gradient-to-b from-[#6B8DB5] via-[#94B0CA] to-[#C8D5DF] px-4">
      <Card className="w-full max-w-sm">
        <CardContent className="space-y-4 p-6 text-center">
          <div>
            <h1 className="text-base font-semibold">Build to Learn</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              AI Build to Learn Experiment Hub
            </p>
          </div>

          {error === "AccessDenied" && (
            <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700">
              Access is limited to Campminder team members. Sign in with your
              @campminder.com Google account.
            </div>
          )}

          {error && error !== "AccessDenied" && (
            <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700">
              Something went wrong. Please try again.
            </div>
          )}

          <Button
            className="w-full"
            onClick={() => signIn("google", { callbackUrl })}
          >
            Sign in with Google
          </Button>

          <p className="text-[10px] text-muted-foreground">
            Requires a @campminder.com email
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
