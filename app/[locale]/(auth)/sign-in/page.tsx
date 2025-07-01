import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GoogleSignInButton } from "./_components/google-signin-button";
import SeparatorWithOr from "@/components/shared/separator-or";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import CredentialsSignInForm from "./_components/credentials-signin-form";
import { Button } from "@/components/ui/button";
import { getSetting } from '@/lib/actions/setting.actions'
import { auth } from "@/lib/auth";


export const metadata: Metadata = {
  title: "Sign In",
};

export default async function SignIn(props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) {
  const { site } = await getSetting()
  const searchParams = await props.searchParams;

  const { callbackUrl = "/" } = searchParams;

  const session = await auth();
  if (session) {
    return redirect(callbackUrl);
  }

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <CredentialsSignInForm />
          </div>
          <SeparatorWithOr />
          <div className="mt-4">
            <GoogleSignInButton callbackUrl={callbackUrl}  />
          </div>
        </CardContent>
      </Card>
      <SeparatorWithOr>New to {site.name}?</SeparatorWithOr>

      <Link href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
        <Button className="w-full cursor-pointer" variant="outline">
          Create your {site.name} account
        </Button>
      </Link>
    </div>
  );
}
