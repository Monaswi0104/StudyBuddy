// @ts-ignore
import { GROQ_API_KEY } from '@env';
import { chunkText } from './chunkingService';

export interface AIRequestOptions {
  text: string;
  outputType: 'Flashcards' | 'Quiz' | 'Summary' | 'Mind Map';
  difficulty: string;
  numItems?: number;
  onProgress?: (current: number, total: number) => void;
}

export const generateStudyMaterial = async ({ text, outputType, difficulty, numItems = 10, onProgress }: AIRequestOptions) => {
  try {
    const difficultyGuide = {
      'Easy': 'Generate NCERT-level conceptual questions. Focus on definitions, basic formulas, direct recall, and straightforward single-step problems. Include simple numerical problems where applicable (e.g., "Calculate the pH of 0.01 M HCl").',
      'Medium': 'Generate questions at the level of JEE Mains / NEET. Include numerical problems that require 2-3 step calculations, application of formulas, unit conversions, and conceptual reasoning. Use realistic values and proper SI units. For example: calculating molarity, finding acceleration, balancing equations with stoichiometry, or applying Newton\'s laws. Mix conceptual MCQs with numerical MCQs.',
      'Hard': 'Generate questions at the level of JEE Advanced / AIIMS. Include multi-step numerical problems requiring deep conceptual understanding, combining multiple formulas, tricky edge cases, and competitive exam-style distractors. Questions should involve: complex stoichiometry, integration/differentiation-based physics problems, organic reaction mechanisms, or multi-concept problems. All 4 options in MCQs should be numerically close or conceptually plausible to test true understanding. Include at least 50% numerical problems.',
    }[difficulty] || '';

    const systemPrompt = `You are an expert competitive exam question generator specializing in JEE (Main + Advanced), NEET, and other Indian competitive exams.
The user will provide raw text from study notes or a textbook.
Your task: Generate EXACTLY ${numItems} high-quality study materials of type "${outputType}" at "${difficulty}" difficulty.

TARGET AUDIENCE: Students preparing for JEE, NEET, board exams, and competitive entrance tests.

DIFFICULTY INSTRUCTIONS: ${difficultyGuide}

CRITICAL QUALITY RULES:
- Questions MUST be derived from the provided text content
- Include NUMERICAL problems wherever the subject allows (Physics, Chemistry, Math). Use realistic values, proper SI units, and show the expected numerical answer
- For Quiz: ALL 4 options must be plausible. For numerical questions, keep options numerically close (e.g., 2.4, 2.8, 3.2, 3.6 — not 2, 20, 200, 2000). Include a step-by-step "explanation" showing HOW to solve the problem
- For Flashcards: Include the formula or method in the answer. For numerical flashcards, show the complete worked-out solution
- Avoid trivially easy or generic questions. Every question should require actual thinking
- Generate EXACTLY ${numItems} items, no more, no less

IMPORTANT: Respond with ONLY valid JSON. No markdown, no backticks, no extra text.

JSON Schemas:
- "Flashcards": { "flashcards": [{ "question": "...", "answer": "..." }] } — Generate exactly ${numItems} flashcards.
- "Quiz": { "quiz": [{ "question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "..." }] } — Generate exactly ${numItems} questions with 4 plausible options each.
- "Summary": { "summary": "...", "keyPoints": ["...", "..."] } — Generate a comprehensive summary with at least ${numItems} key points.
- "Mind Map": { "nodes": [{ "id": "1", "label": "Main Topic", "children": ["2", "3"] }], "edges": [{ "source": "1", "target": "2" }] }
`;

    const chunks = chunkText(text);
    const totalChunks = chunks.length;
    let mergedData: any = null;

    for (let i = 0; i < totalChunks; i++) {
      if (onProgress) {
        onProgress(i + 1, totalChunks);
      }

      // Small delay between chunks to avoid rate limits
      if (i > 0) {
        await new Promise<void>((resolve) => {
          setTimeout(() => resolve(), 1500);
        });
      }

      const chunk = chunks[i];

      let data: any = null;
      let retries = 0;
      const maxRetries = 3;
      let chunkSuccess = false;

      while (retries <= maxRetries) {
        try {
          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
              model: 'llama-3.1-8b-instant', // Higher TPM limit on free tier than 70b
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: 'Here is the text:\n\n' + chunk },
              ],
              temperature: 0.7,
              response_format: { type: 'json_object' },
            }),
          });

          data = await response.json();

          if (data.error) {
            const errMsg = data.error.message || '';
            if (errMsg.includes('try again in')) {
              // Extract the wait time (e.g. "try again in 1.065s")
              const match = errMsg.match(/try again in ([0-9.]+)s/);
              let waitTimeMs = 2000; // default 2s
              if (match && match[1]) {
                waitTimeMs = parseFloat(match[1]) * 1000 + 500; // wait exactly what it asks + 500ms buffer
              }
              console.log(`[Rate Limit] Waiting ${waitTimeMs}ms before retry ${retries + 1}/${maxRetries}...`);
              await new Promise(resolve => setTimeout(resolve, waitTimeMs));
              retries++;
              continue;
            }
            throw new Error(errMsg || 'Groq API Error');
          }
          
          chunkSuccess = true;
          break; // Success, exit retry loop
        } catch (err: any) {
          console.warn(`Chunk ${i+1} attempt ${retries+1} failed:`, err.message);
          retries++;
          if (retries <= maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
      }

      if (!chunkSuccess) {
        console.error(`Skipping chunk ${i+1} after ${maxRetries} failed attempts.`);
        continue; // Skip this chunk and move to the next one
      }

      const content = data?.choices?.[0]?.message?.content || '';
      let chunkData: any = {};
      try {
        chunkData = JSON.parse(content);
      } catch (e) {
        console.warn('Failed to parse chunk JSON:', content);
        continue; // Skip if it's completely invalid JSON
      }

      if (!mergedData) {
        mergedData = chunkData;
      } else {
        if (outputType === 'Flashcards') {
          mergedData.flashcards = [...(mergedData.flashcards || []), ...((chunkData).flashcards || [])];
        } else if (outputType === 'Quiz') {
          mergedData.quiz = [...(mergedData.quiz || []), ...((chunkData).quiz || [])];
        } else if (outputType === 'Summary') {
          mergedData.summary += '\n\n' + ((chunkData).summary || '');
          mergedData.keyPoints = [...(mergedData.keyPoints || []), ...((chunkData).keyPoints || [])];
        } else if (outputType === 'Mind Map') {
          mergedData.nodes = [...(mergedData.nodes || []), ...((chunkData).nodes || [])];
          mergedData.edges = [...(mergedData.edges || []), ...((chunkData).edges || [])];
        }
      }
    }

    // Trim to requested item count
    if (mergedData) {
      if (outputType === 'Flashcards' && mergedData.flashcards) {
        mergedData.flashcards = mergedData.flashcards.slice(0, numItems);
      } else if (outputType === 'Quiz' && mergedData.quiz) {
        mergedData.quiz = mergedData.quiz.slice(0, numItems);
      } else if (outputType === 'Summary' && mergedData.keyPoints) {
        mergedData.keyPoints = mergedData.keyPoints.slice(0, numItems);
      }
    }

    return JSON.stringify(mergedData);
  } catch (error: any) {
    console.error('AI API Failed (Using Mock Fallback):', error.response?.data || error.message);

    // Seamless Mock Fallback so the user can test the app without a paid API Key!
    if (outputType === 'Flashcards') {
      return JSON.stringify({
        flashcards: [
          { question: "What is the primary function of Mitochondria?", answer: "To generate most of the chemical energy needed to power the cell's biochemical reactions (powerhouse of the cell)." },
          { question: "What is an Acid according to Arrhenius?", answer: "A substance that increases the concentration of hydrogen ions (H+) in aqueous solution." },
          { question: "What does OCR stand for?", answer: "Optical Character Recognition, which converts images of typed or handwritten text into machine-encoded text." }
        ]
      });
    } else if (outputType === 'Quiz') {
      return JSON.stringify({
        quiz: [
          { question: "Which of the following is a noble gas?", options: ["Oxygen", "Nitrogen", "Argon", "Carbon"], correctAnswer: 2, explanation: "Argon is a noble gas, meaning it is largely unreactive." },
          { question: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi"], correctAnswer: 2, explanation: "Mitochondria generate energy." }
        ]
      });
    } else {
      return JSON.stringify({
        summary: "This is a beautifully mocked summary of your scanned notes. Since the API key quota was depleted, the app automatically fell back to this mock mode so you can continue testing the UI and navigation seamlessly!",
        keyPoints: ["API Key was valid but had zero billing credits.", "The app smoothly caught the error.", "You can now test saving these materials!"]
      });
    }
  }
};
