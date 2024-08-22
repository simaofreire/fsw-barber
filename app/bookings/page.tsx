import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"
import { BookingItem } from "../_components/booking-item"
import { Header } from "../_components/header"
import { authOptions } from "../_lib/auth"
import { db } from "../_lib/prisma"

const Bookings = async () => {
  const session = await getServerSession(authOptions)

  if (!session) return notFound()

  const confirmedBookings = await db.booking.findMany({
    where: { userId: (session?.user as any).id, date: { gte: new Date() } },
    include: { service: { include: { barbershop: true } } },
    orderBy: { date: "asc" },
  })

  const concludedBookings = await db.booking.findMany({
    where: { userId: (session?.user as any).id, date: { lte: new Date() } },
    include: { service: { include: { barbershop: true } } },
    orderBy: { date: "asc" },
  })

  return (
    <>
      <Header />
      <div className="space-y-3 p-5">
        <h1 className="text-xl font-bold">Agendamentos</h1>
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Confirmados
        </h2>
        {confirmedBookings.map((b) => (
          <BookingItem key={b.id} booking={b} />
        ))}

        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Finalizados
        </h2>
        {concludedBookings.map((b) => (
          <BookingItem key={b.id} booking={b} />
        ))}
      </div>
    </>
  )
}

export default Bookings
