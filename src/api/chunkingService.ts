const MAX_CHARS_PER_CHUNK = 3000; // safe limit per API call (~750 tokens)

export const chunkText = (text: string): string[] => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    if ((current + sentence).length > MAX_CHARS_PER_CHUNK) {
      if (current) chunks.push(current.trim());
      current = sentence;
    } else {
      current += ' ' + sentence;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
};
