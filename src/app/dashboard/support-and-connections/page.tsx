"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // Utility for classnames
import Link from "next/link";
import { columns } from "../analytics/components/recent-activity-table";
export default function SupportAndConnectionsPage() {
  return (
    <div className="flex flex-col p-4 items-start ">
      <h1 className="text-4xl font-semibold">Contact</h1>
      <p className="text-muted-foreground pt-1">
        Contact us for any questions or concerns about DocuConnect.
      </p>
      <div className="w-full h-[1px] bg-secondary my-12 max-w-7xl"></div>
      <div className="flex flex-col items-start">
        <p className="text-base ">
          If you have any questions or concerns about DocuConnect, please
          contact us using one of the methods below. We will try to respond as
          soon as possible.
        </p>
        <h2 className="text-2xl pt-10 font-semibold">Contact Information</h2>
        <div className="w-full h-[1px] bg-secondary mt-3 max-w-7xl">
          <div className="flex flex-col gap-4 py-4">
            <div aria-label="email contact" className="flex">
              <p className="font-semibold">
                <span className="mx-2">•</span>
                Email:{" "}
              </p>
              <div className="w-2"></div>
              <Link href="mailto:docuconnect@gmail.com" passHref>
                <p className="text-primary  underline">docuconnect@gmail.com</p>
              </Link>
            </div>

            <div aria-label="twitter contact" className="flex">
              <p className="font-semibold">
                {" "}
                <span className="mx-2">•</span>
                Twitter:{" "}
              </p>
              <div className="w-2"></div>
              <Link href="https://twitter.com/docuconnect" passHref>
                <p className="text-primary underline ">@docuconnect</p>
              </Link>
            </div>

            <div aria-label="linkedin contact" className="flex">
              <p className="font-semibold">
                {" "}
                <span className="mx-2">•</span>
                Linkedin:{" "}
              </p>
              <div className="w-2"></div>
              <Link href="https://www.linkedin.com/" passHref>
                <p className="text-primary  underline">docuconnect</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
