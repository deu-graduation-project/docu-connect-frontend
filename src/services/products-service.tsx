import {
  CreateAgencyProduct,
  GetAgencyAnalytics,
  GetAgencyProducts,
  GetOrders,
  GetProducts,
  GetSingleOrder,
} from "@/types/classes"
import { fetchWithAuth } from "./fetch-with-auth"

class ProductService {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || ""
  }
  async createProduct(
    paperType: string,
    colorOption: string,
    printType: string
  ) {
    const response = await fetchWithAuth(
      `${this.baseUrl}/Products/CreateProduct`,
      {
        method: "POST",
        body: JSON.stringify({
          paperType,
          colorOption,
          printType,
        }),
      }
    )
    return response
  }
  async createAgencyProduct(products: CreateAgencyProduct[]) {
    const response = await fetchWithAuth(
      `${this.baseUrl}/Products/CreateAgencyProduct`,
      {
        method: "POST",
        body: JSON.stringify({
          UpdateOrCreateAgencyProducts: products,
        }),
      }
    )
    return response
  }
  async getAgencyProducts(agencyId: string): Promise<GetAgencyProducts[]> {
    const queryString = new URLSearchParams({
      agencyId: agencyId,
    }).toString()
    const response = await fetchWithAuth(
      `${this.baseUrl}/Products/GetAgencyProducts?${queryString}`,
      {
        method: "GET",
      }
    )
    const data: GetAgencyProducts[] = await response.json()
    return data
  }
  async getProducts(
    page: number,
    size: number
  ): Promise<{ totalCount: number; products: GetProducts[] }> {
    const queryString = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    }).toString()
    const response = await fetchWithAuth(
      `${this.baseUrl}/Products/GetAgencyProducts?${queryString}`,
      {
        method: "GET",
      }
    )
    const data = await response.json()
    return data
  }

  async deleteProducts(productIds: string[]) {
    if (productIds.length === 0) {
      throw new Error("Silinecek ürün seçilmedi.")
    }

    // Adjust this part if fetchWithAuth returns already parsed JSON
    const response = await fetchWithAuth(
      `${this.baseUrl}/Products/DeleteProducts`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productIds }),
      }
    )

    return response
  }
  async deleteAgencyProducts(AgencyProductIds: string[]) {
    if (AgencyProductIds.length === 0) {
      throw new Error("Silinecek ürün seçilmedi.")
    }

    const response = await fetchWithAuth(
      `${this.baseUrl}/Products/DeleteAgencyProducts`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ AgencyProductIds }),
      }
    )

    return response
  }
}

export const productService = new ProductService()
