import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — c7xai",
  description: "Privacy policy for c7xai financial calculators. No PII collected, all computation client-side.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="flex-1 max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold font-serif-display text-text-primary mb-2">Privacy Policy</h1>
      <p className="text-xs text-text-muted font-mono mb-8">Last updated: April 25, 2026</p>

      <section className="space-y-6 text-sm text-text-secondary leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">1. Overview</h2>
          <p>c7xai is committed to protecting your privacy. This policy explains what data we collect, how we use it, and your rights under the Information Technology Act, 2000 and applicable Indian data protection laws.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">2. Data We Collect</h2>
          <p><strong>Calculator inputs:</strong> All financial calculations run entirely in your browser. We do not collect, store, or transmit any financial data you enter into the calculators.</p>
          <p className="mt-2"><strong>Report downloads:</strong> If you use the &quot;Download Report&quot; feature, we collect your name and email address (via OAuth) for delivering the report and for promotional communications. This data is stored securely.</p>
          <p className="mt-2"><strong>Analytics:</strong> We may collect anonymized usage data (page views, calculator usage patterns) that does not identify you personally.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">3. Cookies</h2>
          <p>We use minimal cookies for essential site functionality (session management, preferences). We do not use tracking cookies, advertising cookies, or third-party analytics cookies that identify you personally.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">4. Third-Party Services</h2>
          <p>We use OAuth providers (Google, GitHub, etc.) for authentication during report downloads. These providers have their own privacy policies governing the data they collect. We receive only your name and email — no access to your financial data.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">5. Data Retention</h2>
          <p>Email addresses collected for report delivery are retained for a maximum of 90 days and then permanently deleted. No financial data is stored on our servers at any time.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">5.5 Third-Party Sharing & Promotional Communications</h2>
          <p>We may share your name and email with trusted third-party service providers and partners for: (a) service delivery and report generation, (b) promotional emails and newsletters, (c) marketing partnerships. All partners are required to comply with Indian data protection laws.</p>
          <p className="mt-2">You may receive occasional promotional mailers from c7xai or our partners. You can opt out at any time via the unsubscribe link in any email.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">6. Your Rights</h2>
          <p>Under Indian law, you have the right to:</p>
          <ul className="list-disc pl-4 mt-2 space-y-1">
            <li>Access any personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your personal data</li>
            <li>Withdraw consent for data processing</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">7. Security</h2>
          <p>All data transmission is encrypted via HTTPS. Calculator data never leaves your browser. OAuth tokens are stored securely and expired according to provider policies.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">8. Children&apos;s Privacy</h2>
          <p>c7xai is not directed at children under 13. We do not knowingly collect personal information from children.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">9. Changes</h2>
          <p>We may update this policy. Continued use after changes constitutes acceptance.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">10. Contact</h2>
          <p>For privacy concerns: privacy@c7xai.in</p>
        </div>
      </section>
    </main>
  );
}