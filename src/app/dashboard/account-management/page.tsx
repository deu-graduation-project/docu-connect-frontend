import React from "react";
import { Separator } from "@radix-ui/react-separator";
import { AccountForm } from "./components/forms/account-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppearanceForm } from "./components/forms/appearance.form";
import { DisplayForm } from "./components/forms/display-form";
import { NotificationsForm } from "./components/forms/notifications-form";
import { ProfileForm } from "./components/forms/profile-form";

export default function AccountManagement() {
  return (
    <div className="p-4 flex flex-col items-start max-w-7xl">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <div className="space-y-6 py-4">
            <div>
              <h3 className="text-lg font-medium">Account</h3>
              <p className="text-sm text-muted-foreground">
                Update your account settings. Set your preferred language and
                timezone.
              </p>
            </div>
            <Separator />
            <AccountForm />
          </div>
        </TabsContent>
        <TabsContent value="appearance">
          <div className="space-y-6 py-4">
            <div>
              <h3 className="text-lg font-medium">Appearance</h3>
              <p className="text-sm text-muted-foreground">
                Customize the appearance of the app. Automatically switch
                between day and night themes.
              </p>
            </div>
            <Separator />
            <AppearanceForm />
          </div>
        </TabsContent>
        <TabsContent value="notifications">
          <div className="space-y-6 py-4">
            <div>
              <h3 className="text-lg font-medium">Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Configure how you receive notifications.
              </p>
            </div>
            <Separator />
            <NotificationsForm />
          </div>
        </TabsContent>
        <TabsContent value="display">
          <div className="space-y-6 py-4">
            <div>
              <h3 className="text-lg font-medium">Display</h3>
              <p className="text-sm text-muted-foreground">
                Turn items on or off to control what&apos;s displayed in the
                app.
              </p>
            </div>
            <Separator />
            <DisplayForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
