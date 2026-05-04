export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 300;
  const cleanContent = content.replace(/<[^>]*>/g, '');
  const wordCount = cleanContent.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
