"use client";

import { FormEvent, useState } from "react";
import { apiFetch } from "@/utils/api";

export default function ContactSection() {
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");

    const formData = new FormData(event.currentTarget);

    try {
      const res = await apiFetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          reason: formData.get("reason"),
          message: formData.get("message"),
        }),
      });

      const json = await res.json();

      if (res.ok) {
        setSubmitted(true);
        setStatus("Message received. We will be in touch.");
      } else {
        setStatus(json.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("Network error. Please email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="contact reveal" id="contact">
      <div className="container">
        <div className="section-eyebrow">11 · Contact</div>
        <h2>Reach out. <em>General enquiry and support.</em></h2>
        <p className="lede">Use this form for general enquiries and support requests. Membership applications should use the separate application page.</p>
        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-block">
              <div className="contact-label">For creators</div>
              <div className="contact-value"><a href="mailto:apply@thesice.com">apply@thesice.com</a></div>
            </div>
            <div className="contact-block">
              <div className="contact-label">For brands</div>
              <div className="contact-value"><a href="mailto:partners@thesice.com">partners@thesice.com</a></div>
            </div>
            <div className="contact-block">
              <div className="contact-label">Press &amp; editorial</div>
              <div className="contact-value"><a href="mailto:editorial@thesice.com">editorial@thesice.com</a></div>
            </div>
            <div className="contact-block">
              <div className="contact-label">Headquarters</div>
              <div className="contact-value">HiLite Business Park<br />Calicut, Kerala — 673014</div>
            </div>
            <div className="contact-block">
              <div className="contact-label">Operated by</div>
              <div className="contact-value"><a href="https://elevatexnow.com" target="_blank" rel="noopener">ElevateX Now →</a></div>
            </div>
          </div>
          {submitted ? (
            <div className="form-success">
              <p>Message received. We will be in touch.</p>
            </div>
          ) : (
            <form className="form" onSubmit={handleSubmit}>
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
              <button type="submit" className="form-submit" disabled={submitting}>
                {submitting ? "Sending…" : "Send Message"}
              </button>
              {status && <div className="form-status">{status}</div>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
