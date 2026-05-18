const particles = [
  { top: "15%", left: "12%", delay: "0s" },
  { top: "25%", left: "78%", delay: "1.2s" },
  { top: "60%", left: "18%", delay: "2.4s" },
  { top: "70%", left: "84%", delay: "3.6s" },
  { top: "35%", left: "50%", delay: "1.8s" },
  { top: "80%", left: "42%", delay: "4.2s" },
  { top: "20%", left: "32%", delay: "5s" },
  { top: "50%", left: "70%", delay: "2.8s" },
  { top: "45%", left: "8%", delay: "6s" },
  { top: "12%", left: "62%", delay: "0.6s" },
];

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero-bg-image"></div>
      <div className="hero-atmosphere"></div>
      <div className="hero-orb hero-orb-1"></div>
      <div className="hero-orb hero-orb-2"></div>
      <div className="hero-orb hero-orb-3"></div>

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

      <div className="hero-particles">
        {particles.map((p, i) => (
          <div
            key={i}
            className="particle"
            style={{ top: p.top, left: p.left, animationDelay: p.delay }}
          />
        ))}
      </div>

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

      <div className="scroll-indicator">
        <span>Scroll</span>
        <div className="scroll-indicator-line"></div>
      </div>
    </header>
  );
}
