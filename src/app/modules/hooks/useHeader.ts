import { useEffect, useState } from "react";
import { useAccessToken, useRefreshToken } from "../../lib/api";
import { useRouter } from "next/navigation";

export const useHeader = () => {
  const { getAccessToken } = useAccessToken();
  const { getRefreshToken } = useRefreshToken();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    if (!accessToken || !refreshToken) {
      router.push("/auth/login");
    }
  }, []);

  const navItems = [
    { label: "Home", href: "/modules/home" },
    { label: "Utilisateurs", href: "/modules/users" },
    { label: "Profile", href: "/profile" },
    { label: "Se déconnecter", href: "/auth/logout" },
  ];
  return { navItems, menuOpen, setMenuOpen };
};
