import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Interview Problems — Yield";
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
        Interview Prep
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
        Interview Problems
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
        Classic coding problems with visual step-by-step solutions
      </div>

      {/* Problem Pills */}
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
        {["Trapping Rain Water", "Two Pointers", "Dynamic Programming"].map((problem) => (
          <div
            key={problem}
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
            {problem}
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

      {/* Decorative code brackets */}
      <div
        style={{
          position: "absolute",
          bottom: "35px",
          left: "60px",
          display: "flex",
          alignItems: "center",
          fontSize: 36,
          fontWeight: 300,
          color: "#5e6ad2",
          opacity: 0.6,
          fontFamily: "monospace",
        }}
      >
        {"{ }"}
      </div>
    </div>,
    {
      ...size,
    }
  );
}
