import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // حزم Node.js التي لا يجب تحويلها بواسطة Webpack — تُشغَّل فقط على الخادم
  // مهم لمكتبة docx التي تعتمد على Buffer وأدوات Node.js الأصلية
  serverExternalPackages: ["docx"],

  // إعدادات Logging
  logging: {
    fetches: {
      fullUrl: false,
    },
  },

  // رؤوس HTTP الأمانة — تُطبَّق على جميع المسارات
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // منع عرض الصفحة داخل iframe من مواقع أخرى
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // منع تخمين نوع المحتوى
          { key: "X-Content-Type-Options", value: "nosniff" },
          // إرسال Referrer فقط للنطاق نفسه
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // منع تسريب معلومات البراوزر
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
