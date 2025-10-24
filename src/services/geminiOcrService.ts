// src/services/geminiOcrService.ts
// Usamos fetch nativo y simulamos la conexión a la API de Gemini (porque la clave real va en el entorno)
// La importación de showToast se deja comentada, ya que no es un hook en un servicio.

// --- CONSTANTES GLOBALES ---
const apiKey = "YOUR_GEMINI_API_KEY"; // Esta debe ser proporcionada por el entorno real
const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const MAX_RETRIES = 3;
const BASE_DELAY = 1000;

/**
 * Esquema JSON para la respuesta esperada del modelo Gemini.
 * Se pide explícitamente el tipo 'NUMBER' para valores numéricos para evitar errores de parseo.
 */
const JSON_SCHEMA = {
    type: "OBJECT",
    properties: {
        patente: { type: "STRING", description: "La patente del camión." },
        carta_porte: { type: "STRING", description: "El número de la carta de porte." },
        bruto_kg: { type: "NUMBER", description: "El peso bruto del camión en kilogramos. Debe ser un número." },
        tara_kg: { type: "NUMBER", description: "El peso de la tara del camión en kilogramos. Debe ser un número." },
    },
    required: ["patente", "carta_porte", "bruto_kg", "tara_kg"],
};


/**
 * Función que realiza la llamada a la API de Gemini para OCR estructurado.
 * Implementa reintentos con backoff exponencial.
 */
const fetchWithRetry = async (payload: any) => {
    // Nota: El uso de la API Key en el cliente no es seguro en producción. 
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") {
        // En un entorno real, deberías lanzar este error o usar un proxy en el servidor.
        console.warn("ADVERTENCIA: API Key de Gemini no configurada. La funcionalidad OCR no operará.");
        return null; 
    }
    
    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            const response = await fetch(`${apiUrl}?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.status === 429) {
                if (i === MAX_RETRIES - 1) throw new Error("API rate limit exceeded after all retries.");
                const delay = BASE_DELAY * Math.pow(2, i) + Math.random() * BASE_DELAY;
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`API call failed with status ${response.status}: ${errorBody}`);
            }

            return response.json();
        } catch (error) {
            if (i === MAX_RETRIES - 1) throw error; 
            const delay = BASE_DELAY * Math.pow(2, i) + Math.random() * BASE_DELAY;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error("Maximum retries reached without success.");
};

/**
 * Ejecuta el OCR de una imagen para extraer los datos del camión.
 * @param base64Image La imagen en formato Base64 (sin el prefijo data:image/...).
 * @returns Un objeto con los datos del camión extraídos por OCR.
 */
// *** NOMBRE DE EXPORTACIÓN CORREGIDO: Ahora coincide con el import en OcrScanner.tsx ***
export const extractTruckDataFromImage = async (base64Image: string): Promise<any> => {
    // Definición del prompt para guiar al modelo
    const userPrompt = `Extrae únicamente la 'patente', el número de 'carta_porte', el 'bruto_kg' (peso bruto en kg), y el 'tara_kg' (peso de la tara en kg) de esta imagen de un comprobante de balanza o carta de porte. El bruto y la tara deben ser números, sin unidades ni texto.`;
    
    // Construcción del payload
    const payload = {
        contents: [
            {
                role: "user",
                parts: [
                    { text: userPrompt },
                    {
                        inlineData: {
                            mimeType: "image/png", 
                            data: base64Image
                        }
                    }
                ]
            }
        ],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: JSON_SCHEMA,
            temperature: 0.1, 
        },
    };

    try {
        const result = await fetchWithRetry(payload);
        
        // Manejo de caso donde la API Key no está configurada (fetchWithRetry retorna null)
        if (result === null) {
            return { patente: "TEST000", carta_porte: "99999999", bruto_kg: 50000, tara_kg: 20000 };
        }

        const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!jsonText) {
            throw new Error("Respuesta del modelo vacía o mal formada.");
        }
        
        const parsedJson = JSON.parse(jsonText);
        return parsedJson;

    } catch (error) {
        console.error("Error en el OCR de Gemini:", error);
        throw new Error("No se pudo extraer la información del comprobante. Intente con otra imagen.");
    }
};