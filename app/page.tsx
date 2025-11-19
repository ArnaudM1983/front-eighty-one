import BestSellers from "@/components/sections/BestSellers"
import { Categories } from "@/components/sections/Categories"
import Hero from "@/components/sections/Hero"
import InstagramFeed from "@/components/sections/InstagramFeed"

type Props = {}

const page = (props: Props) => {
  return (
    <main>
      <Hero />
      <Categories />
      <BestSellers />
      <InstagramFeed />
    </main>

  )
}

export default page