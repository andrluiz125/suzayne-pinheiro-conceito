import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import "./anti-sticky.css";
import { SITE_URL } from "./site";

const display = Cormorant_Garamond({ variable: "--font-display", subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"] });
const sans = Manrope({ variable: "--font-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Suzayne Pinheiro | Plano de Saúde em São Paulo",
  description: "Compare planos de saúde em São Paulo, rede credenciada e custos de longo prazo com orientação clara. Comece pelo diagnóstico gratuito.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Suzayne Pinheiro | Plano de Saúde em São Paulo",
    description: "Compare planos, rede credenciada e custos de longo prazo com orientação clara e personalizada.",
    url: "/",
    siteName: "Suzayne Pinheiro",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/og-suzayne.jpg", width: 1200, height: 630, alt: "Suzayne Pinheiro — planos de saúde em São Paulo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Suzayne Pinheiro | Plano de Saúde em São Paulo",
    description: "Compare planos, rede credenciada e custos de longo prazo com orientação clara e personalizada.",
    images: ["/og-suzayne.jpg"],
  },
  icons: { icon: "/favicon.svg" },
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Suzayne Pinheiro",
    inLanguage: "pt-BR",
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#suzayne-pinheiro`,
    name: "Suzayne Pinheiro",
    url: SITE_URL,
    image: `${SITE_URL}/og-suzayne.jpg`,
    jobTitle: "Consultora de planos de saúde",
    description: "Consultoria em planos de saúde para famílias e empresas, com comparação de rede, contrato e custos de longo prazo.",
    areaServed: {
      "@type": "AdministrativeArea",
      name: "São Paulo",
    },
  },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${display.variable} ${sans.variable}`}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
