/**
 * Route Handler: POST /api/ai
 * يستقبل طلب AI من الواجهة، يتحقق من المصادقة والحدود، ثم يستدعي طبقة AI.
 * مفتاح API لا يُعرض أبدًا للمتصفح.
 */

import { createClient } from "@/lib/supabase/server";
import { callAiService, type AiRequest } from "@/lib/ai-service";
import { NextResponse } from "next/server";

/**
 * حد بسيط في الذاكرة — 20 طلب/دقيقة لكل مستخدم.
 * ملاحظة: على Vercel Serverless كل cold start يُصفِّر الخريطة ومن ثَمَّ لا
 * يُطبَّق الحد بشكل صارم عبر الـ instances. للإنتاج الجاد استخدم Redis / Upstash.
 * في الوقت الحالي يحمي من إساءة الاستخدام داخل Instance الواحدة فقط.
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (entry.count >= 20) return false;

  entry.count++;
  return true;
}

export async function POST(req: Request) {
  // 1. تحقق من المصادقة
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "يجب تسجيل الدخول أولاً." }, { status: 401 });
  }

  // 2. Rate limiting
  if (!checkRateLimit(user.id)) {
    return NextResponse.json(
      { error: "تجاوزت الحد المسموح من الطلبات. حاول مجددًا بعد دقيقة." },
      { status: 429 },
    );
  }

  // 3. تحليل الطلب
  let body: AiRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "بيانات الطلب غير صالحة." }, { status: 400 });
  }

  if (!body.task || !body.documentType) {
    return NextResponse.json({ error: "الحقول المطلوبة مفقودة." }, { status: 400 });
  }

  // 4. تنظيف المدخلات (حجم أقصى 10000 حرف)
  if (body.currentContent && body.currentContent.length > 10_000) {
    body.currentContent = body.currentContent.slice(0, 10_000);
  }
  if (body.selectedText && body.selectedText.length > 3_000) {
    body.selectedText = body.selectedText.slice(0, 3_000);
  }

  // 5. استدعاء طبقة AI
  const result = await callAiService(body);

  return NextResponse.json(result);
}
