export default function AboutSection() {
  return (
    <section className="what-is reveal" id="what">
      <div className="container">
        <div className="section-eyebrow">01 · About</div>
        <h2>What is the <em>South Indian Creators Economy?</em></h2>
        <div className="what-grid">
          <div>
            <p className="lede">SICE is a regional media platform that exists to do three things well — publish South Indian creators, host them in person, and connect them to brand work that pays regional rates fairly.</p>
            <p style={{ fontSize: "15px", lineHeight: "1.7", color: "rgba(8,13,38,0.78)", maxWidth: "560px" }}>
              We are not a talent agency. We are not a community group. We are a working media business with revenue lines, accountable outputs, and a regional focus that runs deeper than most national networks ever attempt.
              <br /><br />
              Most creator platforms treat South India as one segment of a national strategy. SICE is built the other way around — this region first, full stop. We work with creators whose audiences live in Kerala, Tamil Nadu, Karnataka, Telangana, and Andhra Pradesh, and with the diaspora that watches from the Gulf, Singapore, and beyond.
              <br /><br />
              We don&apos;t claim to solve every problem a creator has. We focus on three: getting the work seen, putting the right creator in front of the right brand, and creating room for creators to meet each other in real life.
            </p>
          </div>
          <ul className="what-list">
            {[
              { num: "01", title: "Not an agency", body: "We don’t represent creators on commission. The relationship is platform-to-creator, not agent-to-client." },
              { num: "02", title: "Not a community", body: "Communities are unmonetized and voluntary. SICE is a working business with revenue lines and accountable outputs." },
              { num: "03", title: "Not a luxury body", body: "Luxury requires legacy. SICE is new. We aim to be premium and modern — not aristocratic." },
              { num: "04", title: "Not pan-Indian", body: "We are South Indian. The four languages, the regional context, and the cultural specificity are the point." },
            ].map(({ num, title, body }) => (
              <li key={num}>
                <div className="what-list-num">{num}</div>
                <div className="what-list-content">
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
