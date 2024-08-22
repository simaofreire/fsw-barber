"use server"

import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { authOptions } from "../_lib/auth"
import { db } from "../_lib/prisma"

interface CreateBookingProps {
  serviceId: string
  date: Date
}

export const createBooking = async (params: CreateBookingProps) => {
  const session = await getServerSession(authOptions)

  if (!session) throw new Error("Usuário não autenticado")

  await db.booking.create({
    data: { ...params, userId: (session.user as any).id },
  })

  revalidatePath("/barbershops/[id]")
  revalidatePath("/bookings")
}
