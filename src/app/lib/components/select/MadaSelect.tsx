import { FC } from "react"
import { cn } from "@/lib/utils"

type MadaSelectProps = React.SelectHTMLAttributes<HTMLSelectElement>

export const MadaSelect: FC<MadaSelectProps> = ({ className, ...props }) => {
  return (
    <select 
      className={cn(
        "w-full h-11 rounded-lg border border-gray-300 dark:border-gray-700",
        "focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 dark:focus:border-yellow-500",
        "bg-white dark:bg-gray-800",
        "text-gray-900 dark:text-gray-100",
        "px-3 py-2",
        "transition-all duration-200",
        "focus:outline-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )} 
      {...props} 
    />
  )
}
