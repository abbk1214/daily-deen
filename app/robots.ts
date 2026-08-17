import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/", "/settings/"],
      },
    ],
    sitemap: "https://daily-deen.app/sitemap.xml",
  }
}
