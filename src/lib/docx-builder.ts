/**
 * بناء ملف DOCX حقيقي بدعم RTL والخط العربي.
 * يستخدم مكتبة 'docx' (npm install docx).
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageNumber,
  Footer,
  SectionType,
} from "docx";

export interface DocxOptions {
  title: string;
  content: string;
  lawyerName?: string;
  firmName?: string;
}

export async function buildDocx(opts: DocxOptions): Promise<Buffer> {
  const { title, content, lawyerName, firmName } = opts;

  // تقسيم المحتوى إلى فقرات
  const lines = content.split("\n");
  const bodyParagraphs: Paragraph[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const isHeading =
      trimmed.endsWith(":") ||
      /^(أولاً|ثانياً|ثالثاً|رابعاً|خامساً|سادساً|سابعاً|ثامناً|تاسعاً|عاشراً)/.test(trimmed);

    bodyParagraphs.push(
      new Paragraph({
        ...(isHeading ? { heading: HeadingLevel.HEADING_2 } : {}),
        alignment: AlignmentType.RIGHT,
        bidirectional: true,
        spacing: { after: 120, line: 360 },
        children: [
          new TextRun({
            text: line || " ",
            font: "Cairo",
            size: isHeading ? 26 : 24,
            bold: isHeading,
            color: "0b1f3a",
            rightToLeft: true,
          }),
        ],
      }),
    );
  }

  const headerParagraphs: Paragraph[] = [];

  if (firmName) {
    headerParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        bidirectional: true,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: firmName,
            font: "Cairo",
            size: 30,
            bold: true,
            color: "0b1f3a",
            rightToLeft: true,
          }),
        ],
      }),
    );
  }

  if (lawyerName) {
    headerParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        bidirectional: true,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: `المحامي: ${lawyerName}`,
            font: "Cairo",
            size: 22,
            color: "5b6b7c",
            rightToLeft: true,
          }),
        ],
      }),
    );
  }

  // عنوان المستند
  const titleParagraph = new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    bidirectional: true,
    spacing: { before: 240, after: 360 },
    children: [
      new TextRun({
        text: title,
        font: "Cairo",
        size: 36,
        bold: true,
        color: "0b1f3a",
        rightToLeft: true,
      }),
    ],
  });

  // تنبيه المراجعة
  const disclaimerParagraph = new Paragraph({
    alignment: AlignmentType.RIGHT,
    bidirectional: true,
    spacing: { before: 360 },
    shading: { fill: "FFF9E7" },
    border: {
      top: { style: "single", size: 6, color: "F0C040" },
      bottom: { style: "single", size: 6, color: "F0C040" },
    },
    children: [
      new TextRun({
        text: "⚠️ تنبيه: هذه مسودة أولية أُعدَّت بمساعدة تطبيق صيغتي. تحتاج إلى مراجعة محامٍ متخصص قبل التوقيع أو الإيداع الرسمي.",
        font: "Cairo",
        size: 20,
        color: "8a6d1a",
        italics: true,
        rightToLeft: true,
      }),
    ],
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          type: SectionType.CONTINUOUS,
          page: {
            margin: { top: 1440, right: 1080, bottom: 1440, left: 1080 },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: ["صفحة ", PageNumber.CURRENT, " من ", PageNumber.TOTAL_PAGES],
                    font: "Cairo",
                    size: 18,
                    color: "5b6b7c",
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          ...headerParagraphs,
          titleParagraph,
          ...bodyParagraphs,
          disclaimerParagraph,
        ],
      },
    ],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}
