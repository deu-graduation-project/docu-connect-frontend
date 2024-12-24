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

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
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
      url: `/dashboard/privacy`,
      icon: PieChart,
    },
    {
      name: "Analytics",
      url: `/dashboard/analytics`,
      icon: ChartArea,
    },
    {
      name: "Support & Connections",
      url: `/dashboard/support`,
      icon: Waypoints,
    },
    {
      name: "Account Management",
      url: `/dashboard/account`,
      icon: Wrench,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarContent>
        <NavMain projects={data.projects} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
