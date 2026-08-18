import React from "react";
import { Img, staticFile } from "remotion";

// Real Pacific Ridgeway lockup. White-on-dark version, placed directly on the
// dark background (no chip) for a clean, premium look.
export const Logo: React.FC<{ size?: number }> = ({ size = 52 }) => {
  return (
    <Img
      src={staticFile("pacific-ridgeway-logo-white.png")}
      alt="Pacific Ridgeway Insurance Solutions"
      style={{ height: size, width: "auto", display: "block" }}
    />
  );
};
