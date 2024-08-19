"use client"
import { SearchIcon } from "lucide-react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "./ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"
import { Input } from "./ui/input"

const schema = z.object({
  search: z.string().trim().min(1, { message: "Digite para fazer uma busca" }),
})

const Searchbar = () => {
  const router = useRouter()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { search: "" },
  })

  const onSubmit = (data: z.infer<typeof schema>) => {
    router.push(`/barbershops?search=${data.search}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder="Buscar" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="icon">
          <SearchIcon size={18} />
        </Button>
      </form>
    </Form>
  )
}

export default Searchbar
