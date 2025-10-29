import { Input } from "@/components/ui/input"
import { FC } from "react"

type MadaInputProps = React.ComponentProps<typeof Input>

export const MadaInput: FC<MadaInputProps> = ({ ...props }) => {
  return <Input className="w-full rounded-md border border-gray-300 px-3 py-2" {...props} />
}
