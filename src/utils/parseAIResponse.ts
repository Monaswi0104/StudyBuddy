export const parseAIResponse = (jsonString: string, outputType: string) => {
  try {
    const data = JSON.parse(jsonString);
    
    switch (outputType) {
      case 'Flashcards':
        return data.flashcards || [];
      case 'Quiz':
        return (data.quiz || []).map((q: any) => {
          let correct = q.correctAnswer;
          if (typeof correct === 'string') {
            if (['A', 'B', 'C', 'D'].includes(correct.toUpperCase())) {
              correct = correct.toUpperCase().charCodeAt(0) - 65;
            } else {
              correct = parseInt(correct, 10);
            }
          }
          return { ...q, correctAnswer: isNaN(correct) ? 0 : correct };
        });
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
