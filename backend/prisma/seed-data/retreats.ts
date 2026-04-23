export type SeedRetreat = {
  slug: string;
  name: string;
  shortDescription: string;
  detailDescription: string;
  image: string;
  imageAlt?: string;
  location: string;
  season: string;
  format: string;
  groupSize: string;
};

export const seedRetreats: SeedRetreat[] = [
  {
    slug: "shantiniketan-stillness",
    name: "Shantiniketan Stillness",
    shortDescription: "A slower study of red earth, open studio culture, and reflective ritual in Santiniketan.",
    detailDescription:
      "A three-night immersion shaped by art school legacy, seasonal reading, and tactile craft encounters across Santiniketan's quieter rhythms.",
    image: "/images/Home Page hero image 1.png",
    location: "Shantiniketan",
    season: "Sharad cohort",
    format: "3 nights / 4 days",
    groupSize: "12 participants",
  },
  {
    slug: "kalimpong-quiet",
    name: "Kalimpong Quiet",
    shortDescription: "Mountain light, monastery stillness, and botanical pacing gathered into a small retreat cohort.",
    detailDescription:
      "A hillside retreat built around walks, scent-led pauses, and conversations with local makers across Kalimpong's layered landscapes.",
    image: "/images/hero banner HP 1.png",
    location: "Kalimpong",
    season: "Hemanta cohort",
    format: "3 nights / 4 days",
    groupSize: "10 participants",
  },
  {
    slug: "sundarban-stillness",
    name: "Sundarban Stillness",
    shortDescription: "Tidal movement, mangrove air, and collective quiet along Bengal's river edge.",
    detailDescription:
      "A retreat shaped by river pace, close listening, and shared sensory ritual in the shifting light of the Sundarbans.",
    image: "/images/seijaku_seasonal_drop_cinematic_banner.png",
    location: "Sundarban",
    season: "Monsoon threshold",
    format: "3 nights / 4 days",
    groupSize: "12 participants",
  },
  {
    slug: "bishnupur-breathe",
    name: "Bishnupur Breathe",
    shortDescription: "Terracotta heritage, temple acoustics, and grounded breathing rituals in a slower historic landscape.",
    detailDescription:
      "An intimate retreat moving between Bishnupur's material memory, handwork traditions, and facilitator-led breath practice.",
    image: "/images/Hemanta drop HP banner 1.png",
    location: "Bishnupur",
    season: "Winter cohort",
    format: "3 nights / 4 days",
    groupSize: "10 participants",
  },
];
