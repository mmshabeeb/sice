import type { Metadata } from "next";
import Link from "next/link";
import ApplicationForm from "./ApplicationForm";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const type = resolvedParams.type === "merchant" ? "Merchant" : "Primary";
  return {
    title: `Apply for ${type} Membership`,
    description: `Apply for ${type} Membership with SICE - The South Indian Creators Economy.`,
    alternates: {
      canonical: "/apply",
    },
  };
}

export default async function ApplyPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const type = typeof resolvedParams.type === "string" ? resolvedParams.type : "creator";

  return (
    <main className="apply-page">
      <section className="application apply-hero">
        <div className="container">
          <Link href="/" className="apply-back">Back to SICE</Link>
          <div className="section-eyebrow light">Apply</div>
          <h1>
            {type === "merchant" ? "Merchant Membership" : "Primary Membership"} <em>application.</em>
          </h1>
          <p className="lede light">
            Complete the details below to apply for SICE {type === "merchant" ? "Merchant" : "Primary"} Membership.
            We review all applications and respond via email.
          </p>
          <ApplicationForm type={type} />
        </div>
      </section>
    </main>
  );
}
