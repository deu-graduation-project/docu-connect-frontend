import { getCookie } from "@/services/cookies";

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getCookie("accessToken");
  const isFormData = options.body instanceof FormData
  const headers = isFormData
    ? {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      }
    : {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Try to parse the error response as JSON
    let errorResponse;
    try {
      errorResponse = await response.json();
    } catch (e) {
      // If the response is not JSON, use the raw text
      console.log("Error response:", await response.text());
    }

    // Throw a meaningful error message
    const errorMessage =
      errorResponse.message || errorResponse || "API request failed.";
    throw new Error(errorMessage);
  }

  return response;
};
