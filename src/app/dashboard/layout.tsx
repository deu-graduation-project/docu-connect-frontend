"use client"
import React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { getCookie } from "@/services/cookies"
import Cookies from "js-cookie"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { usePathname, useRouter } from "next/navigation"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { UserAuthService } from "@/services/user-auth-service"

type Props = {
  children?: React.ReactNode
}

// Create the query client outside the component to avoid re-initialization on render
const createQueryClient = () => {
  const userAuthService = UserAuthService()

  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: async (failureCount, error: any) => {
          // Check if error is due to unauthorized access (401)
          if (
            error?.message?.includes("401") ||
            error?.message?.includes("unauthorized") ||
            error?.message?.includes("Unauthorized")
          ) {
            if (failureCount === 1) {
              // Only try refreshing once
              const refreshToken = Cookies.get("refreshToken")
              if (refreshToken) {
                try {
                  // Attempt to refresh the token
                  await userAuthService.refreshTokenLogin(refreshToken)
                  console.log("Token refreshed successfully")
                  return true // Allow the query to retry with the new token
                } catch (refreshError) {
                  console.error("Failed to refresh token:", refreshError)
                  // Redirect to login page
                  window.location.href = "/sign-in"
                  return false
                }
              } else {
                // No refresh token available, redirect to login
                window.location.href = "/sign-in"
                return false
              }
            }
            return false // Don't retry additional times for auth errors
          }

          // For non-auth errors, retry up to 3 times
          return failureCount < 3
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  })
}

export default function DashboardLayout({ children }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const lastSegment = pathname?.split("/").filter(Boolean).pop() || ""

  // Create the query client with refresh token logic
  const [queryClient] = React.useState(() => createQueryClient())

  // Check for auth on component mount
  React.useEffect(() => {
    const accessToken = getCookie("accessToken")

    if (!accessToken) {
      // No token found, redirect to login
      router.push("/sign-in")
    }
  }, [router])

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider className="h-full w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="capitalize">
                      {lastSegment ? decodeURIComponent(lastSegment) : "Home"}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </QueryClientProvider>
  )
}
