import { GetAgencyAnalytics, GetOrders, GetSingleOrder } from "@/types/classes"
import { fetchWithAuth } from "./fetch-with-auth"

class OrderService {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || ""
  }

  async createOrder(
    agencyProductId: string,
    agencyId: string,
    kopyaSayisi: number,
    copyFiles: File[]
  ) {
    const formData = new FormData()
    formData.append("AgencyProductId", agencyProductId)
    formData.append("AgencyId", agencyId)
    formData.append("KopyaSayısı", kopyaSayisi.toString())

    // Add files to FormData
    copyFiles.forEach((file) => {
      formData.append("CopyFiles", file)
    })

    const response = await fetchWithAuth(`${this.baseUrl}/Orders/CreateOrder`, {
      method: "POST",
      body: formData,
    })

    // Parse response - don't try to use the body again after this
    try {
      const data = await response.json()
      return data
    } catch (error) {
      // If the response is not JSON, return the response object
      return response
    }
  }

  async getOrders(
    page: number,
    size: number,
    orderCode?: string,
    search?: string,
    orderBy?: string,
    state?: string,
    orderId?: string
  ): Promise<GetOrders[]> {
    const queryParams = new URLSearchParams()
    queryParams.append("page", page.toString())
    queryParams.append("size", size.toString())
    if (orderCode) queryParams.append("orderCode", orderCode)
    if (search) queryParams.append("search", search)
    if (orderBy) queryParams.append("orderBy", orderBy)
    if (state) queryParams.append("state", state)
    if (orderId) queryParams.append("orderId", orderId)
    const queryString = queryParams.toString()
    const response = await fetchWithAuth(
      `${this.baseUrl}/Orders/GetOrders?${queryString}`,
      {
        method: "GET",
      }
    )
    const data: GetOrders[] = await response.json()
    return data
  }

  async getSingleOrder(orderCode: string): Promise<GetSingleOrder> {
    const response = await fetchWithAuth(
      `${this.baseUrl}/Orders/GetOrders?&orderCode=${orderCode}`,
      {
        method: "GET",
      }
    )
    const data: GetSingleOrder = await response.json()
    return data
  }

  async updateOrder(
    orderState: string,
    orderCode: string,
    comment?: string,
    starRating?: number,
    removeCommentIds?: string[],
    completedCode?: string
  ) {
    const response = await fetchWithAuth(`${this.baseUrl}/Orders/UpdateOrder`, {
      method: "POST",
      body: JSON.stringify({
        orderState,
        comment,
        starRating,
        orderCode,
        removeCommentIds,
        completedCode,
      }),
    })
    return await response.json()
  }

  async getAgencyAnalytics(
    startDate: string,
    endDate: string,
    groupBy: string,
    agencyId?: string
  ): Promise<GetAgencyAnalytics[]> {
    const queryParams = new URLSearchParams()
    queryParams.append("startDate", startDate)
    queryParams.append("endDate", endDate)
    queryParams.append("groupBy", groupBy)
    if (agencyId) {
      queryParams.append("agencyId", agencyId)
    }

    const queryString = queryParams.toString()
    const response = await fetchWithAuth(
      `${this.baseUrl}/Orders/GetAgencyAnalytics?${queryString}`,
      {
        method: "GET",
      }
    )
    const data: GetAgencyAnalytics[] = await response.json()
    return data
  }
}

export const orderService = new OrderService()
