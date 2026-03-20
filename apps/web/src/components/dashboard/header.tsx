"use client";

import { Button } from "@/components/ui/button";
import { Bell, Plus } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function Header({ title, description, action }: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6">
      <div className="pl-10 md:pl-0">
        <h1 className="text-xl sm:text-2xl font-normal tracking-tight">{title}</h1>
        {description && (
          <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 sm:h-9 sm:w-9">
          <Bell className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.5} />
        </Button>

        {action && (
          action.href ? (
            <Button asChild size="sm" className="rounded-xl gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <Link href={action.href}>
                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.5} />
                <span className="hidden sm:inline">{action.label}</span>
                <span className="sm:hidden">Créer</span>
              </Link>
            </Button>
          ) : (
            <Button onClick={action.onClick} size="sm" className="rounded-xl gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.5} />
              <span className="hidden sm:inline">{action.label}</span>
              <span className="sm:hidden">Créer</span>
            </Button>
          )
        )}
      </div>
    </div>
  );
}
