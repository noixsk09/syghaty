/**
 * طبقة AI مستقلة لتطبيق صيغتي.
 * تدعم مزودين:
 *   - openai (الافتراضي) عبر AI_PROVIDER=openai
 *   - demo (وضع تجريبي بدون مفتاح API)
 *
 * لا يُستخدم هذا الملف في المتصفح مطلقًا.
 * جميع استدعاءات الـ AI تمر عبر Server Actions أو Route Handlers.
 */

export type AiTaskType =
  | "generate_draft"     // إنشاء مسودة كاملة من البيانات
  | "improve_language"   // تحسين اللغة القانونية
  | "reorganize"         // إعادة تنظيم العناوين والطلبات
  | "proofread"          // تدقيق الأخطاء
  | "suggest_missing"    // اقتراح المعلومات الناقصة
  | "summarize"          // تلخيص مستند
  | "rephrase_paragraph";// إعادة صياغة فقرة

export interface AiRequest {
  task: AiTaskType;
  documentType: string;
  currentContent?: string;
  formData?: Record<string, string>;
  selectedText?: string;
  style?: "concise" | "detailed" | "formal";
}

export interface AiResponse {
  result: string;
  isDemo: boolean;
  warning?: string;
}

// ==============================
// وضع تجريبي (Demo)
// ==============================

const DEMO_RESPONSES: Record<AiTaskType, string> = {
  generate_draft: `[وضع تجريبي — لم يُعدَّ مفتاح AI]

هذا نص توضيحي يُظهر كيف سيبدو الناتج الحقيقي عند ربط مزود الذكاء الاصطناعي.

في حال إعداد OPENAI_API_KEY في ملف .env.local، سيقوم الذكاء الاصطناعي بصياغة مسودة قانونية كاملة بناءً على البيانات التي أدخلتها، مع الحفاظ على الأسلوب الرسمي والصياغة القانونية المناسبة للمستندات المصرية.

⚠️ هذا نص تجريبي — ليس ناتج ذكاء اصطناعي حقيقي.`,

  improve_language: `[وضع تجريبي — لم يُعدَّ مفتاح AI]

في النظام الحقيقي، سيتم تحسين اللغة القانونية في النص الذي حددته دون تغيير الوقائع أو المعلومات.

⚠️ هذا نص تجريبي — ليس ناتج ذكاء اصطناعي حقيقي.`,

  reorganize: `[وضع تجريبي — لم يُعدَّ مفتاح AI]

في النظام الحقيقي، سيتم إعادة ترتيب العناوين والفقرات والطلبات بشكل منطقي ومتسق مع المستندات القانونية المصرية.

⚠️ هذا نص تجريبي — ليس ناتج ذكاء اصطناعي حقيقي.`,

  proofread: `[وضع تجريبي — لم يُعدَّ مفتاح AI]

في النظام الحقيقي، سيتم الإشارة إلى الأخطاء الإملائية والنحوية والتناقضات الظاهرة في المستند.

⚠️ هذا نص تجريبي — ليس ناتج ذكاء اصطناعي حقيقي.`,

  suggest_missing: `[وضع تجريبي — لم يُعدَّ مفتاح AI]

في النظام الحقيقي، سيقترح الذكاء الاصطناعي المعلومات الناقصة والأسئلة التي تحتاج إجابة لاستكمال المستند.

⚠️ هذا نص تجريبي — ليس ناتج ذكاء اصطناعي حقيقي.`,

  summarize: `[وضع تجريبي — لم يُعدَّ مفتاح AI]

في النظام الحقيقي، سيتم تلخيص المستند في نقاط رئيسية مع تحديد أطراف العقد والالتزامات الجوهرية.

⚠️ هذا نص تجريبي — ليس ناتج ذكاء اصطناعي حقيقي.`,

  rephrase_paragraph: `[وضع تجريبي — لم يُعدَّ مفتاح AI]

في النظام الحقيقي، سيتم إعادة صياغة الفقرة المحددة بأسلوب قانوني أوضح وأدق.

⚠️ هذا نص تجريبي — ليس ناتج ذكاء اصطناعي حقيقي.`,
};

// ==============================
// بناء الـ Prompt
// ==============================

function buildSystemPrompt(): string {
  return `أنت مساعد قانوني متخصص للمحامين في مصر.
مهمتك مساعدة المحامي في صياغة المستندات القانونية باللغة العربية.

القواعد الإلزامية:
1. لا تخترع مواد قانونية أو أحكام محاكم أو أرقام طعون.
2. إذا استلزم الأمر الإشارة إلى نص قانوني، اكتب "[يُرجى التحقق من المادة المناسبة]".
3. اعرض تنبيهًا في نهاية كل مسودة بأنها تحتاج مراجعة محامٍ.
4. احتفظ بالنص باللغة العربية واتجاه RTL.
5. افصل بين الوقائع التي أدخلها المستخدم والمعلومات المستنتجة.
6. لا تُقدِّم أي مسودة باعتبارها مضمونة الصحة القانونية.`;
}

function buildUserPrompt(req: AiRequest): string {
  switch (req.task) {
    case "generate_draft":
      return `أنشئ مسودة ${req.documentType} كاملة بالأسلوب "${req.style ?? "formal"}" بناءً على البيانات التالية:\n${JSON.stringify(req.formData, null, 2)}\n\nالمحتوى الحالي للقالب:\n${req.currentContent}`;
    case "improve_language":
      return `حسِّن اللغة القانونية للنص التالي دون تغيير الوقائع أو الأطراف:\n\n${req.currentContent}`;
    case "reorganize":
      return `أعِد تنظيم العناوين والفقرات والطلبات في المستند التالي:\n\n${req.currentContent}`;
    case "proofread":
      return `دقِّق الأخطاء الإملائية والنحوية والتناقضات الظاهرة في:\n\n${req.currentContent}`;
    case "suggest_missing":
      return `راجع مسودة ${req.documentType} التالية واقترح المعلومات الناقصة والأسئلة التي تحتاج إجابة:\n\n${req.currentContent}`;
    case "summarize":
      return `لخِّص المستند التالي في نقاط رئيسية:\n\n${req.currentContent}`;
    case "rephrase_paragraph":
      return `أعِد صياغة الفقرة التالية بأسلوب قانوني أوضح دون تغيير معناها:\n\n${req.selectedText}`;
    default:
      return req.currentContent ?? "";
  }
}

// ==============================
// الاستدعاء الحقيقي (OpenAI)
// ==============================

async function callOpenAi(req: AiRequest): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.AI_MODEL ?? "gpt-4o-mini";

  if (!apiKey) throw new Error("OPENAI_API_KEY غير مُعدَّة.");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: buildUserPrompt(req) },
      ],
      max_tokens: 2000,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

// ==============================
// الدالة الرئيسية — نقطة الدخول الوحيدة
// ==============================

export async function callAiService(req: AiRequest): Promise<AiResponse> {
  const provider = process.env.AI_PROVIDER ?? "demo";
  const isDemo = provider === "demo" || !process.env.OPENAI_API_KEY;

  if (isDemo) {
    return {
      result: DEMO_RESPONSES[req.task] ?? DEMO_RESPONSES.generate_draft,
      isDemo: true,
      warning:
        "التطبيق يعمل في الوضع التجريبي. أضف OPENAI_API_KEY في .env.local للحصول على ناتج حقيقي.",
    };
  }

  try {
    const result = await callOpenAi(req);
    return { result, isDemo: false };
  } catch (err) {
    const message = err instanceof Error ? err.message : "خطأ غير معروف";
    return {
      result: `حدث خطأ في الاتصال بخدمة الذكاء الاصطناعي: ${message}`,
      isDemo: false,
      warning: message,
    };
  }
}
