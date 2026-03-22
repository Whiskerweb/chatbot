export const metadata = { robots: "noindex" };

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
