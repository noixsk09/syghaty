"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { loginSchema } from "@/lib/validations";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { Scale } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const configured = getSupabaseEnv().isConfigured;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!configured) {
      setError("Supabase غير مُعد. راجع صفحة إعداد الاتصال.");
      return;
    }

    const form = new FormData(e.currentTarget);
    const parsed = loginSchema.safeParse({
      email: form.get("email"),
      password: form.get("password"),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "بيانات غير صالحة");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword(parsed.data);
      if (authError) {
        setError("تعذر تسجيل الدخول. تحقق من البريد وكلمة المرور.");
        return;
      }
      router.replace(searchParams.get("next") || "/dashboard");
      router.refresh();
    } catch {
      setError("حدث خطأ أثناء الاتصال.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(160deg,#0b1f3a_0%,#14345c_45%,#f7f8fa_45%)] p-4">
      <Card className="w-full max-w-md">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--navy)]">
            <Scale className="h-5 w-5 text-[var(--gold)]" />
          </div>
          <div>
            <CardTitle className="text-xl">تسجيل الدخول</CardTitle>
            <CardDescription>مرحبًا بك في صيغتي | Sayghty</CardDescription>
          </div>
        </div>
        {!configured ? (
          <Alert className="mt-4" variant="warning">
            الاتصال غير مُعد.{" "}
            <Link className="underline" href="/setup-required">
              إعداد Supabase
            </Link>
          </Alert>
        ) : null}
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div>
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          {error ? <Alert variant="error">{error}</Alert> : null}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "جاري الدخول..." : "دخول"}
          </Button>
        </form>
        <div className="mt-4 flex justify-between text-sm text-[var(--muted)]">
          <Link href="/signup">إنشاء حساب جديد</Link>
          <Link href="/forgot-password">نسيت كلمة المرور؟</Link>
        </div>
      </Card>
    </div>
  );
}
