import React from "react";
import FAQSection from "@/components/landing-components/faq";
import FeaturesSection from "@/components/landing-components/features";
import HeroSection from "@/components/landing-components/hero";
import SecondFeaturesSection from "@/components/landing-components/second-features";
type Props = {};

export default function IndexPage({}: Props) {
  return (
    <div className=" relative max-w-7xl mx-auto ">
      <HeroSection />
      <SecondFeaturesSection />
      <FeaturesSection />
      <div className="mx-auto py-8">
        <FAQSection />
      </div>
    </div>
  );
}
