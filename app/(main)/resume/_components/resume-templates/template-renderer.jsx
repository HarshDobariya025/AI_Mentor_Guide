"use client";

import React from "react";
import { Mail, Phone, Linkedin, Globe, MapPin, ExternalLink, Award, GraduationCap, Briefcase, Code } from "lucide-react";

export default function TemplateRenderer({
  resumeData,
  template = "modern", // "modern" | "classic" | "compact" | "sidebar" | "silicon" | "harvard"
  accentColor = "#0f172a", // hex
  fontSize = "normal", // "normal" | "compact"
  id = "resume-export-sheet",
}) {
  const {
    name = "Candidate Name",
    contact = {},
    summary = "",
    skills = [],
    experience = [],
    education = [],
    projects = [],
    customSections = [],
    rawContent = "",
  } = resumeData || {};

  const isCompact = fontSize === "compact";
  const baseFontSize = isCompact ? "11px" : "12.5px";
  const headingSize = isCompact ? "20px" : "24px";
  const sectionTitleSize = isCompact ? "12.5px" : "14.5px";
  const lineHeight = isCompact ? "1.38" : "1.5";

  // Build contact items array
  const contactItems = [];
  if (contact.email) contactItems.push({ icon: Mail, label: contact.email, type: "email" });
  if (contact.mobile) contactItems.push({ icon: Phone, label: contact.mobile, type: "phone" });
  if (contact.linkedin) contactItems.push({ icon: Linkedin, label: contact.linkedin.replace(/^https?:\/\/(www\.)?/, ""), type: "linkedin" });
  if (contact.twitter) contactItems.push({ icon: Globe, label: contact.twitter.replace(/^https?:\/\/(www\.)?/, ""), type: "twitter" });

  const hasStructuredData =
    Boolean(summary) ||
    skills.length > 0 ||
    experience.length > 0 ||
    education.length > 0 ||
    projects.length > 0 ||
    customSections.length > 0;

  // Fallback view if nothing was structured
  const renderFallbackContent = () => (
    <div style={{ marginTop: "16px", whiteSpace: "pre-wrap", color: "#334155", lineHeight: "1.6" }}>
      {rawContent}
    </div>
  );

  // -------------------------------------------------------------
  // TEMPLATE 1: MODERN TECH
  // -------------------------------------------------------------
  if (template === "modern") {
    return (
      <div
        id={id}
        style={{
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: baseFontSize,
          lineHeight,
          color: "#1e293b",
          backgroundColor: "#ffffff",
          padding: isCompact ? "24px 28px" : "32px 36px",
          maxWidth: "800px",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <header style={{ borderBottom: `2.5px solid ${accentColor}`, paddingBottom: "12px", marginBottom: "14px" }}>
          <h1
            style={{
              fontSize: headingSize,
              fontWeight: "800",
              color: accentColor,
              margin: "0 0 6px 0",
              letterSpacing: "-0.02em",
              textTransform: "capitalize",
            }}
          >
            {name}
          </h1>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "11px", color: "#475569" }}>
            {contactItems.map((item, idx) => (
              <span key={idx} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <item.icon size={12} style={{ color: accentColor }} />
                <span>{item.label}</span>
              </span>
            ))}
          </div>
        </header>

        {!hasStructuredData && renderFallbackContent()}

        {/* Professional Summary */}
        {summary && (
          <section style={{ marginBottom: "14px", pageBreakInside: "avoid" }}>
            <h2
              style={{
                fontSize: sectionTitleSize,
                fontWeight: "700",
                color: accentColor,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: "0 0 5px 0",
              }}
            >
              Professional Summary
            </h2>
            <p style={{ margin: "0", color: "#334155", textAlign: "justify", lineHeight: "1.5" }}>{summary}</p>
          </section>
        )}

        {/* Technical Skills */}
        {skills?.length > 0 && (
          <section style={{ marginBottom: "14px", pageBreakInside: "avoid" }}>
            <h2
              style={{
                fontSize: sectionTitleSize,
                fontWeight: "700",
                color: accentColor,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: "0 0 7px 0",
              }}
            >
              Skills & Expertise
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {skills.map((skill, idx) => {
                const parts = skill.includes(" – ")
                  ? skill.split(" – ")
                  : skill.includes(": ")
                  ? skill.split(": ")
                  : null;

                if (parts) {
                  return (
                    <div key={idx} style={{ fontSize: "11.5px", color: "#334155", lineHeight: "1.4" }}>
                      <strong style={{ color: "#0f172a" }}>{parts[0]}: </strong>
                      <span>{parts.slice(1).join(" – ")}</span>
                    </div>
                  );
                }

                return (
                  <div key={idx} style={{ fontSize: "11.5px", color: "#334155", lineHeight: "1.4" }}>
                    • {skill}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Work Experience */}
        {experience?.length > 0 && (
          <section style={{ marginBottom: "14px" }}>
            <h2
              style={{
                fontSize: sectionTitleSize,
                fontWeight: "700",
                color: accentColor,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: "0 0 8px 0",
              }}
            >
              Work Experience
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {experience.map((item, idx) => (
                <div key={idx} style={{ pageBreakInside: "avoid" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <strong style={{ fontSize: "13px", color: "#0f172a" }}>{item.title}</strong>
                      {item.organization && (
                        <span style={{ color: "#475569", fontWeight: "600" }}> • {item.organization}</span>
                      )}
                    </div>
                    {item.dateRange && (
                      <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>{item.dateRange}</span>
                    )}
                  </div>
                  {item.bullets?.length > 0 ? (
                    <ul style={{ margin: "3px 0 0 0", paddingLeft: "16px", color: "#334155" }}>
                      {item.bullets.map((b, bIdx) => (
                        <li key={bIdx} style={{ marginBottom: "2px", lineHeight: "1.4" }}>{b}</li>
                      ))}
                    </ul>
                  ) : item.rawText ? (
                    <p style={{ margin: "3px 0 0 0", color: "#334155", whiteSpace: "pre-wrap" }}>{item.rawText}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Key Projects */}
        {projects?.length > 0 && (
          <section style={{ marginBottom: "14px" }}>
            <h2
              style={{
                fontSize: sectionTitleSize,
                fontWeight: "700",
                color: accentColor,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: "0 0 8px 0",
              }}
            >
              Key Projects
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {projects.map((proj, idx) => (
                <div key={idx} style={{ pageBreakInside: "avoid" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <strong style={{ fontSize: "13px", color: "#0f172a" }}>{proj.title}</strong>
                      {proj.organization && (
                        <span style={{ color: "#64748b", fontSize: "11.5px" }}> ({proj.organization})</span>
                      )}
                    </div>
                    {proj.dateRange && (
                      <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "500" }}>{proj.dateRange}</span>
                    )}
                  </div>
                  {proj.bullets?.length > 0 ? (
                    <ul style={{ margin: "3px 0 0 0", paddingLeft: "16px", color: "#334155" }}>
                      {proj.bullets.map((b, bIdx) => (
                        <li key={bIdx} style={{ marginBottom: "2px", lineHeight: "1.4" }}>{b}</li>
                      ))}
                    </ul>
                  ) : proj.rawText ? (
                    <p style={{ margin: "3px 0 0 0", color: "#334155", whiteSpace: "pre-wrap" }}>{proj.rawText}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <section style={{ marginBottom: "14px", pageBreakInside: "avoid" }}>
            <h2
              style={{
                fontSize: sectionTitleSize,
                fontWeight: "700",
                color: accentColor,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: "0 0 7px 0",
              }}
            >
              Education
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              {education.map((edu, idx) => (
                <div key={idx} style={{ pageBreakInside: "avoid" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <strong style={{ fontSize: "12.5px", color: "#0f172a" }}>{edu.title}</strong>
                      {edu.organization && <span style={{ color: "#475569" }}> — {edu.organization}</span>}
                    </div>
                    {edu.dateRange && (
                      <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "500" }}>{edu.dateRange}</span>
                    )}
                  </div>
                  {edu.bullets?.length > 0 && (
                    <ul style={{ margin: "2px 0 0 0", paddingLeft: "16px", color: "#334155" }}>
                      {edu.bullets.map((b, bIdx) => (
                        <li key={bIdx} style={{ fontSize: "11px" }}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Custom Sections (Achievements, Certifications, etc.) */}
        {customSections?.map((cSec, idx) => (
          <section key={idx} style={{ marginBottom: "14px", pageBreakInside: "avoid" }}>
            <h2
              style={{
                fontSize: sectionTitleSize,
                fontWeight: "700",
                color: accentColor,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: "0 0 7px 0",
              }}
            >
              {cSec.title}
            </h2>
            {cSec.entries?.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                {cSec.entries.map((item, eIdx) => (
                  <div key={eIdx}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div>
                        <strong style={{ fontSize: "12.5px", color: "#0f172a" }}>{item.title}</strong>
                        {item.organization && <span style={{ color: "#475569" }}> — {item.organization}</span>}
                      </div>
                      {item.dateRange && (
                        <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "500" }}>{item.dateRange}</span>
                      )}
                    </div>
                    {item.bullets?.length > 0 ? (
                      <ul style={{ margin: "2px 0 0 0", paddingLeft: "16px", color: "#334155" }}>
                        {item.bullets.map((b, bIdx) => (
                          <li key={bIdx} style={{ fontSize: "11px" }}>{b}</li>
                        ))}
                      </ul>
                    ) : item.rawText ? (
                      <p style={{ margin: "2px 0 0 0", color: "#334155", fontSize: "11px" }}>{item.rawText}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: "#334155", whiteSpace: "pre-wrap", fontSize: "11.5px" }}>{cSec.content}</div>
            )}
          </section>
        ))}
      </div>
    );
  }

  // -------------------------------------------------------------
  // TEMPLATE 2: EXECUTIVE CLASSIC (Ivy League Serif Style)
  // -------------------------------------------------------------
  if (template === "classic") {
    return (
      <div
        id={id}
        style={{
          fontFamily: "Georgia, Cambria, 'Times New Roman', Times, serif",
          fontSize: baseFontSize,
          lineHeight,
          color: "#111827",
          backgroundColor: "#ffffff",
          padding: isCompact ? "24px 30px" : "32px 38px",
          maxWidth: "800px",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* Header (Centered) */}
        <header style={{ textAlign: "center", marginBottom: "14px", borderBottom: `2px solid ${accentColor}`, paddingBottom: "10px" }}>
          <h1
            style={{
              fontSize: headingSize,
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: accentColor,
              margin: "0 0 5px 0",
            }}
          >
            {name}
          </h1>

          <div style={{ fontSize: "11px", color: "#374151", letterSpacing: "0.02em" }}>
            {contactItems.map((item, idx) => (
              <span key={idx}>
                {item.label}
                {idx < contactItems.length - 1 && <span style={{ margin: "0 7px", color: "#9ca3af" }}>•</span>}
              </span>
            ))}
          </div>
        </header>

        {!hasStructuredData && renderFallbackContent()}

        {/* Summary */}
        {summary && (
          <section style={{ marginBottom: "12px", pageBreakInside: "avoid" }}>
            <h2
              style={{
                fontSize: sectionTitleSize,
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderBottom: "1px solid #1f2937",
                paddingBottom: "2px",
                margin: "0 0 5px 0",
                color: accentColor,
              }}
            >
              Summary
            </h2>
            <p style={{ margin: "0", color: "#1f2937", textAlign: "justify" }}>{summary}</p>
          </section>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <section style={{ marginBottom: "12px", pageBreakInside: "avoid" }}>
            <h2
              style={{
                fontSize: sectionTitleSize,
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderBottom: "1px solid #1f2937",
                paddingBottom: "2px",
                margin: "0 0 5px 0",
                color: accentColor,
              }}
            >
              Skills & Qualifications
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {skills.map((skill, idx) => {
                const parts = skill.includes(" – ")
                  ? skill.split(" – ")
                  : skill.includes(": ")
                  ? skill.split(": ")
                  : null;

                if (parts) {
                  return (
                    <div key={idx} style={{ fontSize: "11.5px", color: "#1f2937", lineHeight: "1.4" }}>
                      <strong>{parts[0]}: </strong>
                      <span>{parts.slice(1).join(" – ")}</span>
                    </div>
                  );
                }

                return (
                  <div key={idx} style={{ fontSize: "11.5px", color: "#1f2937", lineHeight: "1.4" }}>
                    • {skill}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <section style={{ marginBottom: "12px" }}>
            <h2
              style={{
                fontSize: sectionTitleSize,
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderBottom: "1px solid #1f2937",
                paddingBottom: "2px",
                margin: "0 0 6px 0",
                color: accentColor,
              }}
            >
              Professional Experience
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
              {experience.map((item, idx) => (
                <div key={idx} style={{ pageBreakInside: "avoid" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <strong style={{ fontSize: "12.5px" }}>{item.organization || item.title}</strong>
                      {item.organization && (
                        <span style={{ fontStyle: "italic", color: "#4b5563" }}> — {item.title}</span>
                      )}
                    </div>
                    {item.dateRange && (
                      <span style={{ fontSize: "11px", fontStyle: "italic", color: "#4b5563" }}>{item.dateRange}</span>
                    )}
                  </div>
                  {item.bullets?.length > 0 ? (
                    <ul style={{ margin: "3px 0 0 0", paddingLeft: "16px", color: "#1f2937" }}>
                      {item.bullets.map((b, bIdx) => (
                        <li key={bIdx} style={{ marginBottom: "2px", lineHeight: "1.35" }}>{b}</li>
                      ))}
                    </ul>
                  ) : item.rawText ? (
                    <p style={{ margin: "3px 0 0 0", color: "#1f2937", whiteSpace: "pre-wrap" }}>{item.rawText}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <section style={{ marginBottom: "12px" }}>
            <h2
              style={{
                fontSize: sectionTitleSize,
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderBottom: "1px solid #1f2937",
                paddingBottom: "2px",
                margin: "0 0 6px 0",
                color: accentColor,
              }}
            >
              Selected Projects
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {projects.map((proj, idx) => (
                <div key={idx} style={{ pageBreakInside: "avoid" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <strong style={{ fontSize: "12.5px" }}>{proj.title}</strong>
                    {proj.dateRange && (
                      <span style={{ fontSize: "11px", fontStyle: "italic", color: "#4b5563" }}>{proj.dateRange}</span>
                    )}
                  </div>
                  {proj.bullets?.length > 0 ? (
                    <ul style={{ margin: "3px 0 0 0", paddingLeft: "16px", color: "#1f2937" }}>
                      {proj.bullets.map((b, bIdx) => (
                        <li key={bIdx} style={{ marginBottom: "2px", lineHeight: "1.35" }}>{b}</li>
                      ))}
                    </ul>
                  ) : proj.rawText ? (
                    <p style={{ margin: "3px 0 0 0", color: "#1f2937", whiteSpace: "pre-wrap" }}>{proj.rawText}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <section style={{ marginBottom: "12px", pageBreakInside: "avoid" }}>
            <h2
              style={{
                fontSize: sectionTitleSize,
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderBottom: "1px solid #1f2937",
                paddingBottom: "2px",
                margin: "0 0 5px 0",
                color: accentColor,
              }}
            >
              Education
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {education.map((edu, idx) => (
                <div key={idx} style={{ pageBreakInside: "avoid" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <strong style={{ fontSize: "12px" }}>{edu.title}</strong>
                      {edu.organization && <span style={{ fontStyle: "italic" }}> — {edu.organization}</span>}
                    </div>
                    {edu.dateRange && (
                      <span style={{ fontSize: "11px", fontStyle: "italic", color: "#4b5563" }}>{edu.dateRange}</span>
                    )}
                  </div>
                  {edu.bullets?.length > 0 && (
                    <ul style={{ margin: "2px 0 0 0", paddingLeft: "16px", color: "#1f2937" }}>
                      {edu.bullets.map((b, bIdx) => (
                        <li key={bIdx} style={{ fontSize: "11px" }}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Custom Sections */}
        {customSections?.map((cSec, idx) => (
          <section key={idx} style={{ marginBottom: "12px", pageBreakInside: "avoid" }}>
            <h2
              style={{
                fontSize: sectionTitleSize,
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderBottom: "1px solid #1f2937",
                paddingBottom: "2px",
                margin: "0 0 5px 0",
                color: accentColor,
              }}
            >
              {cSec.title}
            </h2>
            {cSec.entries?.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {cSec.entries.map((item, eIdx) => (
                  <div key={eIdx}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div>
                        <strong>{item.title}</strong>
                        {item.organization && <span style={{ fontStyle: "italic", color: "#4b5563" }}> — {item.organization}</span>}
                      </div>
                      {item.dateRange && (
                        <span style={{ fontSize: "11px", fontStyle: "italic", color: "#4b5563" }}>{item.dateRange}</span>
                      )}
                    </div>
                    {item.bullets?.length > 0 ? (
                      <ul style={{ margin: "2px 0 0 0", paddingLeft: "16px", color: "#1f2937" }}>
                        {item.bullets.map((b, bIdx) => (
                          <li key={bIdx} style={{ fontSize: "11px" }}>{b}</li>
                        ))}
                      </ul>
                    ) : item.rawText ? (
                      <p style={{ margin: "2px 0 0 0", color: "#1f2937", fontSize: "11px" }}>{item.rawText}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: "#1f2937", whiteSpace: "pre-wrap", fontSize: "11px" }}>{cSec.content}</div>
            )}
          </section>
        ))}
      </div>
    );
  }

  // -------------------------------------------------------------
  // TEMPLATE 3: MINIMALIST COMPACT (Max Space Optimization)
  // -------------------------------------------------------------
  if (template === "compact") {
    return (
      <div
        id={id}
        style={{
          fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          fontSize: "11px",
          lineHeight: "1.35",
          color: "#0f172a",
          backgroundColor: "#ffffff",
          padding: "20px 24px",
          maxWidth: "800px",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `2px solid ${accentColor}`, paddingBottom: "7px", marginBottom: "8px" }}>
          <div>
            <h1 style={{ fontSize: "19px", fontWeight: "800", color: accentColor, margin: "0", letterSpacing: "-0.02em" }}>
              {name}
            </h1>
          </div>
          <div style={{ textAlign: "right", fontSize: "10px", color: "#475569" }}>
            <div>{contact.email} {contact.mobile && `• ${contact.mobile}`}</div>
            {contact.linkedin && <div>{contact.linkedin}</div>}
          </div>
        </header>

        {!hasStructuredData && renderFallbackContent()}

        {/* Summary */}
        {summary && (
          <section style={{ marginBottom: "8px", pageBreakInside: "avoid" }}>
            <p style={{ margin: "0", color: "#334155", textAlign: "justify", fontSize: "10.5px" }}>{summary}</p>
          </section>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <section style={{ marginBottom: "8px", pageBreakInside: "avoid" }}>
            <div style={{ borderBottom: "1px solid #cbd5e1", paddingBottom: "1px", marginBottom: "4px" }}>
              <span style={{ fontWeight: "800", textTransform: "uppercase", fontSize: "10.5px", color: accentColor, letterSpacing: "0.05em" }}>
                SKILLS
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {skills.map((skill, idx) => {
                const parts = skill.includes(" – ")
                  ? skill.split(" – ")
                  : skill.includes(": ")
                  ? skill.split(": ")
                  : null;

                if (parts) {
                  return (
                    <div key={idx} style={{ fontSize: "10.5px", color: "#1e293b" }}>
                      <strong>{parts[0]}: </strong>
                      <span>{parts.slice(1).join(" – ")}</span>
                    </div>
                  );
                }

                return (
                  <div key={idx} style={{ fontSize: "10.5px", color: "#1e293b" }}>
                    • {skill}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Work Experience */}
        {experience?.length > 0 && (
          <section style={{ marginBottom: "8px" }}>
            <div style={{ borderBottom: `1px solid #cbd5e1`, paddingBottom: "1px", marginBottom: "4px" }}>
              <span style={{ fontWeight: "800", textTransform: "uppercase", fontSize: "10.5px", color: accentColor, letterSpacing: "0.05em" }}>
                EXPERIENCE
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {experience.map((item, idx) => (
                <div key={idx} style={{ pageBreakInside: "avoid" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span>
                      <strong style={{ fontSize: "11px" }}>{item.title}</strong>
                      {item.organization && <span style={{ color: "#475569" }}> | {item.organization}</span>}
                    </span>
                    {item.dateRange && (
                      <span style={{ fontSize: "9.5px", color: "#64748b", fontWeight: "600" }}>{item.dateRange}</span>
                    )}
                  </div>
                  {item.bullets?.length > 0 ? (
                    <ul style={{ margin: "2px 0 0 0", paddingLeft: "14px", color: "#334155" }}>
                      {item.bullets.map((b, bIdx) => (
                        <li key={bIdx} style={{ marginBottom: "1px", fontSize: "10.5px" }}>{b}</li>
                      ))}
                    </ul>
                  ) : item.rawText ? (
                    <p style={{ margin: "2px 0 0 0", color: "#334155", fontSize: "10.5px" }}>{item.rawText}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <section style={{ marginBottom: "8px" }}>
            <div style={{ borderBottom: `1px solid #cbd5e1`, paddingBottom: "1px", marginBottom: "4px" }}>
              <span style={{ fontWeight: "800", textTransform: "uppercase", fontSize: "10.5px", color: accentColor, letterSpacing: "0.05em" }}>
                PROJECTS
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {projects.map((proj, idx) => (
                <div key={idx} style={{ pageBreakInside: "avoid" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <strong style={{ fontSize: "11px" }}>{proj.title}</strong>
                    {proj.dateRange && <span style={{ fontSize: "9.5px", color: "#64748b" }}>{proj.dateRange}</span>}
                  </div>
                  {proj.bullets?.length > 0 ? (
                    <ul style={{ margin: "2px 0 0 0", paddingLeft: "14px", color: "#334155" }}>
                      {proj.bullets.map((b, bIdx) => (
                        <li key={bIdx} style={{ fontSize: "10.5px" }}>{b}</li>
                      ))}
                    </ul>
                  ) : proj.rawText ? (
                    <p style={{ margin: "2px 0 0 0", color: "#334155", fontSize: "10.5px" }}>{proj.rawText}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <section style={{ marginBottom: "8px", pageBreakInside: "avoid" }}>
            <div style={{ borderBottom: `1px solid #cbd5e1`, paddingBottom: "1px", marginBottom: "4px" }}>
              <span style={{ fontWeight: "800", textTransform: "uppercase", fontSize: "10.5px", color: accentColor, letterSpacing: "0.05em" }}>
                EDUCATION
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {education.map((edu, idx) => (
                <div key={idx} style={{ pageBreakInside: "avoid" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span>
                      <strong style={{ fontSize: "10.5px" }}>{edu.title}</strong>
                      {edu.organization && <span style={{ color: "#475569" }}> — {edu.organization}</span>}
                    </span>
                    {edu.dateRange && <span style={{ fontSize: "9.5px", color: "#64748b" }}>{edu.dateRange}</span>}
                  </div>
                  {edu.bullets?.length > 0 && (
                    <ul style={{ margin: "2px 0 0 0", paddingLeft: "14px", color: "#334155" }}>
                      {edu.bullets.map((b, bIdx) => (
                        <li key={bIdx} style={{ fontSize: "10px" }}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Custom Sections */}
        {customSections?.map((cSec, idx) => (
          <section key={idx} style={{ marginBottom: "8px", pageBreakInside: "avoid" }}>
            <div style={{ borderBottom: `1px solid #cbd5e1`, paddingBottom: "1px", marginBottom: "4px" }}>
              <span style={{ fontWeight: "800", textTransform: "uppercase", fontSize: "10.5px", color: accentColor, letterSpacing: "0.05em" }}>
                {cSec.title}
              </span>
            </div>
            {cSec.entries?.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {cSec.entries.map((item, eIdx) => (
                  <div key={eIdx}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span>
                        <strong style={{ fontSize: "10.5px" }}>{item.title}</strong>
                        {item.organization && <span style={{ color: "#475569" }}> — {item.organization}</span>}
                      </span>
                      {item.dateRange && <span style={{ fontSize: "9.5px", color: "#64748b" }}>{item.dateRange}</span>}
                    </div>
                    {item.bullets?.length > 0 ? (
                      <ul style={{ margin: "2px 0 0 0", paddingLeft: "14px", color: "#334155" }}>
                        {item.bullets.map((b, bIdx) => (
                          <li key={bIdx} style={{ fontSize: "10px" }}>{b}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: "#334155", fontSize: "10px" }}>{cSec.content}</div>
            )}
          </section>
        ))}
      </div>
    );
  }

  // -------------------------------------------------------------
  // TEMPLATE 4: TWO-COLUMN TECH SIDEBAR (Modern Creative Split)
  // -------------------------------------------------------------
  if (template === "sidebar") {
    return (
      <div
        id={id}
        style={{
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: baseFontSize,
          lineHeight,
          color: "#1e293b",
          backgroundColor: "#ffffff",
          maxWidth: "800px",
          margin: "0 auto",
          boxSizing: "border-box",
          display: "flex",
          minHeight: "1050px",
        }}
      >
        {/* Left Column (33% Sidebar) */}
        <div
          style={{
            width: "33%",
            backgroundColor: "#f8fafc",
            borderRight: `2px solid #e2e8f0`,
            padding: isCompact ? "24px 18px" : "28px 22px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {/* Header in Sidebar */}
          <div>
            <h1
              style={{
                fontSize: headingSize,
                fontWeight: "900",
                color: accentColor,
                margin: "0 0 6px 0",
                letterSpacing: "-0.02em",
                textTransform: "capitalize",
                lineHeight: "1.15",
              }}
            >
              {name}
            </h1>
          </div>

          {/* Contact Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "10.5px", color: "#475569" }}>
            {contactItems.map((item, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "6px", wordBreak: "break-word" }}>
                <item.icon size={12} style={{ color: accentColor, flexShrink: 0 }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Skills in Sidebar */}
          {skills?.length > 0 && (
            <div>
              <h3
                style={{
                  fontSize: "11px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: accentColor,
                  borderBottom: `1.5px solid ${accentColor}`,
                  paddingBottom: "3px",
                  margin: "0 0 8px 0",
                }}
              >
                SKILLS & TOOLS
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {skills.map((skill, idx) => {
                  const parts = skill.includes(" – ")
                    ? skill.split(" – ")
                    : skill.includes(": ")
                    ? skill.split(": ")
                    : null;

                  return (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: "#ffffff",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        border: "1px solid #e2e8f0",
                        fontSize: "10.5px",
                        lineHeight: "1.35",
                      }}
                    >
                      {parts ? (
                        <>
                          <strong style={{ color: "#0f172a", display: "block" }}>{parts[0]}</strong>
                          <span style={{ color: "#475569" }}>{parts.slice(1).join(" – ")}</span>
                        </>
                      ) : (
                        <span>{skill}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Education in Sidebar */}
          {education?.length > 0 && (
            <div>
              <h3
                style={{
                  fontSize: "11px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: accentColor,
                  borderBottom: `1.5px solid ${accentColor}`,
                  paddingBottom: "3px",
                  margin: "0 0 8px 0",
                }}
              >
                EDUCATION
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {education.map((edu, idx) => (
                  <div key={idx} style={{ fontSize: "10.5px" }}>
                    <strong style={{ color: "#0f172a", display: "block" }}>{edu.title}</strong>
                    {edu.organization && <span style={{ color: "#475569", display: "block" }}>{edu.organization}</span>}
                    {edu.dateRange && <span style={{ color: "#64748b", fontSize: "10px" }}>{edu.dateRange}</span>}
                    {edu.bullets?.length > 0 && (
                      <div style={{ color: "#334155", marginTop: "2px" }}>
                        {edu.bullets.join(", ")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements in Sidebar */}
          {customSections?.map((cSec, idx) => (
            <div key={idx}>
              <h3
                style={{
                  fontSize: "11px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: accentColor,
                  borderBottom: `1.5px solid ${accentColor}`,
                  paddingBottom: "3px",
                  margin: "0 0 8px 0",
                }}
              >
                {cSec.title}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "10.5px" }}>
                {cSec.entries?.length > 0 ? (
                  cSec.entries.map((item, eIdx) => (
                    <div key={eIdx}>
                      <strong style={{ color: "#0f172a", display: "block" }}>{item.title}</strong>
                      {item.organization && <span style={{ color: "#475569" }}>{item.organization}</span>}
                      {item.dateRange && <span style={{ color: "#64748b", fontSize: "10px", display: "block" }}>{item.dateRange}</span>}
                      {item.bullets?.length > 0 && (
                        <div style={{ color: "#334155" }}>{item.bullets.join(" • ")}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{ color: "#334155" }}>{cSec.content}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column (67% Main Content) */}
        <div
          style={{
            width: "67%",
            padding: isCompact ? "24px 26px" : "28px 30px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Summary */}
          {summary && (
            <section style={{ borderLeft: `3px solid ${accentColor}`, paddingLeft: "10px" }}>
              <h2
                style={{
                  fontSize: sectionTitleSize,
                  fontWeight: "800",
                  color: accentColor,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  margin: "0 0 4px 0",
                }}
              >
                Profile Summary
              </h2>
              <p style={{ margin: 0, color: "#334155", textAlign: "justify", fontSize: "11.5px", lineHeight: "1.5" }}>
                {summary}
              </p>
            </section>
          )}

          {/* Work Experience */}
          {experience?.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: sectionTitleSize,
                  fontWeight: "800",
                  color: accentColor,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  borderBottom: "1.5px solid #cbd5e1",
                  paddingBottom: "3px",
                  margin: "0 0 10px 0",
                }}
              >
                Work Experience
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {experience.map((item, idx) => (
                  <div key={idx} style={{ pageBreakInside: "avoid" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div>
                        <strong style={{ fontSize: "12.5px", color: "#0f172a" }}>{item.title}</strong>
                        {item.organization && <span style={{ color: "#475569" }}> — {item.organization}</span>}
                      </div>
                      {item.dateRange && (
                        <span style={{ fontSize: "10.5px", color: "#64748b", fontWeight: "600" }}>{item.dateRange}</span>
                      )}
                    </div>
                    {item.bullets?.length > 0 ? (
                      <ul style={{ margin: "3px 0 0 0", paddingLeft: "16px", color: "#334155" }}>
                        {item.bullets.map((b, bIdx) => (
                          <li key={bIdx} style={{ fontSize: "11px", marginBottom: "2px" }}>{b}</li>
                        ))}
                      </ul>
                    ) : item.rawText ? (
                      <p style={{ margin: "2px 0 0 0", color: "#334155", fontSize: "11px" }}>{item.rawText}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects?.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: sectionTitleSize,
                  fontWeight: "800",
                  color: accentColor,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  borderBottom: "1.5px solid #cbd5e1",
                  paddingBottom: "3px",
                  margin: "0 0 10px 0",
                }}
              >
                Featured Projects
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {projects.map((proj, idx) => (
                  <div key={idx} style={{ pageBreakInside: "avoid" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div>
                        <strong style={{ fontSize: "12.5px", color: "#0f172a" }}>{proj.title}</strong>
                        {proj.organization && <span style={{ color: "#64748b", fontSize: "11px" }}> ({proj.organization})</span>}
                      </div>
                      {proj.dateRange && (
                        <span style={{ fontSize: "10.5px", color: "#64748b" }}>{proj.dateRange}</span>
                      )}
                    </div>
                    {proj.bullets?.length > 0 ? (
                      <ul style={{ margin: "3px 0 0 0", paddingLeft: "16px", color: "#334155" }}>
                        {proj.bullets.map((b, bIdx) => (
                          <li key={bIdx} style={{ fontSize: "11px", marginBottom: "2px" }}>{b}</li>
                        ))}
                      </ul>
                    ) : proj.rawText ? (
                      <p style={{ margin: "2px 0 0 0", color: "#334155", fontSize: "11px" }}>{proj.rawText}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // TEMPLATE 5: SILICON VALLEY TECH (Monospace & Developer Aesthetic)
  // -------------------------------------------------------------
  if (template === "silicon") {
    const monoFont = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace';
    return (
      <div
        id={id}
        style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: baseFontSize,
          lineHeight,
          color: "#0f172a",
          backgroundColor: "#ffffff",
          padding: isCompact ? "24px 28px" : "30px 36px",
          maxWidth: "800px",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* Terminal Style Header */}
        <header
          style={{
            borderLeft: `4px solid ${accentColor}`,
            paddingLeft: "14px",
            marginBottom: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <h1
              style={{
                fontSize: headingSize,
                fontWeight: "900",
                color: accentColor,
                margin: 0,
                letterSpacing: "-0.03em",
              }}
            >
              {name}
            </h1>
            <span
              style={{
                fontFamily: monoFont,
                fontSize: "10px",
                backgroundColor: "#f1f5f9",
                color: "#475569",
                padding: "2px 6px",
                borderRadius: "3px",
                border: "1px solid #cbd5e1",
              }}
            >
              SWE
            </span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontFamily: monoFont, fontSize: "10.5px", color: "#475569" }}>
            {contactItems.map((item, idx) => (
              <span key={idx}>
                {item.type === "email" && "mailto:"}
                {item.type === "phone" && "tel:"}
                {item.type === "linkedin" && "in/"}
                {item.type === "twitter" && "@"}
                <strong style={{ color: "#1e293b" }}>{item.label}</strong>
              </span>
            ))}
          </div>
        </header>

        {!hasStructuredData && renderFallbackContent()}

        {/* Summary */}
        {summary && (
          <section style={{ marginBottom: "12px", pageBreakInside: "avoid" }}>
            <div style={{ fontFamily: monoFont, fontSize: "10.5px", fontWeight: "700", color: accentColor, marginBottom: "4px" }}>
              // 01. ABOUT
            </div>
            <p style={{ margin: 0, color: "#334155", textAlign: "justify", fontSize: "11.5px", lineHeight: "1.45" }}>
              {summary}
            </p>
          </section>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <section style={{ marginBottom: "12px", pageBreakInside: "avoid" }}>
            <div style={{ fontFamily: monoFont, fontSize: "10.5px", fontWeight: "700", color: accentColor, marginBottom: "5px" }}>
              // 02. TECHNICAL STACK
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {skills.map((skill, idx) => {
                const parts = skill.includes(" – ")
                  ? skill.split(" – ")
                  : skill.includes(": ")
                  ? skill.split(": ")
                  : null;

                if (parts) {
                  return (
                    <div key={idx} style={{ fontSize: "11px", color: "#1e293b" }}>
                      <span style={{ fontFamily: monoFont, fontWeight: "700", color: accentColor }}>{parts[0]}</span>
                      <span style={{ color: "#64748b" }}> → </span>
                      <span>{parts.slice(1).join(" – ")}</span>
                    </div>
                  );
                }

                return (
                  <div key={idx} style={{ fontSize: "11px", color: "#1e293b" }}>
                    <span style={{ color: "#64748b" }}>• </span>
                    {skill}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <section style={{ marginBottom: "12px" }}>
            <div style={{ fontFamily: monoFont, fontSize: "10.5px", fontWeight: "700", color: accentColor, marginBottom: "6px" }}>
              // 03. PROJECTS & REPOSITORIES
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {projects.map((proj, idx) => (
                <div key={idx} style={{ pageBreakInside: "avoid" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <strong style={{ fontSize: "12px", color: "#0f172a" }}>{proj.title}</strong>
                      {proj.organization && <span style={{ color: "#64748b", fontSize: "11px" }}> ({proj.organization})</span>}
                    </div>
                    {proj.dateRange && (
                      <span style={{ fontFamily: monoFont, fontSize: "10px", color: "#64748b" }}>[{proj.dateRange}]</span>
                    )}
                  </div>
                  {proj.bullets?.length > 0 ? (
                    <ul style={{ margin: "2px 0 0 0", paddingLeft: "16px", color: "#334155" }}>
                      {proj.bullets.map((b, bIdx) => (
                        <li key={bIdx} style={{ fontSize: "10.5px", marginBottom: "1px" }}>{b}</li>
                      ))}
                    </ul>
                  ) : proj.rawText ? (
                    <p style={{ margin: "2px 0 0 0", color: "#334155", fontSize: "10.5px" }}>{proj.rawText}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <section style={{ marginBottom: "12px" }}>
            <div style={{ fontFamily: monoFont, fontSize: "10.5px", fontWeight: "700", color: accentColor, marginBottom: "6px" }}>
              // 04. EXPERIENCE
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {experience.map((item, idx) => (
                <div key={idx} style={{ pageBreakInside: "avoid" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <strong style={{ fontSize: "12px", color: "#0f172a" }}>{item.title}</strong>
                      {item.organization && <span style={{ color: "#64748b" }}> @ {item.organization}</span>}
                    </div>
                    {item.dateRange && (
                      <span style={{ fontFamily: monoFont, fontSize: "10px", color: "#64748b" }}>[{item.dateRange}]</span>
                    )}
                  </div>
                  {item.bullets?.length > 0 ? (
                    <ul style={{ margin: "2px 0 0 0", paddingLeft: "16px", color: "#334155" }}>
                      {item.bullets.map((b, bIdx) => (
                        <li key={bIdx} style={{ fontSize: "10.5px", marginBottom: "1px" }}>{b}</li>
                      ))}
                    </ul>
                  ) : item.rawText ? (
                    <p style={{ margin: "2px 0 0 0", color: "#334155", fontSize: "10.5px" }}>{item.rawText}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <section style={{ marginBottom: "12px", pageBreakInside: "avoid" }}>
            <div style={{ fontFamily: monoFont, fontSize: "10.5px", fontWeight: "700", color: accentColor, marginBottom: "4px" }}>
              // 05. ACADEMICS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {education.map((edu, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <strong style={{ fontSize: "11.5px", color: "#0f172a" }}>{edu.title}</strong>
                    {edu.organization && <span style={{ color: "#475569" }}> — {edu.organization}</span>}
                  </div>
                  {edu.dateRange && <span style={{ fontFamily: monoFont, fontSize: "10px", color: "#64748b" }}>[{edu.dateRange}]</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Custom Sections */}
        {customSections?.map((cSec, idx) => (
          <section key={idx} style={{ marginBottom: "12px", pageBreakInside: "avoid" }}>
            <div style={{ fontFamily: monoFont, fontSize: "10.5px", fontWeight: "700", color: accentColor, marginBottom: "4px" }}>
              // 06. {cSec.title.toUpperCase()}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {cSec.entries?.length > 0 ? (
                cSec.entries.map((item, eIdx) => (
                  <div key={eIdx} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <strong style={{ fontSize: "11px" }}>{item.title}</strong>
                      {item.organization && <span style={{ color: "#64748b" }}> — {item.organization}</span>}
                    </div>
                    {item.dateRange && <span style={{ fontFamily: monoFont, fontSize: "10px", color: "#64748b" }}>[{item.dateRange}]</span>}
                  </div>
                ))
              ) : (
                <div style={{ color: "#334155", fontSize: "10.5px" }}>{cSec.content}</div>
              )}
            </div>
          </section>
        ))}
      </div>
    );
  }

  // -------------------------------------------------------------
  // TEMPLATE 6: HARVARD / WALL STREET (Authoritative Consulting & Finance)
  // -------------------------------------------------------------
  return (
    <div
      id={id}
      style={{
        fontFamily: "'Times New Roman', Times, Georgia, serif",
        fontSize: baseFontSize,
        lineHeight: "1.42",
        color: "#000000",
        backgroundColor: "#ffffff",
        padding: isCompact ? "24px 32px" : "32px 42px",
        maxWidth: "800px",
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <header style={{ textAlign: "center", marginBottom: "12px" }}>
        <h1
          style={{
            fontSize: headingSize,
            fontWeight: "bold",
            color: accentColor,
            margin: "0 0 4px 0",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {name}
        </h1>
        <div style={{ fontSize: "10.5px", color: "#262626" }}>
          {contactItems.map((item, idx) => (
            <span key={idx}>
              {item.label}
              {idx < contactItems.length - 1 && " | "}
            </span>
          ))}
        </div>
      </header>

      {!hasStructuredData && renderFallbackContent()}

      {/* Summary */}
      {summary && (
        <section style={{ marginBottom: "12px", pageBreakInside: "avoid" }}>
          <h2
            style={{
              fontSize: "12.5px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              borderBottom: "1px solid #000000",
              paddingBottom: "1px",
              margin: "0 0 4px 0",
              color: accentColor,
            }}
          >
            Executive Summary
          </h2>
          <p style={{ margin: 0, textAlign: "justify", fontSize: "11px", lineHeight: "1.4" }}>
            {summary}
          </p>
        </section>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <section style={{ marginBottom: "12px", pageBreakInside: "avoid" }}>
          <h2
            style={{
              fontSize: "12.5px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              borderBottom: "1px solid #000000",
              paddingBottom: "1px",
              margin: "0 0 5px 0",
              color: accentColor,
            }}
          >
            Education
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {education.map((edu, idx) => (
              <div key={idx}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <strong style={{ fontSize: "12px" }}>{edu.organization || edu.title}</strong>
                    {edu.organization && <span style={{ fontStyle: "italic" }}> — {edu.title}</span>}
                  </div>
                  {edu.dateRange && (
                    <span style={{ fontSize: "11px", fontStyle: "italic" }}>{edu.dateRange}</span>
                  )}
                </div>
                {edu.bullets?.length > 0 && (
                  <div style={{ fontSize: "10.5px", paddingLeft: "14px" }}>
                    {edu.bullets.join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Work Experience */}
      {experience?.length > 0 && (
        <section style={{ marginBottom: "12px" }}>
          <h2
            style={{
              fontSize: "12.5px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              borderBottom: "1px solid #000000",
              paddingBottom: "1px",
              margin: "0 0 6px 0",
              color: accentColor,
            }}
          >
            Professional Experience
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {experience.map((item, idx) => (
              <div key={idx} style={{ pageBreakInside: "avoid" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <strong style={{ fontSize: "12px" }}>{item.organization || item.title}</strong>
                    {item.organization && <span style={{ fontStyle: "italic" }}> — {item.title}</span>}
                  </div>
                  {item.dateRange && (
                    <span style={{ fontSize: "11px", fontStyle: "italic" }}>{item.dateRange}</span>
                  )}
                </div>
                {item.bullets?.length > 0 ? (
                  <ul style={{ margin: "2px 0 0 0", paddingLeft: "16px" }}>
                    {item.bullets.map((b, bIdx) => (
                      <li key={bIdx} style={{ fontSize: "11px", marginBottom: "1px" }}>{b}</li>
                    ))}
                  </ul>
                ) : item.rawText ? (
                  <p style={{ margin: "2px 0 0 0", fontSize: "11px" }}>{item.rawText}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <section style={{ marginBottom: "12px" }}>
          <h2
            style={{
              fontSize: "12.5px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              borderBottom: "1px solid #000000",
              paddingBottom: "1px",
              margin: "0 0 6px 0",
              color: accentColor,
            }}
          >
            Key Projects & Initiatives
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            {projects.map((proj, idx) => (
              <div key={idx} style={{ pageBreakInside: "avoid" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <strong style={{ fontSize: "12px" }}>{proj.title}</strong>
                  {proj.dateRange && <span style={{ fontSize: "11px", fontStyle: "italic" }}>{proj.dateRange}</span>}
                </div>
                {proj.bullets?.length > 0 ? (
                  <ul style={{ margin: "2px 0 0 0", paddingLeft: "16px" }}>
                    {proj.bullets.map((b, bIdx) => (
                      <li key={bIdx} style={{ fontSize: "11px", marginBottom: "1px" }}>{b}</li>
                    ))}
                  </ul>
                ) : proj.rawText ? (
                  <p style={{ margin: "2px 0 0 0", fontSize: "11px" }}>{proj.rawText}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills?.length > 0 && (
        <section style={{ marginBottom: "12px", pageBreakInside: "avoid" }}>
          <h2
            style={{
              fontSize: "12.5px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              borderBottom: "1px solid #000000",
              paddingBottom: "1px",
              margin: "0 0 5px 0",
              color: accentColor,
            }}
          >
            Technical Skills & Competencies
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {skills.map((skill, idx) => {
              const parts = skill.includes(" – ")
                ? skill.split(" – ")
                : skill.includes(": ")
                ? skill.split(": ")
                : null;

              if (parts) {
                return (
                  <div key={idx} style={{ fontSize: "11px" }}>
                    <strong>{parts[0]}: </strong>
                    <span>{parts.slice(1).join(" – ")}</span>
                  </div>
                );
              }

              return (
                <div key={idx} style={{ fontSize: "11px" }}>
                  • {skill}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Custom Sections */}
      {customSections?.map((cSec, idx) => (
        <section key={idx} style={{ marginBottom: "12px", pageBreakInside: "avoid" }}>
          <h2
            style={{
              fontSize: "12.5px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              borderBottom: "1px solid #000000",
              paddingBottom: "1px",
              margin: "0 0 5px 0",
              color: accentColor,
            }}
          >
            {cSec.title}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {cSec.entries?.length > 0 ? (
              cSec.entries.map((item, eIdx) => (
                <div key={eIdx}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <strong style={{ fontSize: "11.5px" }}>{item.title}</strong>
                      {item.organization && <span style={{ fontStyle: "italic" }}> — {item.organization}</span>}
                    </div>
                    {item.dateRange && <span style={{ fontSize: "11px", fontStyle: "italic" }}>{item.dateRange}</span>}
                  </div>
                  {item.bullets?.length > 0 && (
                    <div style={{ fontSize: "10.5px", paddingLeft: "14px" }}>
                      {item.bullets.join(", ")}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ fontSize: "11px" }}>{cSec.content}</div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
