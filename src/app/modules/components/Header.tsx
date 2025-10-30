"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { LucideMenu } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useHeader } from "../hooks/useHeader";

export const Header = () => {
    const {navItems, menuOpen, setMenuOpen} = useHeader()
  
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="text-xl font-bold">Madabel</div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-4">
          {navItems.map((item, index) => (
            <Link
              key={`${item.href}-${index}`}
              href={item.href}
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTitle></SheetTitle>
            <SheetTrigger asChild>
              <Button variant="ghost">
                <LucideMenu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-4">
              <VisuallyHidden>
                <h2>Mobile Menu</h2>
              </VisuallyHidden>
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-gray-700 hover:text-gray-900 font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
