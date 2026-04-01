import { h } from "preact";
import type { ProductData } from "../types";

interface ProductCardProps {
  product: ProductData;
  primaryColor: string;
  isDark: boolean;
  apiBase: string;
}

export function ProductCard({ product, primaryColor, isDark, apiBase }: ProductCardProps) {
  const trackUrl = `${apiBase}/api/v1/product-click?id=${encodeURIComponent(product.id)}&url=${encodeURIComponent(product.url)}`;

  const cardBg = isDark ? "#1e1e1e" : "#fff";
  const cardBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
  const textColor = isDark ? "#e0e0e0" : "#333";
  const mutedColor = isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)";

  return (
    <div
      style={{
        borderRadius: "12px",
        border: `1px solid ${cardBorder}`,
        overflow: "hidden",
        maxWidth: "280px",
        backgroundColor: cardBg,
        animation: "hc-fade-in 0.2s ease",
      }}
    >
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{
            width: "100%",
            height: "120px",
            objectFit: "cover",
            display: "block",
          }}
        />
      )}

      <div style={{ padding: "12px" }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: "14px",
            color: textColor,
            lineHeight: "1.3",
          }}
        >
          {product.name}
        </div>

        <div
          style={{
            fontSize: "12px",
            color: mutedColor,
            marginTop: "4px",
            lineHeight: "1.4",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.description}
        </div>

        {product.price && (
          <div
            style={{
              display: "inline-block",
              marginTop: "8px",
              padding: "2px 8px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: 600,
              backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
              color: textColor,
            }}
          >
            {product.price}
          </div>
        )}

        <a
          href={trackUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            marginTop: "10px",
            padding: "8px 0",
            borderRadius: "8px",
            backgroundColor: primaryColor,
            color: "#fff",
            textAlign: "center",
            fontSize: "13px",
            fontWeight: 600,
            textDecoration: "none",
            transition: "opacity 0.15s ease",
          }}
        >
          {product.ctaText}
        </a>
      </div>
    </div>
  );
}
