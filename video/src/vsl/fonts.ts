import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Self-hosted fonts, loaded at runtime from /public/fonts so renders need no CDN.
// loadFont() registers a delayRender() internally, so the render waits for them.
loadFont({
  family: "Inter",
  url: staticFile("fonts/Inter-var.woff2"),
  weight: "400 700",
});
loadFont({ family: "Poppins", url: staticFile("fonts/Poppins-600.woff2"), weight: "600" });
loadFont({ family: "Poppins", url: staticFile("fonts/Poppins-700.woff2"), weight: "700" });
loadFont({ family: "Poppins", url: staticFile("fonts/Poppins-800.woff2"), weight: "800" });
