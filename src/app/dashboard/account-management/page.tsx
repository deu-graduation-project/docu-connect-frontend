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
    <div className="p-4 md:p-8 lg:p-12 max-w-5xl mx-auto grid gap-10 text-left">
      <div className="flex flex-col gap-6 text-left">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6">
          Account Management
        </h1>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <TabsTrigger value="account" className="text-sm md:text-base">
            Account
          </TabsTrigger>
          <TabsTrigger value="appearance" className="text-sm md:text-base">
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-sm md:text-base">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="display" className="text-sm md:text-base">
            Display
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <div className="space-y-8 py-6 text-left">
            <div>
              <h3 className="text-lg font-medium mb-2">Account</h3>
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
          <div className="space-y-8 py-6 text-left">
            <div>
              <h3 className="text-lg font-medium mb-2">Appearance</h3>
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
          <div className="space-y-8 py-6 text-left">
            <div>
              <h3 className="text-lg font-medium mb-2">Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Configure how you receive notifications.
              </p>
            </div>
            <Separator />
            <NotificationsForm />
          </div>
        </TabsContent>

        <TabsContent value="display">
          <div className="space-y-8 py-6 text-left">
            <div>
              <h3 className="text-lg font-medium mb-2">Display</h3>
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
