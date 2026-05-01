import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | SpeedCheck.DEV",
  description: "Read the Privacy Policy for SpeedCheck.DEV.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="glass-card p-8 md:p-12 relative overflow-hidden">
        <h1 className="text-3xl md:text-4xl font-bold text-[#F8FAFC] mb-6">Privacy Policy</h1>
        
        <div className="text-[#94A3B8] leading-relaxed space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <p>
            At SpeedCheck.DEV, accessible from https://speedcheck.dev, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by SpeedCheck.DEV and how we use it.
          </p>

          <h2 className="text-xl font-semibold text-[#F8FAFC] mt-8 mb-4">Log Files</h2>
          <p>
            SpeedCheck.DEV follows a standard procedure of using log files. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, and referring/exit pages. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
          </p>

          <h2 className="text-xl font-semibold text-[#F8FAFC] mt-8 mb-4">Cookies and Web Beacons</h2>
          <p>
            Like any other website, SpeedCheck.DEV uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
          </p>

          <h2 className="text-xl font-semibold text-[#F8FAFC] mt-8 mb-4">Google DoubleClick DART Cookie</h2>
          <p>
            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" className="text-[#38BDF8] hover:underline" target="_blank" rel="noreferrer">https://policies.google.com/technologies/ads</a>
          </p>

          <h2 className="text-xl font-semibold text-[#F8FAFC] mt-8 mb-4">Speed Test Data</h2>
          <p>
            Our core service—the internet speed test—transmits randomized data to and from our servers to measure your bandwidth. This data does not contain personal files or information. <strong>We do not save your speed test results or associate them with your IP address in a database.</strong> All calculations are done on the fly, and the temporary data is discarded immediately after the test concludes.
          </p>

          <h2 className="text-xl font-semibold text-[#F8FAFC] mt-8 mb-4">Consent</h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
          </p>
        </div>
      </div>
    </main>
  );
}
