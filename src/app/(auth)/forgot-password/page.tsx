"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { resetPasswordSchema } from "@/lib/validations";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const form = new FormData(e.currentTarget);
    const parsed = resetPasswordSchema.safeParse({ email: form.get("email") });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "بيانات غير صالحة");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/login`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
        redirectTo,
      });
      if (resetError) {
        setError("تعذر إرسال رابط الاستعادة.");
        return;
      }
      setMessage("إن وُجد الحساب، سيتم إرسال رابط استعادة كلمة المرور إلى بريدك.");
    } catch {
      setError("تعذر الاتصال. تأكد من إعداد Supabase.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--surface)] p-4">
      <Card className="w-full max-w-md">
        <CardTitle className="text-xl">استعادة كلمة المرور</CardTitle>
        <CardDescription>أدخل بريدك لإرسال رابط الاستعادة</CardDescription>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          {error ? <Alert variant="error">{error}</Alert> : null}
          {message ? <Alert variant="success">{message}</Alert> : null}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "جاري الإرسال..." : "إرسال الرابط"}
          </Button>
        </form>
        <p className="mt-4 text-sm">
          <Link href="/login">العودة لتسجيل الدخول</Link>
        </p>
      </Card>
    </div>
  );
}
