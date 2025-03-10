"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  User,
  SquareActivity,
  ChartArea,
  Waypoints,
  Wrench,
} from "lucide-react";

import { NavMain } from "./nav-main";
import useAuthStatus from "@/lib/queries/auth-status";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, isLoading, error } = useAuthStatus();

  const sideBarConfig = {
    user: {
      name: "kullanıcı adı",
      email: "mail@example.com",
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
    ],
  };

  const sideBarConfigForAdmin = {
    user: {
      name: "kullanıcı adı",
      email: "",
    },
    navMain: [],
    projects: [
      {
        name: "Agency Requests",
        url: `/dashboard/agency-requests`,
        icon: Bot,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarFooter>
        <NavUser user={sideBarConfig.user} />
      </SidebarFooter>
      <SidebarContent>
        <NavMain
          projects={
            data?.isAdmin
              ? sideBarConfigForAdmin.projects
              : sideBarConfig.projects
          }
        />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
