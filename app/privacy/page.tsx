import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Privacy Policy - Athletic Balance",
  description: "Privacy policy for Athletic Balance AI coaching platform",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Athletic Balance Privacy Policy</CardTitle>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <div className="text-base leading-relaxed">
              <p className="mb-6">
                Athletic Balance ("we," "our," "us") respects your privacy and is committed to protecting the personal
                information of our athletes, parents, coaches, and users. This Privacy Policy explains how we collect,
                use, and safeguard information across our websites, applications, and services.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">1. Information We Collect</h2>
              <p className="mb-4">We may collect the following categories of information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Account Information:</strong> Name, email, school, team, or sport when you sign up.
                </li>
                <li>
                  <strong>Usage Data:</strong> Interactions with our app, journaling inputs, session activity, device
                  information, and browser type.
                </li>
                <li>
                  <strong>Performance Data:</strong> Self-reported stats, reflections, or goals entered by athletes.
                </li>
                <li>
                  <strong>Payment Information:</strong> Processed securely by third-party providers (we do not store
                  card details).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">2. How We Use Information</h2>
              <p className="mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, personalize, and improve Athletic Balance services.</li>
                <li>Support athlete development through science-based coaching sessions.</li>
                <li>Maintain the safety and integrity of the platform.</li>
                <li>Communicate updates, features, or support information.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">3. Data for Product Improvement</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Anonymized Data:</strong> We may use de-identified, aggregated, or anonymized information to
                  analyze trends, measure outcomes, and improve product performance.
                </li>
                <li>
                  <strong>Research & Insights:</strong> Such anonymized data may be used at our discretion to enhance
                  product design, training science, and user experience.
                </li>
                <li>
                  <strong>No Re-identification:</strong> We will never attempt to re-identify anonymized data, and we
                  prohibit third parties from doing so.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">4. How We Protect Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Industry-standard encryption for data in transit and at rest.</li>
                <li>Access controls restricting sensitive data to authorized staff only.</li>
                <li>Regular monitoring and audits for vulnerabilities.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">5. Sharing of Information</h2>
              <p className="mb-4 font-semibold">We do not sell your personal information.</p>
              <p className="mb-4">We only share information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Service Providers:</strong> Vendors who support operations (e.g., cloud hosting, payment
                  processors), under strict confidentiality agreements.
                </li>
                <li>
                  <strong>Legal Obligations:</strong> When required by law or to protect the rights, property, or safety
                  of Athletic Balance or others.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">6. Data Retention</h2>
              <p>
                We retain personal data only as long as necessary to provide services, meet legal obligations, or
                resolve disputes. Anonymized and aggregated data may be retained indefinitely for research and product
                development.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">7. Your Rights</h2>
              <p className="mb-4">Depending on your location, you may have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access, correct, or delete your personal information.</li>
                <li>Opt-out of certain data uses (other than anonymized product-improvement uses).</li>
                <li>Request data portability or limit processing.</li>
              </ul>
              <p className="mt-4">
                To exercise rights, contact us at{" "}
                <a href="mailto:info@athleticbalanceai.com" className="text-blue-600 hover:underline">
                  info@athleticbalanceai.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">8. Children's Privacy</h2>
              <p>
                Athletic Balance is intended for student-athletes under coach, school, or parental oversight. We comply
                with COPPA, FERPA, and other applicable youth data protection laws. Parents or guardians may review or
                delete a minor's information at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">9. Updates to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Material changes will be communicated through the
                app or email. Continued use of the platform after updates indicates acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">10. Contact Us</h2>
              <p className="mb-4">Questions, concerns, or privacy requests can be directed to:</p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-semibold">Athletic Balance Privacy Officer</p>
                <p>
                  <a href="mailto:info@athleticbalanceai.com" className="text-blue-600 hover:underline">
                    info@athleticbalanceai.com
                  </a>
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
