import { ImageResponse } from "next/og";
import { brandColors, DROP_PATH, OHIO_PATH } from "@/lib/brand";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
        <svg width="32" height="32" viewBox="0 0 100 100">
          <path d={OHIO_PATH} fill={brandColors.navy} />
          <path d={DROP_PATH} fill="#ffffff" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
