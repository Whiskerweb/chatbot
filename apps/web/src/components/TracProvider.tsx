"use client";

import Script from "next/script";

export function TracProvider() {
  return (
    <Script
      src="/_trac/script.js"
      data-api="/_trac/api"
      data-outbound-domains="app.helloclaudia.fr"
      data-cookie-domain=".helloclaudia.fr"
    />
  );
}
