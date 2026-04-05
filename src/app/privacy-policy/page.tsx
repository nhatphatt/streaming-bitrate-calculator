import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Streaming Bitrate & Storage Calculator. Learn how we handle cookies, analytics, and your privacy rights under CCPA, CPRA, and GDPR.",
  alternates: {
    canonical: "/privacy-policy/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="text-sm text-[var(--muted-foreground)] mb-6"
      >
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-[var(--primary)] transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-[var(--foreground)] font-medium">
            Privacy Policy
          </li>
        </ol>
      </nav>

      <article className="max-w-3xl [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-[var(--muted-foreground)] [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:text-[var(--muted-foreground)] [&_li]:mb-1.5 [&_a]:text-[var(--primary)] [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-8">
          Effective Date: March 26, 2026 &middot; Last Updated: March 26, 2026
        </p>

        <p>
          Welcome to <strong>Streaming Bitrate &amp; Storage Calculator</strong>{" "}
          (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), accessible at{" "}
          <strong>StreamerSize.com</strong> (the &ldquo;Website&rdquo;). We
          respect your privacy and are committed to transparency about how
          information is collected and used when you visit our Website.
        </p>
        <p>
          This Privacy Policy explains what data is collected, why it is
          collected, and your rights regarding that data. By using this Website,
          you agree to the practices described in this policy.
        </p>

        {/* ====== Section 1 ====== */}
        <h2>1. Nature of Our Service</h2>
        <p>
          Our Website is a <strong>static, client-side web tool</strong> that
          calculates video file sizes, bitrates, and storage requirements. All
          calculations are performed entirely within your browser. We do{" "}
          <strong>not</strong>:
        </p>
        <ul>
          <li>Require you to create an account or log in;</li>
          <li>
            Collect your name, email address, phone number, or any other
            personally identifiable information (&ldquo;PII&rdquo;) directly;
          </li>
          <li>Store any user-submitted data on our servers.</li>
        </ul>

        {/* ====== Section 2 ====== */}
        <h2>2. Information We Collect</h2>
        <p>
          Although we do not collect PII directly, certain information may be
          collected automatically through third-party services integrated into
          our Website:
        </p>

        <h3>2.1 Cookies &amp; Tracking Technologies</h3>
        <p>
          A &ldquo;cookie&rdquo; is a small data file placed on your device by a
          website. We and our third-party partners may use cookies, web beacons,
          and similar technologies for the following purposes:
        </p>
        <ul>
          <li>
            <strong>Essential cookies:</strong> To remember your display
            preferences (e.g., light/dark theme).
          </li>
          <li>
            <strong>Analytics cookies:</strong> To understand how visitors
            interact with our Website (see Section 3).
          </li>
          <li>
            <strong>Advertising cookies:</strong> To serve relevant
            advertisements (see Section 4).
          </li>
        </ul>

        <h3>2.2 Automatically Collected Data</h3>
        <p>
          When you access our Website, our hosting and analytics providers may
          automatically record:
        </p>
        <ul>
          <li>Your Internet Protocol (IP) address (anonymized where possible);</li>
          <li>Browser type and version;</li>
          <li>Operating system;</li>
          <li>Referring URL and exit pages;</li>
          <li>Date, time, and duration of your visit;</li>
          <li>Pages viewed and interactions performed;</li>
          <li>Internet Service Provider (ISP).</li>
        </ul>
        <p>
          This data is collected in aggregate form, is not linked to any
          individual user, and is used solely for the purposes described in
          Section 3.
        </p>

        {/* ====== Section 3 ====== */}
        <h2>3. Log Files &amp; Analytics</h2>
        <p>
          We use industry-standard analytics tools to monitor and improve
          Website performance:
        </p>

        <h3>3.1 Google Analytics</h3>
        <p>
          We may use <strong>Google Analytics</strong>, a web analytics service
          provided by Google LLC (&ldquo;Google&rdquo;). Google Analytics uses
          cookies to help us analyze how visitors use our Website. The
          information generated by the cookie about your use of the Website
          (including your anonymized IP address) is transmitted to and stored by
          Google on servers in the United States.
        </p>
        <p>
          Google will use this information to evaluate your use of the Website,
          compile reports on Website activity, and provide other services
          relating to Website activity and internet usage. You can learn more
          about Google Analytics and opt out by installing the{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Analytics Opt-out Browser Add-on
          </a>
          .
        </p>

        <h3>3.2 Cloudflare Web Analytics</h3>
        <p>
          Our Website is hosted on Cloudflare Pages. Cloudflare may collect
          anonymized performance and traffic data to provide its content delivery
          and security services. Cloudflare Web Analytics is privacy-focused and
          does not use client-side cookies. For more information, see{" "}
          <a
            href="https://www.cloudflare.com/privacypolicy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cloudflare&apos;s Privacy Policy
          </a>
          .
        </p>

        {/* ====== Section 4 ====== */}
        <h2>4. Google AdSense &amp; Advertising Cookies</h2>
        <p>
          We use <strong>Google AdSense</strong> to display advertisements on our
          Website. Google, as a third-party advertising vendor, uses cookies
          &mdash; including the <strong>DoubleClick DART cookie</strong> &mdash;
          to serve ads based on your prior visits to this Website and other
          websites on the internet.
        </p>
        <p>
          Google&apos;s use of the DART cookie enables it and its partners to
          serve advertisements to you based on your browsing history. This means
          the ads you see may be tailored to your interests.
        </p>
        <p>
          <strong>You can opt out of personalized advertising</strong> by
          visiting{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google&apos;s Ads Settings
          </a>
          . Alternatively, you can opt out of third-party vendor cookies by
          visiting the{" "}
          <a
            href="https://optout.networkadvertising.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Network Advertising Initiative opt-out page
          </a>{" "}
          or the{" "}
          <a
            href="https://optout.aboutads.info/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Digital Advertising Alliance opt-out page
          </a>
          .
        </p>
        <p>
          For more information on how Google uses data when you use our Website,
          please visit{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
          >
            How Google Uses Information from Sites That Use Our Services
          </a>
          .
        </p>

        {/* ====== Section 5 ====== */}
        <h2>5. Your Privacy Rights</h2>

        <h3>
          5.1 California Residents — CCPA / CPRA (California Consumer Privacy
          Act &amp; California Privacy Rights Act)
        </h3>
        <p>
          If you are a resident of California, you have the following rights
          under the CCPA and CPRA:
        </p>
        <ul>
          <li>
            <strong>Right to Know:</strong> You may request disclosure of the
            categories and specific pieces of personal information we have
            collected about you.
          </li>
          <li>
            <strong>Right to Delete:</strong> You may request deletion of
            personal information we have collected about you.
          </li>
          <li>
            <strong>Right to Opt-Out of Sale:</strong> We do{" "}
            <strong>NOT sell your personal information</strong> to third parties.
            We do not and will not sell personal information as defined under the
            CCPA/CPRA.
          </li>
          <li>
            <strong>Right to Non-Discrimination:</strong> We will not
            discriminate against you for exercising any of these rights.
          </li>
        </ul>
        <p>
          Since our Website does not collect personally identifiable information,
          there is typically no personal data for us to disclose or delete.
          However, if you believe we hold any data about you and wish to exercise
          your rights, please contact us at the address provided in Section 9.
        </p>

        <h3>5.2 European Residents — GDPR (General Data Protection Regulation)</h3>
        <p>
          If you are located in the European Economic Area (EEA), the United
          Kingdom, or Switzerland, you have the following rights under the GDPR:
        </p>
        <ul>
          <li>
            <strong>Right of Access:</strong> You may request a copy of the
            personal data we hold about you.
          </li>
          <li>
            <strong>Right to Rectification:</strong> You may request correction
            of inaccurate personal data.
          </li>
          <li>
            <strong>Right to Erasure (&ldquo;Right to Be Forgotten&rdquo;):</strong>{" "}
            You may request that we delete any personal data we hold about you.
          </li>
          <li>
            <strong>Right to Restrict Processing:</strong> You may request that
            we limit how we use your data.
          </li>
          <li>
            <strong>Right to Data Portability:</strong> You may request your
            personal data in a structured, machine-readable format.
          </li>
          <li>
            <strong>Right to Object:</strong> You may object to the processing
            of your personal data.
          </li>
        </ul>
        <p>
          As stated above, we do not actively collect or store personally
          identifiable information. Any data collected automatically through
          analytics and advertising cookies can be controlled through your
          browser settings or by using the opt-out links provided in Sections 3
          and 4. If you wish to exercise any GDPR rights, please contact us at
          the address in Section 9.
        </p>

        {/* ====== Section 6 ====== */}
        <h2>6. External Links &amp; Affiliate Disclaimer</h2>
        <p>
          Our Website may contain links to external websites, including but not
          limited to affiliate links (e.g., Amazon Associates, hardware
          retailers, and other third-party services). These links are provided
          for your convenience and informational purposes only.
        </p>
        <p>
          We have <strong>no control over</strong> the content, privacy policies,
          or practices of any third-party websites. We do not endorse and are not
          responsible for the privacy practices or the content of these external
          sites. We strongly encourage you to review the privacy policy of every
          website you visit through our links.
        </p>
        <p>
          <strong>Affiliate Disclosure:</strong> Some links on this Website may
          be affiliate links, meaning we may earn a small commission at no
          additional cost to you if you make a purchase through those links. This
          does not influence our editorial content or recommendations.
        </p>

        {/* ====== Section 7 ====== */}
        <h2>7. Children&apos;s Privacy</h2>
        <p>
          Our Website is not directed at children under the age of 13. We do not
          knowingly collect personal information from children under 13. If you
          are a parent or guardian and believe your child has provided us with
          personal information, please contact us so we can take appropriate
          action.
        </p>

        {/* ====== Section 8 ====== */}
        <h2>8. Changes to This Privacy Policy</h2>
        <p>
          We reserve the right to update or modify this Privacy Policy at any
          time. When we make changes, we will update the &ldquo;Last
          Updated&rdquo; date at the top of this page. We encourage you to
          review this Privacy Policy periodically for any changes. Your continued
          use of the Website after any modifications constitutes your acceptance
          of the updated policy.
        </p>

        {/* ====== Section 9 ====== */}
        <h2>9. Contact Us</h2>
        <p>
          If you have any questions, concerns, or requests regarding this Privacy
          Policy or our data practices, please contact us at:
        </p>
        <p>
          <strong>Email:</strong> privacy@streamersize.com
        </p>

        <div className="mt-12 pt-6 border-t border-[var(--border)] text-sm text-[var(--muted-foreground)]">
          <p className="mb-0">
            This Privacy Policy is provided for informational purposes and
            constitutes a binding agreement between you and Streaming Bitrate
            &amp; Storage Calculator. By accessing and using this Website, you
            acknowledge that you have read, understood, and agree to be bound by
            this Privacy Policy.
          </p>
        </div>
      </article>
    </>
  );
}
