import Link from "next/link"

import type { TocEntry } from "@/lib/blocks"

import { LegalSection } from "./legal-sections"

export const termsToc: TocEntry[] = [
  { id: "business-overview", text: "Business Overview", level: 2 },
  { id: "description-of-services", text: "Description of Services", level: 2 },
  { id: "user-responsibilities-and-conduct", text: "User Responsibilities and Conduct", level: 2 },
  { id: "payment-terms-and-refund-policy", text: "Payment Terms and Refund Policy", level: 2 },
  { id: "intellectual-property-rights", text: "Intellectual Property Rights", level: 2 },
  { id: "liability-and-warranties", text: "Liability and Warranties", level: 2 },
  { id: "change-to-terms", text: "Change to Terms", level: 2 },
  { id: "privacy-policy", text: "Privacy Policy", level: 2 },
  { id: "governing-law", text: "Governing Law", level: 2 },
  { id: "contact-us", text: "Contact Us", level: 2 },
]

export function TermsContent() {
  return (
    <>
      <div>
        <p>
          Welcome to ExcelInsider.com (“we,” “our,” or “us”). These Terms of Service
          (“Terms”) govern your use of our website, products, and services, including
          spreadsheet templates, customization, consulting, tutorials, and advanced courses. By
          accessing or using our services, you agree to be bound by these Terms. If you do not
          agree with these Terms, please do not use our services.
        </p>
      </div>

      <LegalSection id="business-overview" num="1" title="Business Overview">
        <p>
          ExcelInsider.com is a platform dedicated to providing high-quality spreadsheet-related
          solutions. Our offerings include professionally designed spreadsheet templates, custom
          spreadsheet development services, consulting for spreadsheet-related projects,
          comprehensive tutorials, and advanced courses aimed at enhancing your spreadsheet
          skills. Our goal is to empower users to leverage spreadsheet technology efficiently and
          effectively.
        </p>
      </LegalSection>

      <LegalSection id="description-of-services" num="2" title="Description of Services">
        <p>
          ExcelInsider.com offers a comprehensive range of spreadsheet-related solutions designed
          to meet diverse user needs. Our services include, but are not limited to, the following:
        </p>
        <ul>
          <li>
            <strong>Premium and Free Spreadsheet Templates:</strong> Professionally designed
            templates available for immediate download. These cover a wide array of applications
            such as budgeting, project management, data analysis, and reporting. Both free and
            paid options are offered to cater to different user requirements.
          </li>
          <li>
            <strong>Customized Spreadsheet Templates:</strong> Personalized spreadsheet templates
            developed according to your specific instructions and business needs. These are
            created on a paid basis to ensure tailored solutions that perfectly fit your workflow.
          </li>
          <li>
            <strong>Spreadsheet Solution Tasks:</strong> Paid services that address complex
            spreadsheet problems or projects. Our team provides expert solutions and delivers
            custom-built spreadsheets tailored to your unique challenges.
          </li>
          <li>
            <strong>Spreadsheet Tools:</strong> A selection of both free and premium spreadsheet
            tools designed to simplify and enhance your spreadsheet experience. These tools range
            from simple utilities to advanced functionalities.
          </li>
          <li>
            <strong>Custom Spreadsheet Tools &amp; Software:</strong> Development of bespoke
            spreadsheet tools and software solutions built to automate tasks, improve
            productivity, and integrate with your existing systems. These are offered as paid
            services.
          </li>
          <li>
            <strong>Spreadsheet Tutorials:</strong> An extensive collection of educational
            content, including detailed blog posts and YouTube videos, aimed at improving your
            spreadsheet skills across various levels of expertise.
          </li>
          <li>
            <strong>Advanced Spreadsheet Courses:</strong> Structured and comprehensive courses
            designed to provide in-depth knowledge and mastery of spreadsheet techniques and best
            practices.
          </li>
          <li>
            <strong>Forum Support:</strong> A community-driven forum where users can seek
            assistance, share knowledge, and discuss spreadsheet-related topics with experts and
            fellow enthusiasts.
          </li>
        </ul>
        <p>
          Please note that ExcelInsider.com reserves the right to modify, update, or discontinue
          any of the above services at any time without prior notice, in order to maintain the
          highest quality and relevance for our users.
        </p>
      </LegalSection>

      <LegalSection
        id="user-responsibilities-and-conduct"
        num="3"
        title="User Responsibilities and Conduct"
      >
        <p>By using our services, you agree to the following:</p>
        <ul>
          <li>
            You will use our services lawfully and comply with all applicable local, state,
            national, and international laws and regulations.
          </li>
          <li>
            You will not share your account credentials or allow unauthorized access to your
            account.
          </li>
          <li>
            You agree not to misuse our services by attempting to interfere with their normal
            operation or access them using automated or unauthorized means.
          </li>
          <li>
            You will not copy, redistribute, or modify any content, templates, tutorials, videos,
            or courses without our explicit written consent.
          </li>
          <li>
            You agree to provide accurate and complete information when using our services.
          </li>
        </ul>
        <p>
          Failure to comply with these obligations may result in suspension or termination of
          your access to our services.
        </p>
      </LegalSection>

      <LegalSection
        id="payment-terms-and-refund-policy"
        num="4"
        title="Payment Terms and Refund Policy"
      >
        <ul>
          <li>
            <strong>Pricing:</strong> All prices for our products and services are clearly stated
            on our website or provided during the purchase process. Prices are subject to change
            without prior notice.
          </li>
          <li>
            <strong>Payment Methods:</strong> We accept payments through the methods specified at
            checkout. Payment is due in full at the time of purchase unless otherwise agreed.
          </li>
          <li>
            <strong>Refund Policy:</strong> If you are unsatisfied with the delivered work, you
            may request a refund within 14 days of receiving the service. Refund requests must be
            submitted in writing and include detailed reasons for dissatisfaction.
          </li>
          <li>
            <strong>Dispute Resolution:</strong> In the event of any dispute or dissatisfaction, we
            are committed to resolving the issue amicably and will refund your payment to ensure a
            fair outcome.
          </li>
        </ul>
      </LegalSection>

      <LegalSection
        id="intellectual-property-rights"
        num="5"
        title="Intellectual Property Rights"
      >
        <ul>
          <li>
            All content, including but not limited to spreadsheet templates, tutorials, videos,
            courses, logos, designs, and written materials available on ExcelInsider.com, are the
            exclusive intellectual property of ExcelInsider.com’s owners and co-founders.
          </li>
          <li>
            These materials are protected by copyright, trademark, and other intellectual
            property laws.
          </li>
          <li>
            You are granted a limited, non-transferable, non-exclusive license to use purchased
            templates or courses for personal or internal business use only.
          </li>
          <li>
            Unauthorized copying, redistribution, modification, or commercial use of our
            materials is strictly prohibited and may result in legal action.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="liability-and-warranties" num="6" title="Liability and Warranties">
        <ul>
          <li>
            While we strive to provide high-quality and accurate services, ExcelInsider.com makes
            no warranties, express or implied, regarding the accuracy, completeness, or
            reliability of any content, templates, tutorials, or services.
          </li>
          <li>
            All services and materials are provided “as is” without warranties of any kind, either
            express or implied.
          </li>
          <li>
            ExcelInsider.com will not be liable for any direct, indirect, incidental,
            consequential, or special damages arising from the use of our services or materials.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="change-to-terms" num="7" title="Change to Terms">
        <p>
          We reserve the right to update or modify these Terms at any time without prior notice.
          Changes will take effect immediately upon posting the revised Terms on our website. Your
          continued use of our services constitutes acceptance of any changes to these Terms.
        </p>
      </LegalSection>

      <LegalSection id="privacy-policy" num="8" title="Privacy Policy">
        <p>
          Your use of our services is also governed by our{" "}
          <Link href="/privacy">Privacy Policy</Link>, which explains how we collect, use, and protect
          your personal information. Please review our Privacy Policy to understand your rights
          and obligations when using our website and services.
        </p>
      </LegalSection>

      <LegalSection id="governing-law" num="9" title="Governing Law">
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the
          jurisdiction in which ExcelInsider.com is registered. Any disputes arising under these
          Terms shall be resolved exclusively in the exclusive jurisdiction of the courts of
          Bangladesh.
        </p>
      </LegalSection>

      <LegalSection id="contact-us" num="10" title="Contact Us">
        <p>
          If you have any questions, concerns, or feedback regarding these Terms of Service,
          please reach out to us at:
        </p>
        <p>
          Email: <a href="mailto:contact@excelinsider.com">contact@excelinsider.com</a>
        </p>
        <p>
          Thank you for using ExcelInsider.com and for your cooperation in abiding by these
          Terms.
        </p>
      </LegalSection>
    </>
  )
}
