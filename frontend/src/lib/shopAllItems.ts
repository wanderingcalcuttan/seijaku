export const canonicalShopRoutes = {
  shopAll: "/shop",
  lifestyle: "/shop/lifestyle",
  perfumes: "/shop/perfumes",
  scarvesAndSquares: "/shop/scarves-and-squares",
  diffusers: "/shop/diffusers",
  dokraOrnaments: "/shop/dokra-ornaments",
  seasonaldrops: "/shop/seasonaldrops",
  checkout: "/checkout",
  collection: "/collection",
} as const;

export type ShopBridgeSlug =
  | "lifestyle"
  | "perfumes"
  | "scarves-and-squares"
  | "diffusers"
  | "dokra-ornaments"
  | "seasonaldrops";
export type ShopItemType =
  | "Ritual Box"
  | "Perfume"
  | "Fragrance Oil"
  | "Wax Melt"
  | "Scarf / Square"
  | "Diffuser"
  | "Dokra Ornament"
  | "Program"
  | "Retreat";
export type ShopMaterial =
  | "Composed Sets"
  | "Botanical Fragrance"
  | "Handwoven Textiles"
  | "Clay & Stone"
  | "Dokra Metal"
  | "Guided Experience";

export type ShopUseCase = "skin" | "cloth" | "diffusion objects";

export type ShopProduct = {
  id: string;
  slug: string;
  title: string;
  type: ShopItemType;
  material: ShopMaterial;
  bridgeCategory?: ShopBridgeSlug;
  useCase?: ShopUseCase;
  shortDescription?: string;
  longDescription?: string;
  price: number;
  priceLabel: string;
  image: string;
  imageAlt?: string;
  gallery?: string[];
  videoUrl?: string;
  ctaLabel?: string;
  status?: string;
  ritualTag?: string;
  ritualTagHref?: string;
  // Per-product variant pickers (e.g. colour tone). When present,
  // `ProductDetailDrawer` renders a <select> for each entry. If `required`
  // is true, Buy Now stays disabled until a value is chosen.
  customizationOptions?: Array<{
    label: string;
    values: string[];
    required?: boolean;
  }>;
};

export type ShopBridgePageConfig = {
  slug: ShopBridgeSlug;
  href: string;
  navLabel: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string[];
  heroImage: string;
  heroImageAlt: string;
  heroImagePosition?: string;
  heroQuote: string;
  introEyebrow: string;
  introTitle: string;
  introDescription: string;
  productSectionEyebrow?: string;
  productSectionTitle?: string;
  productSectionDescription?: string;
  interludeImage?: string;
  interludeImageAlt?: string;
  postCtaTitle?: string;
  postCtaDescription?: string;
  postCtaPrimaryLabel?: string;
  postCtaPrimaryHref?: string;
  postCtaSecondaryLabel?: string;
  postCtaSecondaryHref?: string;
  seoFootnote?: string;
  productSlugs: string[];
};

export const shopProducts: ShopProduct[] = [
  {
    id: "set-dawn-reset",
    slug: "dawn-reset-box",
    title: "Dawn Reset Box",
    type: "Ritual Box",
    material: "Composed Sets",
    bridgeCategory: "lifestyle",
    shortDescription: "A grounding morning composition of fragrance, textile, and reflective cues for a slower first hour.",
    longDescription:
      "A composed Seijaku set for the first quiet stretch of the day. The Dawn Reset Box brings together scent, cloth, and a small rhythm card so the transition into morning feels held rather than hurried.",
    price: 6800,
    priceLabel: "INR 6,800",
    image: "/images/Home Page hero image 1.png",
    gallery: [
      "/images/Home Page hero image 1.png",
      "/images/Seijaku Lifestyle img 1.png",
      "/images/quiet-tea-ritual-box-lifestyle-neutral.png"
    ],
  },
  {
    id: "set-reading-hour",
    slug: "reading-hour-set",
    title: "Reading Hour Set",
    type: "Ritual Box",
    material: "Composed Sets",
    bridgeCategory: "lifestyle",
    shortDescription: "Built around page, scent, and pause to help reading become a repeatable evening ritual.",
    longDescription:
      "This set gathers a small fragrance object, a reading companion, and tactile accents that gently mark the start of a private hour. It is designed less as a gift hamper and more as a repeatable habit prompt.",
    price: 7200,
    priceLabel: "INR 7,200",
    image: "/images/Hemanta drop HP banner 1.png",
    gallery: [
      "/images/Hemanta drop HP banner 1.png",
      "/images/Hemanta drop HP banner 2.png",
      "/images/Evening Unwind Set.png"
    ],
  },
  {
    id: "set-quiet-tea",
    slug: "quiet-tea-ritual-box",
    title: "Quiet Tea Ritual Box",
    type: "Ritual Box",
    material: "Composed Sets",
    bridgeCategory: "lifestyle",
    shortDescription: "A composed tea-centred set for breath-led transitions between work, rest, and private stillness.",
    longDescription:
      "Tea, scent, and cloth are arranged here around pacing rather than ceremony. The box works well for evening decompression, thoughtful gifting, or building a slower close to the workday.",
    price: 8400,
    priceLabel: "INR 8,400",
    image: "/images/Quiet Tea Ritual Box_lifestyle.JPG",
    gallery: [
      "/images/Quiet Tea Ritual Box_lifestyle.JPG",
      "/images/quiet-tea-ritual-box-lifestyle-neutral.png",
      "/images/Seijaku Lifestyle img 1.png"
    ],
  },
  {
    id: "set-evening-unwind",
    slug: "evening-unwind-gift-set",
    title: "Evening Unwind Gift Set",
    type: "Ritual Box",
    material: "Composed Sets",
    bridgeCategory: "lifestyle",
    shortDescription: "Designed for end-of-day softening through scent, tactile rhythm, and a short sensory close.",
    longDescription:
      "A softer set for evening use, built around warmth and gentle closure. It is especially suited to gifting, guest rooms, or personal end-of-day rituals that benefit from quiet repetition.",
    price: 5900,
    priceLabel: "INR 5,900",
    image: "/images/Evening Unwind Set.png",
    imageAlt: "Coffee Break diffuser styled with warm wax melt notes in a quiet studio-like setting.",
    gallery: [
      "/images/Evening Unwind Set.png",
      "/images/Home Page hero image 1.png",
      "/images/Hemanta drop HP banner 1.png"
    ],
  },
  {
    id: "perfume-spirit-01",
    slug: "spirit-01-breath-of-pines",
    title: "Spirit 01 - Breath of Pines",
    type: "Perfume",
    material: "Botanical Fragrance",
    bridgeCategory: "perfumes",
    useCase: "skin",
    shortDescription: "Air, resin, and quiet lift",
    longDescription:
      "A lighter composition for skin that opens with pine air and clear resins. Designed for the first outward breath of the day, it settles close and clean without losing softness.",
    price: 3400,
    priceLabel: "INR 3,400",
    image: "/images/hero banner HP 1.png",
    gallery: [
      "/images/hero banner HP 1.png",
      "/images/our-story-hero-banner.png",
      "/images/Seijaku Lifestyle img 1.png"
    ],
  },
  {
    id: "perfume-body-01",
    slug: "body-01-summer-held-close",
    title: "Body 01 - Summer, Held Close",
    type: "Perfume",
    material: "Botanical Fragrance",
    bridgeCategory: "perfumes",
    useCase: "skin",
    shortDescription: "Warm skin, softened light",
    longDescription:
      "Body 01 is a warmer skin composition intended for nearness rather than projection. It rests in the low warmth of summer skin, moving with the body instead of sitting above it.",
    price: 3600,
    priceLabel: "INR 3,600",
    image: "/images/Hemanta drop HP banner 1.png",
    gallery: [
      "/images/Hemanta drop HP banner 1.png",
      "/images/Hemanta drop HP banner 2.png",
      "/images/hero banner HP 1.png"
    ],
  },
  {
    id: "perfume-mind-01",
    slug: "mind-01-the-morning-desk",
    title: "Mind 01 - The Morning Desk",
    type: "Perfume",
    material: "Botanical Fragrance",
    bridgeCategory: "perfumes",
    useCase: "skin",
    shortDescription: "Paper, clarity, first thoughts",
    longDescription:
      "Built around paper-dry woods and a quieter brightness, Mind 01 is composed for early focus. It sits best on pulse points during reading, writing, or solitary desk hours.",
    price: 3550,
    priceLabel: "INR 3,550",
    image: "/images/our-story-hero-banner.png",
    imageAlt: "Black Kitty terracotta diffuser with a refined cat form placed in a smaller home corner.",
    gallery: [
      "/images/our-story-hero-banner.png",
      "/images/hero banner HP 1.png",
      "/images/Quiet Tea Ritual Box_lifestyle.JPG"
    ],
  },
  {
    id: "perfume-trilogy-kit",
    slug: "trilogy-discovery-kit",
    title: "Trilogy Discovery Kit",
    type: "Perfume",
    material: "Botanical Fragrance",
    bridgeCategory: "perfumes",
    useCase: "skin",
    shortDescription: "A way to arrive before choosing",
    longDescription:
      "A smaller-format introduction to the skin trilogy. It lets the wearer move through Spirit, Body, and Mind before settling into the state that feels most naturally their own.",
    price: 2900,
    priceLabel: "INR 2,900",
    image: "/images/quiet-tea-ritual-box-lifestyle-neutral.png",
    imageAlt: "Kolkata Prajapati Chai Bhaanr diffuser arranged in a calm tea-inspired home fragrance setting.",
    gallery: [
      "/images/quiet-tea-ritual-box-lifestyle-neutral.png",
      "/images/Hemanta drop HP banner 1.png",
      "/images/hero banner HP 1.png"
    ],
  },
  {
    id: "textile-jasmine-neroli",
    slug: "jasmine-neroli-textile-oil",
    title: "Jasmine - Neroli",
    type: "Perfume",
    material: "Botanical Fragrance",
    bridgeCategory: "perfumes",
    useCase: "cloth",
    shortDescription: "Bright, soft, and open",
    longDescription:
      "An oil-based textile blend shaped for scarves, shawls, and soft cotton. Jasmine and neroli keep the atmosphere bright while settling gently into fabric over time.",
    price: 2500,
    priceLabel: "INR 2,500",
    image: "/images/Seijaku section img 1.png",
    gallery: [
      "/images/Seijaku section img 1.png",
      "/images/seijaku sec img 2.png",
      "/images/Quiet Tea Ritual Box_lifestyle.JPG"
    ],
  },
  {
    id: "textile-lotus-jasmine",
    slug: "lotus-jasmine-textile-oil",
    title: "Lotus - Jasmine",
    type: "Perfume",
    material: "Botanical Fragrance",
    bridgeCategory: "perfumes",
    useCase: "cloth",
    shortDescription: "Stillness with bloom",
    longDescription:
      "A softer floral oil meant for cloth that stays near the body. Lotus and jasmine create a bloom-led calm that feels present yet unforced across the day.",
    price: 2550,
    priceLabel: "INR 2,550",
    image: "/images/seijaku sec img 2.png",
    gallery: [
      "/images/seijaku sec img 2.png",
      "/images/Seijaku section img 1.png",
      "/images/Quiet Tea Ritual Box_lifestyle.JPG"
    ],
  },
  {
    id: "textile-hinoki-cedar",
    slug: "hinoki-cedar-textile-oil",
    title: "Hinoki - Cedar",
    type: "Perfume",
    material: "Botanical Fragrance",
    bridgeCategory: "perfumes",
    useCase: "cloth",
    shortDescription: "Dry, grounded wood",
    longDescription:
      "Built for textiles that travel between indoors and outdoors, this blend rests in dry cedar, hinoki, and a restrained wood warmth that deepens with wear.",
    price: 2650,
    priceLabel: "INR 2,650",
    image: "/images/Evening Unwind Set.png",
    imageAlt: "Coffee Break diffuser styled with warm wax melt notes in a quiet studio-like setting.",
    gallery: [
      "/images/Evening Unwind Set.png",
      "/images/Seijaku section img 1.png",
      "/images/hero banner HP 1.png"
    ],
  },
  {
    id: "textile-rose-vetiver",
    slug: "rose-vetiver-textile-oil",
    title: "Rose - Vetiver",
    type: "Perfume",
    material: "Botanical Fragrance",
    bridgeCategory: "perfumes",
    useCase: "cloth",
    shortDescription: "Petal, root, and composure",
    longDescription:
      "Rose keeps this cloth blend open while vetiver grounds it into a quieter register. It is intended for wraps, collars, and room textiles that move close to the body.",
    price: 2700,
    priceLabel: "INR 2,700",
    image: "/images/Our Story Hero Banner 1.png",
    gallery: [
      "/images/Our Story Hero Banner 1.png",
      "/images/Seijaku section img 1.png",
      "/images/quiet-tea-ritual-box-lifestyle-neutral.png"
    ],
  },
  {
    id: "textile-tea-rice",
    slug: "tea-blossom-rice-textile-oil",
    title: "Tea Blossom - Rice",
    type: "Perfume",
    material: "Botanical Fragrance",
    bridgeCategory: "perfumes",
    useCase: "cloth",
    shortDescription: "Soft grain and pale florals",
    longDescription:
      "A textile composition for daily repetition, shaped around tea blossom and rice warmth. It leaves fabric with a gentle comfort rather than a strong scented trail.",
    price: 2480,
    priceLabel: "INR 2,480",
    image: "/images/Quiet Tea Ritual Box_lifestyle.JPG",
    gallery: [
      "/images/Quiet Tea Ritual Box_lifestyle.JPG",
      "/images/quiet-tea-ritual-box-lifestyle-neutral.png",
      "/images/Seijaku section img 1.png"
    ],
  },
  {
    id: "space-neroli-bloom",
    slug: "neroli-bloom-diffusion-vessel",
    title: "Neroli Bloom Diffusion Vessel",
    type: "Diffuser",
    material: "Clay & Stone",
    bridgeCategory: "perfumes",
    useCase: "diffusion objects",
    shortDescription: "Soft citrus bloom for resting rooms",
    longDescription:
      "A floral-fruity room composition carried in a quiet diffusion vessel. Neroli bloom is suited to bedrooms, reading corners, and places that benefit from a softer air.",
    price: 3850,
    priceLabel: "INR 3,850",
    image: "/images/Home Page hero image 1.png",
    gallery: [
      "/images/Home Page hero image 1.png",
      "/images/quiet-tea-ritual-box-lifestyle-neutral.png",
      "/images/Seijaku Lifestyle img 1.png"
    ],
  },
  {
    id: "space-plum-orchard",
    slug: "plum-orchard-room-stone",
    title: "Plum Orchard Room Stone",
    type: "Diffuser",
    material: "Clay & Stone",
    bridgeCategory: "perfumes",
    useCase: "diffusion objects",
    shortDescription: "Fruit-led stillness with a soft finish",
    longDescription:
      "Plum Orchard brings a fuller fruit softness into the room without becoming bright or loud. Best used in spaces for rest, guests, or slower evening transitions.",
    price: 3620,
    priceLabel: "INR 3,620",
    image: "/images/Hemanta drop HP banner 2.png",
    gallery: [
      "/images/Hemanta drop HP banner 2.png",
      "/images/Hemanta drop HP banner 1.png",
      "/images/Home Page hero image 1.png"
    ],
  },
  {
    id: "space-tea-steam-stone",
    slug: "tea-steam-stone-diffuser",
    title: "Tea Steam Stone Diffuser",
    type: "Diffuser",
    material: "Clay & Stone",
    bridgeCategory: "perfumes",
    useCase: "diffusion objects",
    shortDescription: "Quiet warmth and pause",
    longDescription:
      "This diffuser sits in the register of steam, warmed leaves, and soft interior air. It is designed for worktables, tea corners, and evening resets that ask for less noise.",
    price: 3980,
    priceLabel: "INR 3,980",
    image: "/images/Seijaku Lifestyle img 1.png",
    imageAlt: "Bird Nest diffuser in an artisanal natural-material composition for quiet home fragrance rituals.",
    gallery: [
      "/images/Seijaku Lifestyle img 1.png",
      "/images/quiet-tea-ritual-box-lifestyle-neutral.png",
      "/images/Home Page hero image 1.png"
    ],
  },
  {
    id: "space-kyusu-warmth",
    slug: "kyusu-warmth-reed-vessel",
    title: "Kyusu Warmth Reed Vessel",
    type: "Diffuser",
    material: "Clay & Stone",
    bridgeCategory: "perfumes",
    useCase: "diffusion objects",
    shortDescription: "Steam, leaf, and held calm",
    longDescription:
      "A reed vessel composed for slower rooms and tea-led rituals. Kyusu Warmth keeps the atmosphere low and held, offering warmth without turning the room theatrical.",
    price: 4200,
    priceLabel: "INR 4,200",
    image: "/images/quiet-tea-ritual-box-lifestyle-neutral.png",
    imageAlt: "Kolkata Prajapati Chai Bhaanr diffuser arranged in a calm tea-inspired home fragrance setting.",
    gallery: [
      "/images/quiet-tea-ritual-box-lifestyle-neutral.png",
      "/images/Quiet Tea Ritual Box_lifestyle.JPG",
      "/images/Home Page hero image 1.png"
    ],
  },
  {
    id: "space-rice-citrus",
    slug: "rice-citrus-bowl-diffuser",
    title: "Rice Citrus Bowl Diffuser",
    type: "Diffuser",
    material: "Clay & Stone",
    bridgeCategory: "perfumes",
    useCase: "diffusion objects",
    shortDescription: "Rice, citrus, and domestic ease",
    longDescription:
      "A calmer living-space diffuser built around rice warmth and soft citrus. It suits kitchens, dining corners, and rooms that need comfort more than projection.",
    price: 3880,
    priceLabel: "INR 3,880",
    image: "/images/Evening Unwind Set.png",
    imageAlt: "Coffee Break diffuser styled with warm wax melt notes in a quiet studio-like setting.",
    gallery: [
      "/images/Evening Unwind Set.png",
      "/images/Home Page hero image 1.png",
      "/images/Seijaku Lifestyle img 1.png"
    ],
  },
  {
    id: "space-cardamom-hearth",
    slug: "cardamom-hearth-vessel",
    title: "Cardamom Hearth Vessel",
    type: "Diffuser",
    material: "Clay & Stone",
    bridgeCategory: "perfumes",
    useCase: "diffusion objects",
    shortDescription: "Spice, comfort, and the room at rest",
    longDescription:
      "Cardamom Hearth is meant for living rooms and evening gatherings, where spice and warmth can stay close to the space instead of overtaking it.",
    price: 4320,
    priceLabel: "INR 4,320",
    image: "/images/Hemanta drop HP banner 1.png",
    gallery: [
      "/images/Hemanta drop HP banner 1.png",
      "/images/Home Page hero image 1.png",
      "/images/quiet-tea-ritual-box-lifestyle-neutral.png"
    ],
  },
  {
    id: "textile-bengal-japan-scarf",
    slug: "bengal-japan-modal-silk-scarf",
    title: "Bengal X Japan Modal Silk Scarf",
    type: "Scarf / Square",
    material: "Handwoven Textiles",
    bridgeCategory: "scarves-and-squares",
    shortDescription:
      "A modal silk scarf composed in forest green and red earth tones, expressing a quiet dialogue between Bengal craft sensibility and Japanese restraint.",
    longDescription:
      "Designed in a modal silk hand with a softer drape, this scarf brings together Bengal warmth and Japanese restraint through two grounded colour directions. It is meant for daily wear, thoughtful gifting, and the quiet carry of fragrance through cloth.",
    price: 3800,
    priceLabel: "INR 3,800",
    image: "/images/Seijaku section img 1.png",
    imageAlt: "Bengal X Japan modal silk scarf in a quiet editorial textile composition.",
    gallery: [
      "/images/Seijaku section img 1.png",
      "/images/seijaku sec img 2.png",
      "/images/Quiet Tea Ritual Box_lifestyle.JPG"
    ],
    customizationOptions: [
      {
        label: "Colour",
        values: ["Red Earth", "Forest Green"],
        required: true,
      },
    ],
  },
  {
    id: "textile-pine-forest-scarf",
    slug: "pine-forest-modal-silk-scarf",
    title: "A Pine Forest Modal Silk Scarf",
    type: "Scarf / Square",
    material: "Handwoven Textiles",
    bridgeCategory: "scarves-and-squares",
    shortDescription: "A softened modal silk scarf inspired by pine shade, quiet air, and contemplative movement.",
    longDescription:
      "This scarf is shaped around cooler greens, softened air, and a restrained sense of movement. Its modal silk drape makes it easy to wear across workdays, travel, and quieter hours while sitting naturally beside woody fragrances.",
    price: 4400,
    priceLabel: "INR 4,400",
    image: "/images/Evening Unwind Set.png",
    imageAlt: "Pine Forest modal silk scarf arranged in a refined textile setting with cool wooded tones.",
    gallery: [
      "/images/Evening Unwind Set.png",
      "/images/Seijaku section img 1.png",
      "/images/hero banner HP 1.png"
    ],
  },
  {
    id: "textile-kolkata-summer-scarf",
    slug: "kolkata-summer-modal-silk-scarf",
    title: "A Kolkata Summer Modal Silk Scarf",
    type: "Scarf / Square",
    material: "Handwoven Textiles",
    bridgeCategory: "scarves-and-squares",
    shortDescription:
      "A modal silk scarf shaped by warm light, city softness, and the gentle brightness of an Indian summer.",
    longDescription:
      "Warm, sun-touched, and softened in mood, this modal silk scarf draws from Kolkata summer light without becoming loud. It is designed for everyday wear, gifting, and fragrance pairing that feels lived-in rather than formal.",
    price: 3950,
    priceLabel: "INR 3,950",
    image: "/images/seijaku sec img 2.png",
    imageAlt: "Kolkata Summer modal silk scarf with a warm light-filled colour story in an editorial arrangement.",
    gallery: [
      "/images/seijaku sec img 2.png",
      "/images/Seijaku section img 1.png",
      "/images/Our Story Hero Banner 1.png"
    ],
  },
  {
    id: "textile-coffee-clear-scarf",
    slug: "coffee-clear-modal-silk-scarf",
    title: "Coffee Clear Modal Silk Scarf",
    type: "Scarf / Square",
    material: "Handwoven Textiles",
    bridgeCategory: "scarves-and-squares",
    shortDescription:
      "A calm, modern modal silk scarf with a grounded palette suited to desks, early hours, and quiet momentum.",
    longDescription:
      "Coffee Clear is built around a steadier, more contemporary palette that sits easily with work rituals and understated dressing. Its softened textile surface allows colour and scent to remain present without feeling decorative.",
    price: 3850,
    priceLabel: "INR 3,850",
    image: "/images/Our Story Hero Banner 1.png",
    imageAlt: "Coffee Clear modal silk scarf presented as a quiet refined textile for daily dressing.",
    gallery: [
      "/images/Our Story Hero Banner 1.png",
      "/images/Quiet Tea Ritual Box_lifestyle.JPG",
      "/images/Seijaku section img 1.png"
    ],
  },
  {
    id: "textile-bengal-japan-pocket-square",
    slug: "bengal-japan-modal-silk-pocket-square",
    title: "Bengal X Japan Modal Silk Pocket Square",
    type: "Scarf / Square",
    material: "Handwoven Textiles",
    bridgeCategory: "scarves-and-squares",
    shortDescription:
      "A modal silk pocket square in forest green and red earth, designed as a compact expression of cross-cultural textile quietness.",
    longDescription:
      "This smaller format carries the same Bengal x Japan colour language in a more contained gesture. It is intended for tailoring, occasion dressing, and luxury gifting that values tactility over excess.",
    price: 1650,
    priceLabel: "INR 1,650",
    image: "/images/seijaku sec img 2.png",
    imageAlt: "Bengal X Japan modal silk pocket square in a composed close-up textile frame.",
    gallery: [
      "/images/seijaku sec img 2.png",
      "/images/Seijaku section img 1.png",
      "/images/Our Story Hero Banner 1.png"
    ],
    customizationOptions: [
      {
        label: "Colour",
        values: ["Red Earth", "Forest Green"],
        required: true,
      },
    ],
  },
  {
    id: "textile-pine-forest-pocket-square",
    slug: "pine-forest-modal-silk-pocket-square",
    title: "A Pine Forest Modal Silk Pocket Square",
    type: "Scarf / Square",
    material: "Handwoven Textiles",
    bridgeCategory: "scarves-and-squares",
    shortDescription:
      "A modal silk pocket square carrying a cool, wooded calm for formalwear, gifting, and everyday detail.",
    longDescription:
      "With cooler tonal restraint and a softer wooded mood, this pocket square is designed for jackets, gifting, and subtle personal detail. Its finish keeps the textile refined without feeling over-styled.",
    price: 1750,
    priceLabel: "INR 1,750",
    image: "/images/Evening Unwind Set.png",
    imageAlt: "Pine Forest modal silk pocket square styled with cool wooded calm in a refined close-up.",
    gallery: [
      "/images/Evening Unwind Set.png",
      "/images/Seijaku section img 1.png",
      "/images/hero banner HP 1.png"
    ],
  },
  {
    id: "textile-kolkata-summer-pocket-square",
    slug: "kolkata-summer-modal-silk-pocket-square",
    title: "A Kolkata Summer Modal Silk Pocket Square",
    type: "Scarf / Square",
    material: "Handwoven Textiles",
    bridgeCategory: "scarves-and-squares",
    shortDescription:
      "A lighter, sun-touched modal silk pocket square inspired by summer air, movement, and lived warmth.",
    longDescription:
      "A more compact expression of Kolkata summer warmth, this pocket square is designed for occasion dressing, gifting, and daily tailoring details that still feel personal and soft.",
    price: 1800,
    priceLabel: "INR 1,800",
    image: "/images/Quiet Tea Ritual Box_lifestyle.JPG",
    imageAlt: "Kolkata Summer modal silk pocket square with a light warm colour story in an editorial detail shot.",
    gallery: [
      "/images/Quiet Tea Ritual Box_lifestyle.JPG",
      "/images/seijaku sec img 2.png",
      "/images/Our Story Hero Banner 1.png"
    ],
  },
  {
    id: "textile-coffee-clear-pocket-square",
    slug: "coffee-clear-modal-silk-pocket-square",
    title: "Coffee Clear Modal Silk Pocket Square",
    type: "Scarf / Square",
    material: "Handwoven Textiles",
    bridgeCategory: "scarves-and-squares",
    shortDescription:
      "A grounded, elegant modal silk pocket square suited to work rituals, gifting, and subtle evening dressing.",
    longDescription:
      "Coffee Clear in pocket square form is composed for understated refinement. It works well for work rituals, formalwear, and quiet gifting where colour, texture, and gesture matter more than display.",
    price: 1700,
    priceLabel: "INR 1,700",
    image: "/images/Our Story Hero Banner 1.png",
    imageAlt: "Coffee Clear modal silk pocket square in a grounded neutral editorial textile composition.",
    gallery: [
      "/images/Our Story Hero Banner 1.png",
      "/images/Quiet Tea Ritual Box_lifestyle.JPG",
      "/images/Seijaku section img 1.png"
    ],
  },
  {
    id: "diffuser-stone",
    slug: "stone-oil-diffuser",
    title: "Kolkata Prajapati Chai Bhaanr Diffuser",
    type: "Diffuser",
    material: "Clay & Stone",
    bridgeCategory: "diffusers",
    shortDescription:
      "A handcrafted tea-inspired diffuser rooted in the memory of a clay bhaanr; warm, nostalgic, and ideal for reading corners, desks, and intimate spaces.",
    longDescription:
      "Crafted as a quiet reference to the earthen tea bhaanr, this diffuser brings warmth and memory into smaller interiors. It is designed for slow evaporation, refillable fragrance rituals, and moments of calm beside books, notebooks, and evening light.",
    price: 2450,
    priceLabel: "INR 2,450",
    image: "/images/quiet-tea-ritual-box-lifestyle-neutral.png",
    imageAlt: "Kolkata Prajapati Chai Bhaanr diffuser arranged in a calm tea-inspired home fragrance setting.",
    gallery: [
      "/images/quiet-tea-ritual-box-lifestyle-neutral.png",
      "/images/Home Page hero image 1.png",
      "/images/Evening Unwind Set.png"
    ],
  },
  {
    id: "diffuser-brass-tealight",
    slug: "brass-tea-light-diffuser",
    title: "Coffee Break Diffuser",
    type: "Diffuser",
    material: "Clay & Stone",
    bridgeCategory: "diffusers",
    shortDescription:
      "A coffee-inspired diffuser ritual paired with refillable scented soy wax melts, designed for worktables, studio pauses, and slow afternoon resets.",
    longDescription:
      "This diffuser is composed around the pause of a coffee break rather than the rush around it. Used with wax melts, it brings a warmer, more immediate scent ritual to desks, shared studios, and slow afternoon resets.",
    price: 3100,
    priceLabel: "INR 3,100",
    image: "/images/Evening Unwind Set.png",
    imageAlt: "Coffee Break diffuser styled with warm wax melt notes in a quiet studio-like setting.",
    gallery: [
      "/images/Evening Unwind Set.png",
      "/images/Home Page hero image 1.png",
      "/images/our-story-hero-banner.png"
    ],
  },
  {
    id: "diffuser-reed",
    slug: "reed-diffuser-cedar-smoke",
    title: "Black Kitty Terracotta Diffuser",
    type: "Diffuser",
    material: "Clay & Stone",
    bridgeCategory: "diffusers",
    shortDescription:
      "A playful yet refined terracotta cat diffuser that brings warmth, character, and scent to smaller home spaces.",
    longDescription:
      "Playful in silhouette but restrained in presence, this terracotta cat diffuser is shaped for compact rooms and thoughtful corners. It holds fragrance with a sense of character while remaining grounded, artisanal, and easy to live with.",
    price: 3750,
    priceLabel: "INR 3,750",
    image: "/images/our-story-hero-banner.png",
    imageAlt: "Black Kitty terracotta diffuser with a refined cat form placed in a smaller home corner.",
    gallery: [
      "/images/our-story-hero-banner.png",
      "/images/Home Page hero image 1.png",
      "/images/Seijaku Lifestyle img 1.png"
    ],
  },
  {
    id: "diffuser-clay-vessel",
    slug: "clay-vessel-diffuser",
    title: "Bird Nest Diffuser",
    type: "Diffuser",
    material: "Clay & Stone",
    bridgeCategory: "diffusers",
    shortDescription:
      "A nature-led diffuser form inspired by nests, quiet gardens, and outdoor softness; suited for restful corners and reflective rituals.",
    longDescription:
      "Inspired by nest forms and the sheltering quiet of outdoor spaces, this diffuser brings a softer natural texture into the room. It works especially well where rest, reflection, and slower transitions are part of the daily rhythm.",
    price: 4250,
    priceLabel: "INR 4,250",
    image: "/images/Seijaku Lifestyle img 1.png",
    imageAlt: "Bird Nest diffuser in an artisanal natural-material composition for quiet home fragrance rituals.",
    gallery: [
      "/images/Seijaku Lifestyle img 1.png",
      "/images/quiet-tea-ritual-box-lifestyle-neutral.png",
      "/images/Home Page hero image 1.png"
    ],
  },
  {
    id: "dokra-japan-handfan-brooch",
    slug: "japan-handfan-brooch",
    title: "Japan Handfan Brooch",
    type: "Dokra Ornament",
    material: "Dokra Metal",
    bridgeCategory: "dokra-ornaments",
    shortDescription: "A folding gesture cast in metal, opening space where there was none.",
    longDescription:
      "A dokra brooch shaped around the handfan as a gesture of opening. The form sits close to cloth, lapel, or soft bag surfaces, carrying a feeling of pause rather than display.",
    ritualTag: "Part of Unfold Ritual Set",
    ritualTagHref: "/shop/lifestyle#unfold-ritual-box-01",
    price: 2850,
    priceLabel: "INR 2,850",
    image: "/images/japanese fan hero Our Story.png",
    gallery: [
      "/images/japanese fan hero Our Story.png",
      "/images/Seasonal Drop Listen before shaping.jpg",
      "/images/Seasonal Drop Raja-Kundo.jpg"
    ],
  },
  {
    id: "dokra-bengal-handfan-i-brooch",
    slug: "bengal-handfan-i-brooch",
    title: "Bengal Handfan I Brooch",
    type: "Dokra Ornament",
    material: "Dokra Metal",
    bridgeCategory: "dokra-ornaments",
    shortDescription: "A wider spread of air and intention, carried as a quiet metal form.",
    longDescription:
      "This first Bengal handfan brooch carries a fuller silhouette and a wider visual breath. It is designed for garments, wraps, and ritual textiles that invite a gentler outward presence.",
    ritualTag: "Part of Unfold Ritual Set",
    ritualTagHref: "/shop/lifestyle#unfold-ritual-box-01",
    price: 3050,
    priceLabel: "INR 3,050",
    image: "/images/Seasonal Drop Raja-Kundo.jpg",
    gallery: [
      "/images/Seasonal Drop Raja-Kundo.jpg",
      "/images/Seasonal Drop Rishi Chhatim.jpg",
      "/images/Seasonal Drop Listen before shaping.jpg"
    ],
  },
  {
    id: "dokra-bengal-handfan-ii-brooch",
    slug: "bengal-handfan-ii-brooch",
    title: "Bengal Handfan II Brooch",
    type: "Dokra Ornament",
    material: "Dokra Metal",
    bridgeCategory: "dokra-ornaments",
    shortDescription: "A quieter variation, shaped for cloth, pause, and everyday gesture.",
    longDescription:
      "A softer variation in the handfan language, this brooch is shaped for slower dressing rituals and quieter moments of return. Its cast texture keeps the object tactile and unhurried.",
    ritualTag: "Part of Unfold Ritual Set",
    ritualTagHref: "/shop/lifestyle#unfold-ritual-box-01",
    price: 2950,
    priceLabel: "INR 2,950",
    image: "/images/Seasonal Drop Nandini Raktakarabi.jpg",
    gallery: [
      "/images/Seasonal Drop Nandini Raktakarabi.jpg",
      "/images/Seasonal Drop Listen before shaping.jpg",
      "/images/Seasonal Drop Raja-Kundo.jpg"
    ],
  },
  {
    id: "dokra-conch-brooch",
    slug: "conch-brooch",
    title: "Conch Brooch",
    type: "Dokra Ornament",
    material: "Dokra Metal",
    bridgeCategory: "dokra-ornaments",
    shortDescription: "A symbol of beginning, cast as a small marker of presence and return.",
    longDescription:
      "The conch form suggests calling inward before speaking outward. Worn on cloth or kept near a daily surface, it marks beginnings with a steadier, more reflective tempo.",
    ritualTag: "Part of Listen Ritual Set",
    ritualTagHref: "/shop/lifestyle#listen-ritual-box-02",
    price: 3150,
    priceLabel: "INR 3,150",
    image: "/images/Seasonal Drop Listen before shaping.jpg",
    gallery: [
      "/images/Seasonal Drop Listen before shaping.jpg",
      "/images/Seasonal Drop Ispani Jui.jpg",
      "/images/Seasonal Drop Rishi Chhatim.jpg"
    ],
  },
  {
    id: "dokra-temple-bell-brooch",
    slug: "temple-bell-brooch",
    title: "Temple Bell Brooch",
    type: "Dokra Ornament",
    material: "Dokra Metal",
    bridgeCategory: "dokra-ornaments",
    shortDescription: "A held resonance, marking transitions and pause.",
    longDescription:
      "Temple Bell Brooch is shaped as a small marker of transition. Its presence is less ornamental than rhythmic, giving garments and ritual corners a subtle sense of arrival and pause.",
    ritualTag: "Part of Attune Ritual Set",
    ritualTagHref: "/shop/lifestyle#attune-ritual-box-03",
    price: 3250,
    priceLabel: "INR 3,250",
    image: "/images/Seasonal Drop Rishi Chhatim.jpg",
    gallery: [
      "/images/Seasonal Drop Rishi Chhatim.jpg",
      "/images/Seasonal Drop Ispani Jui.jpg",
      "/images/Seasonal Drop Raja-Kundo.jpg"
    ],
  },
  {
    id: "program-adult-unwind",
    slug: "adult-unwind-program",
    title: "Adult Unwind Program",
    type: "Program",
    material: "Guided Experience",
    shortDescription: "A guided one-day practice in breath, scent, and sensory rest for urban adults.",
    longDescription:
      "A slower, in-person format designed to help adults reset the nervous system through scent, breath, and tactile pacing. Structured for one day, with a strong editorial and reflective frame.",
    price: 5400,
    priceLabel: "INR 5,400",
    image: "/images/our-story-hero-banner.png",
    imageAlt: "Black Kitty terracotta diffuser with a refined cat form placed in a smaller home corner.",
    gallery: [
      "/images/our-story-hero-banner.png",
      "/images/Our story hero banner 2.png",
      "/images/Our Story Hero Banner 1.png"
    ],
    ctaLabel: "Reserve Place",
    status: "Booking Open",
  },
  {
    id: "program-elder-reset",
    slug: "elder-reset-program",
    title: "Elder Reset Program",
    type: "Program",
    material: "Guided Experience",
    shortDescription: "A gentle sensory format designed around slower pace, comfort, and calm continuity.",
    longDescription:
      "A one-day guided practice designed for older participants, with carefully paced transitions and a lower-stimulation environment. The focus is on comfort, steadiness, and quiet engagement.",
    price: 3600,
    priceLabel: "INR 3,600",
    image: "/images/Our Story Hero Banner 1.png",
    gallery: [
      "/images/Our Story Hero Banner 1.png",
      "/images/our-story-hero-banner.png",
      "/images/Our story hero banner 2.png"
    ],
    ctaLabel: "Reserve Place",
    status: "Booking Open",
  },
  {
    id: "retreat-autumn",
    slug: "autumn-quiet-retreat",
    title: "Autumn Quiet Retreat",
    type: "Retreat",
    material: "Guided Experience",
    shortDescription: "A three-day retreat in ritual, rest, and crafted attention across seasonal Bengal.",
    longDescription:
      "A deeper Seijaku format for participants who want immersion rather than a single-day encounter. The retreat layers object, practice, and place into a slower seasonal experience.",
    price: 24500,
    priceLabel: "INR 24,500",
    image: "/images/japanese fan hero Our Story.png",
    gallery: [
      "/images/japanese fan hero Our Story.png",
      "/images/our-story-hero-banner.png",
      "/images/Our Story Hero Banner 1.png"
    ],
    ctaLabel: "Book Retreat",
    status: "Booking Open",
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Hemanta Seasonal Drop — keep these four together. Referenced by
  // /seasonaldrops-hemanta Reserve buttons (forms[] in SeasonalDropsPage.tsx).
  // `videoUrl: ""` is a scaffold: drawer falls back to image-only when falsy;
  // drop in a real URL when a clip is ready and video will render automatically.
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "hemanta-nandini",
    slug: "hemanta-nandini",
    title: "Nandini",
    type: "Ritual Box",
    material: "Composed Sets",
    shortDescription: "Warmth without submission.",
    longDescription:
      "Nandini is the fullest Hemanta expression — a composed ritual box that carries the Raktakarabi (Red Oleander) scent across a handcrafted terracotta diffuser, fragrance oil, wax melts, candles, a halogen lamp, a textile narrative, and an archival box. It is made to be held, not displayed; a room's quiet companion through the Bengal autumn.",
    price: 6499,
    priceLabel: "INR 6,499",
    image: "/images/seasonal-drop-nandini-raktakarabi.jpg",
    imageAlt: "Nandini ritual box paired with the Raktakarabi scent",
    gallery: [
      "/images/seasonal-drop-nandini-raktakarabi.jpg",
      "/images/Hemanta drop HP banner 1.png",
      "/images/Hemanta drop HP banner 2.png",
    ],
    videoUrl: "",
  },
  {
    id: "hemanta-raja-diffuser",
    slug: "hemanta-raja-diffuser",
    title: "Raja",
    type: "Diffuser",
    material: "Clay & Stone",
    shortDescription: "Power in shadow.",
    longDescription:
      "Raja is a terracotta diffuser in the Hemanta archive, carrying the Kundo (Star Jasmine) scent. Shaped for desks, bedside tables, and reading corners, it holds the scent low and steady through a cool autumn room. Available in three tones — Dark, Slate, and Copper — each kiln-finished and quietly distinct.",
    price: 4499,
    priceLabel: "INR 4,499",
    image: "/images/seasonal-drop-raja-kundo.jpg",
    imageAlt: "Raja diffuser paired with the Kundo scent",
    gallery: [
      "/images/seasonal-drop-raja-kundo.jpg",
      "/images/Hemanta drop HP banner 1.png",
      "/images/Hemanta drop HP banner 2.png",
    ],
    videoUrl: "",
    customizationOptions: [
      {
        label: "Pick a tone",
        values: ["Dark", "Slate", "Copper"],
        required: true,
      },
    ],
  },
  {
    id: "hemanta-ispani",
    slug: "hemanta-ispani",
    title: "Ispani",
    type: "Ritual Box",
    material: "Composed Sets",
    shortDescription: "Home discovered through scent.",
    longDescription:
      "Ispani gathers the Bengal Jui (Jasmine) composition into a ritual box built around return. Diffuser, fragrance oil, wax melts, candles, a halogen lamp, a textile narrative, and an archival box arrive together — a small domestic world that asks the evening to slow. Kept close to the reading chair or the threshold of a bedroom.",
    price: 6499,
    priceLabel: "INR 6,499",
    image: "/images/seasonal-drop-ispani-jui.jpg",
    imageAlt: "Ispani ritual box paired with the Bengal Jui scent",
    gallery: [
      "/images/seasonal-drop-ispani-jui.jpg",
      "/images/Hemanta drop HP banner 1.png",
      "/images/Hemanta drop HP banner 2.png",
    ],
    videoUrl: "",
  },
  {
    id: "hemanta-rishi-diffuser",
    slug: "hemanta-rishi-diffuser",
    title: "Rishi",
    type: "Diffuser",
    material: "Clay & Stone",
    shortDescription: "Release without spectacle.",
    longDescription:
      "Rishi carries the Chhatim scent — a reflective, close-held fragrance for the quiet evenings of Hemanta. The form is a terracotta diffuser intended for a bedside table or meditation corner. Available in two tones, Emerald and Terracotta, each finished with a subtle restraint that lets the scent do the speaking.",
    price: 5499,
    priceLabel: "INR 5,499",
    image: "/images/seasonal-drop-rishi-chhatim.jpg",
    imageAlt: "Rishi diffuser paired with the Chhatim scent",
    gallery: [
      "/images/seasonal-drop-rishi-chhatim.jpg",
      "/images/Hemanta drop HP banner 1.png",
      "/images/Hemanta drop HP banner 2.png",
    ],
    videoUrl: "",
    customizationOptions: [
      {
        label: "Pick a tone",
        values: ["Emerald", "Terracotta"],
        required: true,
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Hemanta Collection — smaller-format diffuser sets (separate SKUs from the
  // full ritual boxes above). Auto-join the HEMANTA collection via the seed's
  // inferCollections slug match on "hemanta". Prices are placeholders — edit
  // when final pricing is confirmed. Images stub to existing assets; swap to
  // dedicated product photography when available (intended filenames noted).
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "hemanta-ispani-diffuser-set",
    slug: "hemanta-ispani-diffuser-set",
    title: "Ispani Diffuser Set",
    type: "Diffuser",
    material: "Clay & Stone",
    shortDescription: "A smaller Ispani ritual — diffuser and oil in the Bengal Jui scent.",
    longDescription:
      "A pared-back format of the Hemanta Ispani experience: a terracotta diffuser paired with the Bengal Jui fragrance oil, without the accompanying textile, halogen lamp, and archival box. Designed for a bedside table or a reading corner that asks for scent without ceremony.",
    price: 3299,
    priceLabel: "INR 3,299",
    // TODO: swap to /images/hemanta-ispani-diffuser-set.jpg when final photography is ready.
    image: "/images/seasonal-drop-ispani-jui.jpg",
    imageAlt: "Ispani diffuser set paired with the Bengal Jui scent",
    gallery: [
      "/images/seasonal-drop-ispani-jui.jpg",
      "/images/Hemanta drop HP banner 1.png",
      "/images/Hemanta drop HP banner 2.png",
    ],
    videoUrl: "",
  },
  {
    id: "hemanta-rishi-diffuser-set",
    slug: "hemanta-rishi-diffuser-set",
    title: "Rishi Diffuser Set",
    type: "Diffuser",
    material: "Clay & Stone",
    shortDescription: "A smaller Rishi ritual — diffuser and oil in the Chhatim scent.",
    longDescription:
      "A compact Hemanta Rishi — a terracotta diffuser paired with the Chhatim fragrance oil. Built around the same reflective evening character as the full Rishi diffuser but in a lighter, gift-friendly format.",
    price: 3499,
    priceLabel: "INR 3,499",
    // TODO: swap to /images/hemanta-rishi-diffuser-set.jpg when final photography is ready.
    image: "/images/seasonal-drop-rishi-chhatim.jpg",
    imageAlt: "Rishi diffuser set paired with the Chhatim scent",
    gallery: [
      "/images/seasonal-drop-rishi-chhatim.jpg",
      "/images/Hemanta drop HP banner 1.png",
      "/images/Hemanta drop HP banner 2.png",
    ],
    videoUrl: "",
    customizationOptions: [
      {
        label: "Pick a tone",
        values: ["Emerald", "Terracotta"],
        required: true,
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Bengal Kitchen Fragrance Oils (15 ml each) — tagged under /shop/perfumes
  // via bridgeCategory. Prices are placeholders. Images stub to a nearby
  // kitchen-warm still life; replace with dedicated bottle shots when ready.
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "basmati-fragrance-oil",
    slug: "basmati-fragrance-oil",
    title: "Basmati Fragrance Oil",
    type: "Fragrance Oil",
    material: "Botanical Fragrance",
    bridgeCategory: "perfumes",
    useCase: "diffusion objects",
    shortDescription: "Warm rice, kitchen memory, quiet comfort. 15 ml.",
    longDescription:
      "A fragrance oil composed around the softness of cooked Basmati — warm, cereal, almost buttered. Built for use in small diffusers and for layering into domestic ritual where the scent should feel like food memory rather than perfume.",
    price: 1499,
    priceLabel: "INR 1,499",
    // TODO: swap to /images/basmati-fragrance-oil.jpg when final photography is ready.
    image: "/images/Quiet Tea Ritual Box_lifestyle.JPG",
    imageAlt: "Basmati fragrance oil bottle in a warm kitchen-toned still life",
    gallery: [
      "/images/Quiet Tea Ritual Box_lifestyle.JPG",
      "/images/hero banner HP 1.png",
    ],
    videoUrl: "",
  },
  {
    id: "gondhoraj-fragrance-oil",
    slug: "gondhoraj-fragrance-oil",
    title: "Gondhoraj Lime Fragrance Oil",
    type: "Fragrance Oil",
    material: "Botanical Fragrance",
    bridgeCategory: "perfumes",
    useCase: "diffusion objects",
    shortDescription: "The bright Bengal lime, close and fragrant. 15 ml.",
    longDescription:
      "Gondhoraj — the fragrant Bengal lime — rendered as a diffuser oil. Bright, cut-grass green at the top, softening into a rounded floral citrus. Sits well in kitchens, reading rooms, and the quieter hours of Bengal summer.",
    price: 1499,
    priceLabel: "INR 1,499",
    // TODO: swap to /images/gondhoraj-fragrance-oil.jpg when final photography is ready.
    image: "/images/Quiet Tea Ritual Box_lifestyle.JPG",
    imageAlt: "Gondhoraj lime fragrance oil bottle in a quiet Bengal editorial frame",
    gallery: [
      "/images/Quiet Tea Ritual Box_lifestyle.JPG",
      "/images/hero banner HP 1.png",
    ],
    videoUrl: "",
  },
  {
    id: "garam-masala-fragrance-oil",
    slug: "garam-masala-fragrance-oil",
    title: "Garam Masala Fragrance Oil",
    type: "Fragrance Oil",
    material: "Botanical Fragrance",
    bridgeCategory: "perfumes",
    useCase: "diffusion objects",
    shortDescription: "A low, spiced warmth for quieter evenings. 15 ml.",
    longDescription:
      "A warm composition around cardamom, clove, and cinnamon — garam masala rendered as diffuser oil rather than kitchen spice. Low-sitting, evening-leaning, and particularly at home in the colder Bengal months.",
    price: 1499,
    priceLabel: "INR 1,499",
    // TODO: swap to /images/garam-masala-fragrance-oil.jpg when final photography is ready.
    image: "/images/Hemanta drop HP banner 1.png",
    imageAlt: "Garam masala fragrance oil bottle with warm spiced tonality",
    gallery: [
      "/images/Hemanta drop HP banner 1.png",
      "/images/Quiet Tea Ritual Box_lifestyle.JPG",
    ],
    videoUrl: "",
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Wax Melts (50 g each) — tagged under /shop/diffusers via bridgeCategory.
  // Placeholder prices. Stubs from the Evening Unwind still life; swap when
  // dedicated photography lands.
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "coffee-wax-melt",
    slug: "coffee-wax-melt",
    title: "Coffee Wax Melt",
    type: "Wax Melt",
    material: "Botanical Fragrance",
    bridgeCategory: "diffusers",
    useCase: "diffusion objects",
    shortDescription: "A low coffee warmth for the work desk. 50 g.",
    longDescription:
      "A wax melt composed around roasted coffee — steadier and less aromatic than a cup in the hand. Designed for the quieter afternoon hours where the scent signals pause without pulling attention.",
    price: 899,
    priceLabel: "INR 899",
    // TODO: swap to /images/coffee-wax-melt.jpg when final photography is ready.
    image: "/images/Evening Unwind Set.png",
    imageAlt: "Coffee wax melt in a warm studio still life",
    gallery: [
      "/images/Evening Unwind Set.png",
      "/images/Home Page hero image 1.png",
    ],
    videoUrl: "",
  },
  {
    id: "caramel-wax-melt",
    slug: "caramel-wax-melt",
    title: "Caramel Wax Melt",
    type: "Wax Melt",
    material: "Botanical Fragrance",
    bridgeCategory: "diffusers",
    useCase: "diffusion objects",
    shortDescription: "Softened sugar and a quiet warmth. 50 g.",
    longDescription:
      "A caramel wax melt with a lower-sweet register — less dessert, more late-afternoon. Pairs well with reading corners and slower evenings.",
    price: 899,
    priceLabel: "INR 899",
    // TODO: swap to /images/caramel-wax-melt.jpg when final photography is ready.
    image: "/images/Evening Unwind Set.png",
    imageAlt: "Caramel wax melt with soft golden tonality",
    gallery: [
      "/images/Evening Unwind Set.png",
      "/images/Home Page hero image 1.png",
    ],
    videoUrl: "",
  },
  {
    id: "chocolate-wax-melt",
    slug: "chocolate-wax-melt",
    title: "Chocolate Wax Melt",
    type: "Wax Melt",
    material: "Botanical Fragrance",
    bridgeCategory: "diffusers",
    useCase: "diffusion objects",
    shortDescription: "Dark chocolate, grounded and close-held. 50 g.",
    longDescription:
      "A dark-chocolate wax melt, warm and quieter than one might expect. Sits well in winter rooms, reading chairs, and the slow evenings of Hemanta.",
    price: 899,
    priceLabel: "INR 899",
    // TODO: swap to /images/chocolate-wax-melt.jpg when final photography is ready.
    image: "/images/Evening Unwind Set.png",
    imageAlt: "Chocolate wax melt in a low-lit editorial still life",
    gallery: [
      "/images/Evening Unwind Set.png",
      "/images/Home Page hero image 1.png",
    ],
    videoUrl: "",
  },
];

export const shopBridgePages: ShopBridgePageConfig[] = [
  {
    slug: "lifestyle",
    href: canonicalShopRoutes.lifestyle,
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
    href: canonicalShopRoutes.perfumes,
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
    postCtaPrimaryHref: canonicalShopRoutes.lifestyle,
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
      "cardamom-hearth-vessel"
    ],
  },
  {
    slug: "scarves-and-squares",
    href: canonicalShopRoutes.scarvesAndSquares,
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
      "coffee-clear-modal-silk-pocket-square"
    ],
  },
  {
    slug: "diffusers",
    href: canonicalShopRoutes.diffusers,
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
    href: canonicalShopRoutes.dokraOrnaments,
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
    postCtaPrimaryHref: canonicalShopRoutes.lifestyle,
    postCtaSecondaryLabel: "Begin Daily Ritual",
    postCtaSecondaryHref: "/ritual",
    seoFootnote:
      "Handcrafted dokra brooches from Bengal, made using traditional lost-wax casting. Each piece functions as both ornament and ritual object - designed for slow living, meaningful gifting, and personal daily practices.",
    productSlugs: [
      "japan-handfan-brooch",
      "bengal-handfan-i-brooch",
      "bengal-handfan-ii-brooch",
      "conch-brooch",
      "temple-bell-brooch"
    ],
  },
  {
    // Entry-point bridge for all seasonal drops. Today it surfaces the
    // Hemanta diffuser sets; future drops (sravan, basanta, ...) join by
    // appending their slugs to `productSlugs`. The editorial story for each
    // drop still lives on its own page (e.g. /seasonaldrops-hemanta).
    slug: "seasonaldrops",
    href: canonicalShopRoutes.seasonaldrops,
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
    productSlugs: [
      "hemanta-ispani-diffuser-set",
      "hemanta-rishi-diffuser-set",
    ],
  },
];

export const canonicalBridgeSlugs = shopBridgePages.map((page) => page.slug);

export function getShopProductBySlug(slug: string) {
  return shopProducts.find((item) => item.slug === slug);
}

export function getShopBridgePageBySlug(slug: string) {
  return shopBridgePages.find((page) => page.slug === slug);
}

export function getShopBridgeProducts(slug: ShopBridgeSlug) {
  const page = getShopBridgePageBySlug(slug);

  if (!page) {
    return [];
  }

  return page.productSlugs
    .map((productSlug) => getShopProductBySlug(productSlug))
    .filter((item): item is ShopProduct => Boolean(item));
}

export function getProductsGroupedByMaterialThenType() {
  const grouped = new Map<ShopMaterial, Map<ShopItemType, ShopProduct[]>>();

  for (const item of shopProducts) {
    if (!grouped.has(item.material)) {
      grouped.set(item.material, new Map<ShopItemType, ShopProduct[]>());
    }

    const byType = grouped.get(item.material);

    if (!byType) {
      continue;
    }

    if (!byType.has(item.type)) {
      byType.set(item.type, []);
    }

    byType.get(item.type)?.push(item);
  }

  return Array.from(grouped.entries()).map(([material, byType]) => ({
    material,
    types: Array.from(byType.entries()).map(([type, items]) => ({
      type,
      items,
    })),
  }));
}

export type ShopItem = ShopProduct & {
  category: string;
  audience: string;
  collection: string;
  format: string;
  status: string;
  tags: string[];
  isFeatured: boolean;
  isLimitedEdition: boolean;
  isInStock: boolean;
  ctaLabel: string;
  createdAt: string;
};

export type ShopAudience = "All Ages" | "Adults" | "Elderly" | "Teenagers";
export type ShopAvailability = "In Stock" | "Limited Edition" | "Upcoming" | "Open for Booking" | "Sold Out" | "Waitlist" | "Booking Open";
export type ShopCollection = "Core Collection" | "Seasonal Drop" | "Hemanta";
export type ShopFormat = "Physical" | "In-Person";
export type ShopTopCategory = "All";
export type ShopSortOption = "Recommended" | "Newest" | "Price low to high" | "Price high to low";

export const shopAllItems = shopProducts as unknown as ShopItem[];
export const shopTopCategories = ["All"] as const;
export const sortOptions = ["Recommended", "Newest", "Price low to high", "Price high to low"] as const;
export const getShopItemBySlug = getShopProductBySlug;

const shopProductReleaseDates: Partial<Record<string, string>> = {
  "quiet-tea-ritual-box": "2026-03-12",
  "reading-hour-set": "2026-03-08",
  "dawn-reset-box": "2026-03-03",
  "evening-unwind-gift-set": "2026-02-25",
  "smoke-tea-parfum": "2026-03-15",
  "saffron-plum-attar": "2026-03-10",
  "neroli-linen-mist": "2026-03-01",
  "hinoki-morning-oil": "2026-02-20",
  "table-ritual-napkin-pair": "2026-03-11",
  "tea-room-pocket-square": "2026-03-05",
  "rain-quiet-wrap": "2026-02-28",
  "mulberry-dawn-scarf": "2026-02-18",
  "clay-vessel-diffuser": "2026-03-14",
  "reed-diffuser-cedar-smoke": "2026-03-07",
  "brass-tea-light-diffuser": "2026-02-27",
  "stone-oil-diffuser": "2026-02-22",
  "threshold-bell-ornament": "2026-03-13",
  "dokra-bird-figure": "2026-03-09",
  "dokra-talisman-pair": "2026-02-26",
  "quiet-lamp-charm": "2026-02-19",
  "adult-unwind-program": "2026-03-06",
  "elder-reset-program": "2026-02-24",
  "autumn-quiet-retreat": "2026-02-16",
};

// Product statuses that should surface the "Notify Me" CTA in place of
// Buy Now. Kept narrow on purpose — Sold Out / Upcoming stay as
// information-only badges (no capture form) per DECISIONS #14.
export const notifiableStatuses = ["Waitlist"] as const;

export type NotifiableStatus = (typeof notifiableStatuses)[number];

// Statuses that should completely suppress the primary CTA (no Buy Now,
// no Notify Me). The action row shows View Details + Wishlist only,
// with a short status label in the CTA slot.
export const unbuyableStatuses = ["Sold Out", "Upcoming"] as const;

export function isNotifyMeProduct(item: ShopProduct): boolean {
  return Boolean(item.status && (notifiableStatuses as readonly string[]).includes(item.status));
}

export function isUnbuyableProduct(item: ShopProduct): boolean {
  return Boolean(item.status && (unbuyableStatuses as readonly string[]).includes(item.status));
}

export function getShopProductUseCase(item: ShopProduct): ShopUseCase | undefined {
  if (item.useCase) {
    return item.useCase;
  }

  if (item.type === "Perfume") {
    return "skin";
  }

  if (item.type === "Scarf / Square") {
    return "cloth";
  }

  if (item.type === "Diffuser") {
    return "diffusion objects";
  }

  return undefined;
}

export function getShopProductReleaseDate(item: ShopProduct) {
  return shopProductReleaseDates[item.slug] ?? "2026-01-01";
}

export type ShopTypeFilterOption =
  | "Fragrances"
  | "Body"
  | "Diffusers"
  | "Objects"
  | "Textiles"
  | "Gift Sets"
  | "For Yourself"
  | "For a Loved One"
  | "Dokra Ornaments"
  | "Home Objects: Diffusers"
  | "Scarves & Squares"
  | "Programs"
  | "Retreats";

export type ShopMaterialFilterOption =
  | "Oil-based Perfumes"
  | "Ethanol-based Perfumes"
  | "Clay & Stone"
  | "Dokra (Metal)"
  | "Handwoven textiles"
  | "Printed textiles";

const shopTypeFilterOptions: ShopTypeFilterOption[] = [
  "Fragrances",
  "Body",
  "Diffusers",
  "Objects",
  "Textiles",
  "Gift Sets",
  "For Yourself",
  "For a Loved One",
  "Dokra Ornaments",
  "Home Objects: Diffusers",
  "Scarves & Squares",
  "Programs",
  "Retreats",
];

const shopMaterialFilterOptions: ShopMaterialFilterOption[] = [
  "Oil-based Perfumes",
  "Ethanol-based Perfumes",
  "Clay & Stone",
  "Dokra (Metal)",
  "Handwoven textiles",
  "Printed textiles",
];

export function matchesShopTypeFilter(item: ShopProduct, selectedType: ShopTypeFilterOption | "All") {
  if (selectedType === "All") {
    return true;
  }

  if (selectedType === "Fragrances") {
    return item.type === "Perfume" || item.type === "Diffuser";
  }

  if (selectedType === "Body") {
    return item.type === "Perfume";
  }

  if (selectedType === "Diffusers" || selectedType === "Home Objects: Diffusers") {
    return item.type === "Diffuser";
  }

  if (selectedType === "Objects" || selectedType === "Dokra Ornaments") {
    return item.type === "Dokra Ornament";
  }

  if (selectedType === "Textiles" || selectedType === "Scarves & Squares") {
    return item.type === "Scarf / Square";
  }

  if (selectedType === "Gift Sets" || selectedType === "For Yourself" || selectedType === "For a Loved One") {
    return item.type === "Ritual Box";
  }

  if (selectedType === "Programs") {
    return item.type === "Program";
  }

  if (selectedType === "Retreats") {
    return item.type === "Retreat";
  }

  return false;
}

export function matchesShopMaterialFilter(item: ShopProduct, selectedMaterial: ShopMaterialFilterOption | "All") {
  if (selectedMaterial === "All") {
    return true;
  }

  if (selectedMaterial === "Oil-based Perfumes" || selectedMaterial === "Ethanol-based Perfumes") {
    return item.type === "Perfume";
  }

  if (selectedMaterial === "Clay & Stone") {
    return item.material === "Clay & Stone";
  }

  if (selectedMaterial === "Dokra (Metal)") {
    return item.material === "Dokra Metal";
  }

  if (selectedMaterial === "Handwoven textiles" || selectedMaterial === "Printed textiles") {
    return item.material === "Handwoven Textiles";
  }

  return false;
}

export function getShopTypes() {
  return shopTypeFilterOptions;
}

export function getShopMaterials() {
  return shopMaterialFilterOptions;
}

export function getShopUseCases() {
  return Array.from(
    new Set(
      shopProducts
        .map((item) => getShopProductUseCase(item))
        .filter((value): value is ShopUseCase => Boolean(value))
    )
  );
}














