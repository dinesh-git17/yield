import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Sorting Algorithms — Yield";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0b",
        backgroundImage:
          "radial-gradient(circle at 25% 25%, rgba(94, 106, 210, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(94, 106, 210, 0.1) 0%, transparent 50%)",
        fontFamily: "system-ui, sans-serif",
        padding: "60px",
      }}
    >
      {/* Category Label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          fontWeight: 500,
          color: "#5e6ad2",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "24px",
        }}
      >
        Algorithm Category
      </div>

      {/* Title */}
      <div
        style={{
          display: "flex",
          fontSize: 72,
          fontWeight: 700,
          color: "#ffffff",
          textAlign: "center",
          lineHeight: 1.2,
          marginBottom: "16px",
        }}
      >
        Sorting Algorithms
      </div>

      {/* Tagline */}
      <div
        style={{
          display: "flex",
          fontSize: 28,
          fontWeight: 400,
          color: "#a1a1aa",
          textAlign: "center",
          marginBottom: "40px",
          maxWidth: "800px",
        }}
      >
        Master 7 sorting algorithms with interactive visualizations
      </div>

      {/* Algorithm Pills */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "900px",
        }}
      >
        {["Bubble", "Selection", "Insertion", "Quick", "Merge", "Heap", "Gnome"].map((algo) => (
          <div
            key={algo}
            style={{
              display: "flex",
              backgroundColor: "rgba(94, 106, 210, 0.15)",
              border: "1px solid rgba(94, 106, 210, 0.3)",
              borderRadius: "9999px",
              padding: "8px 20px",
              fontSize: 18,
              fontWeight: 500,
              color: "#a1a1aa",
            }}
          >
            {algo}
          </div>
        ))}
      </div>

      {/* Yield Branding */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          right: "60px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 600,
            color: "#71717a",
          }}
        >
          yield
        </div>
      </div>

      {/* Decorative bars */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "60px",
          display: "flex",
          alignItems: "flex-end",
          gap: "8px",
        }}
      >
        {[20, 40, 60, 80, 100].map((height, i) => (
          <div
            key={`bar-${height}`}
            style={{
              width: "12px",
              height: `${height * 0.6}px`,
              backgroundColor: "#5e6ad2",
              borderRadius: "4px 4px 0 0",
              opacity: 0.6 + i * 0.08,
            }}
          />
        ))}
      </div>
    </div>,
    {
      ...size,
    }
  );
}
