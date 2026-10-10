import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Privacy Policy | One Best Price Autos" };

const CONTACT_EMAIL = "jorgebestpriceautos@gmail.com"; 

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 2026">
      <p>
        One Best Price Autos (&quot;we&quot;) respects your privacy. This page explains what
        information we collect through this website and how we use it.
      </p>

      <section>
        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong>Messages:</strong> your name, email, optional phone number, and message
            when you contact us, including the vehicle you asked about.
          </li>
          <li>
            <strong>Accounts:</strong> your name, email, optional phone number, and a
            securely hashed password if you create an account. We never store your password
            in readable form.
          </li>
        </ul>
      </section>

      <section>
        <h2>How we use it</h2>
        <p>
          We use your information only to respond to your inquiries, operate your account,
          and run the website. We do not sell your information.
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          We use one essential cookie to keep you logged in. We do not currently use
          advertising or analytics cookies.
        </p>
      </section>

      <section>
        <h2>Service providers</h2>
        <p>
          We use trusted companies to run the site: web hosting (Netlify and Render),
          database storage (MongoDB Atlas), image storage (Cloudinary), and email delivery
          (Resend). They process data only to provide those services.
        </p>
      </section>

      <section>
        <h2>How long we keep it</h2>
        <p>
          Messages marked as handled are deleted automatically after about 90 days. Other
          messages are kept until we handle or delete them. Accounts are kept until you ask
          us to delete them.
        </p>
      </section>

      <section>
        <h2>Your choices</h2>
        <p>
          To see, correct, or delete your information, email us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal-700 hover:underline">
            {CONTACT_EMAIL}
          </a>
          . This website is not intended for children under 13.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>We may update this policy and will change the date above when we do.</p>
      </section>
    </LegalPage>
  );
}