"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import {
  BookOpen,
  Command,
  Frame,
  GalleryVerticalEnd,
  PieChart,
  SquareTerminal,
  User,
  SquareActivity,
  List,
  Landmark,
  ChartArea,
  Waypoints,
  Mail,
  Wrench,
} from "lucide-react"

import { NavMain } from "./nav-main"
import useAuthStatus from "@/lib/queries/auth-status"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Icons } from "./icons"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, isLoading } = useAuthStatus()

  // Track whether the component has mounted to avoid hydration issues
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const sideBarConfigForAgency = {
    user: {
      name:
        `${data?.name || ""} ${data?.surname || ""}`.trim() || "kullanıcı adı",
      email: data?.email || "kullanıcı emaili",
      avatar: "/avatars/shadcn.jpg",
    },
    projects: [
      {
        name: "Profile",
        url: `/dashboard/profile`,
        icon: User,
      },
      {
        name: "Activity and History",
        url: `/dashboard/activity-and-history`,
        icon: SquareActivity,
      },
      {
        name: "Privacy & Preferences",
        url: `/dashboard/privacy-and-preferences`,
        icon: PieChart,
      },
      {
        name: "Analytics",
        url: `/dashboard/analytics`,
        icon: ChartArea,
      },
      {
        name: "Support & Connections",
        url: `/dashboard/support-and-connections`,
        icon: Waypoints,
      },
      {
        name: "Account Management",
        url: `/dashboard/account-management`,
        icon: Wrench,
      },
      {
        name: "Product List",
        url: "/dashboard/product-list",
        icon: List,
      },
    ],
  }

  const sideBarConfigForAdmin = {
    user: {
      name:
        `${data?.name || ""} ${data?.surname || ""}`.trim() || "kullanıcı adı",
      email: data?.email || "kullanıcı emaili",
      avatar: "/avatars/shadcn.jpg",
    },
    projects: [
      {
        name: "Agency Requests",
        url: `/dashboard/agency-requests`,
        icon: Mail,
      },
      {
        name: "Create Products",
        url: `/dashboard/create-products`,
        icon: Icons.addProduct,
      },
    ],
  }

  const sideBarConfigForUser = {
    user: {
      name:
        `${data?.name || ""} ${data?.surname || ""}`.trim() || "kullanıcı adı",
      email: data?.email || "kullanıcı emaili",
      avatar: "/avatars/shadcn.jpg",
    },
    projects: [
      {
        name: "Profile",
        url: `/dashboard/profile`,
        icon: User,
      },
      {
        name: "Agencies",
        url: `/dashboard/agencies`,
        icon: Landmark,
      },
      {
        name: "Activity and History",
        url: `/dashboard/activity-and-history`,
        icon: SquareActivity,
      },
      {
        name: "Account Management",
        url: `/dashboard/account-management`,
        icon: Wrench,
      },
      {
        name: "Privacy & Preferences",
        url: `/dashboard/privacy-and-preferences`,
        icon: PieChart,
      },
      {
        name: "Support & Connections",
        url: `/dashboard/support-and-connections`,
        icon: Waypoints,
      },
    ],
  }

  const userEmail = data?.email
  const [selectedDisplayItems, setSelectedDisplayItems] = useState<string[]>([])

  useEffect(() => {
    if (typeof window !== "undefined" && userEmail) {
      const stored = localStorage.getItem(`sidebarDisplayItems_${userEmail}`)
      if (stored) {
        try {
          setSelectedDisplayItems(JSON.parse(stored))
        } catch {}
      } else {
        setSelectedDisplayItems([])
      }
    }
  }, [userEmail])

  // Determine which configuration to use based on user role
  const currentConfig = React.useMemo(() => {
    if (!data) return null

    if (data.isAdmin) {
      return sideBarConfigForAdmin
    } else if (data.isAgency) {
      return sideBarConfigForAgency
    } else {
      return sideBarConfigForUser
    }
  }, [data])

  // Don't render until we have auth data to avoid flashing
  if (isLoading || !mounted || !currentConfig) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarFooter>
          {/* Simple loading placeholder */}
          <div className="py-4">
            <div className="h-10 w-full animate-pulse rounded bg-secondary"></div>
          </div>
        </SidebarFooter>
        <SidebarContent>
          {/* Simple loading placeholder */}
          <div className="space-y-2 px-2 py-4">
            <div className="h-8 w-full animate-pulse rounded bg-secondary"></div>
            <div className="h-8 w-full animate-pulse rounded bg-secondary"></div>
          </div>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    )
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarFooter>
        <NavUser user={currentConfig.user} />
      </SidebarFooter>
      <SidebarContent>
        <NavMain projects={currentConfig.projects} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
