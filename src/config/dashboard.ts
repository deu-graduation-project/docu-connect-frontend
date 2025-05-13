import { DashboardConfig, FooterItem } from "../types";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Home",
      href: "/#hero-section",
    },
    {
      title: "Features",
      href: "/#features-section",
    },
    {
      title: "Pricing",
      href: "/pricing",
    },
    
  ],
  footerNav: [
    {
      title: "Product",
      items: [
        {
          title: "Features",
          href: "/#features-section",
          external: false,
        },
        {
          title: "Pricing",
          href: "/pricing",
          external: false,
        },
        {
          title: "How It Works",
          href: "/how-it-works",
          external: false,
        },
        {
          title: "FAQs",
          href: "/#faq-section",
          external: false,
        },
      ],
    },
    {
      title: "Company",
      items: [
        {
          title: "About Us",
          href: "/about",
          external: false,
        },
        {
          title: "Blog",
          href: "/blog",
          external: false,
        },
        {
          title: "Careers",
          href: "/careers",
          external: false,
        },
        {
          title: "Contact",
          href: "/contact",
          external: false,
        },
      ],
    },
    {
      title: "Legal",
      items: [
        {
          title: "Terms of Service",
          href: "/terms",
          external: false,
        },
        {
          title: "Privacy Policy",
          href: "/privacy",
          external: false,
        },
        {
          title: "Cookie Policy",
          href: "/cookie-policy",
          external: false,
        },
        {
          title: "Accessibility",
          href: "/accessibility",
          external: false,
        },
      ],
    },
    {
      title: "Social",
      items: [
        {
          title: "Twitter",
          href: "https://twitter.com/docuconnect",
          external: true,
        },
        {
          title: "GitHub",
          href: "#",
          external: true,
        },
        {
          title: "LinkedIn",
          href: "https://www.linkedin.com/company/docuconnect",
          external: true,
        },
        {
          title: "Instagram",
          href: "https://www.instagram.com/docuconnect",
          external: true,
        },
      ],
    },
  ] satisfies FooterItem[],
};
