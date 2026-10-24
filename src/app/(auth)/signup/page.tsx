"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { signupSchema } from "@/lib/validations";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const form = new FormData(e.currentTarget);
    const parsed = signupSchema.safeParse({
      fullName: form.get("fullName"),
      email: form.get("email"),
      password: form.get("password"),
      confirmPassword: form.get("confirmPassword"),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "بيانات غير صالحة");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          data: { full_name: parsed.data.fullName },
        },
      });
      if (authError) {
        setError("تعذر إنشاء الحساب. قد يكون البريد مستخدمًا بالفعل.");
        return;
      }
      if (data.session) {
        router.replace("/onboarding");
        router.refresh();
        return;
      }
      setMessage("تم إنشاء الحساب. راجع بريدك لتأكيد الحساب إن كان التأكيد مفعّلًا، ثم سجّل الدخول.");
    } catch {
      setError("تعذر الاتصال. تأكد من إعداد Supabase.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--surface)] p-4">
      <Card className="w-full max-w-md">
        <CardTitle className="text-xl">إنشاء حساب</CardTitle>
        <CardDescription>ابدأ بإدارة مكتبك القانوني</CardDescription>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <Label htmlFor="fullName">الاسم الكامل</Label>
            <Input id="fullName" name="fullName" required />
          </div>
          <div>
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="password">كلمة المرور</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <div>
            <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required />
          </div>
          {error ? <Alert variant="error">{error}</Alert> : null}
          {message ? <Alert variant="success">{message}</Alert> : null}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
          </Button>
        </form>
        <p className="mt-4 text-sm text-[var(--muted)]">
          لديك حساب؟ <Link href="/login">تسجيل الدخول</Link>
        </p>
      </Card>
    </div>
  );
}
