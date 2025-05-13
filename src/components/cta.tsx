"use client"

import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CardCTAProps {
  title?: string
  description?: string
  buttonText?: string
  buttonLink?: string
  buttonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
  className?: string
  icon?: React.ReactNode
}

const CardCTA: React.FC<CardCTAProps> = ({
  title = "Ready to Get Started?",
  description = "Take the next step and explore our services today.",
  buttonText = "Learn More",
  buttonLink = "/sign-in",
  buttonVariant = "default",
  className = "",
  icon = null,
}) => {
  return (
    <div className="relative mx-auto w-full max-w-7xl p-1 px-4">
      {/* Grid background moved outside the card */}

      <Card
        className={`relative z-0 mx-auto w-full overflow-hidden border-2 border-t-[2px] border-primary/10 bg-background/90 px-6 py-12 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${className}`}
      >
        <div className="absolute inset-0 z-10 overflow-hidden bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:55px_55px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_160%)]"></div>
        <CardHeader className="flex flex-col items-center justify-center space-y-4 overflow-hidden text-center">
          {icon && <div className="mb-4 text-primary">{icon}</div>}
          <CardTitle className="z-40 text-3xl font-bold">{title}</CardTitle>
          <CardDescription className="z-40 max-w-2xl text-center text-base">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-40 mt-6 flex flex-col items-center justify-center text-center">
          <Button asChild variant={buttonVariant} size="lg" className="group">
            <Link href={buttonLink}>
              {buttonText}
              <ArrowRight
                className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default CardCTA
