"use client"
import { SmartphoneIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "./ui/button"

interface PhoneItemProps {
  phone: string
}

const PhoneItem = ({ phone }: PhoneItemProps) => {
  const handleCopyToClipBoard = (phone: string) => {
    navigator.clipboard.writeText(phone)
    toast.success("Número copiado para a área de transferência", {
      duration: 2000,
    })
  }

  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <SmartphoneIcon />
        <p className="text-sm">{phone}</p>
      </div>
      <Button variant="outline" onClick={() => handleCopyToClipBoard(phone)}>
        Copiar
      </Button>
    </div>
  )
}

export default PhoneItem
