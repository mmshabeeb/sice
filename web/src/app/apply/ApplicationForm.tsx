"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

const countryCodes = [
  { label: "India +91", value: "+91" },
  { label: "United States +1", value: "+1" },
  { label: "United Kingdom +44", value: "+44" },
  { label: "UAE +971", value: "+971" },
  { label: "Saudi Arabia +966", value: "+966" },
  { label: "Singapore +65", value: "+65" },
];

export default function ApplicationForm() {
  const [socialError, setSocialError] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const socialFields = [
      "facebookUrl",
      "instagramUrl",
      "youtubeUrl",
      "xUrl",
      "linkedinUrl",
    ];
    const hasSocialUrl = socialFields.some((field) =>
      String(formData.get(field) || "").trim()
    );

    if (!hasSocialUrl) {
      setSocialError("Add at least one social media URL.");
      setStatus("");
      return;
    }

    setSocialError("");
    setStatus("Application form design complete. Backend connection will be added next.");
  };

  return (
    <form className="form application-form" onSubmit={handleSubmit}>
      <div className="form-field full">
        <label htmlFor="application-full-name">Full name</label>
        <input type="text" id="application-full-name" name="fullName" autoComplete="name" required />
      </div>
      <div className="form-field phone-field">
        <label htmlFor="application-contact-number">Contact number</label>
        <div className="phone-row">
          <select name="contactCountryCode" aria-label="Contact country code" defaultValue="+91" required>
            {countryCodes.map((country) => (
              <option key={country.value} value={country.value}>{country.label}</option>
            ))}
          </select>
          <input
            type="tel"
            id="application-contact-number"
            name="contactNumber"
            inputMode="numeric"
            pattern="[0-9]{7,15}"
            placeholder="9876543210"
            autoComplete="tel-national"
            required
          />
        </div>
      </div>
      <div className="form-field phone-field">
        <label htmlFor="application-whatsapp-number">WhatsApp number</label>
        <div className="phone-row">
          <select name="whatsappCountryCode" aria-label="WhatsApp country code" defaultValue="+91" required>
            {countryCodes.map((country) => (
              <option key={country.value} value={country.value}>{country.label}</option>
            ))}
          </select>
          <input
            type="tel"
            id="application-whatsapp-number"
            name="whatsappNumber"
            inputMode="numeric"
            pattern="[0-9]{7,15}"
            placeholder="9876543210"
            autoComplete="tel-national"
            required
          />
        </div>
      </div>
      <div className="form-field full">
        <label htmlFor="application-email">Mail ID</label>
        <input type="email" id="application-email" name="email" autoComplete="email" required />
      </div>
      <fieldset className="social-fieldset full">
        <legend>Social media handles</legend>
        <p>Submit at least one profile URL.</p>
        <div className="social-grid">
          <div className="form-field">
            <label htmlFor="facebook-url">Facebook</label>
            <input type="url" id="facebook-url" name="facebookUrl" placeholder="https://facebook.com/username" />
          </div>
          <div className="form-field">
            <label htmlFor="instagram-url">Instagram</label>
            <input type="url" id="instagram-url" name="instagramUrl" placeholder="https://instagram.com/username" />
          </div>
          <div className="form-field">
            <label htmlFor="youtube-url">YouTube</label>
            <input type="url" id="youtube-url" name="youtubeUrl" placeholder="https://youtube.com/@channel" />
          </div>
          <div className="form-field">
            <label htmlFor="x-url">X.com</label>
            <input type="url" id="x-url" name="xUrl" placeholder="https://x.com/username" />
          </div>
          <div className="form-field">
            <label htmlFor="linkedin-url">LinkedIn</label>
            <input type="url" id="linkedin-url" name="linkedinUrl" placeholder="https://linkedin.com/in/username" />
          </div>
        </div>
        {socialError && <div className="form-error">{socialError}</div>}
      </fieldset>
      <div className="checkbox-group full">
        <label>
          <input type="checkbox" name="termsAccepted" required />
          <span>I accept the <Link href="/">terms and conditions</Link>.</span>
        </label>
        <label>
          <input type="checkbox" name="newsletterSubscription" required />
          <span>I agree to receive emails and newsletters from SICE.</span>
        </label>
      </div>
      <button type="submit" className="form-submit">Submit Application</button>
      {status && <div className="form-status">{status}</div>}
    </form>
  );
}
