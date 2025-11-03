import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MadaButtonProps = React.ComponentProps<typeof Button>;

/**
 * Bouton Madabel générique avec variant personnalisable
 */
export const MadaButton: React.FC<MadaButtonProps> = ({
  children,
  variant = "default",
  className,
  ...props
}) => {
  return (
    <Button
      variant={variant}
      className={cn(
        variant === "default" && "bg-yellow-500 text-black hover:bg-yellow-600",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};
