import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { publicMainConfig } from "@/config/main-public";
import { FaqItem } from "@/types";
type Props = {};

export default function FAQSection({}: Props) {
  return (
    <div className="px-6">
      <h1 className="  text-3xl font-semibold text-center pb-4">
        Frequently Asked Questions
      </h1>
      <p className="text-center text-muted-foreground text-base pb-4">
        Your Questions, Answered. Learn More About How DocuConnect Works for
        Users and Agencies.
      </p>
      <Accordion type="single" collapsible>
        {publicMainConfig.faq.map((item: FaqItem) => (
          <AccordionItem className="py-2" key={item.id} value={item.id}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
