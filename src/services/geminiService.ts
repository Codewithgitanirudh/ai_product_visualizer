import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import type { OriginalImage } from "../../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  console.warn(
    "API_KEY environment variable not set. App will not function correctly."
  );
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });
const model = "gemini-2.5-flash-image";

const fileToGenerativePart = (base64Data: string, mimeType: string) => ({
  inlineData: { data: base64Data, mimeType },
});

const extractImageFromResponse = (
  response: GenerateContentResponse
): string | null => {
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }
  return null;
};

// Helper to delay polling
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Polls the task until it’s complete or fails
async function pollTask(taskId: string, baseUrl: string): Promise<string> {
  const statusUrl = `${baseUrl}/${taskId}`;

  while (true) {
    const res = await fetch(statusUrl);
    const { data } = await res.json();

    if (!data) throw new Error("Invalid response");

    if (data.status === "COMPLETED") {
      const imageUrl = data.generated?.[0];
      if (!imageUrl) throw new Error("No image URL found");
      return imageUrl;
    }

    if (data.status === "FAILED") {
      throw new Error("Generation failed");
    }

    await sleep(2000); // wait 2 seconds before checking again
  }
}

export const generateVisualizations = async (
  productImage: OriginalImage
): Promise<string[]> => {
  const imagePart = fileToGenerativePart(
    productImage.base64,
    productImage.mimeType
  );
  const url = "/api/freepik/v1/ai/gemini-2-5-flash-image-preview";

  const prompts = [
    "Place this product onto a white coffee mug. The mug is on a wooden table in a bright, modern cafe. The product should be clearly visible and centered on the mug.",
    "Render this product onto the front of a black cotton t-shirt worn by a person walking down a vibrant city street. The product logo or design should be prominent.",
    "Display this product on a massive, glowing billboard in a futuristic city at night, similar to Times Square. The lighting should be dramatic and eye-catching.",
  ];

  // Create tasks and get task IDs
  const taskIds = await Promise.all(
    prompts.map(async (prompt) => {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          reference_images: [imagePart.inlineData.data],
        }),
      });
      const { data } = await response.json();
      return data.task_id;
    })
  );

  // Poll all tasks in parallel
  const results = await Promise.allSettled(
    taskIds.map((taskId) => pollTask(taskId, url))
  );

  // Return successful results
  return results
    .filter(
      (r): r is PromiseFulfilledResult<string> => r.status === "fulfilled"
    )
    .map((r) => r.value);
};

export const editImage = async (
  image: { base64: string; mimeType: string },
  prompt: string
): Promise<string> => {
  const imagePart = fileToGenerativePart(image.base64, image.mimeType);

  const url = "/api/freepik/v1/ai/gemini-2-5-flash-image-preview";

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      reference_images: [imagePart.inlineData.data],
    }),
  });
  const { data } = await response.json();
  const taskId = data.task_id;
  console.log('taskId', taskId);

  const result = await pollTask(taskId, url);
  console.log('result', result);
  return result;

};
