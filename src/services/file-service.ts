import { fetchWithAuth } from "./fetch-with-auth"

class FileService {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || ""
  }

  /**
   * Downloads a file using its file code
   * @param fileCode - Unique identifier for the file
   * @returns A promise that resolves when the file download is complete
   */
  async downloadFile(fileCode: string) {
    try {
      const queryString = new URLSearchParams({
        fileCode: fileCode,
      }).toString()

      const data = await fetchWithAuth(
        `${this.baseUrl}/File/DownloadFile?${queryString}`,
        {
          method: "GET",
        }
      )

      if (data instanceof Blob) {
        const fileUrl = URL.createObjectURL(data)
        const link = document.createElement("a")
        link.href = fileUrl
        link.download = "file.pdf" // Default filename - could be improved
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(fileUrl) // Clean up to avoid memory leaks
        return true
      } else {
        console.error("File download failed - response is not a Blob", data)
        throw new Error("File download failed")
      }
    } catch (error) {
      console.error("Error downloading file:", error)
      throw error
    }
  }
}

export const fileService = new FileService()
