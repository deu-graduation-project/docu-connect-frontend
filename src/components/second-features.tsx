import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  ClipboardCopy,
  FileArchive,
  SignatureIcon,
  TableColumnsSplit,
} from "lucide-react";
import Image from "next/image";

export default function SecondFeaturesSection() {
  return (
    <BentoGrid className="max-w-7xl px-5 xl:px-0 mx-auto md:auto-rows-[23rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={item.className}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}
const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl   dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black"></div>
);
const items = [
  {
    title: "Print and Share Instantly",
    description:
      "Effortlessly connect with copy centers for fast and reliable document printing.",
    header: (
      <Image
        width={400}
        height={400}
        src={"/features_img_5.webp"}
        alt="Instant Printing"
        className="object-cover w-full h-auto rounded-lg max-h-64 md:max-h-60"
      />
    ),
    className: "md:col-span-2 w-full",
    icon: <ClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Digital Library Access",
    description:
      "Build and browse a personal library of shared knowledge and notes.",
    header: (
      <Image
        width={400}
        height={400}
        src={"/features_img_2.webp"}
        alt="Digital Library"
        className="max-h-[750px] md:max-h-60 w-full rounded-lg  object-cover"
      />
    ),
    className: "md:col-span-1",
    icon: <TableColumnsSplit className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Customizable Print Options",
    description: "Edit and prepare your documents to reduce printing costs.",
    header: (
      <Image
        width={400}
        height={400}
        src={"/features_img_3.webp"}
        alt="Custom Print Options"
        className="max-h-[500px] w-full md:max-h-60 rounded-lg object-cover"
      />
    ),
    className: "md:col-span-1",
    icon: <FileArchive className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Seamless Communication",
    description:
      "Directly connect with agencies for real-time updates and support.",
    header: (
      <Image
        width={400}
        height={400}
        src={"/features_img_4.webp"}
        alt="Real-time Communication"
        className="max-h-[400px] md:max-h-60 w-full rounded-lg object-cover"
      />
    ),
    className: "md:col-span-2",
    icon: <SignatureIcon className="h-4 w-4 text-neutral-500" />,
  },
];
