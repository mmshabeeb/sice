const benefits = [
  "Listed in the SICE creator directory",
  "Access to monthly chapter meetups",
  "Priority editorial feature consideration",
  "Access to brand-partnership marketplace",
  "Member badge for use on owned channels",
  "One free workshop per quarter",
];

export default function MembershipSection() {
  return (
    <section className="membership reveal" id="membership">
      <div className="container">
        <div className="section-eyebrow">06 · Membership</div>
        <h2>Primary Membership. <em>One platform.</em></h2>
        <p className="lede">Membership is application-based, not transactional. We don&apos;t sell access. We invite working creators and offer them the platform&apos;s resources through one clear membership plan.</p>
        <div className="membership-grid">
          <article className="tier primary-membership">
            <div className="tier-tag">Membership Plan</div>
            <h3>Primary Membership</h3>
            <div className="tier-price">By application · Annual contribution</div>
            <ul className="tier-list">
              {benefits.map((b) => <li key={b}>{b}</li>)}
            </ul>
            <a href="/apply" className="btn-primary">Apply</a>
          </article>
        </div>
      </div>
    </section>
  );
}
