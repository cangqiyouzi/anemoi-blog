// CJK 字符范围：中日韩统一表意文字 + 扩展A + 平假名 + 片假名 + 谚文音节
const cjkRegex = /[\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g;

export function countWords(content: string | null | undefined): number {
  const cleanContent = (content || '').replace(/<[^>]*>/g, '');

  // CJK 字符数
  const cjkChars = (cleanContent.match(cjkRegex) || []).length;

  // 非 CJK 词数
  const nonCjkWords = cleanContent
    .replace(cjkRegex, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return cjkChars + nonCjkWords;
}

export function calculateReadingTime(content: string | null | undefined): number {
  const cleanContent = (content || '').replace(/<[^>]*>/g, '');

  // CJK 字符数（含汉字、平假名、片假名、谚文）
  const cjkChars = (cleanContent.match(cjkRegex) || []).length;

  // 非 CJK 词数（按空格分词）
  const nonCjkWords = cleanContent
    .replace(cjkRegex, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  // CJK ~400 字/分钟，英文 ~200 词/分钟
  const minutes = cjkChars / 400 + nonCjkWords / 200;

  return Math.max(1, Math.ceil(minutes));
}
