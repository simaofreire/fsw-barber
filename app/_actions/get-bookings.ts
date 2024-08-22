"use server"
import { endOfDay, startOfDay } from "date-fns"
import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"

interface GetBookingsProps {
  serviceId?: string
  date: Date
}

export const getBookings = async ({ date }: GetBookingsProps) => {
  await db.booking.findMany({
    where: {
      date: {
        lte: endOfDay(date),
        gte: startOfDay(date),
      },
    },
  })

  revalidatePath("/bookings", "page")
  revalidatePath("/", "page")
}
