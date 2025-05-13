import React from "react"
import FAQSection from "@/components/landing-components/faq"
import FeaturesSection from "@/components/landing-components/features"
import HeroSection from "@/components/landing-components/hero"
import SecondFeaturesSection from "@/components/landing-components/second-features"
import CTA from "@/components/cta"
import PlanFeature from "@/components/landing-components/plan-feature"
type Props = object;

export default function IndexPage({}: Props) {
  return (
    <div className="relative mx-auto max-w-7xl">
      <div id="hero-section">
        <HeroSection />
      </div>
      <div id="second-features-section">
        <SecondFeaturesSection />
      </div>
      <div id="features-section">
        <FeaturesSection />
      </div>
      <div id="plan-feature-section">
        <PlanFeature />
      </div>
      <div id="faq-section" className="mx-auto py-8">
        <FAQSection />
      </div>
      <div id="cta-section">
        <CTA />
      </div>
    </div>
  );
}
