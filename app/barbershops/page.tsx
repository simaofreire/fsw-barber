import BarbershopItem from "../_components/barbershop-item"
import { Header } from "../_components/header"
import Searchbar from "../_components/searchbar"
import { db } from "../_lib/prisma"

interface BarbershopPageProps {
  searchParams: {
    search?: string
  }
}

const BarbershopPage = async ({ searchParams }: BarbershopPageProps) => {
  const barbershops = await db.barbershop.findMany({
    where: { name: { contains: searchParams.search, mode: "insensitive" } },
  })

  return (
    <div>
      <Header />
      <div className="mt-6 px-5">
        <Searchbar />
      </div>
      <div className="px-5">
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Resultados para &quot;{searchParams.search}&quot;
        </h2>
        {barbershops.map((b) => (
          <BarbershopItem key={b.id} barbershop={b} />
        ))}
      </div>
    </div>
  )
}

export default BarbershopPage
