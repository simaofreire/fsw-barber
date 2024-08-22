"use server"
import { endOfDay, startOfDay } from "date-fns"
import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"

interface GetBookingsProps {
  date: Date
}

export const getBookings = async ({ date }: GetBookingsProps) => {
  const bookings = await db.booking.findMany({
    where: {
      date: {
        lte: endOfDay(date),
        gte: startOfDay(date),
      },
    },
  })

  revalidatePath("/bookings", "page")
  revalidatePath("/", "page")

  return bookings
}
