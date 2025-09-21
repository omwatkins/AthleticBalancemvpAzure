import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Terms of Service - Athletic Balance",
  description: "Terms of service for Athletic Balance AI coaching platform",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Athletic Balance – Terms of Service</CardTitle>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none space-y-6">
            <div className="mb-6">
              <p>
                Welcome to Athletic Balance. By accessing or using our website, applications, or services ("Services"),
                you agree to these Terms of Service ("Terms"). Please read carefully.
              </p>
              <p className="font-medium">If you do not agree, do not use our Services.</p>
            </div>

            <section>
              <h2 className="text-xl font-semibold mb-3">1. Eligibility</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must be at least 12 years old to use Athletic Balance.</li>
                <li>Users under 18 must have permission from a parent, guardian, or school authority.</li>
                <li>By using the Services, you confirm you meet these requirements.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Accounts</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>You agree to provide accurate information and update it as needed.</li>
                <li>Athletic Balance is not liable for unauthorized use of your account.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Use of Services</h2>
              <p className="mb-3">You agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Services only for lawful purposes.</li>
                <li>Not misuse or disrupt the Services (e.g., hacking, automated scraping, abusive content).</li>
                <li>Respect other athletes, coaches, and community members.</li>
              </ul>
              <p className="mt-3">Athletic Balance may suspend or terminate accounts for misuse.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Content Ownership</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Your Content:</strong> You retain ownership of data, journal entries, reflections, and
                  materials you upload.
                </li>
                <li>
                  <strong>License to Us:</strong> By using the Services, you grant Athletic Balance a limited,
                  non-exclusive, royalty-free license to process, store, and display your content solely to operate and
                  improve the Services.
                </li>
                <li>
                  <strong>Anonymized Data:</strong> Athletic Balance may use de-identified or aggregated data at its
                  discretion to improve products, conduct research, or generate insights.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Intellectual Property</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  All Athletic Balance trademarks, logos, designs, and original content are owned by Athletic Balance,
                  LLC.
                </li>
                <li>You may not copy, distribute, or exploit our intellectual property without written permission.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Payments & Subscriptions</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Some Services require a paid subscription.</li>
                <li>All fees are billed in advance and are non-refundable, except where required by law.</li>
                <li>We may change pricing with reasonable notice. Continued use after changes means acceptance.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Disclaimers</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>No Medical or Legal Advice:</strong> The Services provide educational and performance guidance
                  only. They are not a substitute for professional medical, mental health, or legal advice.
                </li>
                <li>
                  <strong>No Guarantee of Results:</strong> While based on proven science and coaching principles,
                  individual outcomes vary.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
              <p className="mb-3">To the maximum extent permitted by law:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Athletic Balance is not liable for indirect, incidental, or consequential damages.</li>
                <li>
                  Our total liability for claims arising out of the Services will not exceed the amount paid by you in
                  the 12 months preceding the claim.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Termination</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You may stop using the Services at any time.</li>
                <li>We may suspend or terminate access if you violate these Terms or misuse the Services.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Governing Law</h2>
              <p>
                These Terms are governed by the laws of the State of [Insert State], without regard to conflict of law
                principles.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Changes to Terms</h2>
              <p>
                We may update these Terms from time to time. Material changes will be communicated through the app or
                email. Continued use after updates means acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Contact</h2>
              <p>Questions about these Terms may be directed to:</p>
              <div className="mt-3 p-4 bg-muted rounded-lg">
                <p className="font-medium">Athletic Balance Legal Team</p>
                <p className="text-lime-600 dark:text-lime-400">info@athleticbalanceai.com</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
