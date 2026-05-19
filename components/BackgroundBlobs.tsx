export default function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
      {/* Teal blob — top left */}
      <div
        className="blob w-[600px] h-[600px] -top-40 -left-40"
        style={{ background: "#0D9488" }}
      />
      {/* Purple blob — top right */}
      <div
        className="blob w-[500px] h-[500px] -top-20 right-0"
        style={{ background: "#7c3aed" }}
      />
      {/* Orange blob — bottom center */}
      <div
        className="blob w-[400px] h-[400px] bottom-0 left-1/2 -translate-x-1/2"
        style={{ background: "#F97316", opacity: 0.07 }}
      />
    </div>
  );
}
