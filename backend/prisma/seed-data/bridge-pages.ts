export type SeedBridgePage = {
  slug: string;
  navLabel: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string[];
  heroImage: string;
  heroImageAlt: string;
  heroImagePosition?: string;
  heroQuote: string;
  introEyebrow?: string;
  introTitle: string;
  introDescription: string;
  interludeImage?: string;
  interludeImageAlt?: string;
  productSectionEyebrow?: string;
  productSectionTitle?: string;
  productSectionDescription?: string;
  postCtaTitle?: string;
  postCtaDescription?: string;
  postCtaPrimaryLabel?: string;
  postCtaPrimaryHref?: string;
  postCtaSecondaryLabel?: string;
  postCtaSecondaryHref?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoFootnote?: string;
  productSlugs: string[];
};

export const seedBridgePages: SeedBridgePage[] = [
  {
    slug: "lifestyle",
    navLabel: "Lifestyle",
    heroEyebrow: "Objects of Stillness",
    heroTitle: "Curated ritual boxes for a slower daily rhythm.",
    heroDescription: [
      "Mindfully composed sets of fragrance, textile, and small ritual objects.",
      "Each one is designed to turn intention into a repeatable, unhurried habit.",
    ],
    heroImage: "/images/Seijaku Lifestyle img 1.png",
    heroImageAlt: "A composed Seijaku ritual box arranged with scent, textile, and stillness objects.",
    heroImagePosition: "object-[center_18%]",
    heroQuote: "A ritual shaped for repetition, not ornament.",
    introEyebrow: "Lifestyle",
    introTitle: "A composed threshold into Seijaku living",
    introDescription:
      "Lifestyle functions as the gentlest entry into the shop: fewer decisions, stronger context, and a clearer sense of how scent, material, and everyday ritual belong together.",
    productSlugs: ["dawn-reset-box", "reading-hour-set", "quiet-tea-ritual-box", "evening-unwind-gift-set"],
  },
  {
    slug: "perfumes",
    navLabel: "Perfumes",
    heroEyebrow: "Fragrance Trilogy",
    heroTitle: "Scent, arranged for the way you live",
    heroDescription: [
      "On skin, on cloth, within space, each composition holds a different rhythm of stillness.",
    ],
    heroImage: "/images/hero banner HP 1.png",
    heroImageAlt: "Seijaku fragrances arranged in a calm editorial frame.",
    heroQuote: "Scent should settle into the day before it declares itself.",
    introEyebrow: "Perfumes",
    introTitle: "A quieter scent index",
    introDescription:
      "The perfumes bridge is arranged by how scent lives: worn on skin, carried on cloth, and placed into space.",
    postCtaTitle: "Begin quietly",
    postCtaPrimaryLabel: "Explore Ritual Sets",
    postCtaPrimaryHref: "/shop/lifestyle",
    postCtaSecondaryLabel: "Learn How to Use Scents",
    postCtaSecondaryHref: "/a-seijaku-life",
    seoFootnote:
      "Discover natural perfumes in India for skin, textiles, and spaces. Seijaku fragrances are crafted as ritual objects, blending traditional methods with mindful scenting practices for slow living.",
    productSlugs: [
      "spirit-01-breath-of-pines",
      "body-01-summer-held-close",
      "mind-01-the-morning-desk",
      "trilogy-discovery-kit",
      "jasmine-neroli-textile-oil",
      "lotus-jasmine-textile-oil",
      "hinoki-cedar-textile-oil",
      "rose-vetiver-textile-oil",
      "tea-blossom-rice-textile-oil",
      "neroli-bloom-diffusion-vessel",
      "plum-orchard-room-stone",
      "tea-steam-stone-diffuser",
      "kyusu-warmth-reed-vessel",
      "rice-citrus-bowl-diffuser",
      "cardamom-hearth-vessel",
    ],
  },
  {
    slug: "scarves-and-squares",
    navLabel: "Scarves & Squares",
    heroEyebrow: "Textiles in Ritual",
    heroTitle: "Scarves and squares that carry texture, gesture, and quiet scent.",
    heroDescription: [
      "Textiles for pocket, neck, table, and travel with an intentionally softened presence.",
      "Designed to live easily with perfume, hosting, and everyday ritual.",
    ],
    heroImage: "/images/Quiet Tea Ritual Box_lifestyle.JPG",
    heroImageAlt: "A quiet textile-led Seijaku arrangement with tea and scent.",
    heroQuote: "A textile can hold movement and memory at the same time.",
    introEyebrow: "Scarves & Squares",
    introTitle: "Textiles chosen by use, not overload",
    introDescription:
      "This bridge page keeps the shopper inside a slower editorial flow by grouping textiles around wear, hosting, and gifting rather than making them decode broad object listings.",
    productSlugs: [
      "bengal-japan-modal-silk-scarf",
      "pine-forest-modal-silk-scarf",
      "kolkata-summer-modal-silk-scarf",
      "coffee-clear-modal-silk-scarf",
      "bengal-japan-modal-silk-pocket-square",
      "pine-forest-modal-silk-pocket-square",
      "kolkata-summer-modal-silk-pocket-square",
      "coffee-clear-modal-silk-pocket-square",
    ],
  },
  {
    slug: "diffusers",
    navLabel: "Diffusers",
    heroEyebrow: "Home Fragrance",
    heroTitle: "Diffusers that shape room atmosphere without raising the volume.",
    heroDescription: [
      "For desks, bedside tables, entry rituals, and rooms that need steadier calm.",
      "Every format is framed by placement, pacing, and mood rather than raw specification.",
    ],
    heroImage: "/images/Home Page hero image 1.png",
    heroImageAlt: "A quiet still life of Seijaku home fragrance objects.",
    heroQuote: "Home scent works best when it settles the room before it fills it.",
    introEyebrow: "Diffusers",
    introTitle: "Home fragrance with fewer decision loops",
    introDescription:
      "The diffuser bridge page reduces friction by clarifying which formats suit close spaces, shared spaces, and evening use. Shoppers can decide by room and pace without leaving the page.",
    productSlugs: ["stone-oil-diffuser", "brass-tea-light-diffuser", "reed-diffuser-cedar-smoke", "clay-vessel-diffuser"],
  },
  {
    slug: "dokra-ornaments",
    navLabel: "Dokra Brooches",
    heroEyebrow: "Dokra Brooches",
    heroTitle: "Objects that fasten stillness to the everyday",
    heroDescription: [
      "Dokra brooches shaped from memory and metal.",
      "Worn close, placed gently, or gifted with intention.",
    ],
    heroImage: "/images/japanese fan hero Our Story.png",
    heroImageAlt: "An atmospheric Seijaku composition evoking dokra brooches and ritual-led craft.",
    heroQuote: "A small object can return a day to its intended pace.",
    introEyebrow: "Dokra Brooches",
    introTitle: "Before you choose, notice what draws you",
    introDescription:
      "Each form carries a quiet suggestion - of gesture, sound, or pause. These are not ornaments alone, but anchors for small daily rituals. Choose not by form, but by the feeling it returns you to.",
    productSectionEyebrow: "DOKRA BROOCHES",
    productSectionTitle: "Five forms for five ways of returning",
    productSectionDescription:
      "Each brooch belongs to a ritual language - unfolding, listening, marking, or holding stillness.",
    interludeImage: "/images/Seasonal Drop Listen before shaping.jpg",
    interludeImageAlt: "A calm dokra ritual image with a hand-held object and quiet movement.",
    postCtaTitle: "Begin with a set, or begin with a moment",
    postCtaDescription:
      "These objects are designed to work together - but also to stand alone. Choose how you enter the ritual.",
    postCtaPrimaryLabel: "Find a Calm Ritual Set",
    postCtaPrimaryHref: "/shop/lifestyle",
    postCtaSecondaryLabel: "Begin Daily Ritual",
    postCtaSecondaryHref: "/ritual",
    seoFootnote:
      "Handcrafted dokra brooches from Bengal, made using traditional lost-wax casting. Each piece functions as both ornament and ritual object - designed for slow living, meaningful gifting, and personal daily practices.",
    productSlugs: [
      "japan-handfan-brooch",
      "bengal-handfan-i-brooch",
      "bengal-handfan-ii-brooch",
      "conch-brooch",
      "temple-bell-brooch",
    ],
  },
  {
    slug: "seasonaldrops",
    navLabel: "Seasonal Drops",
    heroEyebrow: "Seasonal Archive",
    heroTitle: "Seasonal drops, held close.",
    heroDescription: [
      "Limited, place-led releases that arrive once and return only as memory.",
      "Explore the diffuser sets currently available from the Hemanta archive.",
    ],
    heroImage: "/images/Hemanta drop HP banner 1.png",
    heroImageAlt: "Hemanta seasonal drop editorial still life",
    heroImagePosition: "object-[center_54%]",
    heroQuote: "A chapter closes. The scent stays.",
    introEyebrow: "On the archive",
    introTitle: "A quieter way to discover seasonal work",
    introDescription:
      "Each Seijaku seasonal drop is composed around a single mood, place, and scent. The diffuser sets here are smaller-format entries — made to live in rooms without ceremony, and paired with the full editorial on each drop's dedicated page.",
    postCtaTitle: "Read the full Hemanta story",
    postCtaDescription:
      "Each drop carries its own literary and material origin. The Hemanta chapter gathers the full four-form archive and the making process.",
    postCtaPrimaryLabel: "Enter the Hemanta page",
    postCtaPrimaryHref: "/seasonaldrops-hemanta",
    seoFootnote:
      "Seijaku seasonal drops are limited, place-led releases tied to a specific month, mood, or literary source. Each drop is archival — it returns only through seasonal retreats and immersive gatherings.",
    productSlugs: ["hemanta-ispani-diffuser-set", "hemanta-rishi-diffuser-set"],
  },
];
