/**
 * Route Handler: POST /api/export
 * يُصدِّر محتوى المستند بصيغ: txt, docx, pdf
 *
 * التصدير إلى DOCX: يستخدم مكتبة docx (سيتم تثبيتها)
 * التصدير إلى PDF: يُولِّد HTML عربي ثم يُحوِّله عبر print dialog أو مكتبة server-side
 * التصدير إلى TXT: نص عادي
 */

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // 1. تحقق من المصادقة
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "يجب تسجيل الدخول أولاً." }, { status: 401 });
  }

  // 2. تحليل الطلب
  let body: {
    format: "txt" | "docx" | "pdf";
    content: string;
    title: string;
    lawyerName?: string;
    firmName?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "بيانات الطلب غير صالحة." }, { status: 400 });
  }

  const { format, content, title, lawyerName, firmName } = body;

  if (!format || !content || !title) {
    return NextResponse.json({ error: "الحقول المطلوبة مفقودة." }, { status: 400 });
  }

  // 3. تصدير حسب الصيغة
  switch (format) {
    case "txt": {
      const textContent = [
        firmName ? `${firmName}` : "",
        lawyerName ? `المحامي: ${lawyerName}` : "",
        `${title}`,
        "---",
        content,
        "",
        "⚠️ هذه مسودة تحتاج إلى مراجعة محامٍ قبل الاستخدام الرسمي.",
      ]
        .filter(Boolean)
        .join("\n");

      return new Response(textContent, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(title)}.txt`,
        },
      });
    }

    case "docx": {
      // نستخدم مكتبة docx لبناء ملف DOCX حقيقي
      let docxBuffer: Buffer;
      try {
        const { buildDocx } = await import("@/lib/docx-builder");
        docxBuffer = await buildDocx({ title, content, lawyerName, firmName });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "خطأ";
        return NextResponse.json(
          { error: `فشل إنشاء ملف DOCX: ${msg}` },
          { status: 500 },
        );
      }

      return new Response(docxBuffer.buffer as ArrayBuffer, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(title)}.docx`,
        },
      });
    }

    case "pdf": {
      // نُولِّد HTML واجهة ستُطبعها المتصفح عبر print dialog
      // أو نُعيد HTML جاهز لـ window.print()
      const htmlContent = buildPdfHtml({ title, content, lawyerName, firmName });
      return new Response(htmlContent, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      });
    }

    default:
      return NextResponse.json({ error: "صيغة التصدير غير مدعومة." }, { status: 400 });
  }
}

function buildPdfHtml(opts: {
  title: string;
  content: string;
  lawyerName?: string;
  firmName?: string;
}): string {
  const { title, content, lawyerName, firmName } = opts;
  const escapedContent = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
      direction: rtl;
      text-align: right;
      background: white;
      color: #0b1f3a;
      padding: 40px;
      font-size: 14px;
      line-height: 1.8;
    }
    .header {
      border-bottom: 2px solid #0b1f3a;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .firm-name { font-size: 18px; font-weight: 700; color: #0b1f3a; }
    .lawyer-name { font-size: 14px; color: #5b6b7c; margin-top: 4px; }
    h1 { font-size: 20px; font-weight: 700; text-align: center; margin-bottom: 24px; color: #0b1f3a; }
    .content { white-space: pre-wrap; line-height: 2; }
    .footer {
      margin-top: 40px;
      border-top: 1px solid #d9dee7;
      padding-top: 16px;
      font-size: 12px;
      color: #5b6b7c;
    }
    .disclaimer {
      background: #fef9e7;
      border: 1px solid #f0c040;
      border-radius: 4px;
      padding: 8px 12px;
      margin-top: 20px;
      font-size: 12px;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    ${firmName ? `<div class="firm-name">${firmName}</div>` : ""}
    ${lawyerName ? `<div class="lawyer-name">المحامي: ${lawyerName}</div>` : ""}
  </div>

  <h1>${title}</h1>

  <div class="content">${escapedContent}</div>

  <div class="disclaimer">
    ⚠️ تنبيه: هذه مسودة أولية أُعدَّت بمساعدة تطبيق صيغتي. تحتاج إلى مراجعة محامٍ متخصص قبل التوقيع أو الإيداع الرسمي.
  </div>

  <div class="footer no-print">
    <button onclick="window.print()" style="background:#0b1f3a;color:white;border:none;padding:10px 24px;border-radius:6px;font-family:inherit;font-size:14px;cursor:pointer;margin-left:8px;">طباعة / حفظ PDF</button>
    <button onclick="window.close()" style="background:#eef1f5;color:#0b1f3a;border:none;padding:10px 24px;border-radius:6px;font-family:inherit;font-size:14px;cursor:pointer;">إغلاق</button>
  </div>
</body>
</html>`;
}
