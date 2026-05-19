import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import BackgroundBlobs from "@/components/BackgroundBlobs";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <BackgroundBlobs />
      <Navbar />

      <main className="relative z-10 flex flex-col items-center">
        <HeroSection />
        <FeaturesSection />

        {/* How It Works */}
        <section id="how-it-works" className="relative z-10 px-4 pb-24 max-w-3xl mx-auto w-full">
          <h2 className="text-3xl font-bold text-white text-center mb-2">How it works</h2>
          <p className="text-[#94a3b8] text-center mb-12">Three steps to all your transcripts.</p>

          <div className="flex flex-col gap-4">
            {[
              {
                n: "1",
                title: "Paste your YouTube URLs",
                desc: "Open the app and paste up to 100 YouTube links in the textarea — one per line. Supports all URL formats.",
              },
              {
                n: "2",
                title: "Click Fetch Transcripts",
                desc: "Hit the button (or Ctrl+Enter). Five transcripts are fetched in parallel so the whole batch finishes fast.",
              },
              {
                n: "3",
                title: "Download CSV or TXT",
                desc: "Once complete, grab the sticky download bar and export everything. Open in Excel, Notion, or any text editor.",
              },
            ].map((step) => (
              <div key={step.n} className="glass rounded-2xl p-5 flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-[#0D9488] text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {step.n}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                  <p className="text-[#94a3b8] text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="relative z-10 px-4 pb-24 max-w-3xl mx-auto w-full">
          <div
            className="glass rounded-3xl p-10 text-center flex flex-col items-center gap-6"
            style={{ background: "linear-gradient(135deg, rgba(13,148,136,0.12), rgba(124,58,237,0.08))" }}
          >
            <h2 className="text-3xl font-extrabold text-white">Ready to bulk-fetch?</h2>
            <p className="text-[#94a3b8] max-w-sm">
              No account. No API key. No cost. Just transcripts.
            </p>
            <Link
              href="/app"
              className="px-8 py-4 bg-[#F97316] hover:bg-[#ea6c0d] text-white font-bold text-base rounded-2xl transition-colors duration-150 cursor-pointer"
            >
              Open the App — Free
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 w-full border-t border-white/5 py-8 px-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#475569]">
            <span className="font-semibold text-[#94a3b8]">TranscriptBulk</span>
            <span>Free forever · No account required · Open source friendly</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
