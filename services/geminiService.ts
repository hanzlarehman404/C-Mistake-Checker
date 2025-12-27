
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse } from "../types";

export const analyzeCppCode = async (code: string): Promise<AnalysisResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Analyze the following C++ code for mistakes, errors, and bad practices:\n\n${code}`,
    config: {
      systemInstruction: `You are a world-class AI-powered C++ Code Analysis Assistant. 
      Your task is to detect:
      1. Syntax errors (missing semicolons, wrong brackets).
      2. Logical errors (incorrect conditions, wrong loops).
      3. Runtime issues (out-of-bounds, uninitialized variables, memory leaks).
      4. Compiler warnings and undefined behavior.
      5. Bad practices (poor naming, unsafe pointers, lack of const).
      
      Always suggest improvements using Modern C++ (C++11/14/17/20/23).
      Be precise about line numbers.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          issues: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { 
                  type: Type.STRING, 
                  enum: ['syntax', 'logic', 'runtime', 'practice', 'warning']
                },
                line: { type: Type.STRING, description: "The line number or range" },
                originalSnippet: { type: Type.STRING, description: "The problematic part of the code" },
                description: { type: Type.STRING, description: "Why it's wrong" },
                fix: { type: Type.STRING, description: "The corrected code" }
              },
              required: ['type', 'line', 'originalSnippet', 'description', 'fix']
            }
          },
          overallSummary: { type: Type.STRING },
          bestPractices: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ['issues', 'overallSummary', 'bestPractices']
      }
    }
  });

  try {
    const data = JSON.parse(response.text || '{}');
    return data as AnalysisResponse;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Failed to analyze code. Please try again.");
  }
};
