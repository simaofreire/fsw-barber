"use client"
import { Barbershop, BarbershopService, Booking } from "@prisma/client"
import { ptBR } from "date-fns/locale"

import Image from "next/image"
import { Button } from "./ui/button"

import { addDays, format, set } from "date-fns"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { createBooking } from "../_actions/create-booking"
import { getBookings } from "../_actions/get-bookings"
import SignInDialog from "./sign-in-dialog"
import { Calendar } from "./ui/calendar"
import { Card, CardContent } from "./ui/card"
import { Dialog, DialogContent } from "./ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"

interface ServiceItemProps {
  service: BarbershopService
  barbershop: Pick<Barbershop, "name">
}

const TIME_LIST = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
]

const getTimeList = (bookings: Booking[]) => {
  return TIME_LIST.filter((t) => {
    const hour = +t.split(":")[0]
    const minutes = +t.split(":")[1]

    // const isTimePast = set(new Date(), { hours: hour, minutes }).getTime() < Date.now()

    const hasBookingOnCurrentTime = bookings.some(
      (b) => b.date.getHours() === hour && b.date.getMinutes() === minutes,
    )

    if (hasBookingOnCurrentTime) return false
    return true
  })
}

const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const [openSheet, setOpenSheet] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  )
  const [dayBookings, setDayBookings] = useState<Booking[]>([])
  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const { data } = useSession()

  useEffect(() => {
    if (!selectedDay) return

    const fetchBookings = async () => {
      const bookings = await getBookings({
        serviceId: service.id,
        date: selectedDay,
      })
      setDayBookings(bookings)
    }
    fetchBookings()
  }, [selectedDay, service.id])

  const handleBookingClick = () => {
    if (!data?.user) {
      setDialogIsOpen(true)
      return
    }
    setOpenSheet(true)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleCreateBooking = () => {
    if (!selectedDay || !selectedTime) return
    if (!data?.user) return toast.error("Faça login para reservar")

    const hour = +selectedTime.split(":")[0]
    const minute = +selectedTime.split(":")[1]
    const date = set(selectedDay, { hours: hour, minutes: minute })
    try {
      createBooking({
        serviceId: service.id,
        date,
      })

      handleOpenSheet()
      toast.success("Reserva criada com sucesso")
    } catch (error) {
      console.error(error)
      toast.error("Erro ao criar reserva")
    }
  }

  const handleOpenSheet = () => {
    setSelectedDay(undefined)
    setSelectedTime(undefined)
    setDayBookings([])
    setOpenSheet(false)
  }

  return (
    <>
      <Card>
        <CardContent className="flex items-center gap-3 p-3">
          <div className="relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]">
            <Image
              src={service.imageUrl}
              fill
              alt={service.name}
              className="rounded-xl object-cover"
            />
          </div>

          <div className="w-full space-y-2">
            <h3 className="text-sm font-semibold">{service.name}</h3>
            <p className="text-sm">{service.description}</p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-primary">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(+service.price)}
              </p>
              <Sheet open={openSheet} onOpenChange={handleOpenSheet}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleBookingClick}
                >
                  Reservar
                </Button>
                <SheetContent className="px-0">
                  <SheetHeader>
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  <div className="border-b border-solid py-5">
                    <Calendar
                      selected={selectedDay}
                      fromDate={addDays(new Date(), 0)}
                      onSelect={handleDateSelect}
                      mode="single"
                      locale={ptBR}
                      styles={{
                        head_cell: {
                          width: "100%",
                          textTransform: "capitalize",
                        },
                        cell: {
                          width: "100%",
                        },
                        button: {
                          width: "100%",
                        },
                        nav_button_previous: {
                          width: "32px",
                          height: "100%",
                        },
                        nav_button_next: {
                          width: "32px",
                          height: "100%",
                        },
                        caption: {
                          textTransform: "capitalize",
                        },
                      }}
                    />
                  </div>

                  {selectedDay && (
                    <div className="flex gap-2 overflow-x-auto border-b border-solid p-5 [&::-webkit-scrollbar]:hidden">
                      {getTimeList(dayBookings).map((t) => (
                        <Button
                          key={t}
                          className="rounded-full"
                          variant={selectedTime === t ? "default" : "outline"}
                          onClick={() => handleTimeSelect(t)}
                        >
                          {t}
                        </Button>
                      ))}
                    </div>
                  )}

                  {selectedTime && selectedDay && (
                    <div className="p-5">
                      <Card>
                        <CardContent className="space-y-3 p-3">
                          <div className="flex items-center justify-between">
                            <h2 className="font-bold">{service.name}</h2>
                            <p className="text-sm font-bold">
                              {Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(+service.price)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <h2 className="text-sm text-gray-400">Data</h2>
                            <p className="text-sm">
                              {format(selectedDay, "d 'de' MMMM", {
                                locale: ptBR,
                              })}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <h2 className="text-sm text-gray-400">Horário</h2>
                            <p className="text-sm">{selectedTime}</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <h2 className="text-sm text-gray-400">Barbearia</h2>
                            <p className="text-sm">{barbershop.name}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  <SheetFooter className="mt-5 px-5">
                    <Button
                      className="w-wull"
                      disabled={!selectedDay || !selectedTime}
                      onClick={handleCreateBooking}
                    >
                      Confirmar
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog
        open={dialogIsOpen}
        onOpenChange={(open) => setDialogIsOpen(open)}
      >
        <DialogContent>
          <SignInDialog />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ServiceItem
