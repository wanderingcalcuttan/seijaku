import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | Seijaku",
  description: "Terms and conditions governing the use of Seijaku's website, products, and services.",
};

export default function TermsAndAgreementsPage() {
  return (
    <main className="min-h-screen bg-[#f3efe7] pt-[90px] text-[#3a3a3a] sm:pt-[100px]">
      <section className="section-primary pb-8 pt-16 sm:pt-20">
        <div className="page-container max-w-[800px]">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#9a785d]">Information</p>
          <h1 className="mt-5 text-[clamp(36px,4.5vw,56px)] leading-[1.1] tracking-[-0.03em] text-[#1d1a17]">
            Terms &amp; Conditions
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
                Welcome to{" "}
                <Link href="/" className="text-[#365b3f] hover:underline">
                  www.seijaku.co
                </Link>
                , owned and operated by Seijaku Craftworks Pvt. Ltd. (&ldquo;Seijaku&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;).
              </p>
              <p className="mt-4">
                These Terms &amp; Conditions govern your access to and use of our website, products and services. By accessing, browsing or placing an order through our website, you agree to be bound by these Terms &amp; Conditions, our Privacy Policy, and our Shipping, Returns &amp; Exchanges Policy.
              </p>
              <p className="mt-4">
                If you do not agree with these Terms &amp; Conditions, please do not use our website.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                About Seijaku
              </h2>
              <p className="mt-4">
                Seijaku Craftworks Pvt. Ltd. is an Indian lifestyle brand creating thoughtfully designed fragrances, handcrafted objects and ritual accessories inspired by culture, craftsmanship and everyday calm.
              </p>
              <p className="mt-4">Throughout these Terms:</p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>
                  <strong>&ldquo;Website&rdquo;</strong> refers to{" "}
                  <Link href="/" className="text-[#365b3f] hover:underline">
                    www.seijaku.co
                  </Link>
                </li>
                <li>
                  <strong>&ldquo;Products&rdquo;</strong> refers to all goods sold by Seijaku.
                </li>
                <li>
                  <strong>&ldquo;You&rdquo;</strong> refers to any visitor, customer or user of the Website.
                </li>
                <li>
                  <strong>&ldquo;We&rdquo;, &ldquo;Us&rdquo; and &ldquo;Our&rdquo;</strong> refer to Seijaku Craftworks Pvt. Ltd.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Eligibility to Use the Website
              </h2>
              <p className="mt-4">By using this Website, you confirm that:</p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>
                  You are at least 18 years of age or are using the Website under the supervision of a parent or legal guardian.
                </li>
                <li>
                  You are legally capable of entering into binding contracts under applicable laws.
                </li>
                <li>
                  All information provided by you is true, accurate and complete.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Website Use
              </h2>
              <p className="mt-4">You agree to use this Website only for lawful purposes.</p>
              <p className="mt-4 font-normal text-[#1d1a17]">You shall not:</p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>Use the Website for fraudulent or unlawful activities.</li>
                <li>Interfere with the security or functionality of the Website.</li>
                <li>Attempt to gain unauthorised access to our systems.</li>
                <li>Introduce viruses, malware or other harmful code.</li>
                <li>Scrape, copy or systematically extract Website content without our prior written permission.</li>
                <li>Impersonate another individual or entity.</li>
                <li>Use our content, trademarks or intellectual property in any manner that infringes our rights.</li>
              </ul>
              <p className="mt-4">
                We reserve the right to suspend or terminate access to the Website where misuse is reasonably suspected or where these Terms have been violated.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Product Information
              </h2>
              <p className="mt-4">
                We strive to ensure that all product descriptions, photographs, specifications, pricing and other information published on the Website are accurate and up to date.
              </p>
              <p className="mt-4 font-normal text-[#1d1a17]">However:</p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>Handcrafted products naturally vary in colour, texture, finish and form.</li>
                <li>Fragrances may exhibit slight batch-to-batch variations due to the nature of aromatic ingredients.</li>
                <li>
                  Colours displayed on digital screens may differ slightly from the actual product because of photography, lighting and individual display settings.
                </li>
              </ul>
              <p className="mt-4">
                Such variations are inherent characteristics of handcrafted and artisanal products and shall not be regarded as manufacturing defects.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Product Availability
              </h2>
              <p className="mt-4">
                Many Seijaku products are handcrafted in limited batches. Accordingly, all products are offered subject to availability.
              </p>
              <p className="mt-4 font-normal text-[#1d1a17]">
                We reserve the right, at any time and without prior notice, to:
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>discontinue any product;</li>
                <li>modify product specifications;</li>
                <li>limit purchase quantities;</li>
                <li>refuse or cancel orders where necessary.</li>
              </ul>
              <p className="mt-4">
                If a product becomes unavailable after an order has been placed, we will notify you and issue an appropriate refund where applicable.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Pricing
              </h2>
              <p className="mt-4">
                All prices displayed on the Website are in Indian Rupees (INR) unless otherwise stated. Prices are subject to change without prior notice.
              </p>
              <p className="mt-4">
                While we make every effort to ensure pricing accuracy, typographical errors or technical inaccuracies may occasionally occur. If a product is mistakenly listed at an incorrect price, we reserve the right to cancel the order before dispatch and issue a full refund where payment has already been received.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Orders
              </h2>
              <p className="mt-4">Your order constitutes an offer to purchase products from Seijaku.</p>
              <p className="mt-4 font-normal text-[#1d1a17]">An order is deemed accepted only after:</p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>payment has been successfully authorised (where applicable); and</li>
                <li>we have confirmed the order for processing.</li>
              </ul>
              <p className="mt-4">
                Receipt of an automated order confirmation email does not constitute final acceptance of your order.
              </p>
              <p className="mt-4 font-normal text-[#1d1a17]">We reserve the right to refuse or cancel any order due to:</p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>suspected fraud;</li>
                <li>inaccurate customer information;</li>
                <li>payment failure;</li>
                <li>inventory limitations;</li>
                <li>pricing errors;</li>
                <li>operational constraints; or</li>
                <li>inability to service the delivery location.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Payments
              </h2>
              <p className="mt-4">
                Payments made through the Website are securely processed through trusted third-party payment providers.
              </p>
              <p className="mt-4">
                Seijaku does not store your debit card, credit card, banking credentials, UPI PIN or other payment authentication information on its servers.
              </p>
              <p className="mt-4">
                By placing an order, you authorise the applicable payment provider to process your payment in accordance with their own terms and privacy policies.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Shipping &amp; Delivery
              </h2>
              <p className="mt-4">
                Orders are processed and dispatched in accordance with our{" "}
                <Link href="/shipping-and-delivery" className="text-[#365b3f] hover:underline">
                  Shipping, Returns &amp; Exchanges Policy
                </Link>
                , which forms an integral part of these Terms &amp; Conditions.
              </p>
              <p className="mt-4">
                Estimated delivery timelines are indicative only and may vary depending on courier operations or circumstances beyond our reasonable control. Shipping charges, where applicable, are displayed during checkout.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Returns &amp; Exchanges
              </h2>
              <p className="mt-4">
                Returns, exchanges and refunds are governed by our{" "}
                <Link href="/shipping-and-delivery" className="text-[#365b3f] hover:underline">
                  Shipping, Returns &amp; Exchanges Policy
                </Link>
                .
              </p>
              <p className="mt-4">
                By placing an order, you acknowledge that you have read, understood and agreed to the return eligibility applicable to your purchase.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Gift Cards &amp; Promotional Credits
              </h2>
              <p className="mt-4 font-normal text-[#1d1a17]">
                Where offered, gift cards, promotional vouchers or store credits:
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>may only be used in accordance with their stated terms;</li>
                <li>cannot be redeemed for cash;</li>
                <li>cannot be resold or transferred unless expressly permitted;</li>
                <li>may carry expiry dates.</li>
              </ul>
              <p className="mt-4">
                Seijaku reserves the right to cancel any promotional credits or gift cards obtained through fraud, misuse, abuse or technical error.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Intellectual Property
              </h2>
              <p className="mt-4 font-normal text-[#1d1a17]">
                Unless otherwise stated, all content available on this Website—including but not limited to:
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>product designs;</li>
                <li>fragrance names and product names;</li>
                <li>photographs;</li>
                <li>illustrations;</li>
                <li>artwork;</li>
                <li>logos;</li>
                <li>trademarks;</li>
                <li>videos;</li>
                <li>packaging designs;</li>
                <li>website design;</li>
                <li>written content;</li>
                <li>graphics;</li>
                <li>software; and</li>
                <li>other creative works,</li>
              </ul>
              <p className="mt-4">
                is owned by or licensed to Seijaku Craftworks Pvt. Ltd. and is protected under applicable intellectual property laws.
              </p>
              <p className="mt-4">
                Nothing contained on this Website grants any licence or right to use our intellectual property without our prior written permission.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                User-Generated Content
              </h2>
              <p className="mt-4">
                If you submit reviews, testimonials, photographs or other content to Seijaku, you grant us a non-exclusive, worldwide, royalty-free licence to use, reproduce, publish, display and distribute such content for marketing, editorial and promotional purposes.
              </p>
              <p className="mt-4">
                You represent and warrant that you own or have the necessary rights to share such content and that it does not infringe the rights of any third party.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Third-Party Services
              </h2>
              <p className="mt-4">
                Our Website may contain links to third-party websites or integrate services provided by external providers, including payment gateways, logistics partners, analytics platforms and social media services.
              </p>
              <p className="mt-4">
                These third-party services operate independently of Seijaku, and we are not responsible for their content, availability, security or privacy practices. Your interactions with such services are governed by their respective terms and privacy policies.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Privacy
              </h2>
              <p className="mt-4">
                Your use of the Website is also governed by our{" "}
                <Link href="/privacy-policy" className="text-[#365b3f] hover:underline">
                  Privacy Policy
                </Link>
                , which explains how your personal information is collected, used, stored and protected.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Limitation of Liability
              </h2>
              <p className="mt-4">
                To the maximum extent permitted under applicable law, Seijaku Craftworks Pvt. Ltd., its directors, employees, affiliates, partners and service providers shall not be liable for any indirect, incidental, consequential, special or punitive damages arising from:
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>the use or inability to use the Website;</li>
                <li>delays in delivery caused by third-party logistics providers;</li>
                <li>temporary interruptions to Website availability;</li>
                <li>unauthorised access despite reasonable security measures;</li>
                <li>misuse of products contrary to their intended purpose; or</li>
                <li>allergic reactions or individual sensitivities to fragrance products or materials.</li>
              </ul>
              <p className="mt-4">
                Our total liability in relation to any order shall not exceed the amount actually paid by you for the relevant product.
              </p>
              <p className="mt-4">
                Nothing contained in these Terms excludes liability where such exclusion is prohibited under applicable law.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Force Majeure
              </h2>
              <p className="mt-4">
                Seijaku shall not be liable for any delay or failure to perform its obligations where such delay or failure results from circumstances beyond our reasonable control, including but not limited to:
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>natural disasters;</li>
                <li>floods;</li>
                <li>fires;</li>
                <li>pandemics;</li>
                <li>government restrictions;</li>
                <li>labour disputes;</li>
                <li>transportation disruptions;</li>
                <li>internet outages;</li>
                <li>cyberattacks; or</li>
                <li>failures of third-party service providers.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Indemnity
              </h2>
              <p className="mt-4">
                You agree to indemnify and hold harmless Seijaku Craftworks Pvt. Ltd., its directors, employees, affiliates, partners and service providers from any claims, liabilities, damages, losses, costs or expenses (including reasonable legal fees) arising from:
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>your misuse of the Website;</li>
                <li>your breach of these Terms &amp; Conditions;</li>
                <li>your violation of applicable laws; or</li>
                <li>your infringement of any third-party rights.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Changes to These Terms
              </h2>
              <p className="mt-4">
                We may revise these Terms &amp; Conditions from time to time to reflect changes in our business, technology, legal obligations or operational practices.
              </p>
              <p className="mt-4">
                The latest version will always be published on this page together with the revised Last Updated date.
              </p>
              <p className="mt-4">
                Your continued use of the Website after any changes become effective constitutes your acceptance of the revised Terms &amp; Conditions.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Governing Law &amp; Jurisdiction
              </h2>
              <p className="mt-4">
                These Terms &amp; Conditions shall be governed by and interpreted in accordance with the laws of India.
              </p>
              <p className="mt-4">
                Any dispute arising out of or relating to the use of{" "}
                <Link href="/" className="text-[#365b3f] hover:underline">
                  www.seijaku.co
                </Link>{" "}
                or purchases made through the Website shall be subject to the exclusive jurisdiction of the competent courts in Kolkata, West Bengal, India.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Contact Us
              </h2>
              <p className="mt-4">
                If you have any questions regarding these Terms &amp; Conditions, please contact us:
              </p>
              <p className="mt-3 font-medium text-[#1d1a17]">
                Seijaku Craftworks Pvt. Ltd.
              </p>
              <p className="mt-1">
                Website:{" "}
                <Link href="/" className="text-[#365b3f] hover:underline">
                  www.seijaku.co
                </Link>
              </p>
              <p className="mt-1">
                Email:{" "}
                <a href="mailto:lifeatseijaku@gmail.com" className="text-[#365b3f] hover:underline">
                  lifeatseijaku@gmail.com
                </a>
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
