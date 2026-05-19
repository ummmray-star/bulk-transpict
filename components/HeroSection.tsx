import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-44 pb-24">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-6 text-xs font-medium text-[#0D9488]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] animate-pulse" />
        100% Free — No API key, no account
      </div>

      {/* Headline */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight max-w-4xl">
        100 YouTube<br />
        <span className="text-[#0D9488]">Transcripts.</span> One Click.
      </h1>

      {/* Subtitle */}
      <p className="mt-6 text-lg text-[#94a3b8] max-w-xl leading-relaxed">
        Paste up to 100 YouTube URLs, fetch all transcripts in parallel, and
        download as CSV or TXT — completely free, forever.
      </p>

      {/* CTA */}
      <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/app"
          className="px-8 py-4 bg-[#F97316] hover:bg-[#ea6c0d] text-white font-bold text-base rounded-2xl transition-colors duration-150 cursor-pointer shadow-lg shadow-orange-900/20"
        >
          Start Fetching — Free
        </Link>
        <a
          href="#how-it-works"
          className="px-8 py-4 glass glass-hover text-white font-medium text-base rounded-2xl transition-all duration-150 cursor-pointer"
        >
          See how it works
        </a>
      </div>

      {/* Stat pills */}
      <div className="mt-14 flex flex-wrap justify-center gap-3">
        {["Up to 100 URLs at once", "No API key needed", "CSV & TXT export", "Live progress"].map((s) => (
          <span key={s} className="px-3 py-1.5 glass rounded-full text-xs text-[#94a3b8]">
            {s}
          </span>
        ))}
      </div>
    </section>
  );
}
