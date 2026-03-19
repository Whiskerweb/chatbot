"use client";

import { Check } from "lucide-react";
import type { WidgetConfig } from "@chatbot/shared";
import { WIDGET_PRESETS } from "@chatbot/shared";

interface ThemePresetSelectorProps {
  selectedPresetId?: string;
  onSelect: (config: WidgetConfig, suggestedPrimaryColor: string) => void;
}

function PresetThumbnail({ config, primaryColor }: { config: WidgetConfig; primaryColor: string }) {
  const isDark = config.theme === "dark";

  let headerBg: string;
  if (config.headerStyle === "gradient" && config.headerGradientFrom && config.headerGradientTo) {
    headerBg = `linear-gradient(135deg, ${config.headerGradientFrom}, ${config.headerGradientTo})`;
  } else if (config.headerStyle === "transparent") {
    headerBg = isDark ? "#2D2D44" : "#F3F4F6";
  } else {
    headerBg = primaryColor;
  }

  const bg = config.backgroundColor ?? (isDark ? "#1A1A2E" : "#F9FAFB");
  const botBubble = config.botMessageBgColor ?? (isDark ? "#2D2D44" : "#FFFFFF");
  const userBubble = config.userMessageBgColor ?? primaryColor;

  return (
    <div
      className="w-full h-[80px] rounded-lg overflow-hidden border"
      style={{
        borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
      }}
    >
      {/* Mini header */}
      <div className="h-[18px] px-2 flex items-center gap-1" style={{ background: headerBg }}>
        <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
        <div className="h-1.5 w-10 rounded bg-white/40" />
      </div>
      {/* Mini messages */}
      <div className="p-1.5 space-y-1" style={{ backgroundColor: bg }}>
        <div className="flex">
          <div className="h-2.5 w-[55%] rounded-sm" style={{ backgroundColor: botBubble, boxShadow: isDark ? "none" : "0 0.5px 1px rgba(0,0,0,0.05)" }} />
        </div>
        <div className="flex justify-end">
          <div className="h-2.5 w-[40%] rounded-sm" style={{ backgroundColor: userBubble }} />
        </div>
        <div className="flex">
          <div className="h-2.5 w-[45%] rounded-sm" style={{ backgroundColor: botBubble, boxShadow: isDark ? "none" : "0 0.5px 1px rgba(0,0,0,0.05)" }} />
        </div>
      </div>
      {/* Mini input */}
      <div className="h-[14px] px-1.5 flex items-center" style={{ backgroundColor: isDark ? "#16162a" : "#FFFFFF", borderTop: `0.5px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
        <div className="h-2 flex-1 rounded-sm" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6" }} />
      </div>
    </div>
  );
}

export function ThemePresetSelector({ selectedPresetId, onSelect }: ThemePresetSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {WIDGET_PRESETS.map((preset) => {
        const isSelected = selectedPresetId === preset.id;
        return (
          <button
            key={preset.id}
            onClick={() => onSelect(preset.config, preset.suggestedPrimaryColor)}
            className="group relative text-left transition-all"
          >
            <div
              className="relative rounded-xl overflow-hidden transition-all"
              style={{
                outline: isSelected ? `2px solid ${preset.suggestedPrimaryColor}` : "2px solid transparent",
                outlineOffset: 2,
              }}
            >
              <PresetThumbnail config={preset.config} primaryColor={preset.suggestedPrimaryColor} />
              {isSelected && (
                <div
                  className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: preset.suggestedPrimaryColor }}
                >
                  <Check size={12} className="text-white" />
                </div>
              )}
            </div>
            <div className="mt-1.5 px-0.5">
              <p className="text-xs font-medium text-foreground">{preset.name}</p>
              <p className="text-[10px] text-muted-foreground">{preset.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
