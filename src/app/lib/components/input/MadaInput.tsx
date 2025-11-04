import { Input } from "@/components/ui/input"
import { FC } from "react"
import { cn } from "@/lib/utils"

type MadaInputProps = React.ComponentProps<typeof Input>

export const MadaInput: FC<MadaInputProps> = ({ className, ...props }) => {
  return (
    <Input 
      className={cn(
        "w-full h-11 rounded-lg border-gray-300 dark:border-gray-700",
        "focus:border-yellow-500 focus:ring-yellow-500 dark:focus:border-yellow-500",
        "bg-white dark:bg-gray-800",
        "transition-all duration-200",
        className
      )} 
      {...props} 
    />
  )
}
