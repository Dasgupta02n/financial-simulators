export default function TermsPage() {
  return (
    <main className="flex-1 max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold font-serif-display text-text-primary mb-2">Terms of Service</h1>
      <p className="text-xs text-text-muted font-mono mb-8">Last updated: April 25, 2026</p>

      <section className="space-y-6 text-sm text-text-secondary leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">1. Acceptance</h2>
          <p>By using c7xai.in, you agree to these Terms of Service. If you disagree, please do not use the service.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">2. Service Description</h2>
          <p>c7xai provides free, client-side financial calculators for Indian users. All computations run in your browser — no data is sent to any server.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">3. No Financial Advice</h2>
          <p>Calculator results are estimates for informational purposes only. They do not constitute financial, tax, or investment advice. Always consult a qualified professional before making financial decisions.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">4. Accuracy</h2>
          <p>We use current Indian tax laws and RBI data, but:</p>
          <ul className="list-disc pl-4 mt-2 space-y-1">
            <li>Tax laws change — results may not reflect the latest amendments</li>
            <li>Individual circumstances vary — generic calculators cannot cover all cases</li>
            <li>Assumptions (inflation rate, return rate) are defaults — adjust them for your situation</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">5. User Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-4 mt-2 space-y-1">
            <li>Use the service for any unlawful purpose</li>
            <li>Attempt to reverse-engineer or exploit the service</li>
            <li>Misrepresent calculator results as professional financial advice</li>
            <li>Use automated tools to scrape or excessively access the service</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">6. Intellectual Property</h2>
          <p>All content, design, and code on c7xai.in is owned by c7xai. You may link to our calculators but may not embed, reproduce, or redistribute our content without permission.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">7. Disclaimer of Warranties</h2>
          <p>The service is provided &quot;as is&quot; without warranties of any kind. We do not guarantee accuracy, completeness, or fitness for any particular purpose.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">8. Limitation of Liability</h2>
          <p>c7xai shall not be liable for any losses arising from the use of calculator results, including but not limited to financial losses, tax penalties, or investment decisions.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">9. Indemnification</h2>
          <p>You agree to indemnify c7xai against any claims arising from your use of the service or reliance on calculator results.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">10. Governing Law</h2>
          <p>These terms are governed by Indian law. Disputes shall be subject to courts in India.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">11. Contact</h2>
          <p>Questions about these terms: legal@c7xai.in</p>
        </div>
      </section>
    </main>
  );
}