"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Loader2, Check } from "lucide-react";

interface Props {
  userId: string;
  email: string | null;
  profile: Profile | null;
}

export function ProfileForm({ userId, email, profile }: Props) {
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!fullName.trim()) {
      setError("الاسم مطلوب.");
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();
      const { error: err } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          full_name: fullName.trim(),
          phone: phone.trim() || null,
        });

      if (err) throw err;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "فشل الحفظ.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}
      {success && (
        <Alert variant="success">
          <Check className="h-4 w-4" /> تم حفظ البيانات بنجاح.
        </Alert>
      )}

      <div>
        <Label htmlFor="full-name">الاسم الكامل *</Label>
        <Input
          id="full-name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="الاسم الرباعي"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <Input
          id="email"
          value={email ?? ""}
          disabled
          className="mt-1 bg-[var(--surface-muted)]"
        />
        <p className="mt-1 text-xs text-[var(--muted)]">
          لا يمكن تغيير البريد الإلكتروني من هنا.
        </p>
      </div>

      <div>
        <Label htmlFor="phone">رقم الهاتف</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="مثال: 01012345678"
          className="mt-1"
          type="tel"
        />
      </div>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        حفظ التغييرات
      </Button>
    </div>
  );
}
