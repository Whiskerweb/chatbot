import { Sidebar } from "@/components/dashboard/sidebar";
import { TRPCProvider } from "@/lib/trpc-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TRPCProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-muted/30">
          {children}
        </main>
      </div>
    </TRPCProvider>
  );
}
