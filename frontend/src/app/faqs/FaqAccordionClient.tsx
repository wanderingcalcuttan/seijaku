"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqCategory = {
  category: string;
  items: FaqItem[];
};

const faqData: FaqCategory[] = [
  {
    category: "Orders & Payment",
    items: [
      {
        question: "Can I modify my order after placing it?",
        answer: "If your order has not yet been packed or dispatched, we'll do our best to accommodate changes. Please write to us as soon as possible at lifeatseijaku@gmail.com with your order number. Once an order has entered the dispatch process, we are unable to make changes.",
      },
      {
        question: "Can I cancel my order?",
        answer: "Orders may be cancelled only before they have been packed or dispatched. Please contact us immediately after placing your order if you wish to cancel it.",
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept secure online payments through our payment gateway, including:\n• UPI\n• Credit Cards\n• Debit Cards\n• Net Banking\n• Popular digital wallets (where supported)\n\nCash on Delivery (COD) may be available for selected PIN codes.",
      },
      {
        question: "Will I receive an order confirmation?",
        answer: "Yes. You'll receive an email confirming your order shortly after it has been successfully placed. Once your order is dispatched, you'll also receive shipment tracking details via email and/or WhatsApp.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    items: [
      {
        question: "How long does shipping take?",
        answer: "Orders are generally dispatched within 1–3 business days.\n\nEstimated delivery:\n• Metro cities: 2–5 business days\n• Other locations: 3–8 business days\n\nDelivery timelines may vary depending on your location and courier operations.",
      },
      {
        question: "Do you ship across India?",
        answer: "Yes. We currently ship to most serviceable locations across India.",
      },
      {
        question: "Do you offer international shipping?",
        answer: "Not at the moment. We hope to introduce international shipping in the future.",
      },
      {
        question: "My order is delayed. What should I do?",
        answer: "Occasionally, deliveries may be delayed due to weather, courier operations or regional service disruptions. If your tracking has not updated for an extended period or you need assistance, please email lifeatseijaku@gmail.com and we'll be happy to help.",
      },
      {
        question: "My parcel shows as delivered, but I haven't received it.",
        answer: "Please first check with family members, neighbours or your building's security desk. If you're still unable to locate the parcel, contact us within 48 hours and we'll investigate the matter with our courier partner.",
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    items: [
      {
        question: "Can I return my purchase?",
        answer: "Certain products may be returned within 7 days of delivery, provided they are unused and in their original packaging. Please refer to our Shipping, Returns & Exchanges Policy for full details.",
      },
      {
        question: "Why can't fragrances be returned?",
        answer: "Fragrances are personal-use products and cannot be resold once opened or used. For hygiene and quality reasons, Eau de Parfums, perfume oils and fragrance oils are not eligible for returns or exchanges unless they arrive damaged or incorrect.",
      },
      {
        question: "What if my order arrives damaged?",
        answer: "Please email us within 48 hours of delivery with:\n• your order number;\n• photographs of the packaging;\n• photographs of the product; and\n• a brief description of the issue.\n\nWe'll review the case and arrange an appropriate resolution.",
      },
    ],
  },
  {
    category: "Fragrances",
    items: [
      {
        question: "What's the difference between Eau de Parfum, Perfume Oil and Fragrance Oil?",
        answer: "Eau de Parfum (EDP) is an alcohol-based fragrance designed to be worn on the skin.\n\nPerfume Oil is an alcohol-free fragrance blended in nourishing carrier oils for a slower, more intimate scent experience on the skin.\n\nFragrance Oil is intended for use with compatible home diffusers and should not be applied directly to the skin.",
      },
      {
        question: "How long do Seijaku fragrances last?",
        answer: "Longevity depends on the fragrance composition, your skin chemistry, climate and how the fragrance is applied. Results naturally vary from person to person.",
      },
      {
        question: "Where should I apply Eau de Parfum?",
        answer: "For best results, apply lightly to pulse points such as:\n• wrists\n• neck\n• behind the ears\n• inner elbows\n\nAvoid rubbing the fragrance immediately after application, as this can alter its development.",
      },
      {
        question: "Where should I apply Perfume Oil?",
        answer: "Perfume oils work best when applied sparingly to pulse points. A small amount is usually sufficient.",
      },
      {
        question: "Can I use Fragrance Oils on my skin?",
        answer: "No. Seijaku Fragrance Oils are formulated specifically for home fragrance use with compatible diffusers and are not intended for direct application to the skin.",
      },
      {
        question: "How should I store my fragrances?",
        answer: "Store your fragrances in a cool, dry place away from direct sunlight, excessive heat and humidity. Proper storage helps preserve their quality over time.",
      },
    ],
  },
  {
    category: "Diffusers",
    items: [
      {
        question: "Which diffusers can be used with Seijaku Fragrance Oils?",
        answer: "Our fragrance oils are designed for use with compatible home fragrance diffusers. Please follow the instructions provided with your diffuser before use.",
      },
      {
        question: "Are Seijaku diffusers handmade?",
        answer: "Yes. All of our terracotta and ceramic diffusers are individually handcrafted by artisans, making each piece slightly unique.",
      },
      {
        question: "Can I wash my diffuser?",
        answer: "Yes, but cleaning methods vary depending on the material. Allow the diffuser to cool (if applicable), wipe away excess oil, and clean gently using a soft cloth. Avoid abrasive cleaning products or prolonged soaking unless specifically recommended.",
      },
    ],
  },
  {
    category: "Dokra Brooches",
    items: [
      {
        question: "Why does my brooch look slightly different from the photographs?",
        answer: "Each dokra brooch is individually handcrafted using the traditional lost-wax casting technique. Minor differences in texture, finish, dimensions and patina are natural characteristics of handmade objects and make every piece unique.",
      },
      {
        question: "Will my dokra brooch change colour over time?",
        answer: "Like many handcrafted brass alloys, dokra may gradually develop a richer natural patina with age. This is a normal characteristic of the material and many collectors appreciate it as part of the object's evolving character.",
      },
      {
        question: "How should I care for my dokra brooch?",
        answer: "Store it in a dry place when not in use. Avoid prolonged exposure to moisture, perfumes and harsh chemicals. Wipe gently with a soft, dry cloth after use.",
      },
    ],
  },
  {
    category: "Scarves & Pocket Squares",
    items: [
      {
        question: "What fabric are Seijaku scarves made from?",
        answer: "Our scarves and pocket squares are crafted using carefully selected blended silk fabrics chosen for their softness, drape and everyday wearability. Please refer to the individual product page for exact fabric details.",
      },
      {
        question: "How should I care for my scarf?",
        answer: "We recommend gentle hand washing or professional dry cleaning depending on the product's care instructions. Avoid bleach, harsh detergents and prolonged direct sunlight while drying.",
      },
    ],
  },
  {
    category: "Handcrafted Products",
    items: [
      {
        question: "Why are there slight variations between products?",
        answer: "Many Seijaku products are handcrafted in small batches by artisans. Small variations in colour, texture, finish or dimensions are a hallmark of handmade craftsmanship and should not be regarded as defects.",
      },
      {
        question: "Are your products made in India?",
        answer: "Yes. Our products are thoughtfully designed in India and many are handcrafted in collaboration with artisan communities and skilled makers across the country.",
      },
    ],
  },
  {
    category: "Seijaku",
    items: [
      {
        question: "What does \"Seijaku\" mean?",
        answer: "Seijaku (静寂) is a Japanese word that evokes deep stillness—not simply the absence of sound, but a quiet presence of mind. Our products are designed as small rituals that invite moments of calm into everyday life.",
      },
      {
        question: "Are your products suitable for gifting?",
        answer: "Absolutely. Many of our products are designed to be gifted individually or as thoughtfully curated ritual sets. Gift packaging may be available for selected products.",
      },
      {
        question: "How can I collaborate with Seijaku?",
        answer: "For collaborations, editorial features, wholesale enquiries or partnerships, please write to us at: lifeatseijaku@gmail.com",
      },
    ],
  },
];

export default function FaqAccordionClient() {
  const [openIndexes, setOpenIndexes] = useState<Record<string, boolean>>({});

  const toggleItem = (catIndex: number, itemIndex: number) => {
    const key = `${catIndex}-${itemIndex}`;
    setOpenIndexes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-12">
      {faqData.map((categoryGroup, catIndex) => (
        <div key={categoryGroup.category} className="space-y-4">
          <h2 className="font-serif text-[22px] font-normal tracking-[-0.01em] text-[#1c1c1c] border-b border-black/5 pb-2">
            {categoryGroup.category}
          </h2>
          <div className="divide-y divide-black/5">
            {categoryGroup.items.map((item, itemIndex) => {
              const key = `${catIndex}-${itemIndex}`;
              const isOpen = !!openIndexes[key];

              return (
                <div key={item.question} className="py-4">
                  <button
                    onClick={() => toggleItem(catIndex, itemIndex)}
                    className="flex w-full items-center justify-between text-left font-sans text-[15px] font-normal leading-[1.4] text-[#1d1a17] hover:text-[#365b3f]"
                    aria-expanded={isOpen}
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#8a8378] transition-transform duration-350 ease-in-out ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-350 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="whitespace-pre-line text-[14px] font-light leading-[1.8] text-[#5d574e] max-w-none">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Elegant Contact Section at the bottom */}
      <div className="mt-16 rounded-xl border border-black/5 bg-[#fcfbf9] p-8 text-center sm:p-10">
        <h3 className="font-serif text-[20px] font-normal text-[#1d1a17]">
          I still have a question.
        </h3>
        <p className="mt-2 text-[14px] font-light text-[#5d574e]">
          We&apos;re always happy to help.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
          <a
            href="mailto:lifeatseijaku@gmail.com"
            className="flex items-center gap-2 text-[14px] text-[#365b3f] hover:underline"
          >
            <span>📧</span> lifeatseijaku@gmail.com
          </a>
          <a
            href="https://www.seijaku.co"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[14px] text-[#365b3f] hover:underline"
          >
            <span>🌐</span> www.seijaku.co
          </a>
        </div>
      </div>
    </div>
  );
}
