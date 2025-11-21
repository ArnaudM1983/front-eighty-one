"use client";

import { useEffect, useState } from "react";
import ButtonLink from "../ui/ButtonLink";

type InstagramPost = {
  id: string;
  media_url: string;
  caption?: string;
  permalink: string;
};

// Images par défaut à afficher en cas d'erreur
const fallbackPosts: InstagramPost[] = [
  {
    id: "1",
    media_url: "/insta1.webp",
    permalink: "#",
  },
  {
    id: "2",
    media_url: "/insta2.webp",
    permalink: "#",
  },
  {
    id: "3",
    media_url: "/insta3.webp",
    permalink: "#",
  },
  {
    id: "4",
    media_url: "/insta4.webp",
    permalink: "#",
  },
];

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInstagram() {
      try {
        const res = await fetch("/api/instagram");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data: InstagramPost[] = await res.json();
        setPosts(data.length > 0 ? data : fallbackPosts);
      } catch (err) {
        console.error(err);
        setPosts(fallbackPosts);
      } finally {
        setLoading(false);
      }
    }

    fetchInstagram();
  }, []);

  if (loading) return <p>Chargement des publications Instagram...</p>;

  return (
    <section className="px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-12">Suivez-nous sur Instagram</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden shadow hover:shadow-lg transition bg-white"
            >
              <img
                src={post.media_url}
                alt={post.caption ?? "Publication Instagram"}
                className="w-[300px] h-[300px] object-cover"
              />
              {post.caption && (
                <p className="p-2 text-sm text-gray-700 line-clamp-2">{post.caption}</p>
              )}
            </a>
          ))}
        </div>

        <div className="mt-10 text-center">
          <ButtonLink
            href="https://www.instagram.com/81store/?hl=fr"
            target="_blank"
            rel="noopener noreferrer"
          >
            Suivre sur Instagram
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
