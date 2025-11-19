import { Categories } from "@/components/sections/Categories"
import Hero from "@/components/sections/Hero"

type Props = {}

const page = (props: Props) => {
  return (
    <main>
      <Hero />
      <Categories />
    </main>

  )
}

export default page