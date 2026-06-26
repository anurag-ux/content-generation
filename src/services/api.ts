import type { GenerateRequest, GenerateResponse } from '../types/api';

const API_ENDPOINT = 'https://proserv-tool.app.n8n.cloud/webhook/content-generator';

export async function generateContent(data: GenerateRequest): Promise<GenerateResponse> {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate content: ${response.statusText}`);
  }

  return response.json();
}
