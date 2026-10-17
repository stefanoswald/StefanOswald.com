/**
 * Copy and photos for /travel. Every photo is Stefan's, from his NAS (Oct 17, 2026). Places come from the
 * drone's GPS (the Greek islands) or from the landmark in the picture. The 43 countries match MagicTrickGuy.com.
 * Favorite country and city: Stefan's own answers.
 */

import type { Photo } from "@/data/site/types";

export type TravelPhoto = Photo & { place: string; note: string };

export const travel = {
  kicker: "Travel",
  title: "Places I've been",
  intro: [
    "I've performed in 43 countries. These are a few of the places I've been, and I shot most of them with my drone.",
    "Costa Rica is my favorite country. Santorini is my favorite city."
  ],
  hero: {
    src: "/images/site/travel/mykonos-harbor.webp",
    alt: "Aerial view of the harbor on Mykonos, with turquoise water, white houses, and boats",
    width: 2000,
    height: 1125,
    place: "Mykonos, Greece",
    note: "From my drone, 2023"
  } satisfies TravelPhoto,
  photos: [
    {
      src: "/images/site/travel/santorini-fira.webp",
      alt: "Aerial view of white houses along the top of red volcanic cliffs above the sea in Santorini",
      width: 1600,
      height: 900,
      place: "Santorini, Greece",
      note: "Above Fira, 2023"
    },
    {
      src: "/images/site/travel/dubai-burj-khalifa.webp",
      alt: "The Burj Khalifa rising into the clouds at dusk, with string lights in the foreground",
      width: 619,
      height: 1100,
      place: "Dubai, United Arab Emirates",
      note: "The Burj Khalifa, 2023"
    },
    {
      src: "/images/site/travel/paros-naousa.webp",
      alt: "Aerial view of a marina full of sailboats and yachts in front of a white village",
      width: 1600,
      height: 900,
      place: "Naousa, Paros, Greece",
      note: "From my drone, 2023"
    },
    {
      src: "/images/site/travel/hyderabad-charminar.webp",
      alt: "Stefan in sunglasses in front of the Charminar, a white monument with four minarets, on a busy market street",
      width: 733,
      height: 1100,
      place: "Hyderabad, India",
      note: "Me at the Charminar, 2023"
    },
    {
      src: "/images/site/travel/santorini-caldera.webp",
      alt: "Aerial view of red and brown cliffs dropping into deep blue water on Santorini",
      width: 1600,
      height: 900,
      place: "Santorini, Greece",
      note: "The caldera cliffs, 2023"
    },
    {
      src: "/images/site/travel/mykonos-town.webp",
      alt: "Aerial view of the white town of Mykonos, with Little Venice and the windmills by the water",
      width: 1600,
      height: 1200,
      place: "Mykonos, Greece",
      note: "From my drone, 2023"
    },
    {
      src: "/images/site/travel/london-tower-bridge.webp",
      alt: "Tower Bridge over the River Thames under a cloudy sky",
      width: 1600,
      height: 1200,
      place: "London, England",
      note: "Tower Bridge, 2009"
    }
  ] satisfies TravelPhoto[],
  more: [
    { label: "What I pack", body: "The cameras, drones, and gear I actually travel and film with.", href: "/travel-gear" },
    { label: "Watch", body: "Magic from festivals, parties, and street shows.", href: "/watch" }
  ]
};
