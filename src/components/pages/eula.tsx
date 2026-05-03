export default function EulaPage() {
  return (
    <main className="flex-1 max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold font-serif-display text-text-primary mb-2">End User License Agreement</h1>
      <p className="text-xs text-text-muted font-mono mb-8">Last updated: April 25, 2026</p>

      <section className="space-y-6 text-sm text-text-secondary leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">1. Acceptance</h2>
          <p>By accessing and using c7xai.in (&quot;the Service&quot;), you agree to be bound by this End User License Agreement (&quot;EULA&quot;). If you do not agree, do not use the Service.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">2. Description of Service</h2>
          <p>c7xai provides inflation-adjusted, tax-aware financial calculators for India. All computations run client-side in your browser. No personal financial data is transmitted to any server.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">3. Not Financial Advice</h2>
          <p>The calculators provide estimates based on publicly available tax laws, RBI data, and general assumptions. They do not constitute financial advice, investment recommendations, or tax planning guidance. Consult a SEBI-registered investment advisor or chartered accountant before making financial decisions.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">4. Accuracy Disclaimer</h2>
          <p>While we strive for accuracy, tax laws change frequently and individual circumstances vary. Results are estimates only. c7xai is not liable for any financial decisions made based on calculator outputs.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">5. Data Collection & Sharing</h2>
          <p>c7xai collects minimal data to operate the service. All calculator computations happen in your browser. When you use the &quot;Download Report&quot; feature, your name and email are collected via OAuth for report delivery.</p>
          <p className="mt-2"><strong>Promotional Communications:</strong> By using the Service, you agree to receive occasional promotional emails, newsletters, and product updates from c7xai. You may opt out of promotional communications at any time by clicking the unsubscribe link in any email.</p>
          <p className="mt-2"><strong>Third-Party Sharing:</strong> c7xai may share aggregated, anonymized usage data with third-party service providers and partners for analytics, service improvement, and marketing purposes. Individual personally identifiable information (name, email) may be shared with trusted partners who assist in service delivery, report generation, or marketing. We ensure all partners comply with applicable data protection laws.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">6. Intellectual Property</h2>
          <p>All content, design, and code on c7xai.in is the property of c7xai. You may not reproduce, distribute, or create derivative works without written permission.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">7. Limitation of Liability</h2>
          <p>To the fullest extent permitted by Indian law, c7xai shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of the Service.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">8. Governing Law</h2>
          <p>This EULA is governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in India.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">9. Changes</h2>
          <p>We may update this EULA from time to time. Continued use of the Service after changes constitutes acceptance of the revised EULA.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">10. Contact</h2>
          <p>For questions about this EULA, contact us at legal@c7xai.in.</p>
        </div>
      </section>
    </main>
  );
}