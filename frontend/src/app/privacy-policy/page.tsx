import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Seijaku",
  description: "Privacy policy explaining how we collect, use, store, and safeguard your personal information at Seijaku.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f3efe7] pt-[90px] text-[#3a3a3a] sm:pt-[100px]">
      <section className="section-primary pb-8 pt-16 sm:pt-20">
        <div className="page-container max-w-[800px]">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#9a785d]">Information</p>
          <h1 className="mt-5 text-[clamp(36px,4.5vw,56px)] leading-[1.1] tracking-[-0.03em] text-[#1d1a17]">
            Privacy Policy
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
                At Seijaku Craftworks Pvt. Ltd. (&ldquo;Seijaku&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), we value your trust and are committed to protecting your privacy.
              </p>
              <p className="mt-4">
                This Privacy Policy explains how we collect, use, store, disclose and safeguard your personal information when you visit{" "}
                <Link href="/" className="text-[#365b3f] hover:underline">
                  www.seijaku.co
                </Link>
                , create an account, place an order, subscribe to our communications or otherwise interact with our website and services.
              </p>
              <p className="mt-4">
                By using our website, you consent to the practices described in this Privacy Policy.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Information We Collect
              </h2>
              <p className="mt-4">
                We collect information that helps us provide our products and services effectively.
              </p>
              <p className="mt-4 font-medium text-[#1d1a17]">Information You Provide</p>
              <p className="mt-2">
                When you interact with Seijaku, you may provide information such as:
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>Full name</li>
                <li>Shipping and billing address</li>
                <li>Email address</li>
                <li>Mobile number</li>
                <li>Account login details (where applicable)</li>
                <li>Purchase history</li>
                <li>Wishlist information</li>
                <li>Customer support enquiries</li>
                <li>Newsletter subscriptions</li>
                <li>Product reviews or feedback</li>
              </ul>
              <p className="mt-4 font-normal text-[#1d1a17]">
                Providing certain information is necessary for us to process and fulfil your orders.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Information Collected Automatically
              </h2>
              <p className="mt-4">
                When you visit our website, certain information is collected automatically, including:
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>IP address</li>
                <li>Browser type</li>
                <li>Device type</li>
                <li>Operating system</li>
                <li>Language preferences</li>
                <li>Time zone</li>
                <li>Pages viewed</li>
                <li>Products viewed</li>
                <li>Referring website or search engine</li>
                <li>Session duration</li>
                <li>Website interactions</li>
                <li>Cookies and similar technologies</li>
              </ul>
              <p className="mt-4">
                This information helps us understand how visitors use our website and improve their experience.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                How We Use Your Information
              </h2>
              <p className="mt-4 font-normal text-[#1d1a17]">We use your information to:</p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>process and fulfil your orders;</li>
                <li>deliver products to your chosen address;</li>
                <li>process payments securely;</li>
                <li>provide customer support;</li>
                <li>communicate order confirmations, shipping updates and delivery notifications;</li>
                <li>respond to your enquiries;</li>
                <li>personalise your shopping experience;</li>
                <li>improve our products and website;</li>
                <li>prevent fraud and misuse;</li>
                <li>comply with legal obligations;</li>
                <li>send marketing communications where you have consented or where permitted by applicable law.</li>
              </ul>
              <p className="mt-4 font-normal text-[#1d1a17]">
                You may unsubscribe from marketing emails at any time by clicking the unsubscribe link or by contacting us at{" "}
                <a href="mailto:lifeatseijaku@gmail.com" className="text-[#365b3f] hover:underline">
                  lifeatseijaku@gmail.com
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Electronic Communications
              </h2>
              <p className="mt-4">
                By using our website or providing your contact information, you agree to receive communications from Seijaku electronically.
              </p>
              <p className="mt-4 font-normal text-[#1d1a17]">These communications may include:</p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>order confirmations;</li>
                <li>payment confirmations;</li>
                <li>shipping updates;</li>
                <li>delivery notifications;</li>
                <li>customer support responses;</li>
                <li>important notices relating to your orders or your account.</li>
              </ul>
              <p className="mt-4">
                Where you have consented, we may also send promotional emails, SMS messages or WhatsApp communications regarding new collections, offers, events or editorial content.
              </p>
              <p className="mt-4">
                You may opt out of promotional communications at any time. Transactional communications relating to your purchases cannot be opted out of while your order is being processed.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Payments
              </h2>
              <p className="mt-4">
                We do not store your debit card, credit card, banking credentials, UPI PIN or other payment authentication information on our servers.
              </p>
              <p className="mt-4">
                Payments made through our website are securely processed by trusted third-party payment providers such as Razorpay and their authorised banking partners.
              </p>
              <p className="mt-4">
                These providers comply with applicable payment security standards, including PCI-DSS requirements where applicable.
              </p>
              <p className="mt-4">
                Please review the privacy policies of your chosen payment provider for more information about how they process your payment information.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Cookies
              </h2>
              <p className="mt-4">
                Our website uses cookies and similar technologies to improve functionality and user experience.
              </p>
              <p className="mt-4 font-normal text-[#1d1a17]">Cookies help us:</p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>remember your preferences;</li>
                <li>maintain your shopping cart;</li>
                <li>understand website usage;</li>
                <li>improve website performance;</li>
                <li>provide relevant content and advertising.</li>
              </ul>
              <p className="mt-4 font-normal text-[#1d1a17]">
                Most browsers allow you to disable cookies through browser settings. Please note that disabling certain cookies may affect the functionality of our website.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Analytics &amp; Marketing
              </h2>
              <p className="mt-4 font-normal text-[#1d1a17]">
                We may use trusted third-party analytics and marketing tools to better understand how visitors use our website. These may include services such as:
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>Google Analytics</li>
                <li>Google Search Console</li>
                <li>Meta Pixel</li>
                <li>Other advertising and analytics platforms</li>
              </ul>
              <p className="mt-4 font-normal text-[#1d1a17]">
                These services may use cookies or similar technologies to collect anonymised or pseudonymised information about your browsing behaviour.
              </p>
              <p className="mt-4">
                You can learn more about Google&apos;s privacy practices at:{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#365b3f] hover:underline"
                >
                  https://policies.google.com/privacy
                </a>
              </p>
              <p className="mt-2">
                You can manage Google&apos;s advertising preferences at:{" "}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#365b3f] hover:underline"
                >
                  https://adssettings.google.com
                </a>
              </p>
              <p className="mt-2">
                For Meta&apos;s privacy information, please visit:{" "}
                <a
                  href="https://www.facebook.com/privacy/policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#365b3f] hover:underline"
                >
                  https://www.facebook.com/privacy/policy
                </a>
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Sharing Your Information
              </h2>
              <p className="mt-4 font-normal text-[#1d1a17]">
                We do not sell your personal information. We may share your information only where necessary to operate our business, including with:
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>payment gateways;</li>
                <li>logistics and courier partners;</li>
                <li>cloud hosting providers;</li>
                <li>website service providers;</li>
                <li>analytics providers;</li>
                <li>marketing service providers;</li>
                <li>customer support platforms.</li>
              </ul>
              <p className="mt-4 font-normal text-[#1d1a17]">
                We may also disclose information:
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>where required by applicable law;</li>
                <li>to comply with legal proceedings;</li>
                <li>to protect our rights;</li>
                <li>to investigate fraud or security incidents.</li>
              </ul>
              <p className="mt-4">
                All third-party providers are expected to process your information responsibly and only for the purposes for which it has been shared.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Data Security
              </h2>
              <p className="mt-4">
                Protecting your information is important to us. We implement appropriate administrative, technical and organisational safeguards designed to protect personal information against unauthorised access, disclosure, alteration or destruction.
              </p>
              <p className="mt-4 font-normal text-[#1d1a17]">These measures include:</p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>HTTPS encryption;</li>
                <li>secure cloud hosting;</li>
                <li>restricted administrative access;</li>
                <li>regular software updates;</li>
                <li>access controls;</li>
                <li>industry-standard security practices.</li>
              </ul>
              <p className="mt-4">
                While we take reasonable precautions, no method of electronic transmission or storage can be guaranteed to be completely secure.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Data Retention
              </h2>
              <p className="mt-4 font-normal text-[#1d1a17]">
                We retain your personal information only for as long as reasonably necessary to:
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>fulfil your orders;</li>
                <li>provide customer support;</li>
                <li>comply with legal, tax and accounting obligations;</li>
                <li>resolve disputes;</li>
                <li>enforce our agreements.</li>
              </ul>
              <p className="mt-4 font-normal text-[#1d1a17]">
                When information is no longer required, we securely delete or anonymise it where reasonably practicable.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Your Rights
              </h2>
              <p className="mt-4 font-normal text-[#1d1a17]">
                Subject to applicable law, including the Digital Personal Data Protection Act, 2023, you may have the right to:
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>access your personal information;</li>
                <li>request correction of inaccurate information;</li>
                <li>request deletion of your personal information where legally permissible;</li>
                <li>withdraw consent for processing where consent is the basis of processing;</li>
                <li>object to certain marketing communications.</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us at:{" "}
                <a href="mailto:lifeatseijaku@gmail.com" className="text-[#365b3f] hover:underline">
                  lifeatseijaku@gmail.com
                </a>
              </p>
              <p className="mt-4 font-normal text-[#1d1a17]">
                We may request reasonable verification of your identity before processing such requests.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Children&apos;s Privacy
              </h2>
              <p className="mt-4 font-normal text-[#1d1a17]">
                Our website is intended for individuals aged 18 years or older. We do not knowingly collect personal information from children.
              </p>
              <p className="mt-4">
                If we become aware that personal information has been collected from a child without appropriate parental consent where required by law, we will take reasonable steps to delete such information.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Third-Party Websites
              </h2>
              <p className="mt-4">
                Our website may contain links to third-party websites or services. We are not responsible for the privacy practices or content of those external websites.
              </p>
              <p className="mt-4 font-normal text-[#1d1a17]">
                We encourage you to review the privacy policies of any third-party websites you visit.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Changes to this Privacy Policy
              </h2>
              <p className="mt-4">
                We may update this Privacy Policy from time to time to reflect changes in our business practices, technology, legal requirements or regulatory obligations.
              </p>
              <p className="mt-4">
                The updated version will always be published on this page together with the revised &ldquo;Last Updated&rdquo; date.
              </p>
              <p className="mt-4 font-normal text-[#1d1a17]">
                Your continued use of the website after such updates constitutes acceptance of the revised Privacy Policy.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Intellectual Property &amp; Permitted Use
              </h2>
              <p className="mt-4">
                Unless otherwise stated, all content on{" "}
                <Link href="/" className="text-[#365b3f] hover:underline">
                  www.seijaku.in
                </Link>
                , including but not limited to text, photographs, illustrations, graphics, product designs, packaging designs, logos, trademarks, videos, audio, website layouts and software, is the intellectual property of Seijaku Craftworks Pvt. Ltd. or its licensors and is protected under applicable intellectual property laws.
              </p>
              <p className="mt-4">
                You may access and use this website solely for your personal, non-commercial use.
              </p>
              <p className="mt-4 font-normal text-[#1d1a17]">
                You may not reproduce, modify, distribute, publish, transmit, display, create derivative works from or commercially exploit any content from this website without our prior written permission.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-[24px] font-normal tracking-[-0.01em] text-[#1c1c1c] sm:text-[28px]">
                Contact Us
              </h2>
              <p className="mt-4">
                If you have any questions regarding this Privacy Policy or how your personal information is handled, please contact us:
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
