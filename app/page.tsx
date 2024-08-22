import { getServerSession } from "next-auth"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { BookingItem } from "./_components/booking-item"
import { Header } from "./_components/header"
import Searchbar from "./_components/searchbar"
import { Button } from "./_components/ui/button"
import { quickSearchOptions } from "./_constants/quick-search"
import { authOptions } from "./_lib/auth"
import { db } from "./_lib/prisma"

const BarbershopItem = dynamic(() => import("./_components/barbershop-item"), {
  ssr: false,
})

const Home = async () => {
  const session = await getServerSession(authOptions)
  const barbershops = await db.barbershop.findMany({ orderBy: { name: "asc" } })
  const popularBarbershops = await db.barbershop.findMany({
    orderBy: { name: "desc" },
  })

  const confirmedBookings = session?.user
    ? await db.booking.findMany({
        where: { userId: (session?.user as any).id, date: { gte: new Date() } },
        include: { service: { include: { barbershop: true } } },
        orderBy: { date: "asc" },
      })
    : []

  const date = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  return (
    <div>
      <Header />
      <div className="p-5">
        <h2 className="text-xl font-bold">Olá, Simão</h2>
        <p>{date}</p>

        <div className="mt-6">
          <Searchbar />
        </div>

        <div className="mt-6 flex gap-3 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
          {quickSearchOptions.map((option) => (
            <Button
              key={option.title}
              className="gap-2"
              variant="secondary"
              asChild
            >
              <Link href={`/barbershops?service=${option.title}`}>
                <Image
                  src={option.imageUrl}
                  width={16}
                  height={16}
                  alt={option.title}
                />
                {option.title}
              </Link>
            </Button>
          ))}
        </div>

        <div className="relative mt-6 h-[150px] w-full">
          <Image
            src="/BannerPizza.png"
            fill
            className="rounded-xl object-cover"
            alt="Banner pizza"
          />
        </div>

        <h2 className="mb-3 mt-6 font-bold uppercase text-gray-400">
          Agendamentos
        </h2>
        <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {confirmedBookings.map((b) => (
            <BookingItem key={b.id} booking={b} />
          ))}
        </div>

        <h2 className="mb-3 mt-6 font-bold uppercase text-gray-400">
          Recomendados
        </h2>
        <div className="relative flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>

        <h2 className="mb-3 mt-6 font-bold uppercase text-gray-400">
          Populares
        </h2>
        <div className="relative flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {popularBarbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    </div>
  )
}
export default Home
