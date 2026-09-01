import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping, Returns & Exchanges | Seijaku",
  description: "Information regarding shipping zones, charges, order cancellations, returns and exchanges policy for Seijaku handcrafted products.",
};

export default function ShippingAndDeliveryPage() {
  return (
    <main className="min-h-screen bg-[#f3efe7] pt-[90px] text-[#3a3a3a] sm:pt-[100px]">
      <section className="section-primary pb-8 pt-16 sm:pt-20">
        <div className="page-container max-w-[800px]">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#9a785d]">Information</p>
          <h1 className="mt-5 text-[clamp(36px,4.5vw,56px)] leading-[1.1] tracking-[-0.03em] text-[#1d1a17]">
            Shipping, Returns &amp; Exchanges
          </h1>
          <p className="mt-4 text-[13px] tracking-[0.02em] text-[#7c7368]">
            Last Updated: July 2026
          </p>
          <div className="mt-10 h-px w-full bg-black/6" />
        </div>
      </section>

      <section className="pb-24 pt-4">
        <div className="page-container max-w-[800px]">
          <div className="prose prose-stone max-w-none space-y-10 text-[15px] font-light leading-[1.85] text-[#5d574e] sm:text-[16px]">
            <div>
              <p>
                At Seijaku, every object is thoughtfully prepared, carefully packed, and dispatched with attention to detail. Many of our products are handcrafted in small batches using traditional materials such as dokra metal, terracotta, ceramic, silk, and natural fragrance compositions. As a result, slight variations in colour, texture, finish, or form are a natural part of the making process and reflect the individuality of each piece.
              </p>
              <p className="mt-4 font-normal text-[#1d1a17]">
                Please read the following policy carefully before placing your order.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Shipping
              </h2>
              <p className="mt-4">
                We currently ship across most serviceable locations within India.
              </p>
              <p className="mt-4">
                Orders are generally processed within 1–3 business days after payment confirmation. During seasonal launches, festive periods, promotional campaigns, or public holidays, dispatch timelines may be slightly longer.
              </p>
              <p className="mt-4">
                Once your order has been dispatched, you will receive a shipment confirmation along with tracking details via email and/or WhatsApp.
              </p>
              <p className="mt-4 font-normal text-[#1d1a17]">Estimated delivery timelines are:</p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>
                  <strong>Metro cities:</strong> 2–5 business days
                </li>
                <li>
                  <strong>Other locations:</strong> 3–8 business days
                </li>
              </ul>
              <p className="mt-4">
                These timelines are estimates provided by our courier partners and may vary depending on your delivery location, weather conditions, or other operational circumstances.
              </p>
              <p className="mt-4">
                Orders placed on weekends or public holidays will be processed on the next business day.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Shipping Charges
              </h2>
              <p className="mt-4">
                Shipping charges, where applicable, are calculated during checkout based on your delivery PIN code and the size or weight of your order.
              </p>
              <p className="mt-4">
                From time to time, Seijaku may offer complimentary shipping on qualifying orders.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Order Cancellation
              </h2>
              <p className="mt-4">
                Orders may only be cancelled before they have been packed or dispatched. Once an order has entered the dispatch process, it can no longer be cancelled.
              </p>
              <p className="mt-4">
                To request a cancellation, please write to us as soon as possible at:{" "}
                <a href="mailto:lifeatseijaku@gmail.com" className="text-[#365b3f] hover:underline">
                  lifeatseijaku@gmail.com
                </a>
              </p>
              <p className="mt-4">
                We will confirm whether your order is still eligible for cancellation.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Return Eligibility
              </h2>
              <p className="mt-4 font-normal text-[#1d1a17]">
                The following products may be returned within 7 days of delivery, provided they are unused and meet the conditions outlined below:
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>Silk scarves</li>
                <li>Pocket squares</li>
                <li>Dokra brooches</li>
                <li>Unused artisanal home décor objects that are not fragrance products</li>
              </ul>
              <p className="mt-4 font-normal text-[#1d1a17]">
                To qualify for a return, the product must:
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>be unused, unworn and unwashed;</li>
                <li>be returned in its original packaging;</li>
                <li>include all tags, inserts, accessories and protective materials;</li>
                <li>be free from stains, damage, or signs of use.</li>
              </ul>
              <p className="mt-4">
                All returned products undergo a quality inspection before a refund is approved.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Non-returnable Products
              </h2>
              <p className="mt-4 font-normal text-[#1d1a17]">
                For hygiene, safety and quality reasons, the following products are not eligible for returns or exchanges once delivered:
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>Eau de Parfum</li>
                <li>Perfume oils</li>
                <li>Fragrance oils</li>
                <li>Opened fragrance products</li>
                <li>Used diffusers</li>
                <li>
                  Products purchased during clearance sales, promotional campaigns or marked as Final Sale (unless received damaged or incorrect)
                </li>
                <li>Gift cards, where applicable</li>
              </ul>
              <p className="mt-4">
                As fragrances are personal-use products, we are unable to accept returns once they have left our warehouse.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Exchanges
              </h2>
              <p className="mt-4 font-normal text-[#1d1a17]">
                We currently offer exchanges only in the following situations:
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>the wrong product was shipped;</li>
                <li>the product arrived damaged;</li>
                <li>a manufacturing defect is confirmed after inspection.</li>
              </ul>
              <p className="mt-4 font-normal text-[#1d1a17]">
                We do not offer exchanges for:
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>change of mind;</li>
                <li>fragrance preference;</li>
                <li>colour preference arising from differences in screen displays;</li>
                <li>natural handmade variations described in this policy.</li>
              </ul>
              <p className="mt-4">
                Exchange requests are subject to stock availability. Replacement products are dispatched only after the original product has been received and has successfully passed our quality inspection.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Handcrafted Product Variations
              </h2>
              <p className="mt-4 font-normal text-[#1d1a17]">
                Many Seijaku products are individually handcrafted by skilled artisans. Minor differences in:
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>colour;</li>
                <li>glaze;</li>
                <li>texture;</li>
                <li>casting marks;</li>
                <li>hand-finishing;</li>
                <li>natural patina;</li>
                <li>dimensions; or</li>
                <li>surface character</li>
              </ul>
              <p className="mt-4">
                are an inherent part of handmade craftsmanship and should not be regarded as manufacturing defects.
              </p>
              <p className="mt-4">
                Similarly, the colour of textiles may vary slightly due to differences in fabric batches, digital printing processes, photography, lighting conditions and individual screen settings.
              </p>
              <p className="mt-4">
                Each handcrafted piece is therefore unique.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Fragrance Variations
              </h2>
              <p className="mt-4">
                Our fragrances are crafted using carefully selected aromatic ingredients. As with all fine fragrance products, slight variations in colour or scent intensity between batches may naturally occur over time due to the nature of the raw materials used. Such variations are normal and do not indicate a manufacturing defect.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Damaged, Defective or Incorrect Orders
              </h2>
              <p className="mt-4 font-normal text-[#1d1a17]">
                Although every order undergoes careful quality checks before dispatch, if you receive:
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>a damaged product;</li>
                <li>an incorrect product;</li>
                <li>a manufacturing defect; or</li>
                <li>an item missing from your order,</li>
              </ul>
              <p className="mt-4">
                please contact us within 48 hours of delivery. Email us at:{" "}
                <a href="mailto:lifeatseijaku@gmail.com" className="text-[#365b3f] hover:underline">
                  lifeatseijaku@gmail.com
                </a>
              </p>
              <p className="mt-4 font-normal text-[#1d1a17]">
                Please include:
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>your order number;</li>
                <li>photographs of the outer packaging;</li>
                <li>photographs of the product; and</li>
                <li>a brief description of the issue.</li>
              </ul>
              <p className="mt-4">
                Claims reported after 48 hours may not be eligible for replacement or refund.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Tampered Packages
              </h2>
              <p className="mt-4">
                If your shipment appears to have been opened, tampered with, or damaged during transit, we request that you do not accept the package from the courier.
              </p>
              <p className="mt-4">
                Please inform us immediately at{" "}
                <a href="mailto:lifeatseijaku@gmail.com" className="text-[#365b3f] hover:underline">
                  lifeatseijaku@gmail.com
                </a>
                , and we will work with our logistics partner to resolve the matter.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Return Process
              </h2>
              <p className="mt-4 font-normal text-[#1d1a17]">
                To initiate a return, please email{" "}
                <a href="mailto:lifeatseijaku@gmail.com" className="text-[#365b3f] hover:underline">
                  lifeatseijaku@gmail.com
                </a>
              </p>
              <p className="mt-4 font-normal text-[#1d1a17]">
                with:
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>your order number;</li>
                <li>the product(s) you wish to return; and</li>
                <li>the reason for your request.</li>
              </ul>
              <p className="mt-4">
                Return requests are generally reviewed within 2 business days.
              </p>
              <p className="mt-4">
                Where reverse pickup is available, we will arrange collection through our logistics partner.
              </p>
              <p className="mt-4">
                For locations where reverse pickup is not serviceable, customers may be requested to ship the product to our return address. Where the return is approved due to a damaged, defective or incorrect product, reasonable return shipping charges may be reimbursed.
              </p>
              <p className="mt-4">
                To ensure safe transit, products should be returned in their original protective packaging, including the outer shipping carton wherever possible.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Refunds
              </h2>
              <p className="mt-4">
                Once your returned product has been received and successfully passes our quality inspection, your refund will be initiated.
              </p>
              <p className="mt-4 font-medium text-[#1d1a17]">Prepaid Orders</p>
              <p className="mt-1">
                Refunds will be credited to the original payment method used while placing the order.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Refund Timeline
              </h2>
              <p className="mt-4">
                Approved refunds are generally processed within 5–7 business days. Depending on your bank or payment provider, the amount may take additional time to reflect in your account.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Return Requests That Cannot Be Accepted
              </h2>
              <p className="mt-4 font-normal text-[#1d1a17]">
                We reserve the right to decline return or refund requests if:
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>the request is made more than 7 days after delivery;</li>
                <li>the product has been used, worn, washed or altered;</li>
                <li>the original packaging, tags or accessories are missing;</li>
                <li>the product has been damaged after delivery due to improper handling or misuse;</li>
                <li>the product belongs to a non-returnable category listed in this policy;</li>
                <li>
                  the issue relates solely to natural handmade variations or minor colour differences described above.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Delivery Delays Beyond Our Control
              </h2>
              <p className="mt-4">
                While we strive to deliver every order within the estimated timelines, delays may occasionally occur due to circumstances beyond our reasonable control, including but not limited to severe weather conditions, natural disasters, strikes, government restrictions, transportation disruptions, or courier service delays.
              </p>
              <p className="mt-4">
                In such situations, Seijaku shall not be held liable for delays in delivery, though we will make every reasonable effort to keep you informed.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                A Note on Handmade Objects
              </h2>
              <p className="mt-4 italic">
                Every Seijaku object is crafted in small batches by artisans using traditional techniques. The gentle irregularities left by the artisan&apos;s hand are not imperfections—they are part of the story of the object. No two pieces are exactly alike, and we hope these subtle differences become part of what makes your Seijaku piece uniquely yours.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Governing Law
              </h2>
              <p className="mt-4">
                This Shipping, Returns &amp; Exchanges Policy shall be governed by and interpreted in accordance with the laws of India.
              </p>
              <p className="mt-4">
                Any disputes arising out of purchases made through{" "}
                <Link href="/" className="text-[#365b3f] hover:underline">
                  www.seijaku.co
                </Link>{" "}
                shall be subject to the exclusive jurisdiction of the competent courts in Kolkata, West Bengal.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Contact Us
              </h2>
              <p className="mt-4">
                If you have any questions regarding your order, shipping, returns or exchanges, we&apos;re always happy to help.
              </p>
              <p className="mt-3 font-medium text-[#1d1a17]">
                Seijaku Craftworks Pvt. Ltd.
              </p>
              <p className="mt-1">
                Email:{" "}
                <a href="mailto:lifeatseijaku@gmail.com" className="text-[#365b3f] hover:underline">
                  lifeatseijaku@gmail.com
                </a>
              </p>
              <p className="mt-1">
                Website:{" "}
                <Link href="/" className="text-[#365b3f] hover:underline">
                  www.seijaku.co
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-16 flex flex-wrap gap-6 border-t border-black/6 pt-8">
            <Link href="/" className="text-[13px] font-normal tracking-[0.05em] text-[#365b3f] hover:underline">
              ← Return Home
            </Link>
            <Link href="/shop" className="text-[13px] font-normal tracking-[0.05em] text-[#365b3f] hover:underline">
              Explore our Collection
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
