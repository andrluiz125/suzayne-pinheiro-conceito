import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://suzayne-pinheiro-conceito.vercel.app/sitemap.xml",
  };
}
