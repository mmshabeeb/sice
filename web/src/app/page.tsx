import Nav from "./components/Nav";
import Hero from "./components/Hero";
import AboutSection from "./components/AboutSection";
import VisionMission from "./components/VisionMission";
import BrandBar from "./components/BrandBar";
import GovContext from "./components/GovContext";
import Pillars from "./components/Pillars";
import ChaptersSection from "./components/ChaptersSection";
import MembershipSection from "./components/MembershipSection";
import DeveloperSection from "./components/DeveloperSection";
import EditorialSection from "./components/EditorialSection";
import FAQSection from "./components/FAQSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import ScrollReveal from "./components/ScrollReveal";

const siteUrl = "https://sice.media";
const siteName = "SICE - The South Indian Creators Economy";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      alternateName: "SICE",
      url: siteUrl,
      logo: `${siteUrl}/og-image.png`,
      description: "A media platform for Malayalam, Tamil, Telugu, and Kannada creators across South India.",
      foundingDate: "2026",
      areaServed: ["Kerala", "Tamil Nadu", "Karnataka", "Telangana", "Andhra Pradesh"],
      contactPoint: [
        { "@type": "ContactPoint", email: "apply@sice.media", contactType: "creator applications", areaServed: "IN" },
        { "@type": "ContactPoint", email: "partners@sice.media", contactType: "brand partnerships", areaServed: "IN" },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteName,
      alternateName: "SICE",
      url: siteUrl,
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en-IN",
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Nav />
      <Hero />
      <main>
        <AboutSection />
        <VisionMission />
        <BrandBar />
        <GovContext />
        <Pillars />
        <ChaptersSection />
        <MembershipSection />
        <DeveloperSection />
        <EditorialSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
