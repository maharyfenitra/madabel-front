"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Separator } from "@/components/ui/separator";
import { useHeader } from "../hooks/useHeader";
import { cn } from "@/lib/utils";

export const Header = () => {
  const { navItems, menuOpen, setMenuOpen, isActiveRoute } = useHeader();

  const regularNavItems = navItems.filter((item) => !item.isLogout);
  const logoutItem = navItems.find((item) => item.isLogout);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/modules/home" 
            className="flex items-center space-x-2 group transition-transform hover:scale-105"
          >
            <div className="relative">
              <Image
                src="/Logo-couleurs-Madabel.webp"
                alt="Madabel Logo"
                width={130}
                height={45}
                priority
                className="h-10 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-1">
            {regularNavItems.map((item) => {
              const isActive = isActiveRoute(item.href);
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-yellow-500 text-black shadow-md"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  <Icon className={cn(
                    "w-4 h-4 transition-transform",
                    isActive && "scale-110"
                  )} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {logoutItem && (() => {
              const LogoutIcon = logoutItem.icon;
              return (
                <>
                  <Separator orientation="vertical" className="h-6 mx-2" />
                  <Link
                    href={logoutItem.href}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all duration-200"
                  >
                    <LogoutIcon className="w-4 h-4" />
                    <span>{logoutItem.label}</span>
                  </Link>
                </>
              );
            })()}
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Menu className="h-6 w-6" />
                  <VisuallyHidden>Ouvrir le menu</VisuallyHidden>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 sm:w-96">
                <SheetHeader>
                  <SheetTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Menu
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-2 mt-6">
                  {regularNavItems.map((item) => {
                    const isActive = isActiveRoute(item.href);
                    const Icon = item.icon;
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200",
                          isActive
                            ? "bg-yellow-500 text-black shadow-md"
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                        )}
                      >
                        <Icon className={cn(
                          "w-5 h-5",
                          isActive && "scale-110"
                        )} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}

                  {logoutItem && (() => {
                    const LogoutIcon = logoutItem.icon;
                    return (
                      <>
                        <Separator className="my-2" />
                        <Link
                          href={logoutItem.href}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all duration-200"
                        >
                          <LogoutIcon className="w-5 h-5" />
                          <span>{logoutItem.label}</span>
                        </Link>
                      </>
                    );
                  })()}
                </nav>

                {/* Footer du menu mobile */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Image
                      src="/Logo-couleurs-Madabel.webp"
                      alt="Madabel"
                      width={100}
                      height={30}
                      className="h-6 w-auto object-contain opacity-60"
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
