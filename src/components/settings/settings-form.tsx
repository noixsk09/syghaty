"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Loader2, Check } from "lucide-react";

interface Props {
  firmId: string | null;
  firmName: string | null;
  firmCity: string | null;
  firmPhone: string | null;
  userId: string;
}

export function SettingsForm({ firmId, firmName, firmCity, firmPhone }: Props) {
  const [name, setName] = useState(firmName ?? "");
  const [city, setCity] = useState(firmCity ?? "");
  const [phone, setPhone] = useState(firmPhone ?? "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!firmId) {
      setError("لا يوجد مكتب مرتبط بحسابك حاليًا.");
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();
      const { error: err } = await supabase
        .from("law_firms")
        .update({
          name: name.trim(),
          city: city.trim() || null,
          phone: phone.trim() || null,
        })
        .eq("id", firmId);

      if (err) throw err;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "فشل الحفظ.");
    } finally {
      setSaving(false);
    }
  }

  if (!firmId) {
    return (
      <p className="text-sm text-[var(--muted)]">
        لا يوجد مكتب مرتبط بحسابك — يمكنك إعداده من{" "}
        <a href="/onboarding" className="underline">
          صفحة الإعداد
        </a>
        .
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}
      {success && (
        <Alert variant="success">
          <Check className="h-4 w-4" /> تم الحفظ بنجاح.
        </Alert>
      )}

      <div>
        <Label htmlFor="firm-name">اسم المكتب *</Label>
        <Input
          id="firm-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="firm-city">المدينة</Label>
          <Input
            id="firm-city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="firm-phone">الهاتف</Label>
          <Input
            id="firm-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1"
            type="tel"
          />
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        حفظ التغييرات
      </Button>
    </div>
  );
}
