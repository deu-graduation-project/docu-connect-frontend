"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils" // Utility for classnames
import Link from "next/link"
import { columns } from "../analytics/components/recent-activity-table"
import CTA from "@/components/cta"
export default function SupportAndConnectionsPage() {
  return (
    <div className="grid w-full max-w-5xl items-start gap-10 p-4 md:p-8 lg:p-12">
      <h1 className="mb-6 text-left text-xl font-bold md:text-2xl lg:text-3xl">
        Support & Connections
      </h1>
      <div className="flex flex-col items-start">
        <p className="text-base">
          If you have any questions or concerns about DocuConnect, please
          contact us using one of the methods below. We will try to respond as
          soon as possible.
        </p>
        <h2 className="pt-10 text-2xl font-semibold">Contact Information</h2>
        <div className="mt-3 h-[1px] w-full max-w-7xl bg-secondary">
          <div className="flex flex-col gap-4 py-4">
            <div aria-label="email contact" className="flex">
              <p className="font-semibold">
                <span className="mx-2">•</span>
                Email:{" "}
              </p>
              <div className="w-2"></div>
              <Link href="mailto:docuconnect@gmail.com" passHref>
                <p className="text-primary underline">docuconnect@gmail.com</p>
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
                <p className="text-primary underline">@docuconnect</p>
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
                <p className="text-primary underline">docuconnect</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
