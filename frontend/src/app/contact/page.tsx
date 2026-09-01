import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact & Support | Seijaku",
  description: "Get in touch with Seijaku. Contact us for order queries, collaborations, website feedback or general support.",
};

export default function ContactPage() {
  const linkCardClass =
    "flex items-center justify-between rounded-[14px] border border-black/5 bg-[#faf8f4] px-6 py-4 transition-all hover:bg-white hover:border-[#365b3f]/30";

  return (
    <main className="min-h-screen bg-[#f3efe7] pt-[90px] text-[#3a3a3a] sm:pt-[100px]">
      {/* Hero Header */}
      <section className="section-primary pb-8 pt-16 sm:pt-20">
        <div className="page-container max-w-[1100px]">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#9a785d]">
            Get in Touch &amp; Support
          </p>
          <h1 className="mt-5 text-[clamp(36px,4.5vw,56px)] leading-[1.1] tracking-[-0.03em] text-[#1d1a17]">
            Get in Touch
          </h1>
          <p className="mt-4 max-w-[650px] text-[15px] font-light leading-[1.8] text-[#5d574e]">
            Whether you have questions about our products, a collaboration enquiry, or need help with
            an order, we&apos;d love to hear from you.
          </p>
          <p className="mt-2 text-[15px] font-light text-[#5d574e]">
            Or reach us directly at{" "}
            <a href="mailto:lifeatseijaku@gmail.com" className="text-[#365b3f] hover:underline font-normal">
              lifeatseijaku@gmail.com
            </a>
          </p>
          <div className="mt-10 h-px w-full bg-black/6" />
        </div>
      </section>

      {/* Main Grid: Info Cards + Form */}
      <section className="pb-20 pt-4">
        <div className="page-container max-w-[1100px]">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            
            {/* Left Column: Info Cards */}
            <div className="space-y-6 lg:col-span-5">
              
              {/* Support Card */}
              <div className="rounded-[20px] border border-black/5 bg-[#faf8f4] p-8 transition-shadow duration-300 hover:shadow-sm">
                <h3 className="font-serif text-[22px] font-normal tracking-[-0.01em] text-[#1c1c1c]">
                  Customer Support
                </h3>
                <p className="mt-2 text-[14px] font-light leading-[1.6] text-[#5d574e]">
                  For orders, shipping, returns, and support requests.
                </p>
                <div className="mt-4">
                  <a
                    href="mailto:lifeatseijaku@gmail.com"
                    className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#365b3f] hover:underline"
                  >
                    lifeatseijaku@gmail.com <span className="text-[12px] font-sans">&rarr;</span>
                  </a>
                </div>
              </div>

              {/* Collaborations Card */}
              <div className="rounded-[20px] border border-black/5 bg-[#faf8f4] p-8 transition-shadow duration-300 hover:shadow-sm">
                <h3 className="font-serif text-[22px] font-normal tracking-[-0.01em] text-[#1c1c1c]">
                  Business &amp; Collaborations
                </h3>
                <p className="mt-2 text-[14px] font-light leading-[1.6] text-[#5d574e]">
                  For wholesale enquiries, partnerships, and collaborations.
                </p>
                <div className="mt-4">
                  <a
                    href="mailto:lifeatseijaku@gmail.com"
                    className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#365b3f] hover:underline"
                  >
                    lifeatseijaku@gmail.com <span className="text-[12px] font-sans">&rarr;</span>
                  </a>
                </div>
              </div>

              {/* Website Card */}
              <div className="rounded-[20px] border border-black/5 bg-[#faf8f4] p-8 transition-shadow duration-300 hover:shadow-sm">
                <h3 className="font-serif text-[22px] font-normal tracking-[-0.01em] text-[#1c1c1c]">
                  Website
                </h3>
                <p className="mt-2 text-[14px] font-light leading-[1.6] text-[#5d574e]">
                  For feedback, technical issues, or browsing experience issues.
                </p>
                <div className="mt-4">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#365b3f] hover:underline"
                  >
                    www.seijaku.co <span className="text-[12px] font-sans">&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      {/* Customer Care Promise Strip */}
      <section className="bg-[#eae3d5]/50 py-16 border-t border-b border-black/5">
        <div className="page-container max-w-[1100px]">
          <h2 className="font-serif text-[26px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[30px]">
            Our Customer Care Promise
          </h2>
          <p className="mt-4 max-w-[70ch] text-[15px] font-light leading-[1.8] text-[#5d574e]">
            Every inquiry is handled directly by us. If something isn&apos;t as expected, or if a
            handcrafted object arrives damaged or incorrect, please reach out to us within 48 hours
            of receiving it, and we will do our best to make it right.
          </p>
        </div>
      </section>

      {/* Still Have a Question */}
      <section className="py-20">
        <div className="page-container max-w-[1100px]">
          <h2 className="font-serif text-[26px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[30px]">
            Still Have a Question?
          </h2>
          <p className="mt-2 text-[14px] font-light text-[#5d574e]">
            Find quick answers in our resources pages.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link href="/faqs" className={linkCardClass}>
              <span className="text-[14px] font-sans font-medium text-[#1d1a17]">
                Frequently Asked Questions
              </span>
              <span className="text-[14px] text-[#8a8378]">&rarr;</span>
            </Link>
            <Link href="/shipping-and-delivery" className={linkCardClass}>
              <span className="text-[14px] font-sans font-medium text-[#1d1a17]">
                Shipping, Returns &amp; Exchanges
              </span>
              <span className="text-[14px] text-[#8a8378]">&rarr;</span>
            </Link>
            <Link href="/privacy-policy" className={linkCardClass}>
              <span className="text-[14px] font-sans font-medium text-[#1d1a17]">
                Privacy Policy
              </span>
              <span className="text-[14px] text-[#8a8378]">&rarr;</span>
            </Link>
            <Link href="/terms-and-agreements" className={linkCardClass}>
              <span className="text-[14px] font-sans font-medium text-[#1d1a17]">
                Terms &amp; Conditions
              </span>
              <span className="text-[14px] text-[#8a8378]">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Follow Our Journey */}
      <section className="pb-20 border-b border-black/5">
        <div className="page-container max-w-[1100px]">
          <h2 className="font-serif text-[26px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[30px]">
            Follow Our Journey
          </h2>
          <div className="mt-6 flex flex-wrap gap-8">
            <a
              href="https://www.instagram.com/seijaku_lifestyle"
              target="_blank"
              rel="noreferrer"
              className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#365b3f] hover:underline"
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noreferrer"
              className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#365b3f] hover:underline"
            >
              Facebook
            </a>
            <a
              href="https://www.youtube.com/@SeijakuWellness"
              target="_blank"
              rel="noreferrer"
              className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#365b3f] hover:underline"
            >
              Youtube
            </a>
            <a
              href="#footer-email"
              className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#365b3f] hover:underline"
            >
              Newsletter
            </a>
          </div>
        </div>
      </section>

      {/* Our Studio */}
      <section className="py-20">
        <div className="page-container max-w-[1100px]">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-serif text-[26px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[30px]">
                Our Studio
              </h2>
              <p className="mt-4 text-[15px] font-light leading-[1.8] text-[#5d574e] max-w-[45ch]">
                Designed and handcrafted in West Bengal, India. Many of our products are made in
                collaboration with artisan clusters and skilled makers.
              </p>
            </div>
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9a785d]">
                A Note on Craftsmanship
              </h3>
              <p className="mt-4 text-[15px] font-light leading-[1.8] text-[#5d574e] max-w-[45ch]">
                Slight variations in glaze, finish, or pattern are normal characteristics of handmade
                objects. We hope these small signatures of the artisan&apos;s hand make your piece
                feel uniquely yours.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
