import Link from "next/link"

import type { TocEntry } from "@/lib/blocks"

import { InShort, LegalSection, LegalSubsection, LegalTable } from "./legal-sections"

const CONTACT_EMAIL = "contact@excelinsider.com"
const DSAR_URL = "https://app.termly.io/dsar/48e78c17-7d24-4d63-9d23-98e3f5454abd"

export const privacyToc: TocEntry[] = [
  { id: "what-information-do-we-collect", text: "What information do we collect?", level: 2 },
  { id: "how-do-we-process-your-information", text: "How do we process your information?", level: 2 },
  {
    id: "what-legal-bases-do-we-rely-on-to-process-your-information",
    text: "What legal bases do we rely on to process your information?",
    level: 2,
  },
  {
    id: "when-and-with-whom-do-we-share-your-personal-information",
    text: "When and with whom do we share your personal information?",
    level: 2,
  },
  {
    id: "do-we-use-cookies-and-other-tracking-technologies",
    text: "Do we use cookies and other tracking technologies?",
    level: 2,
  },
  { id: "how-long-do-we-keep-your-information", text: "How long do we keep your information?", level: 2 },
  { id: "how-do-we-keep-your-information-safe", text: "How do we keep your information safe?", level: 2 },
  { id: "do-we-collect-information-from-minors", text: "Do we collect information from minors?", level: 2 },
  { id: "what-are-your-privacy-rights", text: "What are your privacy rights?", level: 2 },
  { id: "controls-for-do-not-track-features", text: "Controls for do-not-track features", level: 2 },
  {
    id: "do-united-states-residents-have-specific-privacy-rights",
    text: "Do United States residents have specific privacy rights?",
    level: 2,
  },
  {
    id: "do-other-regions-have-specific-privacy-rights",
    text: "Do other regions have specific privacy rights?",
    level: 2,
  },
  { id: "do-we-make-updates-to-this-notice", text: "Do we make updates to this notice?", level: 2 },
  {
    id: "how-can-you-contact-us-about-this-notice",
    text: "How can you contact us about this notice?",
    level: 2,
  },
  {
    id: "how-can-you-review-update-or-delete-the-data-we-collect-from-you",
    text: "How can you review, update, or delete the data we collect from you?",
    level: 2,
  },
  { id: "advertising-privacy-policy", text: "Advertising Privacy Policy", level: 2 },
]

export function PrivacyContent() {
  return (
    <>
      <div>
        <p>
          This Privacy Notice for Excel Insider (“<strong>we</strong>,” “<strong>us</strong>,” or “
          <strong>our</strong>”), describes how and why we might access, collect, store, use,
          and/or share (“<strong>process</strong>”) your personal information when you use our
          services (“<strong>Services</strong>”), including when you:
        </p>
        <ul>
          <li>
            Visit our website at{" "}
            <a href="https://excelinsider.com">https://excelinsider.com</a> or any website of ours
            that links to this Privacy Notice
          </li>
          <li>
            Use Blog &amp; Video tutorials on Microsoft Excel &amp; Google Sheets, Spreadsheet
            Service, Templates &amp; Tools. At Excel Insider, we provide a complete range of
            professional Excel and Google Sheets templates, custom spreadsheet solutions, and data
            automation services. Alongside our products, we publish insightful blog articles and
            step-by-step video tutorials to help users master spreadsheets with ease. Whether you
            need a ready-made template, a custom dashboard, or expert guidance, Excel Insider is
            here to make your work smarter and more efficient.
          </li>
          <li>Engage with us in other related ways, including any sales, marketing, or events</li>
        </ul>
        <p>
          <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you
          understand your privacy rights and choices. We are responsible for making decisions about
          how your personal information is processed. If you do not agree with our policies and
          practices, please do not use our Services. If you still have any questions or concerns,
          please contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </div>

      <LegalSection id="what-information-do-we-collect" num="1" title="What information do we collect?">
        <LegalSubsection id="personal-information-you-disclose-to-us" title="Personal information you disclose to us">
          <InShort>We collect personal information that you provide to us.</InShort>
          <p>
            We collect personal information that you voluntarily provide to us when you express an
            interest in obtaining information about us or our products and Services, when you
            participate in activities on the Services, or otherwise when you contact us.
          </p>
          <p>
            <strong>Personal Information Provided by You.</strong> The personal information that we
            collect depends on the context of your interactions with us and the Services, the
            choices you make, and the products and features you use. The personal information we
            collect may include the following:
          </p>
          <ul>
            <li>names</li>
            <li>phone numbers</li>
            <li>email addresses</li>
            <li>mailing addresses</li>
            <li>contact preferences</li>
          </ul>
          <p>
            <strong>Sensitive Information.</strong> We do not process sensitive information.
          </p>
          <p>
            All personal information that you provide to us must be true, complete, and accurate,
            and you must notify us of any changes to such personal information.
          </p>
        </LegalSubsection>

        <LegalSubsection id="information-automatically-collected" title="Information automatically collected">
          <InShort>
            Some information — such as your Internet Protocol (IP) address and/or browser and
            device characteristics — is collected automatically when you visit our Services.
          </InShort>
          <p>
            We automatically collect certain information when you visit, use, or navigate the
            Services. This information does not reveal your specific identity (like your name or
            contact information) but may include device and usage information, such as your IP
            address, browser and device characteristics, operating system, language preferences,
            referring URLs, device name, country, location, information about how and when you use
            our Services, and other technical information. This information is primarily needed to
            maintain the security and operation of our Services, and for our internal analytics and
            reporting purposes.
          </p>
          <p>
            Like many businesses, we also collect information through cookies and similar
            technologies. You can find out more about this in our{" "}
            <Link href="/cookie-policy">Cookie Notice</Link>.
          </p>
          <p>The information we collect includes:</p>
          <p>
            <em>Log and Usage Data.</em> Log and usage data is service-related, diagnostic, usage,
            and performance information our servers automatically collect when you access or use
            our Services and which we record in log files. Depending on how you interact with us,
            this log data may include your IP address, device information, browser type, and
            settings and information about your activity in the Services (such as the date/time
            stamps associated with your usage, pages and files viewed, searches, and other actions
            you take such as which features you use), device event information (such as system
            activity, error reports (sometimes called “crash dumps”), and hardware settings).
          </p>
          <p>
            <em>Device Data.</em> We collect device data such as information about your computer,
            phone, tablet, or other device you use to access the Services. Depending on the device
            used, this device data may include information such as your IP address (or proxy
            server), device and application identification numbers, location, browser type,
            hardware model, Internet service provider and/or mobile carrier, operating system, and
            system configuration information.
          </p>
          <p>
            <em>Location Data.</em> We collect location data such as information about your
            device’s location, which can be either precise or imprecise. How much information we
            collect depends on the type and settings of the device you use to access the Services.
            For example, we may use GPS and other technologies to collect geolocation data that
            tells us your current location (based on your IP address). You can opt out of allowing
            us to collect this information either by refusing access to the information or by
            disabling your Location setting on your device. However, if you choose to opt out, you
            may not be able to use certain aspects of the Services.
          </p>
        </LegalSubsection>
      </LegalSection>

      <LegalSection id="how-do-we-process-your-information" num="2" title="How do we process your information?">
        <InShort>
          We process your information to provide, improve, and administer our Services,
          communicate with you, for security and fraud prevention, and to comply with law. We
          process the personal information for the following purposes listed below. We may also
          process your information for other purposes only with your prior explicit consent.
        </InShort>
        <p>
          <strong>
            We process your personal information for a variety of reasons, depending on how you
            interact with our Services, including:
          </strong>
        </p>
        <ul>
          <li>
            <strong>To deliver and facilitate delivery of services to the user.</strong> We may
            process your information to provide you with the requested service.
          </li>
          <li>
            <strong>To respond to user inquiries/offer support to users.</strong> We may process
            your information to respond to your inquiries and solve any potential issues you might
            have with the requested service.
          </li>
          <li>
            <strong>To fulfill and manage your orders.</strong> We may process your information to
            fulfill and manage your orders, payments, returns, and exchanges made through the
            Services.
          </li>
          <li>
            <strong>To enable user-to-user communications.</strong> We may process your information
            if you choose to use any of our offerings that allow for communication with another
            user.
          </li>
          <li>
            <strong>To save or protect an individual’s vital interest.</strong> We may process your
            information when necessary to save or protect an individual’s vital interest, such as
            to prevent harm.
          </li>
        </ul>
      </LegalSection>

      <LegalSection
        id="what-legal-bases-do-we-rely-on-to-process-your-information"
        num="3"
        title="What legal bases do we rely on to process your information?"
      >
        <InShort>
          We only process your personal information when we believe it is necessary and we have a
          valid legal reason (i.e., legal basis) to do so under applicable law, like with your
          consent, to comply with laws, to provide you with services to enter into or fulfill our
          contractual obligations, to protect your rights, or to fulfill our legitimate business
          interests.
        </InShort>
        <p>
          <em>
            <strong>If you are located in the EU or UK, this section applies to you.</strong>
          </em>
        </p>
        <p>
          The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the
          valid legal bases we rely on in order to process your personal information. As such, we
          may rely on the following legal bases to process your personal information:
        </p>
        <p>
          <strong>Consent.</strong> We may process your information if you have given us permission
          (i.e., consent) to use your personal information for a specific purpose. You can
          withdraw your consent at any time.
        </p>
        <p>
          <strong>Performance of a Contract.</strong> We may process your personal information when
          we believe it is necessary to fulfill our contractual obligations to you, including
          providing our Services or at your request prior to entering into a contract with you.
        </p>
        <p>
          <strong>Legal Obligations.</strong> We may process your information where we believe it
          is necessary for compliance with our legal obligations, such as to cooperate with a law
          enforcement body or regulatory agency, exercise or defend our legal rights, or disclose
          your information as evidence in litigation in which we are involved.
        </p>
        <p>
          <strong>Vital Interests.</strong> We may process your information where we believe it is
          necessary to protect your vital interests or the vital interests of a third party, such
          as situations involving potential threats to the safety of any person.
        </p>
        <p>
          <em>
            <strong>If you are located in Canada, this section applies to you.</strong>
          </em>
        </p>
        <p>
          We may process your information if you have given us specific permission (i.e., express
          consent) to use your personal information for a specific purpose, or in situations where
          your permission can be inferred (i.e., implied consent). You can withdraw your consent at
          any time.
        </p>
        <p>
          In some exceptional cases, we may be legally permitted under applicable law to process
          your information without your consent, including, for example:
        </p>
        <ul>
          <li>
            If collection is clearly in the interests of an individual and consent cannot be
            obtained in a timely way
          </li>
          <li>For investigations and fraud detection and prevention</li>
          <li>For business transactions provided certain conditions are met</li>
          <li>
            If it is contained in a witness statement and the collection is necessary to assess,
            process, or settle an insurance claim
          </li>
          <li>
            For identifying injured, ill, or deceased persons and communicating with next of kin
          </li>
          <li>
            If we have reasonable grounds to believe an individual has been, is, or may be victim
            of financial abuse
          </li>
          <li>
            If it is reasonable to expect collection and use with consent would compromise the
            availability or the accuracy of the information and the collection is reasonable for
            purposes related to investigating a breach of an agreement or a contravention of the
            laws of Canada or a province
          </li>
          <li>
            If disclosure is required to comply with a subpoena, warrant, court order, or rules of
            the court relating to the production of records
          </li>
          <li>
            If it was produced by an individual in the course of their employment, business, or
            profession and the collection is consistent with the purposes for which the
            information was produced
          </li>
          <li>
            If the collection is solely for journalistic, artistic, or literary purposes
          </li>
          <li>
            If the information is publicly available and is specified by the regulations
          </li>
          <li>
            We may disclose de-identified information for approved research or statistics
            projects, subject to ethics oversight and confidentiality commitments
          </li>
        </ul>
      </LegalSection>

      <LegalSection
        id="when-and-with-whom-do-we-share-your-personal-information"
        num="4"
        title="When and with whom do we share your personal information?"
      >
        <InShort>
          We may share information in specific situations described in this section and/or with
          the following third parties.
        </InShort>
        <p>We may need to share your personal information in the following situations:</p>
        <p>
          <strong>Business Transfers.</strong> We may share or transfer your information in
          connection with, or during negotiations of, any merger, sale of company assets,
          financing, or acquisition of all or a portion of our business to another company.
        </p>
        <p>
          <strong>Business Partners.</strong> We may share your information with our business
          partners to offer you certain products, services, or promotions.
        </p>
      </LegalSection>

      <LegalSection
        id="do-we-use-cookies-and-other-tracking-technologies"
        num="5"
        title="Do we use cookies and other tracking technologies?"
      >
        <InShort>
          We may use cookies and other tracking technologies to collect and store your
          information.
        </InShort>
        <p>
          We may use cookies and similar tracking technologies (like web beacons and pixels) to
          gather information when you interact with our Services. Some online tracking
          technologies help us maintain the security of our Services, prevent crashes, fix bugs,
          save your preferences, and assist with basic site functions.
        </p>
        <p>
          We also permit third parties and service providers to use online tracking technologies
          on our Services for analytics and advertising, including to help manage and display
          advertisements, to tailor advertisements to your interests, or to send abandoned shopping
          cart reminders (depending on your communication preferences). The third parties and
          service providers use their technology to provide advertising about products and
          services tailored to your interests which may appear either on our Services or on other
          websites.
        </p>
        <p>
          To the extent these online tracking technologies are deemed to be a “sale”/”sharing”
          (which includes targeted advertising, as defined under the applicable laws) under
          applicable US state laws, you can opt out of these online tracking technologies by
          submitting a request as described below under section “
          <a href="#do-united-states-residents-have-specific-privacy-rights">
            DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
          </a>
          ”
        </p>
        <p>
          Specific information about how we use such technologies and how you can refuse certain
          cookies is set out in our <Link href="/cookie-policy">Cookie Notice</Link>.
        </p>
        <LegalSubsection id="google-analytics" title="Google Analytics">
          <p>
            We may share your information with Google Analytics to track and analyze the use of
            the Services. To opt out of being tracked by Google Analytics across the Services,
            visit{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://tools.google.com/dlpage/gaoptout
            </a>
            . For more information on the privacy practices of Google, please visit the{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Privacy &amp; Terms page
            </a>
            .
          </p>
        </LegalSubsection>
      </LegalSection>

      <LegalSection id="how-long-do-we-keep-your-information" num="6" title="How long do we keep your information?">
        <InShort>
          We keep your information for as long as necessary to fulfill the purposes outlined in
          this Privacy Notice unless otherwise required by law.
        </InShort>
        <p>
          We will only keep your personal information for as long as it is necessary for the
          purposes set out in this Privacy Notice, unless a longer retention period is required or
          permitted by law (such as tax, accounting, or other legal requirements).
        </p>
        <p>
          When we have no ongoing legitimate business need to process your personal information,
          we will either delete or anonymize such information, or, if this is not possible (for
          example, because your personal information has been stored in backup archives), then we
          will securely store your personal information and isolate it from any further processing
          until deletion is possible.
        </p>
      </LegalSection>

      <LegalSection id="how-do-we-keep-your-information-safe" num="7" title="How do we keep your information safe?">
        <InShort>
          We aim to protect your personal information through a system of organizational and
          technical security measures.
        </InShort>
        <p>
          We have implemented appropriate and reasonable technical and organizational security
          measures designed to protect the security of any personal information we process.
          However, despite our safeguards and efforts to secure your information, no electronic
          transmission over the Internet or information storage technology can be guaranteed to be
          100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other
          unauthorized third parties will not be able to defeat our security and improperly
          collect, access, steal, or modify your information. Although we will do our best to
          protect your personal information, transmission of personal information to and from our
          Services is at your own risk. You should only access the Services within a secure
          environment.
        </p>
      </LegalSection>

      <LegalSection id="do-we-collect-information-from-minors" num="8" title="Do we collect information from minors?">
        <InShort>
          We do not knowingly collect data from or market to children under 18 years of age or
          the equivalent age as specified by law in your jurisdiction.
        </InShort>
        <p>
          We do not knowingly collect, solicit data from, or market to children under 18 years of
          age or the equivalent age as specified by law in your jurisdiction, nor do we knowingly
          sell such personal information. By using the Services, you represent that you are at
          least 18 or the equivalent age as specified by law in your jurisdiction or that you are
          the parent or guardian of such a minor and consent to such minor dependent’s use of the
          Services. If we learn that personal information from users less than 18 years of age or
          the equivalent age as specified by law in your jurisdiction has been collected, we will
          deactivate the account and take reasonable measures to promptly delete such data from
          our records. If you become aware of any data we may have collected from children under
          age 18 or the equivalent age as specified by law in your jurisdiction, please contact us
          at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>

      <LegalSection id="what-are-your-privacy-rights" num="9" title="What are your privacy rights?">
        <InShort>
          Depending on your state of residence in the US or in some regions, such as the European
          Economic Area (EEA), United Kingdom (UK), Switzerland, and Canada, you have rights that
          allow you greater access to and control over your personal information. You may review,
          change, or terminate your account at any time, depending on your country, province, or
          state of residence.
        </InShort>
        <p>
          In some regions (like the EEA, UK, Switzerland, and Canada), you have certain rights
          under applicable data protection laws. These may include the right (i) to request access
          and obtain a copy of your personal information, (ii) to request rectification or
          erasure; (iii) to restrict the processing of your personal information; (iv) if
          applicable, to data portability; and (v) not to be subject to automated decision-making.
          If a decision that produces legal or similarly significant effects is made solely by
          automated means, we will inform you, explain the main factors, and offer a simple way to
          request human review. In certain circumstances, you may also have the right to object to
          the processing of your personal information. You can make such a request by contacting
          us by using the contact details provided in the section “
          <a href="#how-can-you-contact-us-about-this-notice">
            HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
          </a>
          ” below.
        </p>
        <p>
          We will consider and act upon any request in accordance with applicable data protection
          laws.
        </p>
        <p>
          If you are located in the EEA or UK and you believe we are unlawfully processing your
          personal information, you also have the right to complain to your{" "}
          <a
            href="https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Member State data protection authority
          </a>{" "}
          or{" "}
          <a
            href="https://ico.org.uk/make-a-complaint/data-protection-complaints/data-protection-complaints/"
            target="_blank"
            rel="noopener noreferrer"
          >
            UK data protection authority
          </a>
          .
        </p>
        <p>
          If you are located in Switzerland, you may contact the{" "}
          <a
            href="https://www.edoeb.admin.ch/edoeb/en/home.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Federal Data Protection and Information Commissioner
          </a>
          .
        </p>
        <p>
          <strong>Withdrawing your consent:</strong> If we are relying on your consent to process
          your personal information, which may be express and/or implied consent depending on the
          applicable law, you have the right to withdraw your consent at any time. You can
          withdraw your consent at any time by contacting us by using the contact details provided
          in the section “
          <a href="#how-can-you-contact-us-about-this-notice">
            HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
          </a>
          ” below.
        </p>
        <p>
          However, please note that this will not affect the lawfulness of the processing before
          its withdrawal nor, when applicable law allows, will it affect the processing of your
          personal information conducted in reliance on lawful processing grounds other than
          consent.
        </p>
        <p>
          <strong>Cookies and similar technologies:</strong> Most Web browsers are set to accept
          cookies by default. If you prefer, you can usually choose to set your browser to remove
          cookies and to reject cookies. If you choose to remove cookies or reject cookies, this
          could affect certain features or services of our Services. For further information,
          please see our <Link href="/cookie-policy">Cookie Notice</Link>.
        </p>
        <p>
          If you have questions or comments about your privacy rights, you may email us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>

      <LegalSection id="controls-for-do-not-track-features" num="10" title="Controls for do-not-track features">
        <p>
          Most web browsers and some mobile operating systems and mobile applications include a
          Do-Not-Track (“DNT”) feature or setting you can activate to signal your privacy
          preference not to have data about your online browsing activities monitored and
          collected. At this stage, no uniform technology standard for recognizing and
          implementing DNT signals has been finalized. As such, we do not currently respond to DNT
          browser signals or any other mechanism that automatically communicates your choice not
          to be tracked online. If a standard for online tracking is adopted that we must follow
          in the future, we will inform you about that practice in a revised version of this
          Privacy Notice.
        </p>
        <p>
          California law requires us to let you know how we respond to web browser DNT signals.
          Because there currently is not an industry or legal standard for recognizing or honoring
          DNT signals, we do not respond to them at this time.
        </p>
      </LegalSection>

      <LegalSection
        id="do-united-states-residents-have-specific-privacy-rights"
        num="11"
        title="Do United States residents have specific privacy rights?"
      >
        <InShort>
          If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana,
          Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey,
          Oregon, Rhode Island, Tennessee, Texas, Utah, or Virginia, you may have the right to
          request access to and receive details about the personal information we maintain about
          you and how we have processed it, correct inaccuracies, get a copy of, or delete your
          personal information. You may also have the right to withdraw your consent to our
          processing of your personal information. These rights may be limited in some
          circumstances by applicable law. More information is provided below.
        </InShort>

        <LegalSubsection
          id="categories-of-personal-information-we-collect"
          title="Categories of Personal Information We Collect"
        >
          <p>
            The table below shows the categories of personal information we have collected in the
            past twelve (12) months. The table includes illustrative examples of each category and
            does not reflect the personal information we collect from you. For a comprehensive
            inventory of all personal information we process, please refer to the section “
            <a href="#what-information-do-we-collect">WHAT INFORMATION DO WE COLLECT?</a>”
          </p>
          <LegalTable
            headers={["Category", "Examples", "Collected"]}
            rows={[
              [
                "A. Identifiers",
                "Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name",
                "NO",
              ],
              [
                "B. Personal information as defined in the California Customer Records statute",
                "Name, contact information, education, employment, employment history, and financial information",
                "NO",
              ],
              [
                "C. Protected classification characteristics under state or federal law",
                "Gender, age, date of birth, race and ethnicity, national origin, marital status, and other demographic data",
                "NO",
              ],
              [
                "D. Commercial information",
                "Transaction information, purchase history, financial details, and payment information",
                "NO",
              ],
              ["E. Biometric information", "Fingerprints and voiceprints", "NO"],
              [
                "F. Internet or other similar network activity",
                "Browsing history, search history, online behavior, interest data, and interactions with our and other websites, applications, systems, and advertisements",
                "NO",
              ],
              ["G. Geolocation data", "Device location", "NO"],
              [
                "H. Audio, electronic, sensory, or similar information",
                "Images and audio, video or call recordings created in connection with our business activities",
                "NO",
              ],
              [
                "I. Professional or employment-related information",
                "Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications if you apply for a job with us",
                "NO",
              ],
              ["J. Education Information", "Student records and directory information", "NO"],
              [
                "K. Inferences drawn from collected personal information",
                "Inferences drawn from any of the collected personal information listed above to create a profile or summary about, for example, an individual’s preferences and characteristics",
                "NO",
              ],
              ["L. Sensitive personal Information", "—", "NO"],
            ]}
          />
          <p>
            We may also collect other personal information outside of these categories through
            instances where you interact with us in person, online, or by phone or mail in the
            context of:
          </p>
          <ul>
            <li>Receiving help through our customer support channels;</li>
            <li>Participation in customer surveys or contests; and</li>
            <li>
              Facilitation in the delivery of our Services and to respond to your inquiries.
            </li>
          </ul>
        </LegalSubsection>

        <LegalSubsection id="sources-of-personal-information" title="Sources of Personal Information">
          <p>
            Learn more about the sources of personal information we collect in “
            <a href="#what-information-do-we-collect">WHAT INFORMATION DO WE COLLECT?</a>”
          </p>
        </LegalSubsection>

        <LegalSubsection
          id="how-we-use-and-share-personal-information"
          title="How We Use and Share Personal Information"
        >
          <p>
            Learn more about how we use your personal information in the section, “
            <a href="#how-do-we-process-your-information">
              HOW DO WE PROCESS YOUR INFORMATION?
            </a>
            ”
          </p>
        </LegalSubsection>

        <LegalSubsection
          id="will-your-information-be-shared-with-anyone-else"
          title="Will your information be shared with anyone else?"
        >
          <p>
            We may disclose your personal information with our service providers pursuant to a
            written contract between us and each service provider. Learn more about how we
            disclose personal information to in the section, “
            <a href="#when-and-with-whom-do-we-share-your-personal-information">
              WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
            </a>
            ”
          </p>
          <p>
            We may use your personal information for our own business purposes, such as for
            undertaking internal research for technological development and demonstration. This is
            not considered to be “selling” of your personal information.
          </p>
          <p>
            We have not disclosed, sold, or shared any personal information to third parties for a
            business or commercial purpose in the preceding twelve (12) months. We will not sell
            or share personal information in the future belonging to website visitors, users, and
            other consumers.
          </p>
        </LegalSubsection>

        <LegalSubsection id="your-rights" title="Your Rights">
          <p>
            You have rights under certain US state data protection laws. However, these rights
            are not absolute, and in certain cases, we may decline your request as permitted by
            law. These rights include:
          </p>
          <ul>
            <li>
              <strong>Right to know</strong> whether or not we are processing your personal data
            </li>
            <li>
              <strong>Right to access</strong> your personal data
            </li>
            <li>
              <strong>Right to correct</strong> inaccuracies in your personal data
            </li>
            <li>
              <strong>Right to request</strong> the deletion of your personal data
            </li>
            <li>
              <strong>Right to obtain a copy</strong> of the personal data you previously shared
              with us
            </li>
            <li>
              <strong>Right to non-discrimination</strong> for exercising your rights
            </li>
            <li>
              <strong>Right to opt out</strong> of the processing of your personal data if it is
              used for targeted advertising (or sharing as defined under California’s privacy
              law), the sale of personal data, or profiling in furtherance of decisions that
              produce legal or similarly significant effects (“profiling”)
            </li>
          </ul>
          <p>Depending upon the state where you live, you may also have the following rights:</p>
          <ul>
            <li>
              Right to access the categories of personal data being processed (as permitted by
              applicable law, including the privacy law in Minnesota)
            </li>
            <li>
              Right to obtain a list of the categories of third parties to which we have disclosed
              personal data (as permitted by applicable law, including the privacy law in
              California, Delaware, and Maryland)
            </li>
            <li>
              Right to obtain a list of specific third parties to which we have disclosed personal
              data (as permitted by applicable law, including the privacy law in Minnesota and
              Oregon)
            </li>
            <li>
              Right to obtain a list of third parties to which we have sold personal data (as
              permitted by applicable law, including the privacy law in Connecticut)
            </li>
            <li>
              Right to review, understand, question, and depending on where you live, correct how
              personal data has been profiled (as permitted by applicable law, including the
              privacy law in Connecticut and Minnesota)
            </li>
            <li>
              Right to limit use and disclosure of sensitive personal data (as permitted by
              applicable law, including the privacy law in California)
            </li>
            <li>
              Right to opt out of the collection of sensitive data and personal data collected
              through the operation of a voice or facial recognition feature (as permitted by
              applicable law, including the privacy law in Florida)
            </li>
          </ul>
        </LegalSubsection>

        <LegalSubsection id="how-to-exercise-your-rights" title="How to Exercise Your Rights">
          <p>
            To exercise these rights, you can contact us by submitting a{" "}
            <a href={DSAR_URL} target="_blank" rel="noopener noreferrer">
              data subject access request
            </a>
            , by emailing us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, or by
            referring to the contact details at the bottom of this document.
          </p>
          <p>
            Under certain US state data protection laws, you can designate an authorized agent to
            make a request on your behalf. We may deny a request from an authorized agent that
            does not submit proof that they have been validly authorized to act on your behalf in
            accordance with applicable laws.
          </p>
        </LegalSubsection>

        <LegalSubsection id="request-verification" title="Request Verification">
          <p>
            Upon receiving your request, we will need to verify your identity to determine you are
            the same person about whom we have the information in our system. We will only use
            personal information provided in your request to verify your identity or authority to
            make the request. However, if we cannot verify your identity from the information
            already maintained by us, we may request that you provide additional information for
            the purposes of verifying your identity and for security or fraud-prevention purposes.
          </p>
          <p>
            If you submit the request through an authorized agent, we may need to collect
            additional information to verify your identity before processing your request and the
            agent will need to provide a written and signed permission from you to submit such
            request on your behalf.
          </p>
        </LegalSubsection>

        <LegalSubsection id="appeals" title="Appeals">
          <p>
            Under certain US state data protection laws, if we decline to take action regarding
            your request, you may appeal our decision by emailing us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We will inform you in writing
            of any action taken or not taken in response to the appeal, including a written
            explanation of the reasons for the decisions. If your appeal is denied, you may submit
            a complaint to your state attorney general.
          </p>
        </LegalSubsection>

        <LegalSubsection id="california-shine-the-light-law" title="California “Shine The Light” Law">
          <p>
            California Civil Code Section 1798.83, also known as the “Shine The Light” law,
            permits our users who are California residents to request and obtain from us, once a
            year and free of charge, information about categories of personal information (if any)
            we disclosed to third parties for direct marketing purposes and the names and
            addresses of all third parties with which we shared personal information in the
            immediately preceding calendar year. If you are a California resident and would like
            to make such a request, please submit your request in writing to us by using the
            contact details provided in the section “
            <a href="#how-can-you-contact-us-about-this-notice">
              HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
            </a>
            ”
          </p>
        </LegalSubsection>
      </LegalSection>

      <LegalSection
        id="do-other-regions-have-specific-privacy-rights"
        num="12"
        title="Do other regions have specific privacy rights?"
      >
        <InShort>You may have additional rights based on the country you reside in.</InShort>

        <LegalSubsection id="australia-and-new-zealand" title="Australia and New Zealand">
          <p>
            We collect and process your personal information under the obligations and conditions
            set by Australia’s Privacy Act 1988 and New Zealand’s Privacy Act 2020 (Privacy Act).
          </p>
          <p>
            This Privacy Notice satisfies the notice requirements defined in both Privacy Acts, in
            particular: what personal information we collect from you, from which sources, for
            which purposes, and other recipients of your personal information.
          </p>
          <p>
            If you do not wish to provide the personal information necessary to fulfill their
            applicable purpose, it may affect our ability to provide our services, in particular:
          </p>
          <ul>
            <li>offer you the products or services that you want</li>
            <li>respond to or help with your requests</li>
          </ul>
          <p>
            At any time, you have the right to request access to or correction of your personal
            information. You can make such a request by contacting us by using the contact details
            provided in the section “
            <a href="#how-can-you-review-update-or-delete-the-data-we-collect-from-you">
              HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?
            </a>
            ”
          </p>
          <p>
            If you believe we are unlawfully processing your personal information, you have the
            right to submit a complaint about a breach of the Australian Privacy Principles to the{" "}
            <a
              href="https://www.oaic.gov.au/privacy/privacy-complaints/lodge-a-privacy-complaint-with-us"
              target="_blank"
              rel="noopener noreferrer"
            >
              Office of the Australian Information Commissioner
            </a>{" "}
            and a breach of New Zealand’s Privacy Principles to the{" "}
            <a
              href="https://www.privacy.org.nz/your-rights/making-a-complaint/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Office of New Zealand Privacy Commissioner
            </a>
            .
          </p>
        </LegalSubsection>

        <LegalSubsection id="republic-of-south-africa" title="Republic of South Africa">
          <p>
            At any time, you have the right to request access to or correction of your personal
            information. You can make such a request by contacting us by using the contact details
            provided in the section “
            <a href="#how-can-you-review-update-or-delete-the-data-we-collect-from-you">
              HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?
            </a>
            ”
          </p>
          <p>
            If you are unsatisfied with the manner in which we address any complaint with regard
            to our processing of personal information, you can contact the office of the
            regulator, the details of which are:
          </p>
          <ul>
            <li>
              <a href="https://inforegulator.org.za/" target="_blank" rel="noopener noreferrer">
                The Information Regulator (South Africa)
              </a>
            </li>
            <li>
              General enquiries:{" "}
              <a href="mailto:enquiries@inforegulator.org.za">enquiries@inforegulator.org.za</a>
            </li>
            <li>
              Complaints (complete POPIA/PAIA form 5):{" "}
              <a href="mailto:PAIAComplaints@inforegulator.org.za">
                PAIAComplaints@inforegulator.org.za
              </a>{" "}
              &amp;{" "}
              <a href="mailto:POPIAComplaints@inforegulator.org.za">
                POPIAComplaints@inforegulator.org.za
              </a>
            </li>
          </ul>
        </LegalSubsection>
      </LegalSection>

      <LegalSection id="do-we-make-updates-to-this-notice" num="13" title="Do we make updates to this notice?">
        <InShort>Yes, we will update this notice as necessary to stay compliant with relevant laws.</InShort>
        <p>
          We may update this Privacy Notice from time to time. The updated version will be
          indicated by an updated “Revised” date at the top of this Privacy Notice. If we make
          material changes to this Privacy Notice, we may notify you either by prominently posting
          a notice of such changes or by directly sending you a notification. We encourage you to
          review this Privacy Notice frequently to be informed of how we are protecting your
          information.
        </p>
      </LegalSection>

      <LegalSection id="how-can-you-contact-us-about-this-notice" num="14" title="How can you contact us about this notice?">
        <p>
          If you have questions or comments about this notice, you may email us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or contact us by post at:
        </p>
        <p>
          Excel Insider
          <br />
          15, Tallabagh, Moneshwar Road, Jigatola
          <br />
          Dhaka, 1209
          <br />
          Bangladesh
        </p>
      </LegalSection>

      <LegalSection
        id="how-can-you-review-update-or-delete-the-data-we-collect-from-you"
        num="15"
        title="How can you review, update, or delete the data we collect from you?"
      >
        <p>
          Based on the applicable laws of your country or state of residence in the US, you may
          have the right to request access to the personal information we collect from you,
          details about how we have processed it, correct inaccuracies, or delete your personal
          information. You may also have the right to withdraw your consent to our processing of
          your personal information. These rights may be limited in some circumstances by
          applicable law. To request to review, update, or delete your personal information,
          please fill out and submit a{" "}
          <a href={DSAR_URL} target="_blank" rel="noopener noreferrer">
            data subject access request
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection id="advertising-privacy-policy" title="Advertising Privacy Policy">
        <LegalSubsection
          id="mediavine-programmatic-advertising-ver-11"
          title="Mediavine Programmatic Advertising (Ver 1.1)"
        >
          <p>
            The Website works with Mediavine to manage third-party interest-based advertising
            appearing on the Website. Mediavine serves content and advertisements when you visit
            the Website, which may use first and third-party cookies. A cookie is a small text
            file which is sent to your computer or mobile device (referred to in this policy as a
            “device”) by the web server so that a website can remember some information about your
            browsing activity on the Website.
          </p>
          <p>
            First party cookies are created by the website that you are visiting. A third-party
            cookie is frequently used in behavioral advertising and analytics and is created by a
            domain other than the website you are visiting. Third-party cookies, tags, pixels,
            beacons and other similar technologies (collectively, “Tags”) may be placed on the
            Website to monitor interaction with advertising content and to target and optimize
            advertising. Each internet browser has functionality so that you can block both first
            and third-party cookies and clear your browser’s cache. The “help” feature of the menu
            bar on most browsers will tell you how to stop accepting new cookies, how to receive
            notification of new cookies, how to disable existing cookies and how to clear your
            browser’s cache. For more information about cookies and how to disable them, you can
            consult the information at{" "}
            <a
              href="https://www.allaboutcookies.org/manage-cookies/"
              target="_blank"
              rel="noopener noreferrer"
            >
              All About Cookies
            </a>
            .
          </p>
          <p>
            Without cookies you may not be able to take full advantage of the Website content and
            features. Please note that rejecting cookies does not mean that you will no longer see
            ads when you visit our Site. In the event you opt-out, you will still see
            non-personalized advertisements on the Website.
          </p>
          <p>The Website collects the following data using a cookie when serving personalized ads:</p>
          <ul>
            <li>IP Address</li>
            <li>Operating System type</li>
            <li>Operating System version</li>
            <li>Device Type</li>
            <li>Language of the website</li>
            <li>Web browser type</li>
            <li>Email (in hashed form)</li>
          </ul>
          <p>
            Mediavine Partners (companies listed below with whom Mediavine shares data) may also
            use this data to link to other end user information the partner has independently
            collected to deliver targeted advertisements. Mediavine Partners may also separately
            collect data about end users from other sources, such as advertising IDs or pixels,
            and link that data to data collected from Mediavine publishers in order to provide
            interest-based advertising across your online experience, including devices, browsers
            and apps. This data includes usage data, cookie information, device information,
            information about interactions between users and advertisements and websites,
            geolocation data, traffic data, and information about a visitor’s referral source to a
            particular website. Mediavine Partners may also create unique IDs to create audience
            segments, which are used to provide targeted advertising.
          </p>
          <p>
            If you would like more information about this practice and to know your choices to
            opt-in or opt-out of this data collection, please visit{" "}
            <a href="https://thenai.org/opt-out/" target="_blank" rel="noopener noreferrer">
              National Advertising Initiative opt out page
            </a>
            . You may also visit{" "}
            <a href="http://optout.aboutads.info/#/" target="_blank" rel="noopener noreferrer">
              Digital Advertising Alliance website
            </a>{" "}
            and{" "}
            <a
              href="http://optout.networkadvertising.org/#"
              target="_blank"
              rel="noopener noreferrer"
            >
              Network Advertising Initiative website
            </a>{" "}
            to learn more information about interest-based advertising. You may download the
            AppChoices app at{" "}
            <a
              href="https://youradchoices.com/appchoices"
              target="_blank"
              rel="noopener noreferrer"
            >
              Digital Advertising Alliance’s AppChoices app
            </a>{" "}
            to opt out in connection with mobile apps, or use the platform controls on your mobile
            device to opt out.
          </p>
          <p>
            For specific information about Mediavine Partners, the data each collects and their
            data collection and privacy policies, please visit{" "}
            <a
              href="https://www.mediavine.com/ad-partners/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mediavine Partners
            </a>
            .
          </p>
        </LegalSubsection>
      </LegalSection>
    </>
  )
}
