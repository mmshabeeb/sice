import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import ApplicationForm from "./ApplicationForm";

export const metadata: Metadata = {
  title: "Apply for Membership",
  description:
    "Apply for Membership with SICE - The South Indian Creators Economy.",
  alternates: {
    canonical: "/apply",
  },
};

export default function ApplyPage() {
  return (
    <main className="apply-page">
      <section className="application apply-hero">
        <div className="container">
          <Link href="/" className="apply-back">Back to SICE</Link>
          <div className="section-eyebrow light">Apply</div>
          <Suspense fallback={
            <div style={{ color: "rgba(240, 235, 224, 0.75)", padding: "40px 0", textAlign: "center" }}>
              Loading application form...
            </div>
          }>
            <ApplicationForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
