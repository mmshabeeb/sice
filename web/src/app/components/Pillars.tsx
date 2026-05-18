const pillars = [
  {
    num: "Pillar 01",
    title: "Publish",
    body: "Long-form features, profiles, and editorial work spotlighting regional creators. Distributed through our channels and amplified to brand partners. Original writing, native-language coverage, no recycled press releases.",
  },
  {
    num: "Pillar 02",
    title: "Host",
    body: "Monthly chapter meetups in Calicut, Kochi, Bangalore, Chennai, and Hyderabad. In-person, working sessions — not networking theatre. Skill workshops, peer review, and structured introductions to peers in the room.",
  },
  {
    num: "Pillar 03",
    title: "Connect",
    body: "Brand partnerships matched to creator fit, not just follower count. We negotiate regional rates that reflect what the work is worth — not what Mumbai-based agencies decide South Indian audiences are worth.",
  },
];

export default function Pillars() {
  return (
    <section className="pillars reveal">
      <div className="container">
        <div className="section-eyebrow light">04 · What we do</div>
        <h2 className="light">Three jobs. <em>Done well.</em></h2>
        <p className="lede light">A media platform&apos;s value comes from doing a few things consistently — not many things occasionally. These are ours.</p>
        <div className="pillars-grid">
          {pillars.map(({ num, title, body }) => (
            <article className="pillar" key={num}>
              <div className="pillar-num">{num}</div>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
