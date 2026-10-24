import { Alert } from "@/components/ui/alert";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Scale } from "lucide-react";

export default function SetupRequiredPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--surface)] p-6">
      <Card className="w-full max-w-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--navy)] text-[var(--gold)]">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>محامي برو — إعداد مطلوب</CardTitle>
            <CardDescription>التطبيق جاهز برمجيًا، لكن اتصال Supabase غير مُعد بعد.</CardDescription>
          </div>
        </div>
        <Alert variant="warning">
          أنشئ مشروع Supabase، طبّق ملفات SQL داخل <code>supabase/migrations</code>، ثم انسخ{" "}
          <code>.env.example</code> إلى <code>.env.local</code> واملأ القيم العامة فقط.
        </Alert>
        <ol className="mt-5 list-decimal space-y-2 pr-5 text-sm text-[var(--navy)]">
          <li>أنشئ مشروعًا على supabase.com</li>
          <li>شغّل migrations بالترتيب من مجلد supabase/migrations</li>
          <li>ضع NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY في .env.local</li>
          <li>لا تضع SUPABASE_SERVICE_ROLE_KEY في المتصفح</li>
          <li>أعد تشغيل npm run dev</li>
        </ol>
      </Card>
    </div>
  );
}
