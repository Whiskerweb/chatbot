"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
    <div className="flex items-center justify-between px-8 py-6">
      <div>
        <h1 className="text-2xl font-normal tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </Button>

        {action && (
          action.href ? (
            <Button asChild size="sm" className="rounded-xl gap-2">
              <Link href={action.href}>
                <Plus className="h-4 w-4" strokeWidth={1.5} />
                {action.label}
              </Link>
            </Button>
          ) : (
            <Button onClick={action.onClick} size="sm" className="rounded-xl gap-2">
              <Plus className="h-4 w-4" strokeWidth={1.5} />
              {action.label}
            </Button>
          )
        )}
      </div>
    </div>
  );
}
