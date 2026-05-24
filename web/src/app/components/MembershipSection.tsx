const creatorBenefits = [
  "Listed in the SICE creator directory",
  "Access to monthly chapter meetups",
  "Priority editorial feature consideration",
  "Access to brand-partnership marketplace",
  "Member badge for use on owned channels",
  "One free workshop per quarter",
];

const merchantBenefits = [
  "Access to SICE verified creator directory",
  "Post collaboration and campaign briefs",
  "Direct secure deposit payment escrow",
  "Access to standardized legal contracts",
  "Invitation to exclusive networking events",
  "Brand profile listing on the platform",
];

const chapterBenefits = [
  "Host official local SICE meetups & panels",
  "Moderate region-specific SICE network channels",
  "Access to regional workshop sponsorship funds",
  "Member badge & official regional SICE email alias",
  "Represent local community in platform governance",
  "Exclusive SICE merchandise and organizer toolkit",
];

export default function MembershipSection() {
  return (
    <section className="membership reveal" id="membership">
      <div className="container">
        <div className="section-eyebrow">06 · Membership</div>
        <h2>SICE Memberships. <em>Grow together.</em></h2>
        <p className="lede">Membership is application-based. We invite working creators, verified brands, and regional organizers to collaborate, grow, and secure transaction workflows through one clear network ecosystem.</p>
        <div className="membership-grid">
          <article className="tier primary-membership">
            <div className="tier-tag">Creator Plan</div>
            <h3>Creator Membership</h3>
            <div className="tier-price">By application · Annual contribution</div>
            <ul className="tier-list">
              {creatorBenefits.map((b) => <li key={b}>{b}</li>)}
            </ul>
            <a href="/apply?type=creator" className="btn-primary">Apply as Creator</a>
          </article>

          <article className="tier merchant-membership">
            <div className="tier-tag">Brand Partner Plan</div>
            <h3>Merchant Membership</h3>
            <div className="tier-price">By application · Annual contribution</div>
            <ul className="tier-list">
              {merchantBenefits.map((b) => <li key={b}>{b}</li>)}
            </ul>
            <a href="/apply?type=merchant" className="btn-primary">Apply as Merchant</a>
          </article>

          <article className="tier chapter-membership">
            <div className="tier-tag">Chapter Plan</div>
            <h3>Chapter Representative</h3>
            <div className="tier-price">By application · Volunteer leadership</div>
            <ul className="tier-list">
              {chapterBenefits.map((b) => <li key={b}>{b}</li>)}
            </ul>
            <a href="/apply?type=chapter" className="btn-primary">Apply to Lead Chapter</a>
          </article>
        </div>
      </div>
    </section>
  );
}
