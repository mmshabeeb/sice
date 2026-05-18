const faqs = [
  {
    q: "What is SICE, in one sentence?",
    a: "SICE is a media platform for South Indian creators — publishing work in Malayalam, Tamil, Telugu, and Kannada, hosting in-person chapters across the region, and connecting creators to brand work that pays fairly.",
  },
  {
    q: "Who developed SICE?",
    a: "SICE is developed and operated by ElevateX Now — an integrated business services firm based in Calicut, Kerala, founded in 2019. ElevateX Now has supported over 500 startups and MSMEs across India in legal, branding, and marketing functions, and is now applying that integrated model to building media platforms.",
  },
  {
    q: "Is SICE aligned with the National Creator Economy Bill 2026?",
    a: "Yes. The National Creator Economy Bill 2026, passed by the Rajya Sabha on 14 April 2026, formally recognizes creators as licensed professionals under Indian law. SICE is being built in alignment with the framework this bill establishes — including the registration requirements, contract standards, and disclosure rules it introduces. The bill awaits Presidential Assent at the time of publication.",
  },
  {
    q: "Who can apply?",
    a: "Working creators based in South India, or creators producing content in a South Indian language from anywhere in the world. There is no minimum follower count. We look for consistent original work and a clear voice. Application is open year-round.",
  },
  {
    q: "Is SICE a talent agency?",
    a: "No. We don't represent creators for commissions. We publish their work, host events, and facilitate brand connections — but the relationship is platform-to-creator, not agent-to-client. Creators retain full control of their work.",
  },
  {
    q: "How does the brand-partnership marketplace work?",
    a: "Brands brief us on what they're looking for. We match the brief to members based on audience fit, voice, and creative direction — not just follower count. Members opt in to each pitch individually. We don't take a commission on the deal.",
  },
  {
    q: "Where is SICE based?",
    a: "SICE is headquartered in Calicut, Kerala — operating from HiLite Business Park, the same office as ElevateX Now. Active and planned chapters span Kerala, Tamil Nadu, Karnataka, Telangana, and Andhra Pradesh, with a digital chapter for the GCC diaspora under exploration.",
  },
];

export default function FAQSection() {
  return (
    <section className="faq reveal">
      <div className="container">
        <div className="section-eyebrow">09 · Questions</div>
        <h2>Common questions. <em>Direct answers.</em></h2>
        <div className="faq-list">
          {faqs.map(({ q, a }) => (
            <details className="faq-item" key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
