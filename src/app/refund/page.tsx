import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy — c7xai",
  description: "Refund policy for c7xai financial calculators. All core calculators are free; report downloads are non-refundable digital services.",
  alternates: { canonical: "/refund" },
};

export default function RefundPage() {
  return (
    <main className="flex-1 max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold font-serif-display text-text-primary mb-2">Refund Policy</h1>
      <p className="text-xs text-text-muted font-mono mb-8">Last updated: April 30, 2026</p>

      <section className="space-y-6 text-sm text-text-secondary leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">1. Overview</h2>
          <p>c7xai provides free financial calculators and a paid report download service. This policy outlines refund eligibility for each.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">2. Free Services</h2>
          <p>All core calculators — SIP, EMI, tax, FD, PPF, SWP, FIRE, goal planning, and others — are completely free and require no payment. Since no charge is levied, no refund is applicable.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">3. Paid Report Downloads</h2>
          <p>The &quot;Download Report&quot; feature allows you to receive a detailed financial report via email for a fee. Since this is a digital service delivered electronically:</p>
          <ul className="list-disc pl-4 mt-2 space-y-1">
            <li>Reports are delivered instantly to your registered email upon payment</li>
            <li>As a digital product delivered immediately, reports are non-refundable once delivered</li>
            <li>If you do not receive the report within 24 hours, contact us for re-delivery at no extra charge</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">4. Technical Failures</h2>
          <p>If a payment is processed but the report delivery fails due to a technical error on our end (server outage, email delivery failure), you are entitled to:</p>
          <ul className="list-disc pl-4 mt-2 space-y-1">
            <li>A full refund within 7 business days, or</li>
            <li>Re-delivery of the report at no additional cost</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">5. Duplicate Charges</h2>
          <p>If you are charged twice for the same report due to a system error, the duplicate charge will be refunded within 7 business days upon notification.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">6. How to Request a Refund</h2>
          <p>To request a refund for a technical failure or duplicate charge:</p>
          <ul className="list-disc pl-4 mt-2 space-y-1">
            <li>Email: refund@c7xai.in</li>
            <li>Include your email address, transaction ID, and a description of the issue</li>
            <li>Requests must be made within 30 days of the transaction</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">7. Processing Time</h2>
          <p>Approved refunds will be processed within 7 business days to the original payment method. Bank processing times may vary.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">8. Changes</h2>
          <p>We may update this policy. Continued use after changes constitutes acceptance.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">9. Contact</h2>
          <p>For refund questions: refund@c7xai.in</p>
        </div>
      </section>
    </main>
  );
}