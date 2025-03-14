"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { UserAuthService } from "@/services/user-auth-service"
import { getCookie } from "@/services/cookies"
import authService from "@/services/auth"

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const userAuthService = UserAuthService()

  // Mutation for refreshing the token
  const refreshTokenMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = getCookie("refreshToken")
      if (!refreshToken) {
        throw new Error("No refresh token available")
      }
      return userAuthService.refreshTokenLogin(refreshToken)
    },
    onSuccess: () => {
      // Update auth status after successful token refresh
      authService.identityCheck()
      // Invalidate queries that might depend on the new token
      queryClient.invalidateQueries()
    },
    onError: () => {
      // Redirect to login on refresh failure
      router.push("/sign-in")
    },
  })

  // Query to check authentication status
  const authQuery = useQuery({
    queryKey: ["authStatus"],
    queryFn: async () => {
      const accessToken = getCookie("accessToken")

      if (!accessToken) {
        // Try to refresh if no access token but has refresh token
        const refreshToken = getCookie("refreshToken")
        if (refreshToken) {
          await refreshTokenMutation.mutateAsync()
          return new Promise((resolve, reject) => {
            authService.authStatus$().subscribe({
              next: (value) => resolve(value),
              error: (err) => reject(err),
            })
          })
        }
        throw new Error("Not authenticated")
      }

      // Check if token is valid by updating auth status
      await authService.identityCheck()
      return new Promise((resolve, reject) => {
        authService.authStatus$().subscribe({
          next: (value) => resolve(value),
          error: (err) => reject(err),
        })
      })
    },
    retry: false,
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 60 * 1000, // Check every 5 minutes
  })

  // Handle authentication errors
  useEffect(() => {
    if (authQuery.isError) {
      router.push("/sign-in")
    }
  }, [authQuery.isError, router])

  return {
    ...authQuery,
    refreshToken: refreshTokenMutation.mutate,
    isRefreshing: refreshTokenMutation.isPending,
  }
}
