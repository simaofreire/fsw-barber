"use server"

import { DefaultSession, getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { authOptions } from "../_lib/auth"
import { db } from "../_lib/prisma"

interface CreateBookingProps {
  serviceId: string
  date: Date
}

interface UserSession extends DefaultSession {
  user: {
    id: string
    name: string
    email: string
    image: string
  }
}

export const createBooking = async (params: CreateBookingProps) => {
  const { user } = (await getServerSession(authOptions)) as UserSession

  if (!user) throw new Error("Usuário não autenticado")

  await db.booking.create({
    data: { ...params, userId: user.id },
  })

  revalidatePath("/barbershops/[id]")
}
