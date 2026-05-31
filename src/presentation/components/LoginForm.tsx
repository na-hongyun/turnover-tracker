"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const inputClass =
  "w-full min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? "로그인에 실패했습니다.");
      }

      const from = searchParams.get("from") ?? "/dashboard";
      router.push(from.startsWith("/") ? from : "/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "로그인에 실패했습니다.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl md:p-10"
    >
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          SCM Enterprise
        </p>
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          시스템 로그인
        </h1>
        <p className="text-sm text-slate-500">
          재고 회전율 및 발주 관리 시스템
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="space-y-5">
        <div>
          <label
            htmlFor="username"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            아이디
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClass}
            placeholder="admin"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            비밀번호
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "로그인 중…" : "로그인"}
      </button>

      <p className="text-center text-xs text-slate-400">
        테스트 계정: admin / 1234qwer
      </p>
    </form>
  );
}
