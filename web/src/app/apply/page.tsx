import type { Metadata } from "next";
import Link from "next/link";
import ApplicationForm from "./ApplicationForm";

export const metadata: Metadata = {
  title: "Apply for Primary Membership",
  description:
    "Apply for Primary Membership with SICE - The South Indian Creators Economy.",
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
          <h1>Primary Membership <em>application.</em></h1>
          <p className="lede light">
            Complete the details below to apply for SICE Primary Membership.
            We review all applications and respond via email.
          </p>
          <ApplicationForm />
        </div>
      </section>
    </main>
  );
}
