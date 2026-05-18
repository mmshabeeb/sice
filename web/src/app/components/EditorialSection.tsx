const articles = [
  {
    tag: "Industry · Policy",
    title: "What the National Creator Economy Bill 2026 changes for a working creator.",
    body: "A plain-English breakdown of what creators must do to register, what protections kick in, and what brands must now disclose.",
    meta: "10 minute read · May 2026",
  },
  {
    tag: "Tamil Nadu",
    title: "The economics of being a Tamil food creator in 2026.",
    body: "What regional food creators earn, what brands actually pay, and why most reported numbers are wrong.",
    meta: "5 minute read · May 2026",
  },
  {
    tag: "Diaspora",
    title: "Inside the Malayalam creator economy of the Gulf.",
    body: "How GCC-based Malayalam creators are outperforming domestic peers — and what local brands are missing.",
    meta: "6 minute read · April 2026",
  },
  {
    tag: "Karnataka",
    title: "Kannada gaming is having its moment. The brands aren't ready.",
    body: "A market analysis of Kannada gaming creators and the slow pace of regional brand spend.",
    meta: "8 minute read · April 2026",
  },
];

export default function EditorialSection() {
  return (
    <section className="editorial reveal" id="editorial">
      <div className="container">
        <div className="section-eyebrow">08 · Editorial</div>
        <h2>What we publish. <em>Read first.</em></h2>
        <p className="lede">Editorial isn&apos;t a side project — it&apos;s the main one. Every feature is original writing, regionally specific, and built to be read end-to-end.</p>
        <article className="editorial-feature">
          <div className="article-tag">Featured · Kerala</div>
          <h3>How a Calicut-based satirist built a 600,000-strong Malayalam audience without leaving Kerala.</h3>
          <p className="article-lede">A profile of one of the region&apos;s most quietly successful Malayalam-language creators — and what regional creators everywhere can learn from her playbook.</p>
          <div className="article-meta">By the SICE Editorial Desk · 7 minute read · May 2026</div>
        </article>
        <div className="editorial-list">
          {articles.map(({ tag, title, body, meta }) => (
            <article className="editorial-card" key={tag + title}>
              <div className="article-tag">{tag}</div>
              <h3>{title}</h3>
              <p>{body}</p>
              <div className="article-meta">{meta}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
