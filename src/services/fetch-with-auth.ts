import { getCookie } from "@/services/cookies"

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getCookie("accessToken")
  const isFormData = options.body instanceof FormData

  // Special handling for binary responses (like file downloads)
  const isBinaryResponse = url.includes("/File/DownloadFile")

  const headers = isFormData
    ? {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      }
    : {
        // Don't set Content-Type for binary responses
        ...(!isBinaryResponse ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    // Clone the response before attempting to read its body
    const clonedResponse = response.clone()

    // Try to parse the error response as JSON
    let errorMessage = "API request failed."
    try {
      const errorResponse = await clonedResponse.json()
      errorMessage =
        errorResponse.message ||
        errorResponse.title ||
        JSON.stringify(errorResponse)
    } catch (e) {
      // If the response is not JSON, use the raw text from original response
      try {
        const errorText = await response.text()

        // Check for .NET exception stack trace in the response
        if (errorText.includes("System.") && errorText.includes("Exception")) {
          // Extract the main exception message
          const firstLine = errorText.split("\n")[0]
          const exceptionMessage = firstLine.includes(":")
            ? firstLine.split(":")[1].trim()
            : firstLine

          // Keep the exception type for debugging and user feedback
          const exceptionType = firstLine.includes(":")
            ? firstLine.split(":")[0].trim()
            : "Exception"

          errorMessage = `${exceptionMessage} (${exceptionType})`
        } else {
          errorMessage =
            errorText || `Request failed with status ${response.status}`
        }
      } catch (textError) {
        // If even text() fails, use the status code
        errorMessage = `Request failed with status ${response.status}`
      }
    }

    // Throw a meaningful error message
    throw new Error(errorMessage)
  }

  return response
}
