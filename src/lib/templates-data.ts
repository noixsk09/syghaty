/**
 * قوالب قانونية تجريبية لتطبيق صيغتي.
 * هذه نماذج أولية للعرض التوضيحي فقط — تحتاج مراجعة محامٍ متخصص قبل الاستخدام الرسمي.
 * لا تحتوي على أحكام قضائية أو أرقام مواد أو سوابق قانونية حقيقية.
 */

import type { DocCategory, TemplateField } from "@/types/database";

export interface TemplateDefinition {
  id: string;
  category: DocCategory;
  name: string;
  description: string;
  fields: TemplateField[];
  bodyTemplate: string;
  isSystem: true;
}

// ==============================
// قوالب عقود البيع والإيجار
// ==============================
const saleContractTemplate: TemplateDefinition = {
  id: "sys-sale-001",
  category: "sale_rent",
  name: "عقد بيع عقار",
  description: "عقد بيع عقار بين طرفين مع تفاصيل الثمن وشروط التسليم",
  isSystem: true,
  fields: [
    { id: "seller_name", label: "اسم البائع", type: "text", required: true, placeholder: "الاسم الرباعي للبائع" },
    { id: "seller_id", label: "رقم هوية البائع", type: "text", required: true, placeholder: "رقم البطاقة الوطنية" },
    { id: "buyer_name", label: "اسم المشتري", type: "text", required: true, placeholder: "الاسم الرباعي للمشتري" },
    { id: "buyer_id", label: "رقم هوية المشتري", type: "text", required: true, placeholder: "رقم البطاقة الوطنية" },
    { id: "property_desc", label: "وصف العقار", type: "textarea", required: true, placeholder: "الموقع والمساحة والحدود" },
    { id: "price", label: "ثمن البيع", type: "currency", required: true, placeholder: "0" },
    { id: "payment_terms", label: "شروط السداد", type: "textarea", required: true, placeholder: "طريقة ووقت السداد" },
    { id: "delivery_date", label: "تاريخ التسليم", type: "date", required: true },
    { id: "contract_date", label: "تاريخ العقد", type: "date", required: true },
    { id: "city", label: "المدينة", type: "text", required: true, placeholder: "مدينة إبرام العقد" },
  ],
  bodyTemplate: `عقد بيع عقار

أولاً: طرفا العقد

الطرف الأول (البائع): {{seller_name}}، حامل البطاقة الوطنية رقم {{seller_id}}.

الطرف الثاني (المشتري): {{buyer_name}}، حامل البطاقة الوطنية رقم {{buyer_id}}.

ثانياً: المحل والثمن

باع الطرف الأول وامتلك الطرف الثاني العقار الآتي وصفه:
{{property_desc}}

وذلك بثمن إجمالي قدره: {{price}} جنيه مصري.

ثالثاً: شروط السداد

{{payment_terms}}

رابعاً: التسليم

يلتزم البائع بتسليم العقار خاليًا من أي شاغلين في تاريخ {{delivery_date}}.

خامساً: الضمان

يضمن البائع للمشتري خلو العقار من أي نزاع أو تعارض مع حقوق الغير.

سادساً: النفاذ

حُرر هذا العقد في {{city}} بتاريخ {{contract_date}} من نسختين بيد كل طرف نسخة.

توقيع البائع: __________________    توقيع المشتري: __________________

⚠️ تنبيه: هذه مسودة أولية تحتاج إلى مراجعة محامٍ متخصص قبل التوقيع أو الإيداع.`,
};

const rentContractTemplate: TemplateDefinition = {
  id: "sys-rent-001",
  category: "sale_rent",
  name: "عقد إيجار سكني",
  description: "عقد إيجار وحدة سكنية لفترة محددة",
  isSystem: true,
  fields: [
    { id: "landlord_name", label: "اسم المؤجر", type: "text", required: true, placeholder: "الاسم الرباعي" },
    { id: "tenant_name", label: "اسم المستأجر", type: "text", required: true, placeholder: "الاسم الرباعي" },
    { id: "tenant_id", label: "رقم هوية المستأجر", type: "text", required: true, placeholder: "رقم البطاقة الوطنية" },
    { id: "property_address", label: "عنوان الوحدة", type: "textarea", required: true, placeholder: "الشارع، المنطقة، الطابق" },
    { id: "monthly_rent", label: "الإيجار الشهري", type: "currency", required: true, placeholder: "0" },
    { id: "duration_months", label: "مدة الإيجار (بالأشهر)", type: "number", required: true, placeholder: "12" },
    { id: "start_date", label: "تاريخ بدء الإيجار", type: "date", required: true },
    { id: "deposit", label: "مبلغ التأمين", type: "currency", required: false, placeholder: "0" },
    { id: "contract_date", label: "تاريخ العقد", type: "date", required: true },
  ],
  bodyTemplate: `عقد إيجار سكني

أولاً: طرفا العقد

المؤجر: {{landlord_name}}.
المستأجر: {{tenant_name}}، حامل البطاقة الوطنية رقم {{tenant_id}}.

ثانياً: المأجور

وحدة سكنية كائنة في: {{property_address}}.

ثالثاً: مدة الإيجار

تبدأ من {{start_date}} لمدة {{duration_months}} شهرًا.

رابعاً: الأجرة

الإيجار الشهري: {{monthly_rent}} جنيه مصري يُسدَّد في مطلع كل شهر.
مبلغ التأمين: {{deposit}} جنيه مصري يُرد عند انتهاء العقد سليمًا.

خامساً: التزامات المستأجر

- المحافظة على الوحدة وعدم إجراء أي تعديل دون إذن كتابي من المؤجر.
- عدم التنازل عن الإيجار أو التأجير من الباطن دون موافقة المؤجر.
- سداد فواتير المرافق في مواعيدها.

سادساً: الإنهاء

يلتزم كل طرف بإخطار الآخر كتابةً قبل شهر على الأقل من الرغبة في إنهاء العقد.

حُرر بتاريخ {{contract_date}}.

توقيع المؤجر: __________________    توقيع المستأجر: __________________

⚠️ تنبيه: هذه مسودة أولية تحتاج إلى مراجعة محامٍ متخصص قبل التوقيع.`,
};

// ==============================
// قوالب عقود العمل
// ==============================
const employmentContractTemplate: TemplateDefinition = {
  id: "sys-emp-001",
  category: "employment",
  name: "عقد عمل محدد المدة",
  description: "عقد عمل بين صاحب عمل وموظف لفترة زمنية محددة",
  isSystem: true,
  fields: [
    { id: "employer_name", label: "اسم صاحب العمل / الشركة", type: "text", required: true, placeholder: "الاسم القانوني الكامل" },
    { id: "employee_name", label: "اسم الموظف", type: "text", required: true, placeholder: "الاسم الرباعي" },
    { id: "employee_id", label: "رقم هوية الموظف", type: "text", required: true, placeholder: "رقم البطاقة الوطنية" },
    { id: "job_title", label: "المسمى الوظيفي", type: "text", required: true, placeholder: "مثال: مهندس برمجيات" },
    { id: "monthly_salary", label: "الراتب الشهري", type: "currency", required: true, placeholder: "0" },
    { id: "start_date", label: "تاريخ بدء العمل", type: "date", required: true },
    { id: "duration_months", label: "مدة العقد (بالأشهر)", type: "number", required: true, placeholder: "12" },
    { id: "work_hours", label: "ساعات العمل اليومية", type: "number", required: true, placeholder: "8" },
    { id: "probation_months", label: "مدة التجربة (بالأشهر)", type: "number", required: false, placeholder: "3" },
    { id: "contract_date", label: "تاريخ العقد", type: "date", required: true },
    { id: "city", label: "المدينة", type: "text", required: true, placeholder: "مدينة العمل" },
  ],
  bodyTemplate: `عقد عمل

أولاً: أطراف العقد

صاحب العمل: {{employer_name}}.
العامل: {{employee_name}}، حامل البطاقة الوطنية رقم {{employee_id}}.

ثانياً: طبيعة العمل والوظيفة

يُعيَّن العامل في وظيفة {{job_title}} بمقر صاحب العمل في {{city}}.

ثالثاً: مدة العقد

يبدأ هذا العقد في {{start_date}} لمدة {{duration_months}} شهرًا.
مدة الاختبار: {{probation_months}} أشهر من تاريخ المباشرة.

رابعاً: الأجر وساعات العمل

الراتب الشهري الإجمالي: {{monthly_salary}} جنيه مصري.
ساعات العمل: {{work_hours}} ساعات يوميًا ستة أيام في الأسبوع.

خامساً: الالتزامات

- يلتزم العامل بتأدية مهام وظيفته بعناية وأمانة.
- يلتزم صاحب العمل بصرف الراتب في نهاية كل شهر.
- يسري على هذا العقد أحكام قانون العمل المعمول به.

حُرر بتاريخ {{contract_date}} في {{city}}.

توقيع صاحب العمل: __________________    توقيع العامل: __________________

⚠️ تنبيه: هذه مسودة أولية تحتاج إلى مراجعة محامٍ متخصص قبل التوقيع.`,
};

// ==============================
// قالب إنذار قانوني
// ==============================
const legalNoticeTemplate: TemplateDefinition = {
  id: "sys-notice-001",
  category: "legal_notices",
  name: "إنذار قانوني بالسداد",
  description: "إنذار رسمي يُوجَّه للمدين بالسداد خلال مهلة محددة",
  isSystem: true,
  fields: [
    { id: "sender_name", label: "اسم المُنذِر", type: "text", required: true, placeholder: "الاسم الرباعي" },
    { id: "sender_capacity", label: "صفة المُنذِر", type: "text", required: true, placeholder: "مثال: دائن، مؤجر، صاحب عمل" },
    { id: "recipient_name", label: "اسم المُنذَر إليه", type: "text", required: true, placeholder: "الاسم الرباعي" },
    { id: "recipient_address", label: "عنوان المُنذَر إليه", type: "textarea", required: true, placeholder: "العنوان الكامل" },
    { id: "amount", label: "المبلغ المطالب به", type: "currency", required: true, placeholder: "0" },
    { id: "debt_reason", label: "سبب الدين", type: "textarea", required: true, placeholder: "وصف الالتزام والسبب" },
    { id: "payment_deadline_days", label: "مهلة السداد (بالأيام)", type: "number", required: true, placeholder: "15" },
    { id: "notice_date", label: "تاريخ الإنذار", type: "date", required: true },
    { id: "lawyer_name", label: "اسم المحامي المُوقِّع", type: "text", required: true, placeholder: "الاسم الرباعي للمحامي" },
  ],
  bodyTemplate: `إنذار قانوني

السيد / {{recipient_name}}
المقيم: {{recipient_address}}

تحية طيبة وبعد،

أتشرف بإخطاركم، بصفتي وكيلاً عن موكلي السيد / {{sender_name}} بصفته {{sender_capacity}}، بما يلي:

أولاً: الوقائع

لموكلي في ذمة المُنذَر إليه مبلغ إجمالي قدره {{amount}} جنيه مصري، وذلك {{debt_reason}}.

ثانياً: المطالبة

لذا أُنذِركم وأُكلِّفكم بسداد المبلغ المذكور كاملاً خلال {{payment_deadline_days}} يومًا من تاريخ استلامكم هذا الإنذار.

ثالثاً: التحذير

في حالة إهمالكم السداد خلال المهلة المحددة، فإن موكلي يتحفظ على حقه في اتخاذ كافة الإجراءات القانونية اللازمة للمطالبة بحقوقه أمام الجهات المختصة مع إلزامكم بالمصاريف والأتعاب.

حُرر في {{notice_date}}.

المحامي: الأستاذ / {{lawyer_name}}

⚠️ تنبيه: هذه مسودة أولية تحتاج إلى مراجعة محامٍ متخصص قبل الإرسال.`,
};

// ==============================
// قالب توكيل رسمي
// ==============================
const powerOfAttorneyTemplate: TemplateDefinition = {
  id: "sys-poa-001",
  category: "poa_forms",
  name: "توكيل رسمي عام",
  description: "توكيل رسمي يُخوِّل الوكيل التصرف نيابة عن الموكِّل",
  isSystem: true,
  fields: [
    { id: "principal_name", label: "اسم الموكِّل", type: "text", required: true, placeholder: "الاسم الرباعي" },
    { id: "principal_id", label: "رقم هوية الموكِّل", type: "text", required: true, placeholder: "رقم البطاقة الوطنية" },
    { id: "agent_name", label: "اسم الوكيل", type: "text", required: true, placeholder: "الاسم الرباعي" },
    { id: "agent_id", label: "رقم هوية الوكيل", type: "text", required: true, placeholder: "رقم البطاقة الوطنية" },
    { id: "poa_scope", label: "نطاق التوكيل", type: "textarea", required: true, placeholder: "المهام والصلاحيات الممنوحة للوكيل" },
    { id: "expiry_date", label: "تاريخ انتهاء الصلاحية", type: "date", required: false },
    { id: "poa_date", label: "تاريخ التوكيل", type: "date", required: true },
    { id: "city", label: "المدينة", type: "text", required: true, placeholder: "مدينة إبرام التوكيل" },
  ],
  bodyTemplate: `توكيل رسمي

أنا الموقع أدناه / {{principal_name}}
حامل البطاقة الوطنية رقم: {{principal_id}}

أُوكِّل السيد / {{agent_name}}
حامل البطاقة الوطنية رقم: {{agent_id}}

للقيام نيابةً عني بما يلي:
{{poa_scope}}

ويحق للوكيل توقيع جميع المستندات والعقود المتعلقة بما سبق، وتمثيلي أمام الجهات الحكومية والقضائية والإدارية.

هذا التوكيل ساري المفعول{{expiry_date}} وذلك في {{city}} بتاريخ {{poa_date}}.

توقيع الموكِّل: __________________

⚠️ تنبيه: هذه مسودة أولية — يُنصح بتوثيق التوكيل الرسمي أمام الشهر العقاري أو الجهة المختصة.`,
};

// ==============================
// قالب صحيفة دعوى
// ==============================
const lawsuitTemplate: TemplateDefinition = {
  id: "sys-lawsuit-001",
  category: "lawsuits",
  name: "صحيفة دعوى مدنية",
  description: "صحيفة دعوى مدنية بالمطالبة بحق أو تعويض",
  isSystem: true,
  fields: [
    { id: "court_name", label: "المحكمة المرفوع إليها", type: "text", required: true, placeholder: "مثال: محكمة القاهرة الابتدائية" },
    { id: "plaintiff_name", label: "اسم المدعي", type: "text", required: true, placeholder: "الاسم الرباعي" },
    { id: "plaintiff_address", label: "عنوان المدعي", type: "text", required: true, placeholder: "العنوان الكامل" },
    { id: "defendant_name", label: "اسم المدعى عليه", type: "text", required: true, placeholder: "الاسم الرباعي" },
    { id: "defendant_address", label: "عنوان المدعى عليه", type: "text", required: true, placeholder: "العنوان الكامل" },
    { id: "claim_facts", label: "وقائع الدعوى", type: "textarea", required: true, placeholder: "سرد وقائع النزاع بالتفصيل" },
    { id: "legal_basis", label: "الأساس القانوني", type: "textarea", required: true, placeholder: "الحق أو المصلحة القانونية محل الدعوى" },
    { id: "requests", label: "الطلبات", type: "textarea", required: true, placeholder: "ما تطلبه من المحكمة بدقة" },
    { id: "claim_value", label: "قيمة الدعوى", type: "currency", required: false, placeholder: "0" },
    { id: "filing_date", label: "تاريخ تقديم الصحيفة", type: "date", required: true },
    { id: "lawyer_name", label: "اسم المحامي", type: "text", required: true, placeholder: "الاسم الرباعي للمحامي" },
  ],
  bodyTemplate: `صحيفة دعوى مدنية

السادة رئيس وأعضاء محكمة / {{court_name}}
وفقكم الله

يلتمس المدعي / {{plaintiff_name}}
المقيم: {{plaintiff_address}}

ضد المدعى عليه / {{defendant_name}}
المقيم: {{defendant_address}}

الموضوع

أولاً: الوقائع
{{claim_facts}}

ثانياً: الأساس القانوني
{{legal_basis}}

ثالثاً: الطلبات
بناءً على ما سبق، يلتمس المدعي من عدالة المحكمة الموقرة الحكم بما يلي:
{{requests}}

قيمة الدعوى: {{claim_value}} جنيه مصري.

المحامي المُقدِّم: الأستاذ / {{lawyer_name}}
بتاريخ: {{filing_date}}

⚠️ تنبيه: هذه مسودة أولية تحتاج إلى مراجعة محامٍ مرخص قبل الإيداع أمام المحكمة. لا تُودِع هذه الصحيفة دون مراجعة قانونية متخصصة.`,
};

// ==============================
// قالب مذكرة قانونية
// ==============================
const legalMemoTemplate: TemplateDefinition = {
  id: "sys-memo-001",
  category: "legal_memos",
  name: "مذكرة قانونية دفاعية",
  description: "مذكرة دفاع تُقدَّم للمحكمة ردًّا على دعوى",
  isSystem: true,
  fields: [
    { id: "court_name", label: "اسم المحكمة", type: "text", required: true, placeholder: "مثال: محكمة الاستئناف" },
    { id: "case_number", label: "رقم القضية (اختياري)", type: "text", required: false, placeholder: "لو متوفر" },
    { id: "defendant_name", label: "اسم الموكل (المذكور)", type: "text", required: true, placeholder: "الاسم الرباعي" },
    { id: "plaintiff_name", label: "اسم الخصم", type: "text", required: true, placeholder: "الاسم الرباعي" },
    { id: "defense_facts", label: "وقائع الدفاع", type: "textarea", required: true, placeholder: "الرد على وقائع الخصم" },
    { id: "legal_arguments", label: "الحجج القانونية", type: "textarea", required: true, placeholder: "الأسانيد والحجج القانونية للدفاع" },
    { id: "requests", label: "الطلبات الختامية", type: "textarea", required: true, placeholder: "ما تطلبه من المحكمة" },
    { id: "memo_date", label: "تاريخ المذكرة", type: "date", required: true },
    { id: "lawyer_name", label: "اسم المحامي", type: "text", required: true, placeholder: "الاسم الرباعي للمحامي" },
  ],
  bodyTemplate: `مذكرة دفاع

إلى
محكمة / {{court_name}}
{{case_number}}

مُقدَّمة من المحامي الأستاذ / {{lawyer_name}}
وكيلاً عن الموكل / {{defendant_name}} (المدعى عليه)
في مواجهة / {{plaintiff_name}} (المدعي)

تحية طيبة وبعد،

أولاً: الوقائع والرد عليها

{{defense_facts}}

ثانياً: الأسانيد والحجج القانونية

{{legal_arguments}}

ثالثاً: الطلبات الختامية

بناءً على ما سبق من وقائع وأسانيد، يلتمس الدفاع من عدالة المحكمة الموقرة:
{{requests}}

مُقدَّمة بتاريخ {{memo_date}}

المحامي: الأستاذ / {{lawyer_name}}
التوقيع: __________________

⚠️ تنبيه: هذه مسودة أولية تحتاج إلى مراجعة متخصصة قبل التقديم للمحكمة.`,
};

// ==============================
// قالب عقد تجاري
// ==============================
const commercialAgreementTemplate: TemplateDefinition = {
  id: "sys-comm-001",
  category: "commercial",
  name: "اتفاقية تجارية عامة",
  description: "اتفاقية تعاون أو خدمات بين شركتين أو طرفين تجاريين",
  isSystem: true,
  fields: [
    { id: "party1_name", label: "الطرف الأول", type: "text", required: true, placeholder: "الاسم التجاري أو القانوني" },
    { id: "party1_capacity", label: "صفة الطرف الأول", type: "text", required: true, placeholder: "مثال: شركة، مؤسسة، فرد" },
    { id: "party2_name", label: "الطرف الثاني", type: "text", required: true, placeholder: "الاسم التجاري أو القانوني" },
    { id: "party2_capacity", label: "صفة الطرف الثاني", type: "text", required: true, placeholder: "مثال: شركة، مؤسسة، فرد" },
    { id: "agreement_subject", label: "موضوع الاتفاقية", type: "textarea", required: true, placeholder: "وصف الخدمة أو التعاون" },
    { id: "obligations_p1", label: "التزامات الطرف الأول", type: "textarea", required: true, placeholder: "ما يلتزم به الطرف الأول" },
    { id: "obligations_p2", label: "التزامات الطرف الثاني", type: "textarea", required: true, placeholder: "ما يلتزم به الطرف الثاني" },
    { id: "total_value", label: "القيمة الإجمالية (إن وجدت)", type: "currency", required: false, placeholder: "0" },
    { id: "duration_months", label: "مدة الاتفاقية (بالأشهر)", type: "number", required: true, placeholder: "12" },
    { id: "start_date", label: "تاريخ البدء", type: "date", required: true },
    { id: "contract_date", label: "تاريخ العقد", type: "date", required: true },
    { id: "city", label: "المدينة", type: "text", required: true, placeholder: "مدينة الإبرام" },
  ],
  bodyTemplate: `اتفاقية تجارية

أولاً: أطراف الاتفاقية

الطرف الأول: {{party1_name}} ({{party1_capacity}}).
الطرف الثاني: {{party2_name}} ({{party2_capacity}}).

ثانياً: موضوع الاتفاقية

{{agreement_subject}}

ثالثاً: التزامات الطرف الأول

{{obligations_p1}}

رابعاً: التزامات الطرف الثاني

{{obligations_p2}}

خامساً: القيمة المالية

القيمة الإجمالية للاتفاقية: {{total_value}} جنيه مصري — تُسدَّد وفق الجدول الزمني المتفق عليه.

سادساً: المدة

تبدأ الاتفاقية من {{start_date}} لمدة {{duration_months}} شهرًا.

سابعاً: إنهاء الاتفاقية

يحق لأي طرف إنهاء الاتفاقية بإشعار كتابي مسبق مدته ثلاثون يومًا.

ثامناً: السرية

يلتزم كل طرف بالحفاظ على سرية المعلومات التجارية للطرف الآخر.

حُرر هذا العقد في {{city}} بتاريخ {{contract_date}} من نسختين متطابقتين.

توقيع الطرف الأول: __________________    توقيع الطرف الثاني: __________________

⚠️ تنبيه: هذه مسودة أولية تحتاج إلى مراجعة محامٍ متخصص قبل التوقيع.`,
};

// ==============================
// التصدير
// ==============================

export const SYSTEM_TEMPLATES: TemplateDefinition[] = [
  saleContractTemplate,
  rentContractTemplate,
  employmentContractTemplate,
  legalNoticeTemplate,
  powerOfAttorneyTemplate,
  lawsuitTemplate,
  legalMemoTemplate,
  commercialAgreementTemplate,
];

export const TEMPLATES_BY_CATEGORY: Record<string, TemplateDefinition[]> = {};
for (const tpl of SYSTEM_TEMPLATES) {
  if (!TEMPLATES_BY_CATEGORY[tpl.category]) {
    TEMPLATES_BY_CATEGORY[tpl.category] = [];
  }
  TEMPLATES_BY_CATEGORY[tpl.category].push(tpl);
}

export function getTemplateById(id: string): TemplateDefinition | undefined {
  return SYSTEM_TEMPLATES.find((t) => t.id === id);
}

/**
 * يملأ قالب بالبيانات المُدخَلة.
 * الحقول الفارغة تُترك كـ [[اسم_الحقل]] لتوضيح ما ينقص.
 */
export function fillTemplate(
  bodyTemplate: string,
  formData: Record<string, string>,
  fields: TemplateField[],
): string {
  let result = bodyTemplate;
  for (const field of fields) {
    const value = formData[field.id]?.trim() ?? "";
    const placeholder = value || `[[${field.label}]]`;
    result = result.replaceAll(`{{${field.id}}}`, placeholder);
  }
  return result;
}
