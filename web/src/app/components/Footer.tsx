const platform = [
  { label: "About", href: "#what" },
  { label: "Vision", href: "#vision" },
  { label: "Chapters", href: "#chapters" },
  { label: "Membership", href: "#membership" },
  { label: "Editorial", href: "#editorial" },
];

const resources = [
  { label: "Creator Economy Bill", href: "#gov-context" },
  { label: "About ElevateX", href: "#developer" },
  { label: "Contact", href: "#contact" },
  { label: "Apply", href: "/apply" },
];

const social = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Twitter / X", href: "https://twitter.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "YouTube", href: "https://youtube.com" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <div className="footer-brand">SICE</div>
          <p className="footer-tagline">SICE - The South Indian Creators Economy. A media platform for South Indian creators, built here and published in four languages.</p>
        </div>
        <div className="footer-col">
          <h4>Platform</h4>
          <ul>{platform.map(({ label, href }) => <li key={label}><a href={href}>{label}</a></li>)}</ul>
        </div>
        <div className="footer-col">
          <h4>Resources</h4>
          <ul>{resources.map(({ label, href }) => <li key={label}><a href={href}>{label}</a></li>)}</ul>
        </div>
        <div className="footer-col">
          <h4>Follow</h4>
          <ul>{social.map(({ label, href }) => <li key={label}><a href={href} target="_blank" rel="noopener">{label}</a></li>)}</ul>
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
  );
}
