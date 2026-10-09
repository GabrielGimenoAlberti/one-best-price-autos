import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Terms of Use | One Best Price Autos" };

const CONTACT_EMAIL = "example@email.com"; // replace

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="October 2026">
      <p>By using this website you agree to these terms.</p>

      <section>
        <h2>Vehicle information</h2>
        <p>
          We work to keep listings accurate, but prices, availability, mileage, and
          descriptions may contain errors or change without notice. Listings are not an
          offer to sell. Please confirm details with us before you buy.
        </p>
      </section>

      <section>
        <h2>Using the site</h2>
        <ul>
          <li>Provide accurate information when you contact us or create an account.</li>
          <li>Keep your login private, and tell us if you think it was misused.</li>
          <li>Do not attempt to disrupt, scrape, or gain unauthorized access to the site.</li>
        </ul>
      </section>

      <section>
        <h2>Limits of liability</h2>
        <p>
          The site is provided &quot;as is.&quot; To the extent the law allows, we are not
          liable for losses that result from using the site or relying on its content.
        </p>
      </section>

      <section>
        <h2>Governing law</h2>
        <p>These terms are governed by the laws of the State of Florida.</p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions? Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal-700 hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}