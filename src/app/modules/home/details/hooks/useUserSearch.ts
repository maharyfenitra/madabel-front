import { useState, useEffect } from "react";
import { useGenericQuery } from "@/app/lib/api";
import { formatDataFromQuery } from "@/app/lib/api";

export type UserSuggestion = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  post?: string;
  role: string;
};

export const useUserSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [suggestionsText, setSuggestionsText] = useState<string[]>([]);

  // Debounce the search query to avoid too many API calls

  const { data, isLoading, refetch } = useGenericQuery(
    (raw) => formatDataFromQuery(raw),
    "/users/search/",
    "userSearch",
    { q: searchQuery }
  );

  useEffect(() => {
    refetch();
    console.log("User Search Data:", data);
    setSuggestions(data?.users || []);
    setSuggestionsText(
      suggestions.map((user) => `${user.name} (${user.email})`)
    );

    console.log("User Search Data:", suggestions);

    return;
  }, [searchQuery]);

  
  return {
    searchQuery,
    setSearchQuery,
    suggestions,
    suggestionsText,
    isLoading,
  };
};
