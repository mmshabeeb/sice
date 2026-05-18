"use client";

import { FormEvent, useEffect, useState } from 'react';

const siteName = "SICE - The South Indian Creators Economy";
const siteUrl = "https://sice.media";
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      alternateName: "SICE",
      url: siteUrl,
      logo: `${siteUrl}/og-image.png`,
      description:
        "A media platform for Malayalam, Tamil, Telugu, and Kannada creators across South India.",
      foundingDate: "2026",
      areaServed: [
        "Kerala",
        "Tamil Nadu",
        "Karnataka",
        "Telangana",
        "Andhra Pradesh",
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          email: "apply@sice.media",
          contactType: "creator applications",
          areaServed: "IN",
        },
        {
          "@type": "ContactPoint",
          email: "partners@sice.media",
          contactType: "brand partnerships",
          areaServed: "IN",
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteName,
      alternateName: "SICE",
      url: siteUrl,
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      inLanguage: "en-IN",
    },
  ],
};

export default function Home() {
  const [contactStatus, setContactStatus] = useState("");

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactStatus("General enquiry form design complete. Backend connection will be added next.");
  };

  useEffect(() => {
    // Nav background tightens on scroll
    const nav = document.getElementById('nav');
    if (nav) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
      });
    }

    // Mobile menu toggle
    const toggle = document.querySelector('.nav-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const links = document.querySelector('.nav-links') as HTMLElement;
        if (links) {
          const isOpen = links.style.display === 'flex';
          links.style.display = isOpen ? 'none' : 'flex';
          if (!isOpen) {
            links.style.flexDirection = 'column';
            links.style.position = 'absolute';
            links.style.top = '100%';
            links.style.left = '0';
            links.style.right = '0';
            links.style.background = 'rgba(8, 13, 38, 0.98)';
            links.style.padding = '24px 32px';
            links.style.gap = '20px';
          }
        }
      });
    }

    document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 900) {
          const links = document.querySelector('.nav-links') as HTMLElement;
          if (links) links.style.display = 'none';
        }
      });
    });

    // Scroll-reveal animations using IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />


  <nav className="nav" id="nav">
    <div className="nav-inner">
      <a href="#top" className="nav-logo">SICE</a>
      <div className="nav-links">
        <a href="#what" className="nav-link">About</a>
        <a href="#vision" className="nav-link">Vision</a>
        <a href="#chapters" className="nav-link">Chapters</a>
        <a href="#membership" className="nav-link">Membership</a>
        <a href="#editorial" className="nav-link">Editorial</a>
        <a href="/apply" className="nav-cta">Apply</a>
      </div>
      <button className="nav-toggle" aria-label="Open menu">☰</button>
    </div>
  </nav>

  {/* ============ HERO — RICH ANIMATED ============ */}
  <header className="hero" id="top">

    {/* Layer 0: Background Image */}
    <div className="hero-bg-image"></div>

    {/* Layer 1: Atmospheric gradient */}
    <div className="hero-atmosphere"></div>

    {/* Layer 2: Drifting orbs */}
    <div className="hero-orb hero-orb-1"></div>
    <div className="hero-orb hero-orb-2"></div>
    <div className="hero-orb hero-orb-3"></div>

    {/* Layer 3: Slowly rotating concentric rings */}
    <div className="hero-rings">
      <svg viewBox="0 0 1400 1400" xmlns="http://www.w3.org/2000/svg">
        <circle cx="700" cy="700" r="200" />
        <circle cx="700" cy="700" r="320" />
        <circle cx="700" cy="700" r="450" />
        <circle cx="700" cy="700" r="580" strokeDasharray="3 8" />
        <circle cx="700" cy="700" r="680" />
        <circle cx="700" cy="700" r="620" strokeDasharray="1 12" opacity="0.5" />
      </svg>
    </div>

    {/* Layer 4: Floating particles */}
    <div className="hero-particles">
      <div className="particle" style={{top: "15%", left: "12%", animationDelay: "0s"}}></div>
      <div className="particle" style={{top: "25%", left: "78%", animationDelay: "1.2s"}}></div>
      <div className="particle" style={{top: "60%", left: "18%", animationDelay: "2.4s"}}></div>
      <div className="particle" style={{top: "70%", left: "84%", animationDelay: "3.6s"}}></div>
      <div className="particle" style={{top: "35%", left: "50%", animationDelay: "1.8s"}}></div>
      <div className="particle" style={{top: "80%", left: "42%", animationDelay: "4.2s"}}></div>
      <div className="particle" style={{top: "20%", left: "32%", animationDelay: "5s"}}></div>
      <div className="particle" style={{top: "50%", left: "70%", animationDelay: "2.8s"}}></div>
      <div className="particle" style={{top: "45%", left: "8%", animationDelay: "6s"}}></div>
      <div className="particle" style={{top: "12%", left: "62%", animationDelay: "0.6s"}}></div>
    </div>

    {/* Layer 5: Content */}
    <div className="hero-inner">

      <div className="hero-logo-block">
        <div className="hero-top-rule">
          <div className="line"></div>
          <div className="dot"></div>
          <div className="line"></div>
        </div>
        <div className="hero-wordmark">
          <span>S</span><span>I</span><span>C</span><span>E</span>
        </div>
        <div className="hero-bottom-rule"></div>
        <div className="hero-tagline">South Indian<br />Creator Economy</div>
      </div>

      <div className="hero-statement">
        <h1>A media platform <em>built here,</em> for the creators making work in <em>Malayalam, Tamil, Telugu, and Kannada.</em></h1>

        <div className="gov-banner">
          <span className="gov-banner-tag">Aligned</span>
          <span className="gov-banner-text">Built in alignment with the <a href="#gov-context">National Creator Economy Bill 2026</a> · Passed by Rajya Sabha, 14 April 2026</span>
        </div>

        <div className="hero-cta-row">
          <a href="/apply" className="btn-primary">Apply for Membership</a>
          <a href="#what" className="btn-ghost">What is SICE?</a>
        </div>
      </div>

      <div className="hero-stats">
        <div>
          <div className="stat-num">4</div>
          <div className="stat-label">Languages</div>
          <div className="stat-note">Malayalam · Tamil · Telugu · Kannada</div>
        </div>
        <div>
          <div className="stat-num">5</div>
          <div className="stat-label">Chapter Cities</div>
          <div className="stat-note">Across the South</div>
        </div>
        <div>
          <div className="stat-num">2026</div>
          <div className="stat-label">Founding Year</div>
          <div className="stat-note">Applications open now</div>
        </div>
        <div>
          <div className="stat-num">100</div>
          <div className="stat-label">Membership Plan</div>
          <div className="stat-note">Primary Membership</div>
        </div>
      </div>
    </div>

    {/* Scroll indicator */}
    <div className="scroll-indicator">
      <span>Scroll</span>
      <div className="scroll-indicator-line"></div>
    </div>
  </header>

  <main>

  {/* ABOUT */}
  <section className="what-is reveal" id="what">
    <div className="container">
      <div className="section-eyebrow">01 · About</div>
      <h2>What is the <em>South Indian Creators Economy?</em></h2>
      <div className="what-grid">
        <div>
          <p className="lede">SICE is a regional media platform that exists to do three things well — publish South Indian creators, host them in person, and connect them to brand work that pays regional rates fairly.</p>
          <p style={{fontSize: "15px", lineHeight: "1.7", color: "rgba(8,13,38,0.78)", maxWidth: "560px"}}>
            We are not a talent agency. We are not a community group. We are a working media business with revenue lines, accountable outputs, and a regional focus that runs deeper than most national networks ever attempt.
            <br/><br/>
            Most creator platforms treat South India as one segment of a national strategy. SICE is built the other way around — this region first, full stop. We work with creators whose audiences live in Kerala, Tamil Nadu, Karnataka, Telangana, and Andhra Pradesh, and with the diaspora that watches from the Gulf, Singapore, and beyond.
            <br/><br/>
            We don&apos;t claim to solve every problem a creator has. We focus on three: getting the work seen, putting the right creator in front of the right brand, and creating room for creators to meet each other in real life.
          </p>
        </div>
        <ul className="what-list">
          <li>
            <div className="what-list-num">01</div>
            <div className="what-list-content">
              <h3>Not an agency</h3>
              <p>We don&apos;t represent creators on commission. The relationship is platform-to-creator, not agent-to-client.</p>
            </div>
          </li>
          <li>
            <div className="what-list-num">02</div>
            <div className="what-list-content">
              <h3>Not a community</h3>
              <p>Communities are unmonetized and voluntary. SICE is a working business with revenue lines and accountable outputs.</p>
            </div>
          </li>
          <li>
            <div className="what-list-num">03</div>
            <div className="what-list-content">
              <h3>Not a luxury body</h3>
              <p>Luxury requires legacy. SICE is new. We aim to be premium and modern — not aristocratic.</p>
            </div>
          </li>
          <li>
            <div className="what-list-num">04</div>
            <div className="what-list-content">
              <h3>Not pan-Indian</h3>
              <p>We are South Indian. The four languages, the regional context, and the cultural specificity are the point.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>

  {/* VISION MISSION */}
  <section className="vision-mission reveal" id="vision">
    <div className="container">
      <div className="section-eyebrow">02 · Direction</div>
      <h2>Vision and Mission. <em>Stated plainly.</em></h2>
      <p className="lede">A vision is what we want the region to look like in ten years. A mission is what we are doing this year to get there. Both kept short.</p>
      <div className="vm-grid">
        <article className="vm-card">
          <div>
            <div className="vm-eyebrow">— Vision</div>
            <div className="vm-heading">South Indian creators, working as recognized professionals — locally, fairly, and visibly.</div>
            <p className="vm-body">A region where a Malayalam creator in Calicut, a Tamil creator in Madurai, or a Telugu creator in Vijayawada earns from their craft as a registered profession — not a side hustle, not a grey-zone informal job, but a legitimate career with the same recognition, protections, and economic dignity as any other.</p>
          </div>
          <div className="vm-stamp">A ten-year horizon</div>
        </article>
        <article className="vm-card light">
          <div>
            <div className="vm-eyebrow">— Mission</div>
            <div className="vm-heading">Build the platform that makes that vision real for working creators today.</div>
            <p className="vm-body">Publish original editorial work that puts regional creators in front of brands and audiences who otherwise wouldn&apos;t see them. Host chapter meetups that turn isolated creators into a working network. Connect creators to brand partnerships negotiated at fair regional rates — not at rates set by Mumbai-based agencies who decide what regional audiences are worth.</p>
          </div>
          <div className="vm-stamp">In motion this year</div>
        </article>
      </div>
    </div>
  </section>

  {/* BRAND BAR */}
  <section className="brand-bar">
    <div className="brand-bar-inner">
      <div className="brand-bar-rule-top">
        <div className="line"></div>
        <div className="dot"></div>
        <div className="line"></div>
      </div>
      <div className="brand-bar-word">SICE</div>
      <div className="brand-bar-rule-bottom"></div>
      <div className="brand-bar-tag">South Indian Creators Economy</div>
    </div>
  </section>

  {/* GOV CONTEXT */}
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
            Source: Reporting on the National Creator Economy Bill 2026, passed by Rajya Sabha 14 April 2026. The bill awaits Presidential Assent at the time of publication. <a href="https://www.sansalegal.com/post/national-creator-economy-bill-2026-legal-framework-for-influencers-and-digital-creators-in-india" target="_blank" rel="noopener">Read full legal analysis →</a>
          </div>
        </article>
        <aside className="gov-key-points">
          <h3>What the bill changes for creators.</h3>
          <ul className="gov-key-list">
            <li><span className="gov-key-list-num">01</span><span>Creators are legally recognized as professionals — not informal workers</span></li>
            <li><span className="gov-key-list-num">02</span><span>Registration with the Ministry of I&amp;B for creators above an income threshold</span></li>
            <li><span className="gov-key-list-num">03</span><span>Standardized contract templates and disclosure rules for brand partnerships</span></li>
            <li><span className="gov-key-list-num">04</span><span>Creator Welfare Fund — health insurance, accidental cover, retirement provisions</span></li>
            <li><span className="gov-key-list-num">05</span><span>Mandatory AI-content labelling for synthetic or deepfake-generated work</span></li>
            <li><span className="gov-key-list-num">06</span><span>Access to formal financial products — business loans, insurance, professional credit</span></li>
          </ul>
        </aside>
      </div>
      <div className="gov-sources-row">
        <a href="https://www.pmindia.gov.in/en/news_updates/pm-presents-first-ever-national-creators-award/" target="_blank" rel="noopener" className="gov-source">
          <div className="gov-source-label">PM India · Official</div>
          <div className="gov-source-title">National Creators Award presented by PM Modi at Bharat Mandapam</div>
          <div className="gov-source-link">Read on pmindia.gov.in</div>
        </a>
        <a href="https://www.pib.gov.in/PressReleasePage.aspx?PRID=2224507&reg=3&lang=1" target="_blank" rel="noopener" className="gov-source">
          <div className="gov-source-label">Press Information Bureau</div>
          <div className="gov-source-title">Government initiatives supporting creative economy and content creators</div>
          <div className="gov-source-link">Read on pib.gov.in</div>
        </a>
        <a href="https://thebetterindia.com/education/union-budget-2026-creator-labs-india-11067472" target="_blank" rel="noopener" className="gov-source">
          <div className="gov-source-label">Union Budget 2026</div>
          <div className="gov-source-title">₹250 crore allocated for National Creator Labs across 15,000 schools and 500 colleges</div>
          <div className="gov-source-link">Read full coverage</div>
        </a>
      </div>
      <p className="gov-disclaimer" style={{marginTop: "32px"}}>Note: The National Creator Economy Bill 2026 has been passed by the Rajya Sabha and is awaiting Presidential Assent at the time of publication. Some provisions may be subject to rule-making before full implementation. SICE is being built in anticipation of, and in alignment with, the framework this legislation establishes.</p>
    </div>
  </section>

  {/* PILLARS */}
  <section className="pillars reveal">
    <div className="container">
      <div className="section-eyebrow light">04 · What we do</div>
      <h2 className="light">Three jobs. <em>Done well.</em></h2>
      <p className="lede light">A media platform&apos;s value comes from doing a few things consistently — not many things occasionally. These are ours.</p>
      <div className="pillars-grid">
        <article className="pillar">
          <div className="pillar-num">Pillar 01</div>
          <h3>Publish</h3>
          <p>Long-form features, profiles, and editorial work spotlighting regional creators. Distributed through our channels and amplified to brand partners. Original writing, native-language coverage, no recycled press releases.</p>
        </article>
        <article className="pillar">
          <div className="pillar-num">Pillar 02</div>
          <h3>Host</h3>
          <p>Monthly chapter meetups in Calicut, Kochi, Bangalore, Chennai, and Hyderabad. In-person, working sessions — not networking theatre. Skill workshops, peer review, and structured introductions to peers in the room.</p>
        </article>
        <article className="pillar">
          <div className="pillar-num">Pillar 03</div>
          <h3>Connect</h3>
          <p>Brand partnerships matched to creator fit, not just follower count. We negotiate regional rates that reflect what the work is worth — not what Mumbai-based agencies decide South Indian audiences are worth.</p>
        </article>
      </div>
    </div>
  </section>

  {/* CHAPTERS */}
  <section className="chapters reveal" id="chapters">
    <div className="container">
      <div className="section-eyebrow">05 · Chapters</div>
      <h2>Five cities. <em>One platform.</em></h2>
      <p className="lede">Every chapter has a founding home and a working membership. New chapters open when there&apos;s demand on the ground — not before.</p>
      <div className="chapters-grid">
        <article className="chapter-card">
          <div className="chapter-meta">Headquarters · Kerala</div>
          <h3>Kozhikode</h3>
          <p>The founding chapter. Anchors the Malabar creator community and serves as the operational base for the platform.</p>
          <div className="chapter-stat"><span>Status</span><strong>Active</strong></div>
        </article>
        <article className="chapter-card">
          <div className="chapter-meta">Lifestyle · Kerala</div>
          <h3>Kochi</h3>
          <p>Media and lifestyle production hub. Strong representation in beauty, fashion, food, and visual storytelling categories.</p>
          <div className="chapter-stat"><span>Status</span><strong>Opening Q3 2026</strong></div>
        </article>
        <article className="chapter-card">
          <div className="chapter-meta">Tech &amp; Media · Karnataka</div>
          <h3>Bangalore</h3>
          <p>Tech-creator integration. Strong representation in Kannada-language content, gaming, education, and product reviews.</p>
          <div className="chapter-stat"><span>Status</span><strong>Opening Q4 2026</strong></div>
        </article>
        <article className="chapter-card">
          <div className="chapter-meta">Cinema · Tamil Nadu</div>
          <h3>Chennai</h3>
          <p>Tamil creator and cinema-adjacent talent hub. Bridges traditional film industry and digital creator economy.</p>
          <div className="chapter-stat"><span>Status</span><strong>Planning</strong></div>
        </article>
        <article className="chapter-card">
          <div className="chapter-meta">Tech &amp; Cinema · Telangana</div>
          <h3>Hyderabad</h3>
          <p>Telugu-language creator hub. Strong cinema-adjacent influence and growing tech and lifestyle representation.</p>
          <div className="chapter-stat"><span>Status</span><strong>Planning</strong></div>
        </article>
        <article className="chapter-card" style={{borderLeftColor: "var(--gold-deep)", background: "var(--indigo)", color: "var(--cream)"}}>
          <div className="chapter-meta" style={{color: "var(--gold)"}}>Coming · Diaspora</div>
          <h3 style={{color: "var(--cream)"}}>GCC Digital Chapter</h3>
          <p style={{color: "rgba(240,235,224,0.7)"}}>Digital-only chapter for South Indian creators based in the Gulf — the diaspora audience is too large to overlook.</p>
          <div className="chapter-stat" style={{color: "rgba(240,235,224,0.5)", borderTopColor: "var(--indigo-line)"}}>
            <span>Status</span><strong style={{color: "var(--gold)"}}>Exploring</strong>
          </div>
        </article>
      </div>
    </div>
  </section>

  {/* MEMBERSHIP */}
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
            <li>Listed in the SICE creator directory</li>
            <li>Access to monthly chapter meetups</li>
            <li>Priority editorial feature consideration</li>
            <li>Access to brand-partnership marketplace</li>
            <li>Member badge for use on owned channels</li>
            <li>One free workshop per quarter</li>
          </ul>
          <a href="/apply" className="btn-primary">Apply</a>
        </article>
      </div>
    </div>
  </section>

  {/* DEVELOPER */}
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
            <div>
              <div className="developer-stat-num">500+</div>
              <div className="developer-stat-label">Startups Served</div>
            </div>
            <div>
              <div className="developer-stat-num">2019</div>
              <div className="developer-stat-label">Founded</div>
            </div>
            <div>
              <div className="developer-stat-num">98%</div>
              <div className="developer-stat-label">Delivery Rate</div>
            </div>
          </div>
        </aside>
        <div className="developer-content">
          <p style={{fontSize: "16px", lineHeight: "1.7", color: "rgba(240,235,224,0.82)", marginBottom: "24px"}}>
            ElevateX Now was built to end the fragmentation that kills most early-stage businesses — five different vendors who never speak to each other, each pulling in a different direction.
          </p>
          <p style={{fontSize: "15px", lineHeight: "1.7", color: "rgba(240,235,224,0.72)", marginBottom: "24px"}}>
            One integrated team handles legal incorporation, brand identity, performance marketing, and strategic consulting under a single brief. That same model is now being applied to building media platforms — SICE is the first.
          </p>
          <div className="developer-pillars">
            <div className="developer-pillar"><strong>Foundation</strong>Company registration, GST, MSME, annual compliance.</div>
            <div className="developer-pillar"><strong>Shield</strong>Trademark, IP protection, founder agreements.</div>
            <div className="developer-pillar"><strong>Identity</strong>Branding, website, design, media assets.</div>
            <div className="developer-pillar"><strong>Engine</strong>Performance marketing, SEO, paid campaigns.</div>
          </div>
          <a href="https://elevatexnow.com" target="_blank" rel="noopener" className="btn-primary" style={{background: "var(--gold)"}}>Visit ElevateX Now →</a>
        </div>
      </div>
    </div>
  </section>

  {/* EDITORIAL */}
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
        <article className="editorial-card">
          <div className="article-tag">Industry · Policy</div>
          <h3>What the National Creator Economy Bill 2026 changes for a working creator.</h3>
          <p>A plain-English breakdown of what creators must do to register, what protections kick in, and what brands must now disclose.</p>
          <div className="article-meta">10 minute read · May 2026</div>
        </article>
        <article className="editorial-card">
          <div className="article-tag">Tamil Nadu</div>
          <h3>The economics of being a Tamil food creator in 2026.</h3>
          <p>What regional food creators earn, what brands actually pay, and why most reported numbers are wrong.</p>
          <div className="article-meta">5 minute read · May 2026</div>
        </article>
        <article className="editorial-card">
          <div className="article-tag">Diaspora</div>
          <h3>Inside the Malayalam creator economy of the Gulf.</h3>
          <p>How GCC-based Malayalam creators are outperforming domestic peers — and what local brands are missing.</p>
          <div className="article-meta">6 minute read · April 2026</div>
        </article>
        <article className="editorial-card">
          <div className="article-tag">Karnataka</div>
          <h3>Kannada gaming is having its moment. The brands aren&apos;t ready.</h3>
          <p>A market analysis of Kannada gaming creators and the slow pace of regional brand spend.</p>
          <div className="article-meta">8 minute read · April 2026</div>
        </article>
      </div>
    </div>
  </section>

  {/* FAQ */}
  <section className="faq reveal">
    <div className="container">
      <div className="section-eyebrow">09 · Questions</div>
      <h2>Common questions. <em>Direct answers.</em></h2>
      <div className="faq-list">
        <details className="faq-item">
          <summary>What is SICE, in one sentence?</summary>
          <p>SICE is a media platform for South Indian creators — publishing work in Malayalam, Tamil, Telugu, and Kannada, hosting in-person chapters across the region, and connecting creators to brand work that pays fairly.</p>
        </details>
        <details className="faq-item">
          <summary>Who developed SICE?</summary>
          <p>SICE is developed and operated by ElevateX Now — an integrated business services firm based in Calicut, Kerala, founded in 2019. ElevateX Now has supported over 500 startups and MSMEs across India in legal, branding, and marketing functions, and is now applying that integrated model to building media platforms.</p>
        </details>
        <details className="faq-item">
          <summary>Is SICE aligned with the National Creator Economy Bill 2026?</summary>
          <p>Yes. The National Creator Economy Bill 2026, passed by the Rajya Sabha on 14 April 2026, formally recognizes creators as licensed professionals under Indian law. SICE is being built in alignment with the framework this bill establishes — including the registration requirements, contract standards, and disclosure rules it introduces. The bill awaits Presidential Assent at the time of publication.</p>
        </details>
        <details className="faq-item">
          <summary>Who can apply?</summary>
          <p>Working creators based in South India, or creators producing content in a South Indian language from anywhere in the world. There is no minimum follower count. We look for consistent original work and a clear voice. Application is open year-round.</p>
        </details>
        <details className="faq-item">
          <summary>Is SICE a talent agency?</summary>
          <p>No. We don&apos;t represent creators for commissions. We publish their work, host events, and facilitate brand connections — but the relationship is platform-to-creator, not agent-to-client. Creators retain full control of their work.</p>
        </details>
        <details className="faq-item">
          <summary>How does the brand-partnership marketplace work?</summary>
          <p>Brands brief us on what they&apos;re looking for. We match the brief to members based on audience fit, voice, and creative direction — not just follower count. Members opt in to each pitch individually. We don&apos;t take a commission on the deal.</p>
        </details>
        <details className="faq-item">
          <summary>Where is SICE based?</summary>
          <p>SICE is headquartered in Calicut, Kerala — operating from HiLite Business Park, the same office as ElevateX Now. Active and planned chapters span Kerala, Tamil Nadu, Karnataka, Telangana, and Andhra Pradesh, with a digital chapter for the GCC diaspora under exploration.</p>
        </details>
      </div>
    </div>
  </section>

  {/* CONTACT */}
  <section className="contact reveal" id="contact">
    <div className="container">
      <div className="section-eyebrow">11 · Contact</div>
      <h2>Reach out. <em>General enquiry and support.</em></h2>
      <p className="lede">Use this form for general enquiries and support requests. Membership applications should use the separate application page.</p>
      <div className="contact-grid">
        <div className="contact-info">
          <div className="contact-block">
            <div className="contact-label">For creators</div>
            <div className="contact-value"><a href="mailto:apply@sice.media">apply@sice.media</a></div>
          </div>
          <div className="contact-block">
            <div className="contact-label">For brands</div>
            <div className="contact-value"><a href="mailto:partners@sice.media">partners@sice.media</a></div>
          </div>
          <div className="contact-block">
            <div className="contact-label">Press &amp; editorial</div>
            <div className="contact-value"><a href="mailto:editorial@sice.media">editorial@sice.media</a></div>
          </div>
          <div className="contact-block">
            <div className="contact-label">Headquarters</div>
            <div className="contact-value">HiLite Business Park<br/>Calicut, Kerala — 673014</div>
          </div>
          <div className="contact-block">
            <div className="contact-label">Operated by</div>
            <div className="contact-value"><a href="https://elevatexnow.com" target="_blank" rel="noopener">ElevateX Now →</a></div>
          </div>
        </div>
        <form className="form" onSubmit={handleContactSubmit}>
          <div className="form-field">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-field">
            <label htmlFor="reason">Request type</label>
            <select id="reason" name="reason" required>
              <option value="">Select one</option>
              <option value="general">General enquiry</option>
              <option value="support">Support</option>
              <option value="press">Press or editorial</option>
              <option value="other">Something else</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" required></textarea>
          </div>
          <button type="submit" className="form-submit">Send Message</button>
          {contactStatus && <div className="form-status">{contactStatus}</div>}
        </form>
      </div>
    </div>
  </section>

  </main>

  <footer className="footer">
    <div className="footer-top">
      <div>
        <div className="footer-brand">SICE</div>
        <p className="footer-tagline">SICE - The South Indian Creators Economy. A media platform for South Indian creators, built here and published in four languages.</p>
      </div>
      <div className="footer-col">
        <h4>Platform</h4>
        <ul>
          <li><a href="#what">About</a></li>
          <li><a href="#vision">Vision</a></li>
          <li><a href="#chapters">Chapters</a></li>
          <li><a href="#membership">Membership</a></li>
          <li><a href="#editorial">Editorial</a></li>
        </ul>
      </div>
      <div className="footer-col">
        <h4>Resources</h4>
        <ul>
          <li><a href="#gov-context">Creator Economy Bill</a></li>
          <li><a href="#developer">About ElevateX</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="/apply">Apply</a></li>
        </ul>
      </div>
      <div className="footer-col">
        <h4>Follow</h4>
        <ul>
          <li><a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a></li>
          <li><a href="https://twitter.com" target="_blank" rel="noopener">Twitter / X</a></li>
          <li><a href="https://linkedin.com" target="_blank" rel="noopener">LinkedIn</a></li>
          <li><a href="https://youtube.com" target="_blank" rel="noopener">YouTube</a></li>
        </ul>
      </div>
    </div>
    <div className="footer-bottom">
      <div>© 2026 SICE Media · All rights reserved</div>
      <div>Calicut · Kerala · India</div>
    </div>
    <div className="footer-credit">
      Built and operated by <a href="https://elevatexnow.com" target="_blank" rel="noopener">ElevateX Now</a> · Powering Digital Success
    </div>
  </footer>

  


    </>
  );
}
