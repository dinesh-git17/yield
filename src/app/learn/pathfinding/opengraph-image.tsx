import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Pathfinding Algorithms — Yield";
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
        Pathfinding Algorithms
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
        Navigate grids and graphs with classic search algorithms
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
        {["BFS", "DFS", "Dijkstra", "A*", "Greedy", "Bidirectional"].map((algo) => (
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

      {/* Decorative grid */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "60px",
          display: "flex",
          flexWrap: "wrap",
          gap: "4px",
          width: "84px",
        }}
      >
        {[
          { id: "c0", color: "#22c55e", opacity: 1 },
          { id: "c1", color: "#5e6ad2", opacity: 0.55 },
          { id: "c2", color: "#5e6ad2", opacity: 0.7 },
          { id: "c3", color: "#5e6ad2", opacity: 0.85 },
          { id: "c4", color: "#5e6ad2", opacity: 0.4 },
          { id: "c5", color: "#3b82f6", opacity: 0.55 },
          { id: "c6", color: "#5e6ad2", opacity: 0.7 },
          { id: "c7", color: "#5e6ad2", opacity: 0.85 },
          { id: "c8", color: "#5e6ad2", opacity: 0.4 },
          { id: "c9", color: "#5e6ad2", opacity: 0.55 },
          { id: "c10", color: "#3b82f6", opacity: 0.7 },
          { id: "c11", color: "#5e6ad2", opacity: 0.85 },
          { id: "c12", color: "#5e6ad2", opacity: 0.4 },
          { id: "c13", color: "#5e6ad2", opacity: 0.55 },
          { id: "c14", color: "#5e6ad2", opacity: 0.7 },
          { id: "c15", color: "#22c55e", opacity: 1 },
        ].map((cell) => (
          <div
            key={cell.id}
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: cell.color,
              borderRadius: "2px",
              opacity: cell.opacity,
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
