import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "edge";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const prompt = "Generate three open-ended and thought-provoking questions formatted as a single string, separated by '||'. The questions should be diverse, engaging, and suitable for an anonymous social messaging platform like Qooh.me. Ensure that each set of questions varies widely in topic, covering aspects like personal reflection, hypothetical scenarios, and social experiences. Avoid repetition and aim for originality in every response.";

        // Initialize the Gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        console.log("Request made successfully...");

        // Generate and stream the response
        const result = await model.generateContentStream({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.9,
                topP: 0.85,
                maxOutputTokens: 200,
            },
        });

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.stream) {
                        const text = await chunk.text();  // ✅ Fix: Await the text extraction
                        if (text) {
                            console.log("Streaming chunk:", text);

                            controller.enqueue(encoder.encode(text + "\n\n"));  // ✅ Fix: Add separator
                        }
                    }
                    controller.close();
                } catch (err) {
                    console.error("Streaming error:", err);
                    controller.error(err);
                }
            }
        });

        return new Response(stream, {
            headers: { "Content-Type": "text/plain; charset=utf-8" }  // ✅ Ensure correct header
        });

    } catch (error) {
        console.error("Error in generating response:", error);
        return new Response(JSON.stringify({
            success: false,
            message: "Error in generating response"
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
