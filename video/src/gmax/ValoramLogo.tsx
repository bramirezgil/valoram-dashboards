import React from "react";
import { Img, staticFile } from "remotion";

// Valoram Solutions lockup, recolored white/orange for the dark GMAX stage.
export const ValoramLogo: React.FC<{ size?: number }> = ({ size = 46 }) => {
  return (
    <Img
      src={staticFile("valoram-logo-white.png")}
      alt="Valoram Solutions"
      style={{ height: size, width: "auto", display: "block" }}
    />
  );
};
