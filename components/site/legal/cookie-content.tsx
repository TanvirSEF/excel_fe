import type { TocEntry } from "@/lib/blocks"

import { LegalSection, LegalSubsection, LegalTable } from "./legal-sections"

const CONTACT_EMAIL = "contact@excelinsider.com"
const GOOGLE_PRIVACY = "https://business.safety.google/privacy/"

export const cookieToc: TocEntry[] = [
  { id: "what-are-cookies", text: "What Are Cookies?", level: 2 },
  { id: "why-do-we-use-cookies", text: "Why Do We Use Cookies?", level: 2 },
  { id: "how-can-i-control-cookies", text: "How Can I Control Cookies?", level: 2 },
  {
    id: "how-can-i-control-cookies-on-my-browser",
    text: "How Can I Control Cookies on My Browser?",
    level: 2,
  },
  {
    id: "what-about-other-tracking-technologies-like-web-beacons",
    text: "What About Other Tracking Technologies, Like Web Beacons?",
    level: 2,
  },
  {
    id: "do-you-use-flash-cookies-or-local-shared-objects",
    text: "Do You Use Flash Cookies or Local Shared Objects?",
    level: 2,
  },
  { id: "do-you-serve-targeted-advertising", text: "Do You Serve Targeted Advertising?", level: 2 },
  {
    id: "how-often-will-you-update-this-cookie-policy",
    text: "How Often Will You Update This Cookie Policy?",
    level: 2,
  },
  {
    id: "where-can-i-get-further-information",
    text: "Where Can I Get Further Information?",
    level: 2,
  },
]

export function CookieContent() {
  return (
    <>
      <div>
        <p>
          This Cookie Policy explains how Excel Insider (“<strong>Company</strong>,” “
          <strong>we</strong>,” “<strong>us</strong>,” and “<strong>our</strong>”) uses cookies
          and similar technologies to recognize you when you visit our website at{" "}
          <a href="https://excelinsider.com">https://excelinsider.com</a> (“
          <strong>Website</strong>”). It explains what these technologies are and why we use them,
          as well as your rights to control our use of them.
        </p>
        <p>
          In some cases we may use cookies to collect personal information, or that becomes
          personal information if we combine it with other information.
        </p>
      </div>

      <LegalSection id="what-are-cookies" title="What Are Cookies?">
        <p>
          Cookies are small data files that are placed on your computer or mobile device when you
          visit a website. Cookies are widely used by website owners in order to make their
          websites work, or to work more efficiently, as well as to provide reporting information.
        </p>
        <p>
          Cookies set by the website owner (in this case, Excel Insider) are called “first-party
          cookies.” Cookies set by parties other than the website owner are called “third-party
          cookies.” Third-party cookies enable third-party features or functionality to be
          provided on or through the website (e.g., advertising, interactive content, and
          analytics). The parties that set these third-party cookies can recognize your computer
          both when it visits the website in question and also when it visits certain other
          websites.
        </p>
      </LegalSection>

      <LegalSection id="why-do-we-use-cookies" title="Why Do We Use Cookies?">
        <p>
          We use first- and third-party cookies for several reasons. Some cookies are required for
          technical reasons in order for our Website to operate, and we refer to these as
          “essential” or “strictly necessary” cookies. Other cookies also enable us to track and
          target the interests of our users to enhance the experience on our Online Properties.
          Third parties serve cookies through our Website for advertising, analytics, and other
          purposes. This is described in more detail below.
        </p>
      </LegalSection>

      <LegalSection id="how-can-i-control-cookies" title="How Can I Control Cookies?">
        <p>
          You have the right to decide whether to accept or reject cookies. You can exercise your
          cookie rights by setting your preferences in the Cookie Consent Manager. The Cookie
          Consent Manager allows you to select which categories of cookies you accept or reject.
          Essential cookies cannot be rejected as they are strictly necessary to provide you with
          services.
        </p>
        <p>
          The Cookie Consent Manager can be found in the notification banner and on our Website.
          If you choose to reject cookies, you may still use our Website though your access to
          some functionality and areas of our Website may be restricted. You may also set or amend
          your web browser controls to accept or refuse cookies.
        </p>
        <p>
          The specific types of first- and third-party cookies served through our Website and the
          purposes they perform are described in the table below (please note that the specific
          cookies served may vary depending on the specific Online Properties you visit):
        </p>

        <LegalSubsection
          id="analytics-and-customization-cookies"
          title="Analytics and Customization Cookies"
        >
          <p>
            These cookies collect information that is used either in aggregate form to help us
            understand how our Website is being used or how effective our marketing campaigns
            are, or to help us customize our Website for you.
          </p>
          <LegalTable
            kv
            rows={[
              ["Name:", "_ga"],
              [
                "Purpose:",
                "Records a particular ID used to come up with data about website usage by the user",
              ],
              ["Provider:", ".excelinsider.com"],
              [
                "Service:",
                <>
                  Google Analytics{" "}
                  <a href={GOOGLE_PRIVACY} target="_blank" rel="noopener noreferrer">
                    View Service Privacy Policy
                  </a>
                </>,
              ],
              ["Type:", "http_cookie"],
              ["Expires in:", "1 year 1 month 4 days"],
            ]}
          />
          <LegalTable
            kv
            rows={[
              ["Name:", "_ga_#"],
              [
                "Purpose:",
                "Used to distinguish individual users by means of designation of a randomly generated number as client identifier, which allows calculation of visits and sessions",
              ],
              ["Provider:", ".excelinsider.com"],
              [
                "Service:",
                <>
                  Google Analytics{" "}
                  <a href={GOOGLE_PRIVACY} target="_blank" rel="noopener noreferrer">
                    View Service Privacy Policy
                  </a>
                </>,
              ],
              ["Type:", "http_cookie"],
              ["Expires in:", "1 year 1 month 4 days"],
            ]}
          />
        </LegalSubsection>
      </LegalSection>

      <LegalSection
        id="how-can-i-control-cookies-on-my-browser"
        title="How Can I Control Cookies on My Browser?"
      >
        <p>
          As the means by which you can refuse cookies through your web browser controls vary
          from browser to browser, you should visit your browser’s help menu for more
          information. The following is information about how to manage cookies on the most
          popular browsers:
        </p>
        <ul>
          <li>
            <a
              href="https://support.google.com/chrome/answer/95647#zippy=%2Callow-or-block-cookies"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chrome
            </a>
          </li>
          <li>
            <a
              href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d"
              target="_blank"
              rel="noopener noreferrer"
            >
              Internet Explorer
            </a>
          </li>
          <li>
            <a
              href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop?redirectslug=enable-and-disable-cookies-website-preferences&redirectlocale=en-US"
              target="_blank"
              rel="noopener noreferrer"
            >
              Firefox
            </a>
          </li>
          <li>
            <a
              href="https://support.apple.com/en-ie/guide/safari/sfri11471/mac"
              target="_blank"
              rel="noopener noreferrer"
            >
              Safari
            </a>
          </li>
          <li>
            <a
              href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd"
              target="_blank"
              rel="noopener noreferrer"
            >
              Edge
            </a>
          </li>
          <li>
            <a
              href="https://help.opera.com/en/latest/web-preferences/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Opera
            </a>
          </li>
        </ul>
        <p>
          In addition, most advertising networks offer you a way to opt out of targeted
          advertising. If you would like to find out more information, please visit:
        </p>
        <ul>
          <li>
            <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
              Digital Advertising Alliance
            </a>
          </li>
          <li>
            <a href="https://youradchoices.ca/" target="_blank" rel="noopener noreferrer">
              Digital Advertising Alliance of Canada
            </a>
          </li>
          <li>
            <a href="http://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer">
              European Interactive Digital Advertising Alliance
            </a>
          </li>
        </ul>
      </LegalSection>

      <LegalSection
        id="what-about-other-tracking-technologies-like-web-beacons"
        title="What About Other Tracking Technologies, Like Web Beacons?"
      >
        <p>
          Cookies are not the only way to recognize or track visitors to a website. We may use
          other, similar technologies from time to time, like web beacons (sometimes called
          “tracking pixels” or “clear gifs”). These are tiny graphics files that contain a unique
          identifier that enables us to recognize when someone has visited our Website or opened
          an email including them. This allows us, for example, to monitor the traffic patterns
          of users from one page within a website to another, to deliver or communicate with
          cookies, to understand whether you have come to the website from an online
          advertisement displayed on a third-party website, to improve site performance, and to
          measure the success of email marketing campaigns. In many instances, these technologies
          are reliant on cookies to function properly, and so declining cookies will impair their
          functioning.
        </p>
      </LegalSection>

      <LegalSection
        id="do-you-use-flash-cookies-or-local-shared-objects"
        title="Do You Use Flash Cookies or Local Shared Objects?"
      >
        <p>
          Websites may also use so-called “Flash Cookies” (also known as Local Shared Objects or
          “LSOs”) to, among other things, collect and store information about your use of our
          services, fraud prevention, and for other site operations.
        </p>
        <p>
          If you do not want Flash Cookies stored on your computer, you can adjust the settings
          of your Flash player to block Flash Cookies storage using the tools contained in the{" "}
          <a
            href="http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager07.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Website Storage Settings Panel
          </a>
          . You can also control Flash Cookies by going to the{" "}
          <a
            href="http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager03.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Global Storage Settings Panel
          </a>{" "}
          and following the instructions (which may include instructions that explain, for
          example, how to delete existing Flash Cookies (referred to “information” on the
          Macromedia site), how to prevent Flash LSOs from being placed on your computer without
          your being asked, and (for Flash Player 8 and later) how to block Flash Cookies that
          are not being delivered by the operator of the page you are on at the time).
        </p>
        <p>
          Please note that setting the Flash Player to restrict or limit acceptance of Flash
          Cookies may reduce or impede the functionality of some Flash applications, including,
          potentially, Flash applications used in connection with our services or online content.
        </p>
      </LegalSection>

      <LegalSection id="do-you-serve-targeted-advertising" title="Do You Serve Targeted Advertising?">
        <p>
          Third parties may serve cookies on your computer or mobile device to serve advertising
          through our Website. These companies may use information about your visits to this and
          other websites in order to provide relevant advertisements about goods and services
          that you may be interested in. They may also employ technology that is used to measure
          the effectiveness of advertisements. They can accomplish this by using cookies or web
          beacons to collect information about your visits to this and other sites in order to
          provide relevant advertisements about goods and services of potential interest to you.
          The information collected through this process does not enable us or them to identify
          your name, contact details, or other details that directly identify you unless you
          choose to provide these.
        </p>
      </LegalSection>

      <LegalSection
        id="how-often-will-you-update-this-cookie-policy"
        title="How Often Will You Update This Cookie Policy?"
      >
        <p>
          We may update this Cookie Policy from time to time in order to reflect, for example,
          changes to the cookies we use or for other operational, legal, or regulatory reasons.
          Please therefore revisit this Cookie Policy regularly to stay informed about our use of
          cookies and related technologies.
        </p>
        <p>The date at the top of this Cookie Policy indicates when it was last updated.</p>
      </LegalSection>

      <LegalSection
        id="where-can-i-get-further-information"
        title="Where Can I Get Further Information?"
      >
        <p>
          If you have any questions about our use of cookies or other technologies, please email
          us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or by post to:
        </p>
        <p>
          Nehad Ulfat
          <br />
          15, Tallabagh, Moneshwar Road, Jigatola
          <br />
          Dhaka, 1209
          <br />
          Bangladesh
        </p>
        <p>Phone: +8801314999034</p>
      </LegalSection>
    </>
  )
}
