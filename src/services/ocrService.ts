import { GoogleGenAI, Type } from "@google/genai";

// We assume API_KEY is set in the environment as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! }); // Usamos process.env.GEMINI_API_KEY!

interface OcrTruckData {
    patente?: string;
    carta_porte?: string;
    bruto_kg?: number;
    tara_kg?: number;
}

/**
 * Extracts truck weighing data from a ticket image using Gemini.
 * @param base64Image The base64 encoded image string.
 * @param mimeType The MIME type of the image (e.g., 'image/jpeg').
 * @returns A promise that resolves to the extracted truck data.
 */
// ¡CRÍTICO! Nombre de la función corregido para coincidir con la importación.
export const extractTruckDataFromImage = async (base64Image: string, mimeType: string): Promise<OcrTruckData> => {
    try {
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType,
            },
        };

        const textPart = {
            text: "Analiza la imagen de este ticket de báscula. Extrae la patente del camión, el número de carta de porte, el peso bruto en kilogramos y la tara en kilogramos. Devuelve solo un objeto JSON con las claves 'patente', 'carta_porte', 'bruto_kg' y 'tara_kg'. Si un valor no está presente, omite la clave. Asegúrate de que los pesos sean números.",
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [textPart, imagePart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        patente: { type: Type.STRING, description: "La matrícula o patente del vehículo." },
                        carta_porte: { type: Type.STRING, description: "El número del documento de carta de porte." },
                        bruto_kg: { type: Type.NUMBER, description: "El peso bruto total en kilogramos." },
                        tara_kg: { type: Type.NUMBER, description: "El peso del vehículo vacío (tara) en kilogramos." },
                    },
                },
            },
        });

        const jsonString = response.text.trim();
        const parsedData = JSON.parse(jsonString);

        return parsedData as OcrTruckData;

    } catch (error) {
        console.error("Error processing image with Gemini:", error);
        throw new Error("No se pudo analizar la imagen del ticket. Por favor, ingrese los datos manualmente.");
    }
};