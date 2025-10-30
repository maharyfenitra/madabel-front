"use client";

import { Header } from "./components/Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-4">{children}</main>
    </div>
  );
};

export default MainLayout;
