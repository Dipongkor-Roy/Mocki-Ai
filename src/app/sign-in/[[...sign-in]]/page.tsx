import { SignUp } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <SignUp
        signInUrl="/sign-in"
        fallbackRedirectUrl="/dashboard?login=success"
        forceRedirectUrl="/dashboard?login=success"
      />
    </div>
  );
}
