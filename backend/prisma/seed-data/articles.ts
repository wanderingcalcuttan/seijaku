export type SeedArticleCategory =
  | "Journal"
  | "Seasonal Notes"
  | "Behind the Scenes"
  | "Rituals"
  | "Materials"
  | "Places"
  | "Letters";

export type SeedArticle = {
  slug: string;
  title: string;
  category: SeedArticleCategory;
  date: string;
  excerpt: string;
  image?: string;
  imageAlt?: string;
  featured?: boolean;
};

export const seedArticles: SeedArticle[] = [
  {
    slug: "hemanta-and-the-art-of-seasonal-attention",
    title: "Hemanta, and the Art of Seasonal Attention",
    category: "Seasonal Notes",
    date: "March 2026",
    excerpt:
      "A meditation on shifting light, inwardness, and the quiet disciplines that accompany seasonal change.",
    image: "/images/DSC_8097.JPG",
    imageAlt: "Soft winter light across objects arranged in a calm interior.",
    featured: true,
  },
  {
    slug: "in-the-studio-before-dawn",
    title: "In the Studio, Before Dawn",
    category: "Behind the Scenes",
    date: "February 2026",
    excerpt: "Notes from the quieter hours when objects, materials, and decisions begin to take form.",
    image: "/images/DSC_8017.JPG",
    imageAlt: "Morning studio table with unfinished forms and natural texture.",
  },
  {
    slug: "ritual-objects-for-urban-evenings",
    title: "Ritual Objects for Urban Evenings",
    category: "Rituals",
    date: "February 2026",
    excerpt: "On creating transitions between work, home, and inward attention.",
  },
  {
    slug: "bengal-in-place-and-form",
    title: "Bengal, In Place and Form",
    category: "Places",
    date: "January 2026",
    excerpt:
      "Traces of texture, memory, craft, and atmosphere that continue to shape the Seijaku sensibility.",
    image: "/images/Our Story img_2.png",
    imageAlt: "A textured scene evoking Bengal craft and atmosphere.",
  },
  {
    slug: "what-we-return-to-each-winter",
    title: "What We Return to Each Winter",
    category: "Journal",
    date: "January 2026",
    excerpt:
      "Familiar gestures, recurring texts, and the rituals that quietly gather us back to ourselves.",
  },
  {
    slug: "on-materials-that-age-beautifully",
    title: "On Materials That Age Beautifully",
    category: "Materials",
    date: "December 2025",
    excerpt: "A study of surfaces, tactility, and the emotional life of materials over time.",
    image: "/images/Seijaku section img 1.png",
    imageAlt: "Close view of material surfaces with warm, muted tones.",
  },
  {
    slug: "a-letter-before-the-next-drop",
    title: "A Letter Before the Next Drop",
    category: "Letters",
    date: "December 2025",
    excerpt: "A quiet note on intention, anticipation, and what we hope to make space for next.",
  },
];
