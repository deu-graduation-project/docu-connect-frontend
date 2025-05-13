import { fetchWithAuth } from "./fetch-with-auth"

class FileService {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || ""
  }

  /**
   * Downloads a file using its file code
   * @param fileCode - Unique identifier for the file
   * @param fileName - Optional filename to use for the download (defaults to the original filename)
   * @returns A promise that resolves when the file download is complete
   */
  async downloadFile(fileCode: string, fileName?: string) {
    try {
      const queryString = new URLSearchParams({
        fileCode: fileCode,
      }).toString()

      // Use your existing fetchWithAuth function, but we need to ensure it handles binary data
      const response = await fetchWithAuth(
        `${this.baseUrl}/File/DownloadFile?${queryString}`,
        {
          method: "GET",
          headers: {
            // Remove default Content-Type to let the browser set it correctly for the response
            // This is important for binary data
          },
          // Tell the browser we want a blob response
          credentials: "include",
        }
      )

      // Get the content disposition header to extract the original filename if available
      const contentDisposition = response.headers.get("content-disposition")
      const defaultFileName = fileName || "file.pdf"

      // Extract filename from content disposition if available
      let downloadFileName = defaultFileName
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        )
        if (filenameMatch && filenameMatch[1]) {
          downloadFileName = filenameMatch[1].replace(/['"]/g, "")
        }
      }

      // Convert the response to a blob
      const blob = await response.blob()

      // Create a download link and trigger the download
      const fileUrl = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = fileUrl
      link.download = downloadFileName

      // Append, click, and remove the link
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up the blob URL
      URL.revokeObjectURL(fileUrl)

      return true
    } catch (error) {
      console.error("Error downloading file:", error)
      throw error
    }
  }
}

export const fileService = new FileService()
