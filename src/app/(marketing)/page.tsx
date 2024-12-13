import React from "react";
import FAQSection from "@/components/faq";
import FeaturesSection from "@/components/features";
import HeroSection from "@/components/hero";
import SecondFeaturesSection from "@/components/second-features";
type Props = {};

export default function IndexPage({}: Props) {
  return (
    <div className=" relative max-w-7xl mx-auto ">
      {/* <HeroSection /> */}
      <SecondFeaturesSection />
      <FeaturesSection />
      <div className="mx-auto py-8">
        <FAQSection />
      </div>
    </div>
  );
}
