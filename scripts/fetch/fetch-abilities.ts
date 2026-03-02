import { ABILITIES_API_URL } from "../config/api-url";

export async function fetchAbilities<String>(): Promise<string> {
    const response = await fetch(ABILITIES_API_URL);

 if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Parse the response body as text
  const data: string = await response.text();
  return data;
}
