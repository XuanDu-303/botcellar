import { Html, Heading, Link, Text } from "@react-email/components";

export default function ResetPasswordEmail({ url }: { url: string }) {
  return (
    <Html>
      <Heading>Reset your password</Heading>
      <Text>Click the link below to set a new password.</Text>
      <Link href={url}>Reset Password</Link>
    </Html>
  );
}
