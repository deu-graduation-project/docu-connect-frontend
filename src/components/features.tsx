import {
  Code,
  DollarSign,
  Cloud,
  Users,
  HelpCircle,
  Shield,
  Heart,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function FeaturesSection() {
  const features = [
    {
      title: "Developer-Friendly",
      description:
        "Seamlessly integrates with agency workflows and developer tools.",
      icon: <Code size={30} className="text-primary" />,
    },
    {
      title: "User-Friendly Design",
      description: "A clean, intuitive interface for users and agencies alike.",
      icon: <Settings size={30} className="text-primary" />,
    },
    {
      title: "Transparent Pricing",
      description: "Affordable rates with no hidden fees or surprises.",
      icon: <DollarSign size={30} className="text-primary" />,
    },
    {
      title: "Reliable Uptime",
      description:
        "Available 24/7 so users and agencies can always access their information.",
      icon: <Cloud size={30} className="text-primary" />,
    },
    {
      title: "Multi-User Collaboration",
      description: "Easily collaborate on documents within the platform.",
      icon: <Users size={30} className="text-primary" />,
    },
    {
      title: "Comprehensive Support",
      description: "Assistance is just a message away—any time, any day.",
      icon: <HelpCircle size={30} className="text-primary" />,
    },
    {
      title: "Satisfaction Guarantee",
      description: "Love the platform or receive a full refund within 30 days.",
      icon: <Shield size={30} className="text-primary" />,
    },
    {
      title: "Inclusive Features",
      description:
        "Tools for both individuals and agencies to maximize impact.",
      icon: <Heart size={30} className="text-primary" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <div
          key={feature.title}
          className={cn(
            "flex flex-col border  lg:border-r py-10 relative group/feature  border-secondary",
            (index === 0 || index === 4) &&
              "lg:border-l dark:border-neutral-800",
            index < 4 && "lg:border-b border-secondary",
            (index === 6 || index === 7) && "border-b-0 lg:border-b",
            (index === 0 || index === 1) && "border-t-0 lg:border-t"
          )}
        >
          {index < 4 && (
            <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
          )}
          {index >= 4 && (
            <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
          )}
          <div className="mb-4 relative z-10 px-10 text-primary ">
            {feature.icon}
          </div>
          <div className="text-lg font-bold mb-2 relative z-10 px-10">
            <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-muted-foreground transition-all duration-200 origin-center" />
            <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-primary">
              {feature.title}
            </span>
          </div>
          <p className="text-sm  text-muted-foreground  max-w-xs relative z-10 px-10">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
