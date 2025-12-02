"use client";

import { useMemo } from "react";

type Environment = "development" | "production";

const getEnvironment = (): Environment => {
  console.log("Current Environment:", process.env.NEXT_PUBLIC_APP_ENV);
  return process.env.NEXT_PUBLIC_APP_ENV === "production" ? "production" : "development";
};

const CONFIG = {
  development: {
    uri: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001",
    ur_socket: process.env.NEXT_PUBLIC_SOCKET_URL || "localhost:8001",
  },
  production: {
    uri: process.env.NEXT_PUBLIC_API_URL || "https://api-evaluation.madabel.com/",
    ur_socket: process.env.NEXT_PUBLIC_SOCKET_URL || "https://api-evaluation.madabel.com/",
  },
} as const;

export const useServerConfig = () => {
 
  const config = useMemo(() => {
    const env = getEnvironment();
    
    return CONFIG[env];
  }, []);

  return config;
};

// Export pour compatibilité avec le code existant
export const URL_CONFIG = CONFIG[getEnvironment()];
