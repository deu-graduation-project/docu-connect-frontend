import { Icons } from "@/components/icons";

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
} & (
  | {
      href: string;
      items?: never;
    }
  | {
      href?: string;
      items: NavItem[];
    }
);

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
  };
};

export type MarketingConfig = {
  mainNav: MainNavItem[];
};

export type DashboardConfig = {
  mainNav: MainNavItem[];
  footerNav: FooterItem[];
};

export type PublicMainConfig = {
  faq: FaqItem[];
};

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
export interface SucceededMessageResponse {
  succeeded: boolean;
  message: string;
}