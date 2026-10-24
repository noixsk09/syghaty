"use client";

import { createFirmAction } from "@/app/actions/firm";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function OnboardingPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await createFirmAction(new FormData(e.currentTarget));
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--surface)] p-4">
      <Card className="w-full max-w-xl">
        <CardTitle className="text-xl">إعداد المكتب لأول مرة</CardTitle>
        <CardDescription>أنشئ مكتب المحاماة الخاص بك للبدء</CardDescription>
        <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
          <div className="sm:col-span-2">
            <Label htmlFor="name">اسم المكتب</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="tradeName">الاسم التجاري</Label>
            <Input id="tradeName" name="tradeName" />
          </div>
          <div>
            <Label htmlFor="city">المدينة</Label>
            <Input id="city" name="city" />
          </div>
          <div>
            <Label htmlFor="phone">الهاتف</Label>
            <Input id="phone" name="phone" />
          </div>
          <div>
            <Label htmlFor="email">البريد</Label>
            <Input id="email" name="email" type="email" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="address">العنوان</Label>
            <Input id="address" name="address" />
          </div>
          {error ? (
            <div className="sm:col-span-2">
              <Alert variant="error">{error}</Alert>
            </div>
          ) : null}
          <div className="sm:col-span-2">
            <Button type="submit" disabled={loading}>
              {loading ? "جاري الحفظ..." : "حفظ ومتابعة"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
