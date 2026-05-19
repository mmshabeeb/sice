"use client";

import { FormEvent, useState, useRef } from "react";
import Link from "next/link";
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  type ConfirmationResult
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";

const countryCodes = [
  { label: "India +91", value: "+91" },
  { label: "United States +1", value: "+1" },
  { label: "United Kingdom +44", value: "+44" },
  { label: "UAE +971", value: "+971" },
  { label: "Saudi Arabia +966", value: "+966" },
  { label: "Singapore +65", value: "+65" },
];

export default function ApplicationForm() {
  // Verification states
  const [googleEmail, setGoogleEmail] = useState<string | null>(null);
  const [googleName, setGoogleName] = useState<string | null>(null);
  const [smsPhoneNumber, setSmsPhoneNumber] = useState<string | null>(null);
  const [smsCountryCode, setSmsCountryCode] = useState<string | null>(null);

  const [step, setStep] = useState<"verify" | "form">("verify");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [smsLoading, setSmsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form submission states
  const [fullName, setFullName] = useState("");
  const [socialError, setSocialError] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Check if Firebase is using mock key
  const isMockFirebase = 
    !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "mock-api-key-for-prerendering";

  const handleGoogleVerify = async () => {
    setGoogleLoading(true);
    setVerificationError(null);
    setSuccessMessage(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      if (result.user && result.user.email) {
        setGoogleEmail(result.user.email);
        const name = result.user.displayName || "";
        setGoogleName(name);
        setFullName(name);
        setSuccessMessage("Google account connected successfully!");
      } else {
        throw new Error("Could not retrieve email from Google login.");
      }
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message || "Google authentication failed.";
      if (err.code === "auth/unauthorized-domain") {
        errMsg = "Unauthorized Domain: Please authorize this domain (e.g. 'localhost') in your Firebase Console under Authentication -> Settings -> Authorized Domains.";
      }
      setVerificationError(errMsg);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!phoneInput || !/^[0-9]{7,15}$/.test(phoneInput)) {
      setVerificationError("Please enter a valid phone number (7 to 15 digits).");
      return;
    }
    setSmsLoading(true);
    setVerificationError(null);
    setSuccessMessage(null);
    const fullPhone = `${selectedCountryCode}${phoneInput}`;
    try {
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
          callback: () => {}
        });
      }
      const confirmation = await signInWithPhoneNumber(auth, fullPhone, recaptchaVerifierRef.current);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setSuccessMessage(`Verification code sent to ${fullPhone} successfully!`);
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message || "Failed to send OTP code. Please try again.";
      if (err.code === "auth/unauthorized-domain") {
        errMsg = "Unauthorized Domain: Please authorize this domain (e.g. 'localhost') in your Firebase Console under Authentication -> Settings -> Authorized Domains.";
      }
      setVerificationError(errMsg);
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    } finally {
      setSmsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setVerificationError("Please enter a valid 6-digit OTP code.");
      return;
    }
    setSmsLoading(true);
    setVerificationError(null);
    setSuccessMessage(null);
    const fullPhone = `${selectedCountryCode}${phoneInput}`;
    try {
      if (!confirmationResult) {
        throw new Error("No active verification session. Please request OTP again.");
      }
      const result = await confirmationResult.confirm(otpCode);
      if (result.user) {
        const verifiedE164 = result.user.phoneNumber || fullPhone;
        const matchedCountry = countryCodes.find((c) => verifiedE164.startsWith(c.value));
        if (matchedCountry) {
          setSmsCountryCode(matchedCountry.value);
          setSmsPhoneNumber(verifiedE164.substring(matchedCountry.value.length));
        } else {
          setSmsCountryCode(selectedCountryCode);
          setSmsPhoneNumber(verifiedE164.replace(selectedCountryCode, ""));
        }
        setSuccessMessage("Phone number verified successfully!");
      } else {
        throw new Error("SMS verification failed.");
      }
    } catch (err: any) {
      console.error(err);
      setVerificationError(err.message || "Incorrect verification code. Please try again.");
    } finally {
      setSmsLoading(false);
    }
  };

  const handleResetSms = () => {
    setOtpSent(false);
    setOtpCode("");
    setSmsPhoneNumber(null);
    setSmsCountryCode(null);
    setConfirmationResult(null);
    setVerificationError(null);
    setSuccessMessage(null);
    if (recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current.clear();
      recaptchaVerifierRef.current = null;
    }
  };

  const handleDemoBypass = () => {
    setGoogleEmail("demo.creator@sice.media");
    setGoogleName("Demo Creator");
    setFullName("Demo Creator");
    setSmsPhoneNumber("9876543210");
    setSmsCountryCode("+91");
    setSuccessMessage("Identity verified with offline demo credentials!");
    setVerificationError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const socialFields = ["facebookUrl", "instagramUrl", "youtubeUrl", "xUrl", "linkedinUrl"];
    const hasSocialUrl = socialFields.some((field) => String(formData.get(field) || "").trim());

    if (!hasSocialUrl) {
      setSocialError("Add at least one social media URL.");
      setStatus("");
      return;
    }

    setSocialError("");
    setSubmitting(true);
    setStatus("");

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.get("fullName"),
          contactCountryCode: formData.get("contactCountryCode"),
          contactNumber: formData.get("contactNumber"),
          whatsappCountryCode: formData.get("whatsappCountryCode"),
          whatsappNumber: formData.get("whatsappNumber"),
          email: formData.get("email"),
          facebookUrl: formData.get("facebookUrl"),
          instagramUrl: formData.get("instagramUrl"),
          youtubeUrl: formData.get("youtubeUrl"),
          xUrl: formData.get("xUrl"),
          linkedinUrl: formData.get("linkedinUrl"),
        }),
      });

      const json = await res.json();

      if (res.ok) {
        setSubmitted(true);
        setStatus("Application received. We will review it and be in touch via email.");
      } else {
        setStatus(json.error || "Something went wrong. Please try again or email apply@sice.media");
      }
    } catch {
      setStatus("Network error. Please try again or email apply@sice.media");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="form-success">
        <p>Application received. We will review it and be in touch via email.</p>
      </div>
    );
  }

  // Identity Verification Step
  if (step === "verify") {
    return (
      <div 
        className="form application-form" 
        style={{ 
          display: "block", 
          maxWidth: 600, 
          margin: "0 auto", 
          padding: 32, 
          borderRadius: 8,
          boxSizing: "border-box"
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--indigo)", marginBottom: 8, letterSpacing: "-0.02em" }}>
          Identity Verification
        </h2>
        <p style={{ fontSize: 13, color: "rgba(8, 13, 38, 0.6)", marginBottom: 24, lineHeight: 1.5 }}>
          Before proceeding with the membership application, please verify your identity using Google and SMS OTP.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Google Auth status */}
          <div style={{
            background: "rgba(8, 13, 38, 0.03)",
            border: "1px solid rgba(8, 13, 38, 0.08)",
            borderRadius: 6,
            padding: 20,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--indigo)" }}>
                1. Google Verification
              </span>
              {googleEmail ? (
                <span style={{ fontSize: 10, background: "rgba(34, 197, 94, 0.1)", color: "#16a34a", padding: "2px 8px", borderRadius: 100, fontWeight: 600 }}>
                  ✓ Connected
                </span>
              ) : (
                <span style={{ fontSize: 10, background: "rgba(8, 13, 38, 0.05)", color: "rgba(8, 13, 38, 0.6)", padding: "2px 8px", borderRadius: 100, fontWeight: 600 }}>
                  Required
                </span>
              )}
            </div>

            {googleEmail ? (
              <div style={{ fontSize: 14, color: "var(--indigo)", fontWeight: 500 }}>
                Verified Email: <strong style={{ color: "var(--indigo)" }}>{googleEmail}</strong>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: 12, color: "rgba(8, 13, 38, 0.55)", marginBottom: 14 }}>
                  Connect your Google account to verify your primary email address.
                </p>
                <button
                  type="button"
                  onClick={handleGoogleVerify}
                  disabled={googleLoading}
                  style={{
                    background: "white",
                    color: "#374151",
                    border: "1px solid #d1d5db",
                    borderRadius: 6,
                    padding: "10px 16px",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: googleLoading ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.background = "#f9fafb"; 
                    e.currentTarget.style.borderColor = "#c5c7c9";
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.background = "white"; 
                    e.currentTarget.style.borderColor = "#d1d5db";
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" style={{ display: "block" }}>
                    <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.91c1.7-1.56 2.69-3.86 2.69-6.6z"/>
                    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.2l-2.91-2.26c-.8.54-1.84.86-3.05.86-2.34 0-4.32-1.58-5.03-3.7H.95v2.32A9 9 0 0 0 9 18z"/>
                    <path fill="#FBBC05" d="M3.97 10.7a5.4 5.4 0 0 1 0-3.4V4.98H.95a9 9 0 0 0 0 8.04l3.02-2.32z"/>
                    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.1A9 9 0 0 0 .95 4.98l3.02 2.32C4.68 5.16 6.66 3.58 9 3.58z"/>
                  </svg>
                  <span>{googleLoading ? "Connecting..." : "Sign in with Google"}</span>
                </button>
              </div>
            )}
          </div>

          {/* SMS Verification status */}
          <div style={{
            background: "rgba(8, 13, 38, 0.03)",
            border: "1px solid rgba(8, 13, 38, 0.08)",
            borderRadius: 6,
            padding: 20,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--indigo)" }}>
                2. SMS OTP Verification
              </span>
              {smsPhoneNumber ? (
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 10, background: "rgba(34, 197, 94, 0.1)", color: "#16a34a", padding: "2px 8px", borderRadius: 100, fontWeight: 600 }}>
                    ✓ Verified
                  </span>
                  <button
                    type="button"
                    onClick={handleResetSms}
                    style={{ fontSize: 11, background: "transparent", border: "none", color: "rgba(8, 13, 38, 0.4)", textDecoration: "underline", cursor: "pointer" }}
                  >
                    Change
                  </button>
                </div>
              ) : (
                <span style={{ fontSize: 10, background: "rgba(8, 13, 38, 0.05)", color: "rgba(8, 13, 38, 0.6)", padding: "2px 8px", borderRadius: 100, fontWeight: 600 }}>
                  Required
                </span>
              )}
            </div>

            {smsPhoneNumber ? (
              <div style={{ fontSize: 14, color: "var(--indigo)", fontWeight: 500 }}>
                Verified Mobile: <strong style={{ color: "var(--indigo)" }}>{smsCountryCode} {smsPhoneNumber}</strong>
              </div>
            ) : (
              <div>
                {!otpSent ? (
                  <div>
                    <p style={{ fontSize: 12, color: "rgba(8, 13, 38, 0.55)", marginBottom: 14 }}>
                      Verify your mobile number to ensure secure and direct communication.
                    </p>
                    <div style={{ display: "flex", gap: 8, maxWidth: "100%" }}>
                      <select
                        value={selectedCountryCode}
                        onChange={(e) => setSelectedCountryCode(e.target.value)}
                        style={{
                          background: "white",
                          border: "1px solid rgba(8, 13, 38, 0.15)",
                          borderRadius: 4,
                          padding: "8px 12px",
                          fontSize: 13,
                          color: "var(--indigo)",
                          width: "35%",
                        }}
                      >
                        {countryCodes.map((country) => (
                          <option key={country.value} value={country.value}>{country.label}</option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value.replace(/[^0-9]/g, ""))}
                        placeholder="9876543210"
                        style={{
                          background: "white",
                          border: "1px solid rgba(8, 13, 38, 0.15)",
                          borderRadius: 4,
                          padding: "8px 12px",
                          fontSize: 13,
                          color: "var(--indigo)",
                          flex: 1,
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={smsLoading || !phoneInput}
                      style={{
                        background: "var(--indigo)",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        padding: "9px 16px",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: smsLoading || !phoneInput ? "not-allowed" : "pointer",
                        marginTop: 14,
                        transition: "opacity 0.2s",
                        opacity: !phoneInput ? 0.5 : 1,
                      }}
                      onMouseEnter={(e) => { if (phoneInput) e.currentTarget.style.opacity = "0.9"; }}
                      onMouseLeave={(e) => { if (phoneInput) e.currentTarget.style.opacity = "1"; }}
                    >
                      {smsLoading ? "Sending Code..." : "Send Verification Code"}
                    </button>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: 12, color: "rgba(8, 13, 38, 0.55)", marginBottom: 14 }}>
                      We sent a 6-digit OTP to <strong>{selectedCountryCode} {phoneInput}</strong>. Enter it below.
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                      <input
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                        placeholder="123456"
                        style={{
                          background: "white",
                          border: "1px solid rgba(8, 13, 38, 0.15)",
                          borderRadius: 4,
                          padding: "8px 12px",
                          fontSize: 14,
                          fontFamily: "monospace",
                          color: "var(--indigo)",
                          width: 120,
                          textAlign: "center",
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={smsLoading || otpCode.length !== 6}
                        style={{
                          background: "var(--gold-deep)",
                          color: "white",
                          border: "none",
                          borderRadius: 4,
                          padding: "8px 16px",
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: smsLoading || otpCode.length !== 6 ? "not-allowed" : "pointer",
                        }}
                      >
                        {smsLoading ? "Verifying..." : "Verify Code"}
                      </button>
                      <button
                        type="button"
                        onClick={handleResetSms}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "rgba(8, 13, 38, 0.5)",
                          fontSize: 12,
                          textDecoration: "underline",
                          cursor: "pointer",
                          padding: "4px 8px",
                        }}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {verificationError && (
          <div style={{
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.15)",
            borderRadius: 6,
            padding: "10px 14px",
            fontSize: 12.5,
            color: "#b91c1c",
            marginTop: 20,
          }}>
            ⚠️ {verificationError}
          </div>
        )}

        {successMessage && (
          <div style={{
            background: "rgba(34, 197, 94, 0.08)",
            border: "1px solid rgba(34, 197, 94, 0.15)",
            borderRadius: 6,
            padding: "10px 14px",
            fontSize: 12.5,
            color: "#15803d",
            marginTop: 20,
          }}>
            ✓ {successMessage}
          </div>
        )}

        {/* Recaptcha hidden container */}
        <div id="recaptcha-container"></div>

        <button
          type="button"
          onClick={() => setStep("form")}
          disabled={!googleEmail || !smsPhoneNumber}
          style={{
            background: googleEmail && smsPhoneNumber ? "var(--gold)" : "rgba(8, 13, 38, 0.06)",
            color: googleEmail && smsPhoneNumber ? "var(--indigo)" : "rgba(8, 13, 38, 0.35)",
            border: "none",
            borderRadius: 4,
            padding: "12px 24px",
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            cursor: googleEmail && smsPhoneNumber ? "pointer" : "not-allowed",
            transition: "all 0.3s",
            width: "100%",
            marginTop: 28,
            boxShadow: googleEmail && smsPhoneNumber ? "0 8px 16px rgba(200, 169, 104, 0.2)" : "none",
          }}
        >
          Proceed to Application Form
        </button>

        {/* Offline Demo Bypass option */}
        {isMockFirebase && (
          <div style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: "1px dashed rgba(8, 13, 38, 0.12)",
            textAlign: "center",
          }}>
            <button
              type="button"
              onClick={handleDemoBypass}
              style={{
                background: "rgba(200, 169, 104, 0.08)",
                border: "1px dashed var(--gold-deep)",
                color: "var(--gold-deep)",
                borderRadius: 6,
                padding: "8px 16px",
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                cursor: "pointer",
                transition: "all 0.2s",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(200, 169, 104, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(200, 169, 104, 0.08)";
              }}
            >
              ⚡ Bypass Verification (Offline Demo Mode)
            </button>
          </div>
        )}
      </div>
    );
  }

  // Application Form Step
  return (
    <form className="form application-form" onSubmit={handleSubmit}>
      <div className="form-field full">
        <label htmlFor="application-full-name">Full name</label>
        <input 
          type="text" 
          id="application-full-name" 
          name="fullName" 
          autoComplete="name" 
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required 
        />
      </div>

      <div className="form-field phone-field">
        <label htmlFor="application-contact-number">Contact number</label>
        <div className="phone-row">
          <div style={{ position: "relative" }}>
            <select 
              disabled 
              value={smsCountryCode || "+91"} 
              aria-label="Contact country code"
              style={{
                background: "rgba(8, 13, 38, 0.04)",
                color: "rgba(8, 13, 38, 0.5)",
                cursor: "not-allowed",
                borderBottomColor: "rgba(8, 13, 38, 0.08)",
              }}
            >
              {countryCodes.map((country) => (
                <option key={country.value} value={country.value}>{country.label}</option>
              ))}
            </select>
            <input type="hidden" name="contactCountryCode" value={smsCountryCode || "+91"} />
          </div>
          <div style={{ position: "relative", display: "flex", alignItems: "center", flex: 1 }}>
            <input
              type="tel"
              id="application-contact-number"
              name="contactNumber"
              value={smsPhoneNumber || ""}
              readOnly
              required
              style={{
                background: "rgba(8, 13, 38, 0.04)",
                color: "rgba(8, 13, 38, 0.5)",
                cursor: "not-allowed",
                borderBottomColor: "rgba(8, 13, 38, 0.08)",
                paddingRight: 100,
              }}
            />
            <span style={{
              position: "absolute",
              right: 12,
              fontSize: 10,
              background: "rgba(34, 197, 94, 0.1)",
              color: "#16a34a",
              padding: "2px 8px",
              borderRadius: 100,
              fontWeight: 600,
              pointerEvents: "none"
            }}>
              🔒 Verified
            </span>
          </div>
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

      <div className="form-field full" style={{ position: "relative" }}>
        <label htmlFor="application-email">Mail ID</label>
        <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
          <input 
            type="email" 
            id="application-email" 
            name="email" 
            autoComplete="email" 
            value={googleEmail || ""}
            readOnly
            required 
            style={{
              background: "rgba(8, 13, 38, 0.04)",
              color: "rgba(8, 13, 38, 0.5)",
              cursor: "not-allowed",
              borderBottomColor: "rgba(8, 13, 38, 0.08)",
              paddingRight: 100,
            }}
          />
          <span style={{
            position: "absolute",
            right: 12,
            fontSize: 10,
            background: "rgba(34, 197, 94, 0.1)",
            color: "#16a34a",
            padding: "2px 8px",
            borderRadius: 100,
            fontWeight: 600,
            pointerEvents: "none"
          }}>
            🔒 Verified
          </span>
        </div>
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

      <button type="submit" className="form-submit" disabled={submitting}>
        {submitting ? "Submitting…" : "Submit Application"}
      </button>
      {status && <div className="form-status">{status}</div>}
    </form>
  );
}
