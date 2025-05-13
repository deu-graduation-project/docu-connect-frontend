import { GetAgencyAnalytics, GetOrders, GetSingleOrder } from "@/types/classes"
import { fetchWithAuth } from "./fetch-with-auth"
import { SucceededMessageResponse } from "@/types"

// Define the expected response structure for initiatePayment
type InitiatePaymentResponse = {
  sessionId: string
  // Add other potential fields if the backend returns more
}

class OrderService {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || ""
    if (!this.baseUrl) {
      console.error("API URL is not defined in environment variables.")
      // Optionally throw an error or handle it as needed
      // throw new Error("API URL is not configured.");
    }
  }

  // Removed the old createOrder method as payment initiation handles order creation implicitly via Stripe webhook
  /* async createOrder(
    agencyProductId: string,
    agencyId: string,
    kopyaSayisi: number,
    copyFiles: File[]
  ) { ... } */

  async initiatePayment(
    agencyId: string,
    agencyProductId: string,
    kopyaSayisi: number,
    copyFiles: File[]
  ): Promise<string> {
    // Return only the sessionId string
    const formData = new FormData()
    formData.append("agencyId", agencyId)
    formData.append("agencyProductId", agencyProductId)
    formData.append("kopyaSayisi", kopyaSayisi.toString()) // Ensure it's a string for FormData
    copyFiles.forEach((file) => {
      formData.append("copyFiles", file, file.name) // Append each file
    })

    const paymentUrl = `${this.baseUrl}/Checkout/initiate-payment` // Corrected path

    try {
      const response = await fetchWithAuth(paymentUrl, {
        method: "POST",
        body: formData,
        // No 'Content-Type' header needed; browser sets it for FormData
      })

      if (!response.ok) {
        let errorDetails = `Status: ${response.status}`
        try {
          const errorData = await response.json()
          errorDetails += `, Message: ${errorData.message || JSON.stringify(errorData)}`
        } catch {
          // Removed unused 'e' variable
          // If response is not JSON or empty
          errorDetails += `, Body: ${await response.text()}`
        }
        throw new Error(`Failed to initiate payment: ${errorDetails}`)
      }

      const result: InitiatePaymentResponse = await response.json()
      if (!result.sessionId) {
        throw new Error("Session ID not received from backend.")
      }
      return result.sessionId // Return only the session ID
    } catch (error) {
      console.error("Payment initiation error in service:", error)
      // Re-throw the error so the mutation hook can handle it
      throw error instanceof Error ? error : new Error(String(error))
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
    if (!response.ok) {
      // Handle non-OK responses if necessary, e.g., throw an error
      throw new Error(`Failed to fetch orders: ${response.statusText}`)
    }
    // Ensure response is parsed correctly
    try {
      const data: GetOrders[] = await response.json()
      return data
    } catch (error) {
      console.error("Failed to parse orders response:", error)
      throw new Error("Invalid response format from server.")
    }
  }

  async getSingleOrder(orderCode: string): Promise<GetSingleOrder> {
    const response = await fetchWithAuth(
      `${this.baseUrl}/Orders/GetOrders?&orderCode=${orderCode}`,
      {
        method: "GET",
      }
    )
    if (!response.ok) {
      throw new Error(`Failed to fetch single order: ${response.statusText}`)
    }
    try {
      const data: GetSingleOrder = await response.json()
      return data
    } catch (error) {
      console.error("Failed to parse single order response:", error)
      throw new Error("Invalid response format from server.")
    }
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
      headers: {
        "Content-Type": "application/json", // Ensure correct content type
      },
      body: JSON.stringify({
        orderState,
        comment,
        starRating,
        orderCode,
        removeCommentIds,
        completedCode,
      }),
    })
    if (!response.ok) {
      // Consider more specific error handling based on status code
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `Failed to update order: ${response.statusText} ${errorData.message || ""}`
      )
    }
    // Only parse JSON if the response is expected to have a body
    // If the backend sends 204 No Content, response.json() will fail
    if (response.status !== 204) {
      try {
        return await response.json()
      } catch (error) {
        console.error("Failed to parse update order response:", error)
        // Decide how to handle: return null, throw, etc.
        return null // Or throw new Error("Invalid response format");
      }
    }
    return null // Return null or a success indicator for 204
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
    try {
      const data: GetAgencyAnalytics[] = await response.json();
      return data
    } catch (error) {
      console.error("Failed to parse agency analytics response:", error)
      throw new Error("Invalid response format from server.")
    }
  }
  async cancelOrder(orderCode: string): Promise<SucceededMessageResponse> {
    const response = await fetchWithAuth(`${this.baseUrl}/Orders/CancelOrder`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderCode,
      }),
    })
    return response.json()
  }
}

export const orderService = new OrderService()
