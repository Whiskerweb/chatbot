"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import {
  integrations,
  categoryLabels,
  type IntegrationCategory,
  type Integration,
} from "@/data/marketing/integrations";

const allCategories = Object.keys(categoryLabels) as IntegrationCategory[];

function StatusBadge({ status }: { status: Integration["status"] }) {
  return status === "disponible" ? (
    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
      Disponible
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
      Bient&ocirc;t
    </span>
  );
}

export function IntegrationGrid() {
  const [active, setActive] = useState<"all" | IntegrationCategory>("all");

  const filtered =
    active === "all"
      ? integrations
      : integrations.filter((i) => i.category === active);

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      {/* ── Category filter tabs ── */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <button
          onClick={() => setActive("all")}
          className={`inline-flex items-center rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
            active === "all"
              ? "bg-foreground text-background shadow-sm"
              : "bg-card shadow-apple text-muted-foreground hover:text-foreground hover:shadow-apple-hover"
          }`}
        >
          Toutes
        </button>
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`inline-flex items-center rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
              active === cat
                ? "bg-foreground text-background shadow-sm"
                : "bg-card shadow-apple text-muted-foreground hover:text-foreground hover:shadow-apple-hover"
            }`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* ── Cards grid ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((integration) => (
          <div
            key={integration.name}
            className={`rounded-2xl bg-card shadow-apple p-6 transition-all duration-200 hover:shadow-apple-hover hover:-translate-y-0.5 ${
              integration.featured ? "ring-1 ring-border" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/60">
                  <Globe className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <h3 className="font-medium text-foreground">{integration.name}</h3>
              </div>
              <StatusBadge status={integration.status} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {integration.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
