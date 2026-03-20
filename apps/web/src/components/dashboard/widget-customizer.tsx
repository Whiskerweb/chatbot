"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MessageCircle, MessageSquare, Headset, Sparkles,
  Circle, Square, Hexagon, ChevronRight, Palette, Layout, Sparkle,
  Crown, Upload, X,
} from "lucide-react";
import { useState, useRef } from "react";
import type { WidgetConfig } from "@chatbot/shared";
import { isFeatureAvailable } from "@chatbot/shared";
import { ThemePresetSelector } from "./theme-preset-selector";

interface WidgetCustomizerProps {
  config: WidgetConfig;
  onChange: (config: WidgetConfig) => void;
  primaryColor: string;
  onPrimaryColorChange: (color: string) => void;
  welcomeMessage: string;
  onWelcomeMessageChange: (msg: string) => void;
  leadCaptureEnabled: boolean;
  onLeadCaptureChange: (enabled: boolean) => void;
  plan: string;
  avatarUrl: string | null;
  onAvatarUrlChange: (url: string | null) => void;
}

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value.startsWith("rgba") ? "#ffffff" : value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-md cursor-pointer border border-border shrink-0"
          style={{ padding: 1 }}
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono text-xs h-8"
        />
      </div>
    </div>
  );
}

function ToggleGroup({ label, options, value, onChange }: {
  label: string;
  options: { value: string; label: string; icon?: React.ReactNode }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex gap-0.5 p-0.5 bg-muted/50 rounded-md">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-all ${
              value === opt.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt.icon}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border/50 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex items-center gap-2.5 w-full px-4 py-3 text-left hover:bg-muted/30 transition-colors"
      >
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-sm font-medium flex-1">{title}</span>
        <ChevronRight
          size={14}
          className={`text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

function PlanBadge({ requiredPlan }: { requiredPlan: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
      <Crown size={10} />
      {requiredPlan}
    </span>
  );
}

export function WidgetCustomizer({
  config,
  onChange,
  primaryColor,
  onPrimaryColorChange,
  welcomeMessage,
  onWelcomeMessageChange,
  leadCaptureEnabled,
  onLeadCaptureChange,
  plan,
  avatarUrl,
  onAvatarUrlChange,
}: WidgetCustomizerProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canWhiteLabel = isFeatureAvailable(plan, "whiteLabel");
  const canUploadLogo = plan !== "FREE";

  const update = (partial: Partial<WidgetConfig>) => {
    onChange({ ...config, ...partial, presetId: undefined });
  };

  const handlePresetSelect = (presetConfig: WidgetConfig, suggestedColor: string) => {
    onChange(presetConfig);
    onPrimaryColorChange(suggestedColor);
  };

  const toggle = (id: string) => setOpenSection((prev) => (prev === id ? null : id));

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return; // 2MB max
    const reader = new FileReader();
    reader.onload = (ev) => {
      onAvatarUrlChange(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      {/* Theme Presets — always visible */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <ThemePresetSelector
            selectedPresetId={config.presetId}
            onSelect={handlePresetSelect}
          />
        </CardContent>
      </Card>

      {/* Collapsible sections */}
      <Card className="overflow-hidden">
        {/* Couleurs & En-tête */}
        <Section
          title="Couleurs & En-tête"
          icon={<Palette size={15} />}
          isOpen={openSection === "colors"}
          onToggle={() => toggle("colors")}
        >
          <ToggleGroup
            label="Style d'en-tête"
            value={config.headerStyle}
            onChange={(v) => update({ headerStyle: v as WidgetConfig["headerStyle"] })}
            options={[
              { value: "solid", label: "Solide" },
              { value: "gradient", label: "Gradient" },
              { value: "transparent", label: "Transparent" },
            ]}
          />

          <ColorPicker
            label="Couleur principale"
            value={primaryColor}
            onChange={onPrimaryColorChange}
          />

          {config.headerStyle === "gradient" && (
            <div className="grid grid-cols-2 gap-2">
              <ColorPicker
                label="Gradient début"
                value={config.headerGradientFrom ?? primaryColor}
                onChange={(v) => update({ headerGradientFrom: v })}
              />
              <ColorPicker
                label="Gradient fin"
                value={config.headerGradientTo ?? primaryColor}
                onChange={(v) => update({ headerGradientTo: v })}
              />
            </div>
          )}

          <ColorPicker
            label="Fond de conversation"
            value={config.backgroundColor ?? "#F9FAFB"}
            onChange={(v) => update({ backgroundColor: v })}
          />

          <ToggleGroup
            label="Motif de fond"
            value={config.backgroundPattern ?? "none"}
            onChange={(v) => update({ backgroundPattern: v as WidgetConfig["backgroundPattern"] })}
            options={[
              { value: "none", label: "Aucun" },
              { value: "dots", label: "Points" },
              { value: "grid", label: "Grille" },
              { value: "diagonal", label: "Diagonal" },
            ]}
          />

          <div className="grid grid-cols-2 gap-2">
            <ColorPicker
              label="Message visiteur"
              value={config.userMessageBgColor ?? primaryColor}
              onChange={(v) => update({ userMessageBgColor: v })}
            />
            <ColorPicker
              label="Message bot"
              value={config.botMessageBgColor ?? "#FFFFFF"}
              onChange={(v) => update({ botMessageBgColor: v })}
            />
          </div>
        </Section>

        {/* Apparence */}
        <Section
          title="Apparence"
          icon={<Layout size={15} />}
          isOpen={openSection === "appearance"}
          onToggle={() => toggle("appearance")}
        >
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Police</Label>
            <Select
              value={config.fontFamily ?? "inter"}
              onValueChange={(v) => update({ fontFamily: v as WidgetConfig["fontFamily"] })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="poppins">Poppins</SelectItem>
                <SelectItem value="dm-sans">DM Sans</SelectItem>
                <SelectItem value="geist">Geist</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ToggleGroup
            label="Forme des messages"
            value={config.messageBorderRadius ?? "rounded"}
            onChange={(v) => update({ messageBorderRadius: v as WidgetConfig["messageBorderRadius"] })}
            options={[
              { value: "sharp", label: "Carré", icon: <Square size={10} /> },
              { value: "rounded", label: "Arrondi", icon: <Circle size={10} /> },
              { value: "pill", label: "Pilule", icon: <Hexagon size={10} /> },
            ]}
          />

          <ToggleGroup
            label="Forme du widget"
            value={config.widgetBorderRadius ?? "rounded"}
            onChange={(v) => update({ widgetBorderRadius: v as WidgetConfig["widgetBorderRadius"] })}
            options={[
              { value: "sharp", label: "Carré" },
              { value: "rounded", label: "Arrondi" },
              { value: "pill", label: "Pilule" },
            ]}
          />

          <ToggleGroup
            label="Ombre"
            value={config.widgetShadow ?? "lg"}
            onChange={(v) => update({ widgetShadow: v as WidgetConfig["widgetShadow"] })}
            options={[
              { value: "none", label: "Aucune" },
              { value: "sm", label: "Légère" },
              { value: "md", label: "Moyenne" },
              { value: "lg", label: "Forte" },
              { value: "glow", label: "Glow" },
            ]}
          />

          <div className="flex items-center justify-between py-0.5">
            <Label className="text-xs text-muted-foreground">Effet Glass</Label>
            <Switch
              checked={config.glassEffect ?? false}
              onCheckedChange={(v) => update({ glassEffect: v })}
            />
          </div>
        </Section>

        {/* Bulle de lancement */}
        <Section
          title="Bulle de lancement"
          icon={<Sparkle size={15} />}
          isOpen={openSection === "bubble"}
          onToggle={() => toggle("bubble")}
        >
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Icône</Label>
            <div className="flex gap-0.5 p-0.5 bg-muted/50 rounded-md">
              {[
                { value: "chat", icon: <MessageSquare size={14} /> },
                { value: "message-circle", icon: <MessageCircle size={14} /> },
                { value: "headset", icon: <Headset size={14} /> },
                { value: "sparkle", icon: <Sparkles size={14} /> },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => update({ bubbleIcon: opt.value as WidgetConfig["bubbleIcon"] })}
                  className={`flex-1 flex items-center justify-center p-1.5 rounded transition-all ${
                    (config.bubbleIcon ?? "chat") === opt.value
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.icon}
                </button>
              ))}
            </div>
          </div>

          <ToggleGroup
            label="Taille"
            value={config.bubbleSize ?? "md"}
            onChange={(v) => update({ bubbleSize: v as WidgetConfig["bubbleSize"] })}
            options={[
              { value: "sm", label: "S" },
              { value: "md", label: "M" },
              { value: "lg", label: "L" },
            ]}
          />

          <ColorPicker
            label="Couleur"
            value={config.bubbleColor ?? primaryColor}
            onChange={(v) => update({ bubbleColor: v })}
          />
        </Section>
      </Card>

      {/* Content — always visible, compact */}
      <Card>
        <CardContent className="pt-3 pb-3 space-y-3">
          {/* Logo / Avatar */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">Logo de la marque</Label>
              {!canUploadLogo && <PlanBadge requiredPlan="Starter" />}
            </div>
            {canUploadLogo ? (
              <div className="flex items-center gap-3">
                {avatarUrl ? (
                  <div className="relative">
                    <img
                      src={avatarUrl}
                      alt="Logo"
                      className="w-10 h-10 rounded-full object-cover border border-border"
                    />
                    <button
                      onClick={() => onAvatarUrlChange(null)}
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full border-2 border-dashed border-border flex items-center justify-center text-muted-foreground">
                    <Upload size={14} />
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-primary hover:underline"
                >
                  {avatarUrl ? "Changer" : "Uploader un logo"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 opacity-50">
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-border flex items-center justify-center text-muted-foreground">
                  <Upload size={14} />
                </div>
                <span className="text-xs text-muted-foreground">Disponible à partir du plan Starter</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Message d&apos;accueil</Label>
            <Input
              value={welcomeMessage}
              onChange={(e) => onWelcomeMessageChange(e.target.value)}
              placeholder="Bonjour ! Comment puis-je vous aider ?"
              className="h-8 text-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Capture de leads</Label>
            <Switch checked={leadCaptureEnabled} onCheckedChange={onLeadCaptureChange} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">Masquer &quot;Powered by Claudia&quot;</Label>
              {!canWhiteLabel && <PlanBadge requiredPlan="Growth" />}
            </div>
            <Switch
              checked={config.showBranding === false}
              onCheckedChange={(v) => update({ showBranding: !v })}
              disabled={!canWhiteLabel}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
