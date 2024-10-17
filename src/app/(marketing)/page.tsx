import React from "react";
import FAQSection from "@/components/faq";
import FeaturesSection from "@/components/features";
type Props = {};

export default function IndexPage({}: Props) {
  return (
    <div className="min-h-screen  max-w-7xl mx-auto ">
      <FeaturesSection />
      <div className="max-w-4xl mx-auto py-8">
        <FAQSection />
      </div>
    </div>
  );
}
