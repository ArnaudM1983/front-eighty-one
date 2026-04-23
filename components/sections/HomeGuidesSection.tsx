import SliderWrapper from "../ui/SliderWrapper";
import GuideCard from "../ui/GuideCard";
import ButtonLink from "../ui/ButtonLink";

type Guide = {
  id: number;
  title: string;
  slug: string;
  description: string;
  image?: string;
  created_at: string;
};

type Props = {
  id?: string;
  title: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
};

async function fetchFeaturedGuides(): Promise<Guide[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SYMFONY_API_URL}/api/guides?featured=true&_limit=8`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function HomeGuidesSection({
  id,
  title,
  description,
  buttonLabel = "Tous nos guides",
  buttonHref = "/guides",
}: Props) {
  const guides = await fetchFeaturedGuides();

  if (!guides || guides.length === 0) return null;

  return (
    <section id={id} className="px-8 py-20 bg-white border-t border-gray-50">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
          <div className="space-y-4">
            <h2 >
              {title}
            </h2>
            {description && (
              <p className="text-gray-500 max-w-2xl leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {buttonLabel && buttonHref && (
            <ButtonLink href={buttonHref}>
              {buttonLabel}
            </ButtonLink>
          )}
        </div>

        <div className="relative">
          <SliderWrapper slidesToShow={3} autoplay={false}>
            {guides.map((guide) => (
              <div key={guide.id} className="px-3 pb-4">
                <GuideCard guide={guide} />
              </div>
            ))}
          </SliderWrapper>
        </div>

      </div>
    </section>
  );
}