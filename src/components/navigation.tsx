"use client";

import React from "react";
import Link from "next/link";
import { Icons } from "./icons";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
import { useSelectedLayoutSegment } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface NavProps {
  items: NavItem[];
  children?: React.ReactNode;
}

export default function Footer({ items }: NavProps) {
  const segment = useSelectedLayoutSegment();
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);

  return (
    <nav className="sticky max-w-7xl mx-auto top-0     z-40   w-full bg-background">
      <div className="flex py-3  px-4 gap-8 items-center">
        <div className="flex w-full items-center justify-start gap-12">
          <Link href="/" className="flex items-center space-x-2  ">
            <Icons.logo />
            <h1 className=" font-bold text-xl sm:inline-block">
              {siteConfig.name}
            </h1>
          </Link>
          {items?.length ? (
            <nav className="hidden gap-6 md:flex">
              {items?.map((item, index) => (
                <Link
                  key={index}
                  href={item.disabled ? "#" : item.href}
                  className={cn(
                    "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                    item.href.startsWith(`/${segment}`)
                      ? "text-foreground"
                      : "text-foreground/60",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>
        <div className="flex items-center gap-4">
          {" "}
          <Button>
              <Link href={"sign-in"}>
                  Sign In
              </Link>
          </Button>
          <Button>
              <Link href={"sign-up"}>
                  Sign Up
              </Link>
          </Button>
          <ModeToggle />
          <div className="md:hidden flex">
            <Drawer>
              <DrawerTrigger>
                <Icons.menu className="w-5 h-5" />
              </DrawerTrigger>
              <DrawerContent
                onOpenAutoFocus={(event) => {
                  event.preventDefault();
                }}
                className="max-w-2xl   transition-all ease-in-out w-full mx-auto"
              >
                <div className="bg-[#D9D9D9] h-[4px] w-24 -translate-y-3 self-center"></div>

                {items?.length ? (
                  <div className="flex flex-col items-center gap-4 py-4 ">
                    {items?.map((item, index) => (
                      <Link
                        key={index}
                        href={item.disabled ? "#" : item.href}
                        className={cn(
                          "flex items-center w-fit text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                          item.href.startsWith(`/${segment}`)
                            ? "text-foreground"
                            : "text-foreground/60",
                          item.disabled && "cursor-not-allowed opacity-80"
                        )}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </nav>
  );
}
