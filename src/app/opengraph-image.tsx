import { ImageResponse } from "next/og";

export const alt =
  "Columbus Water Filtration — whole-home filtration, softeners, and reverse osmosis in Columbus, Ohio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0c2847",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 2, color: "#7ee0e4" }}>
          COLUMBUS, OHIO
        </div>
        <div style={{ fontSize: 68, fontWeight: 700, marginTop: 16, lineHeight: 1.1 }}>
          Columbus Water Filtration
        </div>
        <div style={{ fontSize: 32, marginTop: 24, color: "#dbeafe" }}>
          Whole-home filters, softeners, and reverse osmosis. Free water test.
        </div>
      </div>
    ),
    { ...size },
  );
}
