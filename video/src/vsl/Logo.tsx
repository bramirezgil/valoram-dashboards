import React from "react";
import { COLORS, FONTS } from "./theme";

/** Stylized Pacific Ridgeway mountain mark + wordmark, dark-theme friendly. */
export const Logo: React.FC<{ size?: number; showWord?: boolean }> = ({
  size = 44,
  showWord = true,
}) => {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: `1.5px solid ${COLORS.panelBorder}`,
          background: "rgba(211,175,101,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width={size * 0.56}
          height={size * 0.56}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M2 20 L9 7 L13 14 L16 9 L22 20 Z"
            fill={COLORS.gold}
            opacity={0.95}
          />
          <path d="M9 7 L11.5 11.2 L9.6 13 Z" fill="#0B1B2E" opacity={0.35} />
        </svg>
      </div>
      {showWord && (
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span
            style={{
              fontFamily: FONTS.display,
              fontWeight: 700,
              fontSize: size * 0.42,
              color: COLORS.ink,
              letterSpacing: "0.01em",
            }}
          >
            Pacific Ridgeway
          </span>
          <span
            style={{
              fontFamily: FONTS.body,
              fontWeight: 600,
              fontSize: size * 0.2,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: COLORS.sub,
              marginTop: size * 0.1,
            }}
          >
            Insurance Solutions
          </span>
        </div>
      )}
    </div>
  );
};
