const chapters = [
  {
    meta: "Headquarters · Kerala",
    city: "Kozhikode",
    body: "The founding chapter. Anchors the Malabar creator community and serves as the operational base for the platform.",
    status: "Active",
    dark: false,
  },
  {
    meta: "Lifestyle · Kerala",
    city: "Kochi",
    body: "Media and lifestyle production hub. Strong representation in beauty, fashion, food, and visual storytelling categories.",
    status: "Opening Q3 2026",
    dark: false,
  },
  {
    meta: "Tech & Media · Karnataka",
    city: "Bangalore",
    body: "Tech-creator integration. Strong representation in Kannada-language content, gaming, education, and product reviews.",
    status: "Opening Q4 2026",
    dark: false,
  },
  {
    meta: "Cinema · Tamil Nadu",
    city: "Chennai",
    body: "Tamil creator and cinema-adjacent talent hub. Bridges traditional film industry and digital creator economy.",
    status: "Planning",
    dark: false,
  },
  {
    meta: "Tech & Cinema · Telangana",
    city: "Hyderabad",
    body: "Telugu-language creator hub. Strong cinema-adjacent influence and growing tech and lifestyle representation.",
    status: "Planning",
    dark: false,
  },
];

export default function ChaptersSection() {
  return (
    <section className="chapters reveal" id="chapters">
      <div className="container">
        <div className="section-eyebrow">05 · Chapters</div>
        <h2>Five cities. <em>One platform.</em></h2>
        <p className="lede">Every chapter has a founding home and a working membership. New chapters open when there&apos;s demand on the ground — not before.</p>
        <div className="chapters-grid">
          {chapters.map(({ meta, city, body, status }) => (
            <article className="chapter-card" key={city}>
              <div className="chapter-meta">{meta}</div>
              <h3>{city}</h3>
              <p>{body}</p>
              <div className="chapter-stat"><span>Status</span><strong>{status}</strong></div>
            </article>
          ))}
          <article
            className="chapter-card"
            style={{ borderLeftColor: "var(--gold-deep)", background: "var(--indigo)", color: "var(--cream)" }}
          >
            <div className="chapter-meta" style={{ color: "var(--gold)" }}>Coming · Diaspora</div>
            <h3 style={{ color: "var(--cream)" }}>GCC Digital Chapter</h3>
            <p style={{ color: "rgba(240,235,224,0.7)" }}>Digital-only chapter for South Indian creators based in the Gulf — the diaspora audience is too large to overlook.</p>
            <div className="chapter-stat" style={{ color: "rgba(240,235,224,0.5)", borderTopColor: "var(--indigo-line)" }}>
              <span>Status</span><strong style={{ color: "var(--gold)" }}>Exploring</strong>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
