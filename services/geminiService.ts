
import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateStudyTips = async (subject: string, teacher: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "KI-Dienst ist derzeit nicht verfügbar. Bitte prüfen Sie den API-Schlüssel.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Erstelle 3 kurze, prägnante Lerntipps und eine mögliche Prüfungsfrage für das Schulfach "${subject}" (typischerweise unterrichtet im Stil von "${teacher}", falls bekannt, sonst allgemein). Formatiere es als Markdown.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Keine Tipps verfügbar.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Fehler beim Laden der Lerntipps.";
  }
};

// Mock OCR function - in a real app this would call Gemini Vision or an OCR API
export const extractTextFromImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Return dummy text based on file name keywords for search simulation
            const keywords = file.name.split(/[\s_.-]/);
            resolve(`Automatisch generierter Text für ${file.name}. Enthält Schlüsselwörter: ${keywords.join(', ')}. Dies ist ein simulierter OCR-Scan, der es ermöglicht, den Inhalt der Klausur zu durchsuchen.`);
        }, 1500);
    });
};
