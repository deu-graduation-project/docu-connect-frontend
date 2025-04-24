"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils" // Utility for classnames
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select"
import AgencyList from "./components/agency-list"
export default function Agencies() {
  return (
    <div className="flex flex-col items-start p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold">
          Explore the current agencies{" "}
        </h1>
        <p className="pt-1 text-muted-foreground">
          Browse through a curated list of agencies to find the perfect match
          for your requirements.
        </p>
      </div>
      <div className="my-12 h-[1px] w-full max-w-7xl bg-secondary">
        <div className="flex items-center justify-start gap-4 py-4">
          {/* cities */}
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Cities</SelectLabel>
                <SelectItem value="istanbul">Istanbul</SelectItem>
                <SelectItem value="ankara">Ankara</SelectItem>
                <SelectItem value="izmir">Izmir</SelectItem>
                <SelectItem value="antalya">Antalya</SelectItem>
                <SelectItem value="bursa">Bursa</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* district */}
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a district" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Districts</SelectLabel>
                <SelectItem value="istanbul">Istanbul</SelectItem>
                <SelectItem value="ankara">Ankara</SelectItem>
                <SelectItem value="izmir">Izmir</SelectItem>
                <SelectItem value="antalya">Antalya</SelectItem>
                <SelectItem value="bursa">Bursa</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* district */}
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select the rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Ratings</SelectLabel>
                <SelectItem value="istanbul">Istanbul</SelectItem>
                <SelectItem value="ankara">Ankara</SelectItem>
                <SelectItem value="izmir">Izmir</SelectItem>
                <SelectItem value="antalya">Antalya</SelectItem>
                <SelectItem value="bursa">Bursa</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="">
          <AgencyList />
        </div>
      </div>
    </div>
  )
}
