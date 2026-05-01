import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | SpeedCheck.DEV",
  description: "Terms of Service and usage conditions for SpeedCheck.DEV.",
};

export default function TermsPage() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="glass-card p-8 md:p-12 relative overflow-hidden">
        <h1 className="text-3xl md:text-4xl font-bold text-[#F8FAFC] mb-6">Terms of Service</h1>
        
        <div className="text-[#94A3B8] leading-relaxed space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold text-[#F8FAFC] mt-8 mb-4">1. Terms</h2>
          <p>
            By accessing this Website, accessible from https://speedcheck.dev, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this Website are protected by copyright and trade mark law.
          </p>

          <h2 className="text-xl font-semibold text-[#F8FAFC] mt-8 mb-4">2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials on SpeedCheck.DEV's Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose or for any public display;</li>
            <li>attempt to reverse engineer any software contained on SpeedCheck.DEV's Website;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transferring the materials to another person or "mirror" the materials on any other server.</li>
          </ul>

          <h2 className="text-xl font-semibold text-[#F8FAFC] mt-8 mb-4">3. Disclaimer</h2>
          <p>
            All the materials on SpeedCheck.DEV's Website are provided "as is". SpeedCheck.DEV makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, SpeedCheck.DEV does not make any representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website.
          </p>

          <h2 className="text-xl font-semibold text-[#F8FAFC] mt-8 mb-4">4. Limitations</h2>
          <p>
            SpeedCheck.DEV or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on SpeedCheck.DEV's Website, even if SpeedCheck.DEV or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage. Some jurisdiction does not allow limitations on implied warranties or limitations of liability for incidental damages, these limitations may not apply to you.
          </p>

          <h2 className="text-xl font-semibold text-[#F8FAFC] mt-8 mb-4">5. Revisions and Errata</h2>
          <p>
            The materials appearing on SpeedCheck.DEV's Website may include technical, typographical, or photographic errors. SpeedCheck.DEV will not promise that any of the materials in this Website are accurate, complete, or current. SpeedCheck.DEV may change the materials contained on its Website at any time without notice.
          </p>

          <h2 className="text-xl font-semibold text-[#F8FAFC] mt-8 mb-4">6. Links</h2>
          <p>
            SpeedCheck.DEV has not reviewed all of the sites linked to its Website and is not responsible for the contents of any such linked site. The presence of any link does not imply endorsement by SpeedCheck.DEV of the site. The use of any linked website is at the user's own risk.
          </p>
        </div>
      </div>
    </main>
  );
}
