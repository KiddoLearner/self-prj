import SignInForm from "@/src/app/component/Nav/SignInForm";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Login to your account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Go NA if you forget your password
          </p>
        </div>
        <SignInForm />
      </div>
    </main>
  );
}