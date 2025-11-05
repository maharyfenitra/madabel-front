"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

type AutocompleteSearchProps = {
  data?: string[];
  onSelect?: (value: string) => void;
  handleChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">;

export function AutocompleteSearch({
  data = [],
  onSelect,
  placeholder = "Rechercher...",
  handleChange,
  className,
  ...props
}: AutocompleteSearchProps) {
  const [search, setSearch] = React.useState("");

  const filtered = data.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (item: string) => {
    setSearch(item);
    onSelect?.(item);
  };

  return (
    <div className={cn("relative w-[250px]", className)}>
      <Command>
        <CommandInput
          placeholder={placeholder}
          value={search}
          onValueChange={(value: string) => { setSearch(value); handleChange?.(value); }}
          {...props}
        />
      </Command>

      {search.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <Command>
            <CommandEmpty>Aucun résultat.</CommandEmpty>
            <CommandGroup>
              {filtered.map((item) => (
                <CommandItem key={item} onSelect={() => handleSelect(item)}>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      search === item ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </div>
      )}
    </div>
  );
}
