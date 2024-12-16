import { fetchWithAuth } from "./fetch-with-auth";

class FileService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  }
  async downloadFile(fileCode:string){
     const queryString = new URLSearchParams({
       fileCode: fileCode, 
     }).toString();
    const data = await fetchWithAuth(
      `${this.baseUrl}/File/DownloadFile?${queryString}`,
      {
        method: "GET",
      }
    );
     if (data instanceof Blob) {
       const fileUrl = URL.createObjectURL(data);
       const link = document.createElement("a");
       link.href = fileUrl;
       link.download = "file.pdf"; // Dosya ismi burada belirtilebilir
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
       URL.revokeObjectURL(fileUrl); // Bellek temizliği
     } else {
       console.error("Dosya indirilemedi", data);
     }

     return data;
  }
}

export const fileService = new FileService();