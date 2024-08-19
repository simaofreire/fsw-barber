"use client"

import { Button } from "@/app/_components/ui/button"
import { ChevronLeftIcon } from "lucide-react"
import { useRouter } from "next/navigation"

const ReturnButton = () => {
  const router = useRouter()
  return (
    <Button
      className="absolute left-4 top-4"
      size="icon"
      variant="secondary"
      onClick={() => router.back()}
    >
      <ChevronLeftIcon />
    </Button>
  )
}

export default ReturnButton
