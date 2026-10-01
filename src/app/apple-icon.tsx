import { ImageResponse } from "next/og";
import { brandColors, DROP_PATH, OHIO_PATH } from "@/lib/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: brandColors.cream,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="128" height="128" viewBox="0 0 100 100">
          <path d={OHIO_PATH} fill={brandColors.navy} />
          <path d={DROP_PATH} fill={brandColors.brick} />
        </svg>
      </div>
    ),
    { ...size },
  );
}
