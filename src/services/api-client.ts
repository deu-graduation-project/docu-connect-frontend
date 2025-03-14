"use client"

import { fetchWithAuth } from "@/services/fetch-with-auth"
import { UserAuthService } from "@/services/user-auth-service"
import { getCookie } from "@/services/cookies"

class ApiClient {
  private userAuthService = UserAuthService()

  async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetchWithAuth(url, options)
      return (await response.json()) as T
    } catch (error: any) {
      // Check if error is due to unauthorized access (401)
      if (
        error?.message?.includes("401") ||
        error?.message?.includes("unauthorized") ||
        error?.message?.includes("Unauthorized")
      ) {
        // Try to refresh the token
        const refreshToken = getCookie("refreshToken")
        if (refreshToken) {
          try {
            // Attempt to refresh the token
            await this.userAuthService.refreshTokenLogin(refreshToken)

            // Retry the original request with the new token
            const retryResponse = await fetchWithAuth(url, options)
            return (await retryResponse.json()) as T
          } catch (refreshError) {
            console.error("Failed to refresh token:", refreshError)
            // Rethrow the original error
            throw error
          }
        }
      }

      // Rethrow the error for other cases
      throw error
    }
  }

  async get<T>(url: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: "GET" })
  }

  async post<T>(url: string, data: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })
  }

  async put<T>(url: string, data: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })
  }

  async delete<T>(url: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: "DELETE" })
  }
}

export const apiClient = new ApiClient()
