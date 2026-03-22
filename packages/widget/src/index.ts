import { h, render } from "preact";
import { App } from "./components/App";
import { fetchConfig } from "./lib/api";
import { WIDGET_CSS } from "./styles";
import { FONT_FAMILY_MAP } from "./types";
import type { AgentConfig } from "./types";

(async () => {
  // Find the script tag with data-agent-id
  const scriptTag = document.querySelector(
    "script[data-agent-id]"
  ) as HTMLScriptElement | null;

  if (!scriptTag) {
    console.error("[HelloClaudia] Missing script tag with data-agent-id attribute.");
    return;
  }

  const agentId = scriptTag.getAttribute("data-agent-id");
  if (!agentId) {
    console.error("[HelloClaudia] data-agent-id attribute is empty.");
    return;
  }

  // Derive API base URL from script src
  const scriptSrc = scriptTag.src;
  let apiBase: string;
  try {
    const url = new URL(scriptSrc);
    apiBase = url.origin;
  } catch {
    // Fallback: strip /widget.js from src
    apiBase = scriptSrc.replace(/\/widget\.js(\?.*)?$/, "");
  }

  // Fetch agent config
  let config: AgentConfig;
  try {
    config = await fetchConfig(apiBase, agentId);
  } catch (err) {
    console.error("[HelloClaudia] Failed to load config:", err);
    return;
  }

  // Create host element
  const hostEl = document.createElement("div");
  hostEl.id = "helloclaudia-widget";
  hostEl.style.cssText = "position:fixed;z-index:2147483647;";
  document.body.appendChild(hostEl);

  // Attach shadow DOM
  const shadow = hostEl.attachShadow({ mode: "open" });

  // Inject CSS reset + keyframes
  const styleEl = document.createElement("style");
  styleEl.textContent = WIDGET_CSS;
  shadow.appendChild(styleEl);

  // Inject Google Fonts link for the configured font
  const fontKey = config.widgetConfig?.fontFamily || "system";
  if (fontKey !== "system") {
    const fontMap: Record<string, string> = {
      inter: "Inter:wght@400;500;600;700",
      poppins: "Poppins:wght@400;500;600;700",
      "dm-sans": "DM+Sans:wght@400;500;600;700",
      geist: "Geist:wght@400;500;600;700",
    };
    const fontParam = fontMap[fontKey];
    if (fontParam) {
      const linkEl = document.createElement("link");
      linkEl.rel = "stylesheet";
      linkEl.href = `https://fonts.googleapis.com/css2?family=${fontParam}&display=swap`;
      shadow.appendChild(linkEl);
    }
  }

  // Add mobile responsive styles
  const mobileStyle = document.createElement("style");
  mobileStyle.textContent = `
    @media (max-width: 480px) {
      :host > div > div[style*="position: fixed"][style*="width: 380px"] {
        width: 100vw !important;
        height: 100vh !important;
        bottom: 0 !important;
        right: 0 !important;
        border-radius: 0 !important;
        max-width: 100vw !important;
        max-height: 100vh !important;
      }
    }
  `;
  shadow.appendChild(mobileStyle);

  // Create render container
  const container = document.createElement("div");
  shadow.appendChild(container);

  // Render the Preact app
  render(
    h(App, { config, apiBase, agentId }),
    container
  );
})();
