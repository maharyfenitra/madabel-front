import React from "react"
import { Button } from "@/components/ui/button"

type MadaButtonProps = React.ComponentProps<typeof Button>

export const MadaButton:React.FC<MadaButtonProps> = ({ children, ...props }) => {
  return (
    <Button className="w-full" {...props}>
      {children}
    </Button>
  )
}