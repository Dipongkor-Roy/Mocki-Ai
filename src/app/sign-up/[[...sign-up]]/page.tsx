import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <SignUp
        signInUrl="/sign-in"
        fallbackRedirectUrl="/dashboard?login=welcome"
        forceRedirectUrl="/dashboard?login=welcome"
      />
    </div>
  );
}
