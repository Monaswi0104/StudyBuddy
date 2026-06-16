export const parseAIResponse = (jsonString: string, outputType: string) => {
  try {
    const data = JSON.parse(jsonString);
    
    switch (outputType) {
      case 'Flashcards':
        return data.flashcards || [];
      case 'Quiz':
        return data.quiz || [];
      case 'Summary':
        return data || {};
      case 'Mind Map':
        return data || { nodes: [], edges: [] };
      default:
        return data;
    }
  } catch (error) {
    console.error('Failed to parse AI response JSON:', error);
    // Return empty fallbacks if parsing fails
    switch (outputType) {
      case 'Flashcards': return [];
      case 'Quiz': return [];
      case 'Summary': return { summary: 'Parsing failed.', keyPoints: [] };
      case 'Mind Map': return { nodes: [], edges: [] };
      default: return null;
    }
  }
};
