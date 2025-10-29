import { Label } from "@/components/ui/label"
import { FC } from "react"

type MadaLabelProps = React.ComponentProps<typeof Label>

export const MadaLabel: FC<MadaLabelProps> = ({ children, ...props }) => {
  return (
    <Label className="font-medium text-gray-700" {...props}>
      {children}
    </Label>
  )
}
