import { useEffect, useState } from "react";
import { useAccessToken, useRefreshToken, useCurrentUser } from "../../lib/api";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Users,
  FileQuestion,
  ActivityIcon,
  User,
  LogOut,
  FileText,
  Settings,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isLogout?: boolean;
};

export const useHeader = () => {
  const { getAccessToken } = useAccessToken();
  const { getRefreshToken } = useRefreshToken();
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  // default nav items (server-safe initial state)
  const defaultNavItems: NavItem[] = [
    { label: "Home", href: "/modules/home", icon: Home },
    { label: "Utilisateurs", href: "/modules/users", icon: Users },
    { label: "Quizzes", href: "/modules/quizzes", icon: FileQuestion },
    {
      label: "Mes évaluations",
      href: "/modules/evaluations",
      icon: ActivityIcon,
    },
    {
      label: "Rapports",
      href: "/modules/reports",
      icon: FileText,
    },
    { label: "Configuration", href: "/modules/config", icon: Settings },
    { label: "Profile", href: "/modules/profiles", icon: User },
    {
      label: "Se déconnecter",
      href: "/auth/logout",
      icon: LogOut,
      isLogout: true,
    },
  ];

  const [navItems, setNavItems] = useState<NavItem[]>(defaultNavItems);

  useEffect(() => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    if (!accessToken || !refreshToken) {
      router.push("/auth/login");
      return;
    }

    // update nav items based on current user after mount to avoid hydration mismatch
    const { getUser } = useCurrentUser();
    const currentUser = getUser();

    if (currentUser && currentUser.role === "EVALUATOR") {
      setNavItems([
        {
          label: "Mes évaluations",
          href: "/modules/evaluations",
          icon: ActivityIcon,
        },
        { label: "Profile", href: "/modules/profiles", icon: User },
        {
          label: "Se déconnecter",
          href: "/auth/logout",
          icon: LogOut,
          isLogout: true,
        },
      ]);
    } else if (currentUser && currentUser.role === "CANDIDAT") {
      setNavItems([
        {
          label: "Mes évaluations",
          href: "/modules/evaluations",
          icon: ActivityIcon,
        },
        { label: "Profile", href: "/modules/profiles", icon: User },
        {
          label: "Se déconnecter",
          href: "/auth/logout",
          icon: LogOut,
          isLogout: true,
        },
      ]);
    }
  }, []);

  const isActiveRoute = (href: string) => {
    if (href === "/modules/home") {
      return pathname === "/modules/home" || pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  return { navItems, menuOpen, setMenuOpen, isActiveRoute, pathname };
};
