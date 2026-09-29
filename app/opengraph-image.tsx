import { ImageResponse } from "next/og";

export const alt = "Jayson Caburatan — Lead Full-Stack Web Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#08080a",
          color: "#f4f1ea",
          padding: "72px",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#e4c9a8",
          }}
        >
          Jayson Caburatan
        </div>
        <div
          style={{
            fontSize: 72,
            lineHeight: 0.95,
            letterSpacing: -2,
            marginTop: 24,
            maxWidth: 900,
          }}
        >
          I build digital products that move.
        </div>
        <div style={{ fontSize: 28, marginTop: 28, color: "#b7b2a8" }}>
          Lead Full-Stack Web Developer
        </div>
      </div>
    ),
    { ...size },
  );
}
