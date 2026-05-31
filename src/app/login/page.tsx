import { Suspense } from "react";
import { LoginForm } from "@/presentation/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-100 via-white to-blue-50 px-4 py-12 md:px-8">
      <div className="w-full max-w-lg">
        <Suspense
          fallback={
            <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-lg">
              로딩 중…
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
