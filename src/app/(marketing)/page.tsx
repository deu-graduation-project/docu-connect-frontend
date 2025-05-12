import React from "react"
import FAQSection from "@/components/landing-components/faq"
import FeaturesSection from "@/components/landing-components/features"
import HeroSection from "@/components/landing-components/hero"
import SecondFeaturesSection from "@/components/landing-components/second-features"
import CTA from "@/components/cta"
type Props = {}

export default function IndexPage({}: Props) {
  return (
    <div className="relative mx-auto max-w-7xl">
      <HeroSection />
      <SecondFeaturesSection />
      <FeaturesSection />
      <div className="mx-auto py-8">
        <FAQSection />
      </div>
      <CTA />
    </div>
  )
}
