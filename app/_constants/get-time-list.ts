import { Booking } from "@prisma/client"
import { isPast, set, isToday } from "date-fns"
import { TIME_LIST } from "./time-list"

interface GetTimeListProps {
  bookings: Booking[]
  selectedDay?: Date
}

export const getTimeList = ({
  bookings,
  selectedDay = new Date(),
}: GetTimeListProps) => {
  return TIME_LIST.filter((t) => {
    const hours = +t.split(":")[0]
    const minutes = +t.split(":")[1]

    const isTimePast = isPast(set(new Date(), { hours, minutes }).getTime())

    if (isTimePast && isToday(selectedDay)) {
      return false
    }

    const hasBookingOnCurrentTime = bookings?.some(
      (b) => b.date.getHours() === hours && b.date.getMinutes() === minutes,
    )

    if (hasBookingOnCurrentTime) {
      return false
    }

    return true
  })
}
