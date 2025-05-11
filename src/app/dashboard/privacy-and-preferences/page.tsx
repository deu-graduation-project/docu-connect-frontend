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
import { Lock, Bell } from "lucide-react";

export default function PrivacyPreferencesPage() {
  const [notesPublic, setNotesPublic] = useState(true);
  const [searchable, setSearchable] = useState(true);
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    engagement: true,
  });

  const handleSave = () => alert("Changes Saved!");
  const handleReset = () => {
    setNotesPublic(true);
    setSearchable(true);
    setNotifications({
      orderUpdates: true,
      promotions: false,
      engagement: true,
    });
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-5xl mx-auto grid gap-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">
          Privacy & Preferences
        </h1>
        <p className="text-muted-foreground">
          Manage how your account, notes, and notifications behave.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notes Privacy Section */}
        <Card className="h-full">
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
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center gap-4">
            <Bell className="w-5 h-5 translate-y-1" />
            <CardTitle className="text-xl">Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={notifications.orderUpdates}
                onCheckedChange={(val) =>
                  setNotifications({
                    ...notifications,
                    orderUpdates: val as boolean,
                  })
                }
              />
              <span>Order Updates (Processing, Ready, Delivered)</span>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={notifications.promotions}
                onCheckedChange={(val) =>
                  setNotifications({
                    ...notifications,
                    promotions: val as boolean,
                  })
                }
              />
              <span>New Features & Promotions</span>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={notifications.engagement}
                onCheckedChange={(val) =>
                  setNotifications({
                    ...notifications,
                    engagement: val as boolean,
                  })
                }
              />
              <span>Engagement Alerts (Downloads, Likes)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
