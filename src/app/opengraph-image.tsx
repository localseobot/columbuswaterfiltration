import { ImageResponse } from "next/og";
import { brandColors, DROP_PATH, OHIO_PATH } from "@/lib/brand";

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
          background: brandColors.navy,
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 100 100">
            <path d={OHIO_PATH} fill="#ffffff" />
            <path d={DROP_PATH} fill={brandColors.brick} />
          </svg>
          <div style={{ fontSize: 28, letterSpacing: 2, color: "#f2b8a8" }}>
            COLUMBUS, OHIO · THE 614
          </div>
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
