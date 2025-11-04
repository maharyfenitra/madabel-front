import { Label } from "@/components/ui/label"
import { FC } from "react"
import { cn } from "@/lib/utils"

type MadaLabelProps = React.ComponentProps<typeof Label>

export const MadaLabel: FC<MadaLabelProps> = ({ children, className, ...props }) => {
  return (
    <Label 
      className={cn(
        "font-semibold text-sm text-gray-900 dark:text-gray-100",
        "mb-1.5 block",
        className
      )} 
      {...props}
    >
      {children}
    </Label>
  )
}
