// components/sections/InstagramFeed.tsx
import SliderWrapper from "../ui/SliderWrapper";

type InstagramPost = {
  id: string;
  mediaUrl: string;
  permalink: string;
  caption?: string;
};

export default async function InstagramFeed() {
  const BEHOLD_URL = "https://feeds.behold.so/IbSbLmjXRIujWiZjLI5N";

  try {
    const res = await fetch(BEHOLD_URL, {
      next: { revalidate: 3600 }
    });

    if (!res.ok) return null;

    const rawData = await res.json();
    const posts: InstagramPost[] = rawData.posts || [];

    if (posts.length === 0) {
      return null;
    }

    return (
      // bg-white pour correspondre à ta demande, py-16 et px-4 pour le style BestSellers
      <section className="px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <a
            href="https://www.instagram.com/81store/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-block mb-12"
          >
            <h2 className="text-xl font-semibold uppercase italic tracking-tighter transition-colors group-hover:text-red-600">
              Follow @81store sur Instagram
              <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
            </h2>
          </a>

          <SliderWrapper slidesToShow={4} autoplay={true}>
            {posts.map((post) => (
              <div key={post.id} className="px-2">
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block relative aspect-square overflow-hidden rounded-2xl shadow-sm"
                >
                  <img
                    src={post.mediaUrl}
                    alt={post.caption || "Post Instagram 81Store"}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Overlay subtil au survol */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/90 p-2 rounded-full shadow-lg">
                      <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.247 2.242 1.308 3.607.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.247-3.607 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.247-2.242-1.308-3.607-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.247 3.607-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.335.06-2.247.272-3.045.582-.826.321-1.527.75-2.224 1.447-.697.697-1.126 1.398-1.447 2.224-.31.798-.522 1.71-.582 3.045-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.06 1.335.272 2.247.31 3.045.321.826.75 1.527 1.447 2.224.697.697 1.398 1.126 2.224 1.447.798.31 1.71.522 3.045.582 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.335-.06 2.247-.272 3.045-.582.826-.321 1.527-.75 2.224-1.447.697-.697 1.126-1.398 1.447-2.224.31-.798.522-1.71.582-3.045.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.06-1.335-.272-2.247-.31-3.045-.321-.826-.75-1.527-1.447-2.224-.697-.697-1.398-1.126-2.224-1.447-.798-.31-1.71-.522-3.045-.582-1.28-.058-1.688-.072-4.947-.072zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </SliderWrapper>
        </div>
      </section>
    );
  } catch (error) {
    console.error("Erreur Instagram Feed:", error);
    return null;
  }
}