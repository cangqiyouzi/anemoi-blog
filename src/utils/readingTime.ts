export function calculateReadingTime(content: string | null | undefined): number {
  const cleanContent = (content || '').replace(/<[^>]*>/g, '');

  // CJK 字符数（中日韩统一表意文字）
  const cjkChars = (cleanContent.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;

  // 非 CJK 词数（按空格分词）
  const nonCjkWords = cleanContent
    .replace(/[\u4e00-\u9fff\u3400-\u4dbf]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  // CJK ~400 字/分钟，英文 ~200 词/分钟
  const minutes = cjkChars / 400 + nonCjkWords / 200;

  return Math.max(1, Math.ceil(minutes));
}
