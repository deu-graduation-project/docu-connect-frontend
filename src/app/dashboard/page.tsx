import { AppSidebar } from "@/components/app-sidebar";
import { getToken } from "@/services/cookies";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ProfilePage from "./profile/page";

export default function Page() {
  return (
    <div className="max-h-screen flex p-4 items-center w-full mx-auto">
      <div className="flex flex-1  flex-col gap-4  pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video animate-pulse rounded-xl bg-muted/50" />
          <div className="aspect-video animate-pulse  rounded-xl bg-muted/50" />
          <div className="aspect-video animate-pulse  rounded-xl bg-muted/50" />
        </div>
        <div className="max-h-[500px] h-full mb-2 aspect-video animate-pulse  rounded-xl bg-muted/50"></div>
      </div>
    </div>
  );
}
