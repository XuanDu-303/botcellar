"use client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { IUserSignIn } from "@/types";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { getCsrfToken } from "next-auth/react";

import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSignInSchema } from "@/lib/validator";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import useSettingStore from '@/hooks/use-setting-store'
import { useEffect, useState } from "react";
import Loading from "@/components/shared/loading";

const signInDefaultValues =
  process.env.NODE_ENV === "development"
    ? {
        email: "admin@example.com",
        password: "123456",
      }
    : {
        email: "",
        password: "",
      };

export default function CredentialsSignInForm() {
  const {
    setting: { site },
  } = useSettingStore()
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  const router = useRouter();
  useEffect(() => {
    const fetchToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token);
    };
    fetchToken();
  }, []);

  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const form = useForm<IUserSignIn>({
    resolver: zodResolver(UserSignInSchema),
    defaultValues: signInDefaultValues,
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (data: IUserSignIn) => {
    try {
      await signInWithCredentials({
        email: data.email,
        password: data.password,
      });
      router.push(callbackUrl);
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }

      toast("Error", {
        description: "Invalid email or password",
      });
    }
  };

  if (!csrfToken) {
    return (
      <div className="space-y-5 min-w-xs pr-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" /> {/* label */}
          <Skeleton className="h-8 w-full max-w-md" /> {/* input */}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" /> {/* label */}
          <Skeleton className="h-8 w-full max-w-md" /> {/* input */}
        </div>
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-full max-w-md" /> {/* button */}
      </div>
    );
  }
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <input type="hidden" name="csrfToken" value={csrfToken} />
        <div className="space-y-6">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            {/* Submit Button */}
            <div>
              <Button type="submit" className="cursor-pointer">
                {form.formState.isSubmitting ? <div className="flex gap-2 items-center">{<Loading className="fill-foreground" />}</div> : `Sign In`}
              </Button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-left">
              <Link href="/forgot-password" className="text-sm underline text-blue-600 hover:text-blue-800">
                Forgot password?
              </Link>
            </div>

            {/* Terms and Privacy */}
            <div className="text-sm text-gray-600">
              By signing in, you agree to <strong>{site.name}</strong>&lsquo;s{" "}
              <Link href="/page/conditions-of-use" className="underline hover:text-blue-700">
                Conditions of Use
              </Link>{" "}
              and{" "}
              <Link href="/page/privacy-policy" className="underline hover:text-blue-700">
                Privacy Notice
              </Link>.
            </div>
          </div>

        </div>
      </form>
    </Form>
  );
}
