const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 21V9"/>
      </svg>
    ),
    title: "Paste 100 URLs",
    desc: "Drop up to 100 YouTube links at once — one per line or comma-separated. Supports watch, shorts, and youtu.be formats.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: "Live Progress",
    desc: "Watch each transcript fetch in real time. Successes turn green, errors show inline — no guessing what's happening.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
    title: "Download CSV & TXT",
    desc: "Export all transcripts as a spreadsheet-ready CSV or a clean TXT file. One click, instant download, no server upload.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    title: "No API Key Needed",
    desc: "Zero setup. No Google API key, no account, no credit card. Just paste and go — it's free for you and free to run.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: "Privacy First",
    desc: "Transcripts are fetched and processed in your browser session. Nothing is stored on our servers.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
      </svg>
    ),
    title: "Copy Individual Transcripts",
    desc: "Each result has a one-click copy button so you can grab individual transcripts without downloading the full batch.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative z-10 px-4 pb-24 max-w-6xl mx-auto w-full">
      <h2 className="text-3xl font-bold text-white text-center mb-2">Everything you need</h2>
      <p className="text-[#94a3b8] text-center mb-12">Built for speed, designed to stay free.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <div key={f.title} className="glass rounded-2xl p-6 flex flex-col gap-3 glass-hover cursor-default">
            <div className="w-10 h-10 rounded-xl bg-[#0D9488]/15 text-[#0D9488] flex items-center justify-center">
              {f.icon}
            </div>
            <h3 className="font-semibold text-white text-base">{f.title}</h3>
            <p className="text-[#94a3b8] text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
