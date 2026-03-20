"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bot,
  BarChart3,
  MessageSquare,
  CreditCard,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/marketing/logo";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Agents", href: "/dashboard/agents", icon: Bot },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Inbox", href: "/dashboard/inbox", icon: MessageSquare },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-5 py-6">
        {(!collapsed || mobileOpen) && (
          <Link href="/dashboard">
            <Logo size="sm" />
          </Link>
        )}
        {/* Desktop collapse button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => mobileOpen ? setMobileOpen(false) : setCollapsed(!collapsed)}
          className="h-8 w-8 rounded-lg"
        >
          {mobileOpen ? (
            <X className="h-[18px] w-[18px]" strokeWidth={1.5} />
          ) : collapsed ? (
            <Menu className="h-[18px] w-[18px]" strokeWidth={1.5} />
          ) : (
            <ChevronLeft className="h-[18px] w-[18px]" strokeWidth={1.5} />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-2">
        {navigation.map((item) => {
          const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-apple",
                isActive
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} />
              {(!collapsed || mobileOpen) && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3">
        <form action="/auth/signout" method="post">
          <Button
            variant="ghost"
            type="submit"
            className={cn(
              "w-full justify-start gap-3 rounded-xl text-muted-foreground hover:text-foreground",
              (collapsed && !mobileOpen) && "justify-center"
            )}
          >
            <LogOut className="h-[18px] w-[18px]" strokeWidth={1.5} />
            {(!collapsed || mobileOpen) && <span className="text-sm">Déconnexion</span>}
          </Button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile trigger button - fixed in top-left */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 h-10 w-10 rounded-xl bg-background/80 backdrop-blur-sm shadow-apple md:hidden"
      >
        <Menu className="h-5 w-5" strokeWidth={1.5} />
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col glass w-[260px] transition-transform duration-300 ease-apple md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col glass transition-all duration-300 ease-apple",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
