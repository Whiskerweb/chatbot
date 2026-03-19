import type { Testimonial } from "@/data/marketing/testimonials";

export function TestimonialCard({ quote, name, title, company }: Testimonial) {
  return (
    <div className="group rounded-3xl bg-card shadow-apple p-8 transition-all duration-200 hover:shadow-apple-hover motion-safe:hover:scale-[1.02]">
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg
            key={s}
            className="h-4 w-4 text-amber-400 fill-amber-400 motion-safe:animate-scale-in"
            style={{ animationDelay: `${s * 50}ms`, animationFillMode: "both" }}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-sm text-foreground leading-relaxed">&ldquo;{quote}&rdquo;</p>
      <div className="mt-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
          {name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{title}, {company}</p>
        </div>
      </div>
    </div>
  );
}
