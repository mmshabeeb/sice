const stats = [
  { num: "500+", label: "Startups Served" },
  { num: "2019", label: "Founded" },
  { num: "98%", label: "Delivery Rate" },
];

const services = [
  { title: "Foundation", desc: "Company registration, GST, MSME, annual compliance." },
  { title: "Shield", desc: "Trademark, IP protection, founder agreements." },
  { title: "Identity", desc: "Branding, website, design, media assets." },
  { title: "Engine", desc: "Performance marketing, SEO, paid campaigns." },
];

export default function DeveloperSection() {
  return (
    <section className="developer reveal" id="developer">
      <div className="container">
        <div className="section-eyebrow light">07 · Behind the build</div>
        <h2 className="light">Developed by <em>ElevateX Now.</em></h2>
        <p className="lede light">SICE is built and operated by ElevateX Now — an integrated business services firm based in Calicut, serving 500+ startups and growing businesses across India since 2019.</p>
        <div className="developer-grid">
          <aside className="developer-mark">
            <div className="developer-mark-text">ELEVATEX</div>
            <div className="developer-mark-tagline">Powering Digital Success</div>
            <div className="developer-stats">
              {stats.map(({ num, label }) => (
                <div key={label}>
                  <div className="developer-stat-num">{num}</div>
                  <div className="developer-stat-label">{label}</div>
                </div>
              ))}
            </div>
          </aside>
          <div className="developer-content">
            <p style={{ fontSize: "16px", lineHeight: "1.7", color: "rgba(240,235,224,0.82)", marginBottom: "24px" }}>
              ElevateX Now was built to end the fragmentation that kills most early-stage businesses — five different vendors who never speak to each other, each pulling in a different direction.
            </p>
            <p style={{ fontSize: "15px", lineHeight: "1.7", color: "rgba(240,235,224,0.72)", marginBottom: "24px" }}>
              One integrated team handles legal incorporation, brand identity, performance marketing, and strategic consulting under a single brief. That same model is now being applied to building media platforms — SICE is the first.
            </p>
            <div className="developer-pillars">
              {services.map(({ title, desc }) => (
                <div className="developer-pillar" key={title}>
                  <strong>{title}</strong>{desc}
                </div>
              ))}
            </div>
            <a href="https://elevatexnow.com" target="_blank" rel="noopener" className="btn-primary" style={{ background: "var(--gold)" }}>
              Visit ElevateX Now →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
