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

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data } = useAuthStatus()

  const sideBarConfigForAgency = {
    user: {
      name: `${data?.name} ${data?.surname}` || "kullanıcı adı",
      email: `${data?.email}` || "kullanıcı emaili",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [],
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
      name: `${data?.name} ${data?.surname}` || "kullanıcı adı",
      email: `${data?.email}` || "kullanıcı emaili",
    },
    navMain: [],
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
      name: `${data?.name} ${data?.surname}` || "kullanıcı adı",
      email: `${data?.email}` || "kullanıcı emaili",
    },
    navMain: [],
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

  // Sidebar'da gösterilecek ek menüler (DisplayForm'daki seçenekler)
  const displaySidebarItems = [
    { name: "Recents", url: "/dashboard/recents", icon: Frame, id: "recents" },
    { name: "Home", url: "/dashboard/home", icon: Landmark, id: "home" },
    { name: "Applications", url: "/dashboard/applications", icon: Command, id: "applications" },
    { name: "Desktop", url: "/dashboard/desktop", icon: SquareTerminal, id: "desktop" },
    { name: "Downloads", url: "/dashboard/downloads", icon: GalleryVerticalEnd, id: "downloads" },
    { name: "Documents", url: "/dashboard/documents", icon: BookOpen, id: "documents" },
  ];

  const userEmail = data?.email;
  const [selectedDisplayItems, setSelectedDisplayItems] = useState<string[]>([]);
  useEffect(() => {
    if (typeof window !== "undefined" && userEmail) {
      const stored = localStorage.getItem(`sidebarDisplayItems_${userEmail}`);
      if (stored) {
        try {
          setSelectedDisplayItems(JSON.parse(stored));
        } catch {}
      } else {
        setSelectedDisplayItems([]);
      }
    }
  }, [userEmail]);

  // Kullanıcıya göre ana menüleri seç
  const baseProjects = data?.isAdmin
    ? sideBarConfigForAdmin.projects
    : data?.isAgency
    ? sideBarConfigForAgency.projects
    : sideBarConfigForUser.projects;

  // DisplayForm'dan seçilenleri ekle
  const dynamicProjects = [
    ...baseProjects,
    ...displaySidebarItems.filter((item) => selectedDisplayItems.includes(item.id)),
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarFooter>
        <NavUser user={sideBarConfigForAgency.user} />
      </SidebarFooter>
      <SidebarContent>
        <NavMain projects={dynamicProjects} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
