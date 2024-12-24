"use client";
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Lock, Bell, User, Shield, Download, Trash } from "lucide-react";

export default function PrivacyPreferencesPage() {
  const [notesPublic, setNotesPublic] = useState(true);
  const [searchable, setSearchable] = useState(true);
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    engagement: true,
  });
  const [visibility, setVisibility] = useState("public");
  const [notificationFrequency, setNotificationFrequency] = useState("Instant");

  const handleSave = () => alert("Changes Saved!");
  const handleReset = () => {
    setNotesPublic(true);
    setSearchable(true);
    setNotifications({
      orderUpdates: true,
      promotions: false,
      engagement: true,
    });
    setVisibility("public");
    setNotificationFrequency("Instant");
  };

  return (
    <div className="container max-w-5xl  h-full px-4  py-10 space-y-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Privacy and Preferences</h1>
        <p className="text-muted-foreground">
          Manage how your account, notes, and notifications behave.
        </p>
      </div>

      {/* Notes Privacy Section */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Lock className="w-5 h-5 translate-y-1" />
          <CardTitle className="text-xl">Notes Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <span>Make all uploaded notes public by default</span>
            <Switch checked={notesPublic} onCheckedChange={setNotesPublic} />
          </div>

          <div className="flex justify-between items-center">
            <span>Allow uploaded notes to appear in search results</span>
            <Switch checked={searchable} onCheckedChange={setSearchable} />
          </div>

          {/* <Button variant="outline">Bulk Edit Notes Visibility</Button> */}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Bell className="w-5 h-5 translate-y-1" />
          <CardTitle className="text-xl">Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className=" items-center flex gap-2">
            <Checkbox
              checked={notifications.orderUpdates}
              onCheckedChange={(val) =>
                setNotifications({ ...notifications, orderUpdates: val })
              }
            />
            <span>Order Updates (Processing, Ready, Delivered)</span>
          </div>

          <div className=" items-center flex gap-2">
            <Checkbox
              checked={notifications.promotions}
              onCheckedChange={(val) =>
                setNotifications({ ...notifications, promotions: val })
              }
            />
            <span>New Features & Promotions</span>
          </div>

          <div className=" items-center flex gap-2">
            <Checkbox
              checked={notifications.engagement}
              onCheckedChange={(val) =>
                setNotifications({ ...notifications, engagement: val })
              }
            />
            <span>Engagement Alerts (Downloads, Likes)</span>
          </div>

          {/* <div className="flex items-center gap-4 mt-6">
            <span>Notification Frequency</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{notificationFrequency}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {["Instant", "Daily Digest", "Weekly"].map((freq) => (
                  <DropdownMenuItem
                    key={freq}
                    onClick={() => setNotificationFrequency(freq)}
                  >
                    {freq}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div> */}
        </CardContent>
      </Card>

      {/* Profile Privacy */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <User className="w-5 h-5 translate-y-1" />
          <CardTitle className="text-xl">Profile Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <span>Profile Visibility</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{visibility}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setVisibility("public")}>
                  Public
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setVisibility("private")}>
                  Private
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex justify-between items-center">
            <span>Anonymous Mode for orders</span>
            <Switch />
          </div>

          {/* <Button variant="outline">Manage Blocked Agencies</Button> */}
        </CardContent>
      </Card>

      {/* Security and Data */}
      <Card className="flex items-center   justify-between">
        <CardHeader className="flex flex-row h-full items-center gap-2">
          <Shield className="w-5 h-5 translate-y-1" />
          <CardTitle className="text-xl">Security and Data</CardTitle>
        </CardHeader>
        <CardContent className=" gap-4 py-0 justify-center items-center h-full  flex">
          <Button variant="outline" className="flex items-center  gap-2">
            <Download className="w-5 h-5" />
            Download My Data
          </Button>

          <Button variant="destructive" className="flex items-center gap-2">
            <Trash className="w-5 h-5" />
            Delete Account
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4 mt-12">
        <Button className="h-[42px]" variant="outline" onClick={handleReset}>
          Reset to Default
        </Button>
        <Button variant="default" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
