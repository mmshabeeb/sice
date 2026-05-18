const keyPoints = [
  "Creators are legally recognized as professionals — not informal workers",
  "Registration with the Ministry of I&B for creators above an income threshold",
  "Standardized contract templates and disclosure rules for brand partnerships",
  "Creator Welfare Fund — health insurance, accidental cover, retirement provisions",
  "Mandatory AI-content labelling for synthetic or deepfake-generated work",
  "Access to formal financial products — business loans, insurance, professional credit",
];

const sources = [
  {
    label: "PM India · Official",
    title: "National Creators Award presented by PM Modi at Bharat Mandapam",
    link: "Read on pmindia.gov.in",
    href: "https://www.pmindia.gov.in/en/news_updates/pm-presents-first-ever-national-creators-award/",
  },
  {
    label: "Press Information Bureau",
    title: "Government initiatives supporting creative economy and content creators",
    link: "Read on pib.gov.in",
    href: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2224507&reg=3&lang=1",
  },
  {
    label: "Union Budget 2026",
    title: "₹250 crore allocated for National Creator Labs across 15,000 schools and 500 colleges",
    link: "Read full coverage",
    href: "https://thebetterindia.com/education/union-budget-2026-creator-labs-india-11067472",
  },
];

export default function GovContext() {
  return (
    <section className="gov-context reveal" id="gov-context">
      <div className="container">
        <div className="section-eyebrow">03 · Context</div>
        <h2>India recognized creators as professionals. <em>SICE is built for that moment.</em></h2>
        <p className="lede">On 14 April 2026, the Rajya Sabha passed the National Creator Economy Bill — one of the first laws of its kind anywhere in the world. SICE is being built in alignment with the framework this bill creates.</p>
        <div className="gov-grid">
          <article className="gov-card">
            <div className="gov-card-eyebrow">National Creator Economy Bill 2026</div>
            <h3>For the first time, Indian law treats creators as a profession — not a gig.</h3>
            <p>The bill formally recognizes social media creators, YouTubers, streamers, digital artists, and podcasters as licensed professionals under Indian law. Previously, creators operated in a legal grey zone — classified as informal workers, with limited access to insurance, structured contracts, or formal financial recognition.</p>
            <p>Key provisions include mandatory registration with the Ministry of Information and Broadcasting for high-earning creators, standardized contract frameworks, AI content labelling requirements, and the establishment of a Creator Welfare Fund.</p>
            <div className="citation">
              Source: Reporting on the National Creator Economy Bill 2026, passed by Rajya Sabha 14 April 2026. The bill awaits Presidential Assent at the time of publication.{" "}
              <a href="https://www.sansalegal.com/post/national-creator-economy-bill-2026-legal-framework-for-influencers-and-digital-creators-in-india" target="_blank" rel="noopener">Read full legal analysis →</a>
            </div>
          </article>
          <aside className="gov-key-points">
            <h3>What the bill changes for creators.</h3>
            <ul className="gov-key-list">
              {keyPoints.map((point, i) => (
                <li key={i}>
                  <span className="gov-key-list-num">{String(i + 1).padStart(2, "0")}</span>
                  <span dangerouslySetInnerHTML={{ __html: point }} />
                </li>
              ))}
            </ul>
          </aside>
        </div>
        <div className="gov-sources-row">
          {sources.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener" className="gov-source">
              <div className="gov-source-label">{s.label}</div>
              <div className="gov-source-title">{s.title}</div>
              <div className="gov-source-link">{s.link}</div>
            </a>
          ))}
        </div>
        <p className="gov-disclaimer" style={{ marginTop: "32px" }}>
          Note: The National Creator Economy Bill 2026 has been passed by the Rajya Sabha and is awaiting Presidential Assent at the time of publication. Some provisions may be subject to rule-making before full implementation. SICE is being built in anticipation of, and in alignment with, the framework this legislation establishes.
        </p>
      </div>
    </section>
  );
}
