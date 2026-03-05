import Link from "next/link"

type Props = {
    name: string
    href: string
    image: string
}

export const CategoryCard = ({ name, href, image }: Props) => (
    <Link href={href} className="block">
        <div className="group relative bg-white shadow-xs hover:shadow-lg transition overflow-hidden min-h-[330px] sm:min-h-[430px] flex flex-col items-center pt-16">

            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                style={{
                    backgroundImage: `url(${image})`,
                    backgroundPosition: "center 195px",
                    backgroundSize: "105%",
                }}
            />

            <div className="relative z-10 flex flex-col items-center w-full">

                <h3 className="text-center mb-4 uppercase">{name}</h3>

                <span
                    className="group inline-block px-6 py-2 font-normal rounded-4xl border
    border-(--primary) bg-(--primary) text-white
    hover:bg-white hover:text-(--primary) hover:border-(--primary)
    transition-colors duration-200 cursor-pointer"
                >
                    Voir plus
                </span>
            </div>

        </div>
    </Link>
)
