import { useEffect, useState } from "react";
import { useAccessToken, useRefreshToken } from "../../lib/api";
import { useRouter, usePathname } from "next/navigation";
import { 
  Home, 
  Users, 
  FileQuestion, 
  User, 
  LogOut 
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

  useEffect(() => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    if (!accessToken || !refreshToken) {
      router.push("/auth/login");
    }
  }, []);

  const navItems: NavItem[] = [
    { label: "Home", href: "/modules/home", icon: Home },
    { label: "Utilisateurs", href: "/modules/users", icon: Users },
    { label: "Quizzes", href: "/modules/quizzes", icon: FileQuestion },
    { label: "Profile", href: "/profile", icon: User },
    { label: "Se déconnecter", href: "/auth/logout", icon: LogOut, isLogout: true },
  ];

  const isActiveRoute = (href: string) => {
    if (href === "/modules/home") {
      return pathname === "/modules/home" || pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  return { navItems, menuOpen, setMenuOpen, isActiveRoute, pathname };
};
