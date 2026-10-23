"use client";

import React from "react";
import { Mail, Phone, Linkedin, Globe } from "lucide-react";

export default function TemplateRenderer({
  resumeData,
  template = "modern", // "modern" | "classic" | "compact"
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
  const baseFontSize = isCompact ? "11.5px" : "13px";
  const headingSize = isCompact ? "20px" : "24px";
  const sectionTitleSize = isCompact ? "13px" : "15px";
  const lineHeight = isCompact ? "1.4" : "1.55";

  // Build contact items array
  const contactItems = [];
  if (contact.email) contactItems.push({ icon: Mail, label: contact.email });
  if (contact.mobile) contactItems.push({ icon: Phone, label: contact.mobile });
  if (contact.linkedin) contactItems.push({ icon: Linkedin, label: contact.linkedin.replace(/^https?:\/\/(www\.)?/, "") });
  if (contact.twitter) contactItems.push({ icon: Globe, label: contact.twitter.replace(/^https?:\/\/(www\.)?/, "") });

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
