import React from "react";
import { Img, staticFile } from "remotion";

// Real Pacific Ridgeway lockup, shown on a white chip (as on the live page).
export const Logo: React.FC<{ size?: number }> = ({ size = 46 }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FBFDFD",
        padding: `${size * 0.34}px ${size * 0.5}px`,
        borderRadius: size * 0.42,
        boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
      }}
    >
      <Img
        src={staticFile("pacific-ridgeway-logo.png")}
        alt="Pacific Ridgeway Insurance Solutions"
        style={{ height: size, width: "auto", display: "block" }}
      />
    </div>
  );
};
