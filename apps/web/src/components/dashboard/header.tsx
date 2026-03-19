"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <div className="flex items-center justify-between border-b bg-card px-6 py-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        {/* Credits bar mini */}
        <div className="hidden md:flex items-center gap-2">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Crédits</p>
            <p className="text-sm font-medium">45 / 100</p>
          </div>
          <Progress value={45} className="w-24 h-2" />
        </div>

        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        {action && (
          action.href ? (
            <Button asChild>
              <Link href={action.href}>
                <Plus className="mr-2 h-4 w-4" />
                {action.label}
              </Link>
            </Button>
          ) : (
            <Button onClick={action.onClick}>
              <Plus className="mr-2 h-4 w-4" />
              {action.label}
            </Button>
          )
        )}
      </div>
    </div>
  );
}
