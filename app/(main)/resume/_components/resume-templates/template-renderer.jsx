"use client";

import React from "react";
import { Mail, Phone, Linkedin, Globe } from "lucide-react";

export default function TemplateRenderer({
  resumeData,
  template = "modern", // "modern" | "sidebar" | "silicon" | "classic" | "harvard" | "compact"
  accentColor = "#0f172a", // hex
  fontSize = "normal", // "normal" | "compact"
  id = "resume-export-sheet",
}) {
  const {
    name = "Candidate Name",
    headline = "",
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
  const baseFontSize = isCompact ? "11px" : "12px";
  const headingSize = isCompact ? "21px" : "24px";
  const sectionTitleSize = isCompact ? "12px" : "13.5px";
  const lineHeight = isCompact ? "1.38" : "1.48";

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

  // Helper to format bullets (bolds Tech Stack, removes stray asterisks)
  const renderBulletItem = (b, bIdx) => {
    const cleanB = (b || "").replace(/^\s*[-*•]+\s*/, "").trim();
    if (!cleanB) return null;

    const techMatch = cleanB.match(/^(Technologies Used|Tech Stack|Technologies|Tools Used):\s*(.+)$/i);
    if (techMatch) {
      return (
        <li key={bIdx} style={{ marginBottom: "2px", lineHeight: "1.4" }}>
          <strong style={{ color: "#0f172a" }}>{techMatch[1]}: </strong>
          <span>{techMatch[2]}</span>
        </li>
      );
    }

    return (
      <li key={bIdx} style={{ marginBottom: "2px", lineHeight: "1.4" }}>
        {cleanB}
      </li>
    );
  };

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
          padding: isCompact ? "24px 30px" : "28px 36px",
          width: "100%",
          maxWidth: "794px",
          minHeight: "1123px",
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
              margin: "0 0 2px 0",
              letterSpacing: "-0.02em",
              textTransform: "capitalize",
            }}
          >
            {name}
          </h1>

          {headline && (
            <div style={{ fontSize: isCompact ? "12px" : "13.5px", fontWeight: "600", color: "#475569", margin: "0 0 6px 0" }}>
              {headline}
            </div>
          )}

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
          <section style={{ marginBottom: "12px", pageBreakInside: "avoid" }}>
            <h2
              style={{
                fontSize: sectionTitleSize,
                fontWeight: "700",
                color: accentColor,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: "0 0 4px 0",
              }}
            >
              Professional Summary
            </h2>
            <p style={{ margin: "0", color: "#334155", textAlign: "justify", lineHeight: "1.45" }}>{summary}</p>
          </section>
        )}

        {/* Technical Skills */}
        {skills?.length > 0 && (
          <section style={{ marginBottom: "12px", pageBreakInside: "avoid" }}>
            <h2
              style={{
                fontSize: sectionTitleSize,
                fontWeight: "700",
                color: accentColor,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: "0 0 6px 0",
              }}
            >
              Skills & Expertise
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {skills.map((skill, idx) => {
                const parts = skill.includes(" – ")
                  ? skill.split(" – ")
                  : skill.includes(": ")
                  ? skill.split(": ")
                  : null;

                if (parts) {
                  return (
                    <div key={idx} style={{ fontSize: "11px", color: "#334155", lineHeight: "1.38" }}>
                      <strong style={{ color: "#0f172a" }}>{parts[0]}: </strong>
                      <span>{parts.slice(1).join(" – ")}</span>
                    </div>
                  );
                }

                return (
                  <div key={idx} style={{ fontSize: "11px", color: "#334155", lineHeight: "1.38" }}>
                    • {skill}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Work Experience */}
        {experience?.length > 0 && (
          <section style={{ marginBottom: "12px" }}>
            <h2
              style={{
                fontSize: sectionTitleSize,
                fontWeight: "700",
                color: accentColor,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: "0 0 6px 0",
              }}
            >
              Work Experience
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {experience.map((item, idx) => (
                <div key={idx} style={{ pageBreakInside: "avoid" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <strong style={{ fontSize: "12.5px", color: "#0f172a" }}>{item.title}</strong>
                      {item.organization && (
                        <span style={{ color: "#475569", fontWeight: "600" }}> • {item.organization}</span>
                      )}
                    </div>
                    {item.dateRange && (
                      <span style={{ fontSize: "10.5px", color: "#64748b", fontWeight: "600" }}>{item.dateRange}</span>
                    )}
                  </div>
                  {item.bullets?.length > 0 ? (
                    <ul style={{ margin: "2px 0 0 0", paddingLeft: "16px", color: "#334155" }}>
                      {item.bullets.map((b, bIdx) => renderBulletItem(b, bIdx))}
                    </ul>
                  ) : item.rawText ? (
                    <p style={{ margin: "2px 0 0 0", color: "#334155", whiteSpace: "pre-wrap" }}>{item.rawText}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Key Projects */}
        {projects?.length > 0 && (
          <section style={{ marginBottom: "12px" }}>
            <h2
              style={{
                fontSize: sectionTitleSize,
                fontWeight: "700",
                color: accentColor,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: "0 0 6px 0",
              }}
            >
              Key Projects
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {projects.map((proj, idx) => (
                <div key={idx} style={{ pageBreakInside: "avoid" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <strong style={{ fontSize: "12.5px", color: "#0f172a" }}>{proj.title}</strong>
                      {proj.organization && (
                        <span style={{ color: "#64748b", fontSize: "11px" }}> ({proj.organization})</span>
                      )}
                    </div>
                    {proj.dateRange && (
                      <span style={{ fontSize: "10.5px", color: "#64748b", fontWeight: "500" }}>{proj.dateRange}</span>
                    )}
                  </div>
                  {proj.bullets?.length > 0 ? (
                    <ul style={{ margin: "2px 0 0 0", paddingLeft: "16px", color: "#334155" }}>
                      {proj.bullets.map((b, bIdx) => renderBulletItem(b, bIdx))}
                    </ul>
                  ) : proj.rawText ? (
                    <p style={{ margin: "2px 0 0 0", color: "#334155", whiteSpace: "pre-wrap" }}>{proj.rawText}</p>
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
                fontWeight: "700",
                color: accentColor,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: "0 0 6px 0",
              }}
            >
              Education
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {education.map((edu, idx) => (
                <div key={idx} style={{ pageBreakInside: "avoid" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <strong style={{ fontSize: "12px", color: "#0f172a" }}>{edu.title}</strong>
                      {edu.organization && <span style={{ color: "#475569" }}> — {edu.organization}</span>}
                      {edu.bullets?.length > 0 && (
                        <span style={{ color: "#475569", fontWeight: "600", fontSize: "10.5px" }}> ({edu.bullets.join(" • ")})</span>
                      )}
                    </div>
                    {edu.dateRange && (
                      <span style={{ fontSize: "10.5px", color: "#64748b", fontWeight: "500" }}>{edu.dateRange}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Custom Sections (Achievements, Certifications, etc.) */}
        {customSections?.map((cSec, idx) => (
          <section key={idx} style={{ marginBottom: "12px", pageBreakInside: "avoid" }}>
            <h2
              style={{
                fontSize: sectionTitleSize,
                fontWeight: "700",
                color: accentColor,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: "0 0 6px 0",
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
                        <strong style={{ fontSize: "12px", color: "#0f172a" }}>{item.title}</strong>
                        {item.organization && <span style={{ color: "#475569" }}> — {item.organization}</span>}
                      </div>
                      {item.dateRange && (
                        <span style={{ fontSize: "10.5px", color: "#64748b", fontWeight: "500" }}>{item.dateRange}</span>
                      )}
                    </div>
                    {item.bullets?.length > 0 ? (
                      <ul style={{ margin: "2px 0 0 0", paddingLeft: "16px", color: "#334155" }}>
                        {item.bullets.map((b, bIdx) => renderBulletItem(b, bIdx))}
                      </ul>
                    ) : item.rawText ? (
                      <p style={{ margin: "2px 0 0 0", color: "#334155", fontSize: "10.5px" }}>{item.rawText}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: "#334155", whiteSpace: "pre-wrap", fontSize: "11px" }}>{cSec.content}</div>
            )}
          </section>
        ))}
      </div>
    );
  }

  // -------------------------------------------------------------
  // TEMPLATE 2: MODERN SPLIT-COLUMN (Two-Column Sidebar Layout)
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
          width: "100%",
          maxWidth: "794px",
          minHeight: "1123px",
          margin: "0 auto",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
        }}
      >
        {/* Left Column (33% Sidebar) */}
        <div
          style={{
            width: "33%",
            flexShrink: 0,
            backgroundColor: "#f8fafc",
            borderRight: "1.5px solid #e2e8f0",
            padding: isCompact ? "22px 16px" : "26px 20px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: headingSize,
                fontWeight: "900",
                color: accentColor,
                margin: "0 0 4px 0",
                letterSpacing: "-0.02em",
                textTransform: "capitalize",
                lineHeight: "1.15",
              }}
            >
              {name}
            </h1>
            {headline && (
              <div style={{ fontSize: "11px", fontWeight: "600", color: "#64748b" }}>
                {headline}
              </div>
            )}
          </div>

          {/* Contact Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "10px", color: "#475569" }}>
            {contactItems.map((item, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "6px", wordBreak: "break-word" }}>
                <item.icon size={11} style={{ color: accentColor, flexShrink: 0 }} />
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
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
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
                        padding: "4px 7px",
                        borderRadius: "4px",
                        border: "1px solid #e2e8f0",
                        fontSize: "10px",
                        lineHeight: "1.3",
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
              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                {education.map((edu, idx) => (
                  <div key={idx} style={{ fontSize: "10px" }}>
                    <strong style={{ color: "#0f172a", display: "block" }}>{edu.title}</strong>
                    {edu.organization && <span style={{ color: "#475569", display: "block" }}>{edu.organization}</span>}
                    {edu.bullets?.length > 0 && (
                      <span style={{ color: "#0284c7", fontWeight: "600", display: "block" }}>
                        {edu.bullets.join(" • ")}
                      </span>
                    )}
                    {edu.dateRange && <span style={{ color: "#94a3b8", fontSize: "9.5px" }}>{edu.dateRange}</span>}
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
              <div style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "10px" }}>
                {cSec.entries?.length > 0 ? (
                  cSec.entries.map((item, eIdx) => (
                    <div key={eIdx}>
                      <strong style={{ color: "#0f172a", display: "block" }}>{item.title}</strong>
                      {item.organization && <span style={{ color: "#475569" }}>{item.organization}</span>}
                      {item.dateRange && <span style={{ color: "#94a3b8", fontSize: "9.5px", display: "block" }}>{item.dateRange}</span>}
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
            flex: 1,
            padding: isCompact ? "22px 24px" : "26px 28px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
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
                  margin: "0 0 3px 0",
                }}
              >
                Profile Summary
              </h2>
              <p style={{ margin: 0, color: "#334155", textAlign: "justify", fontSize: "11px", lineHeight: "1.45" }}>
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
                  margin: "0 0 8px 0",
                }}
              >
                Work Experience
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {experience.map((item, idx) => (
                  <div key={idx} style={{ pageBreakInside: "avoid" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div>
                        <strong style={{ fontSize: "12px", color: "#0f172a" }}>{item.title}</strong>
                        {item.organization && <span style={{ color: "#475569" }}> — {item.organization}</span>}
                      </div>
                      {item.dateRange && (
                        <span style={{ fontSize: "10px", color: "#64748b", fontWeight: "600" }}>{item.dateRange}</span>
                      )}
                    </div>
                    {item.bullets?.length > 0 ? (
                      <ul style={{ margin: "2px 0 0 0", paddingLeft: "16px", color: "#334155" }}>
                        {item.bullets.map((b, bIdx) => renderBulletItem(b, bIdx))}
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
                  margin: "0 0 8px 0",
                }}
              >
                Featured Projects
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {projects.map((proj, idx) => (
                  <div key={idx} style={{ pageBreakInside: "avoid" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div>
                        <strong style={{ fontSize: "12px", color: "#0f172a" }}>{proj.title}</strong>
                        {proj.organization && <span style={{ color: "#64748b", fontSize: "10.5px" }}> ({proj.organization})</span>}
                      </div>
                      {proj.dateRange && (
                        <span style={{ fontSize: "10px", color: "#64748b" }}>{proj.dateRange}</span>
                      )}
                    </div>
                    {proj.bullets?.length > 0 ? (
                      <ul style={{ margin: "2px 0 0 0", paddingLeft: "16px", color: "#334155" }}>
                        {proj.bullets.map((b, bIdx) => renderBulletItem(b, bIdx))}
                      </ul>
                    ) : proj.rawText ? (
                      <p style={{ margin: "2px 0 0 0", color: "#334155", fontSize: "10.5px" }}>{proj.rawText}</p>
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
  // TEMPLATE 3: SILICON VALLEY TECH (Monospace & Developer Aesthetic)
  // -------------------------------------------------------------
  if (template === "silicon") {
    const monoFont = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
    return (
      <div
        id={id}
        style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: baseFontSize,
          lineHeight,
          color: "#0f172a",
          backgroundColor: "#ffffff",
          padding: isCompact ? "24px 28px" : "28px 36px",
          width: "100%",
          maxWidth: "794px",
          minHeight: "1123px",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* Terminal Header */}
        <header
          style={{
            borderLeft: `4px solid ${accentColor}`,
            paddingLeft: "14px",
            marginBottom: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
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
              ENGINEER
            </span>
          </div>

          {headline && (
            <div style={{ fontFamily: monoFont, fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>
              $ role: {headline}
            </div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontFamily: monoFont, fontSize: "10.5px", color: "#475569" }}>
            {contactItems.map((item, idx) => (
              <span key={idx}>
                {item.type === "email" && "email:"}
                {item.type === "phone" && "tel:"}
                {item.type === "linkedin" && "in/"}
                {item.type === "twitter" && "@"}
                <strong style={{ color: "#1e293b", marginLeft: "2px" }}>{item.label}</strong>
              </span>
            ))}
          </div>
        </header>

        {!hasStructuredData && renderFallbackContent()}

        {/* Summary */}
        {summary && (
          <section style={{ marginBottom: "12px", pageBreakInside: "avoid" }}>
            <div style={{ fontFamily: monoFont, fontSize: "10.5px", fontWeight: "700", color: accentColor, marginBottom: "3px" }}>
              // 01. ABOUT
            </div>
            <p style={{ margin: 0, color: "#334155", textAlign: "justify", fontSize: "11px", lineHeight: "1.45" }}>
              {summary}
            </p>
          </section>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <section style={{ marginBottom: "12px", pageBreakInside: "avoid" }}>
            <div style={{ fontFamily: monoFont, fontSize: "10.5px", fontWeight: "700", color: accentColor, marginBottom: "4px" }}>
              // 02. TECHNICAL STACK
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {skills.map((skill, idx) => {
                const parts = skill.includes(" – ")
                  ? skill.split(" – ")
                  : skill.includes(": ")
                  ? skill.split(": ")
                  : null;

                if (parts) {
                  return (
                    <div key={idx} style={{ fontSize: "10.5px", color: "#1e293b" }}>
                      <span style={{ fontFamily: monoFont, fontWeight: "700", color: accentColor }}>{parts[0]}</span>
                      <span style={{ color: "#94a3b8" }}> → </span>
                      <span>{parts.slice(1).join(" – ")}</span>
                    </div>
                  );
                }

                return (
                  <div key={idx} style={{ fontSize: "10.5px", color: "#1e293b" }}>
                    <span style={{ color: "#94a3b8" }}>• </span>
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
            <div style={{ fontFamily: monoFont, fontSize: "10.5px", fontWeight: "700", color: accentColor, marginBottom: "5px" }}>
              // 03. FEATURED PROJECTS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              {projects.map((proj, idx) => (
                <div key={idx} style={{ pageBreakInside: "avoid" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <strong style={{ fontSize: "11.5px", color: "#0f172a" }}>{proj.title}</strong>
                      {proj.organization && <span style={{ color: "#64748b", fontSize: "10.5px" }}> ({proj.organization})</span>}
                    </div>
                    {proj.dateRange && (
                      <span style={{ fontFamily: monoFont, fontSize: "9.5px", color: "#64748b" }}>[{proj.dateRange}]</span>
                    )}
                  </div>
                  {proj.bullets?.length > 0 ? (
                    <ul style={{ margin: "2px 0 0 0", paddingLeft: "16px", color: "#334155" }}>
                      {proj.bullets.map((b, bIdx) => renderBulletItem(b, bIdx))}
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
            <div style={{ fontFamily: monoFont, fontSize: "10.5px", fontWeight: "700", color: accentColor, marginBottom: "5px" }}>
              // 04. EXPERIENCE
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              {experience.map((item, idx) => (
                <div key={idx} style={{ pageBreakInside: "avoid" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <strong style={{ fontSize: "11.5px", color: "#0f172a" }}>{item.title}</strong>
                      {item.organization && <span style={{ color: "#64748b" }}> @ {item.organization}</span>}
                    </div>
                    {item.dateRange && (
                      <span style={{ fontFamily: monoFont, fontSize: "9.5px", color: "#64748b" }}>[{item.dateRange}]</span>
                    )}
                  </div>
                  {item.bullets?.length > 0 ? (
                    <ul style={{ margin: "2px 0 0 0", paddingLeft: "16px", color: "#334155" }}>
                      {item.bullets.map((b, bIdx) => renderBulletItem(b, bIdx))}
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
                    <strong style={{ fontSize: "11px", color: "#0f172a" }}>{edu.title}</strong>
                    {edu.organization && <span style={{ color: "#475569" }}> — {edu.organization}</span>}
                    {edu.bullets?.length > 0 && (
                      <span style={{ color: "#0284c7", fontWeight: "600", fontSize: "10px" }}> ({edu.bullets.join(" • ")})</span>
                    )}
                  </div>
                  {edu.dateRange && <span style={{ fontFamily: monoFont, fontSize: "9.5px", color: "#64748b" }}>[{edu.dateRange}]</span>}
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
                    {item.dateRange && <span style={{ fontFamily: monoFont, fontSize: "9.5px", color: "#64748b" }}>[{item.dateRange}]</span>}
                  </div>
                ))
              ) : (
                <div style={{ color: "#334155", fontSize: "10px" }}>{cSec.content}</div>
              )}
            </div>
          </section>
        ))}
      </div>
    );
  }

  // -------------------------------------------------------------
  // TEMPLATE 4: EXECUTIVE CLASSIC (Timeless Serif)
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
          padding: isCompact ? "24px 30px" : "28px 38px",
          width: "100%",
          maxWidth: "794px",
          minHeight: "1123px",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: "12px", borderBottom: `2px solid ${accentColor}`, paddingBottom: "8px" }}>
          <h1
            style={{
              fontSize: headingSize,
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: accentColor,
              margin: "0 0 3px 0",
            }}
          >
            {name}
          </h1>

          {headline && (
            <div style={{ fontSize: "11.5px", fontStyle: "italic", color: "#4b5563", marginBottom: "4px" }}>
              {headline}
            </div>
          )}

          <div style={{ fontSize: "10.5px", color: "#374151", letterSpacing: "0.02em" }}>
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
          <section style={{ marginBottom: "11px", pageBreakInside: "avoid" }}>
            <h2
              style={{
                fontSize: sectionTitleSize,
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderBottom: "1px solid #cbd5e1",
                paddingBottom: "2px",
                margin: "0 0 4px 0",
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
          <section style={{ marginBottom: "11px", pageBreakInside: "avoid" }}>
            <h2
              style={{
                fontSize: sectionTitleSize,
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderBottom: "1px solid #cbd5e1",
                paddingBottom: "2px",
                margin: "0 0 4px 0",
                color: accentColor,
              }}
            >
              Skills & Qualifications
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
                    <div key={idx} style={{ fontSize: "11px", color: "#1f2937", lineHeight: "1.35" }}>
                      <strong>{parts[0]}: </strong>
                      <span>{parts.slice(1).join(" – ")}</span>
                    </div>
                  );
                }

                return (
                  <div key={idx} style={{ fontSize: "11px", color: "#1f2937", lineHeight: "1.35" }}>
                    • {skill}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <section style={{ marginBottom: "11px" }}>
            <h2
              style={{
                fontSize: sectionTitleSize,
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderBottom: "1px solid #cbd5e1",
                paddingBottom: "2px",
                margin: "0 0 5px 0",
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
                      {item.organization && (
                        <span style={{ fontStyle: "italic", color: "#4b5563" }}> — {item.title}</span>
                      )}
                    </div>
                    {item.dateRange && (
                      <span style={{ fontSize: "10.5px", fontStyle: "italic", color: "#4b5563" }}>{item.dateRange}</span>
                    )}
                  </div>
                  {item.bullets?.length > 0 ? (
                    <ul style={{ margin: "2px 0 0 0", paddingLeft: "16px", color: "#1f2937" }}>
                      {item.bullets.map((b, bIdx) => renderBulletItem(b, bIdx))}
                    </ul>
                  ) : item.rawText ? (
                    <p style={{ margin: "2px 0 0 0", color: "#1f2937", whiteSpace: "pre-wrap" }}>{item.rawText}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <section style={{ marginBottom: "11px" }}>
            <h2
              style={{
                fontSize: sectionTitleSize,
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderBottom: "1px solid #cbd5e1",
                paddingBottom: "2px",
                margin: "0 0 5px 0",
                color: accentColor,
              }}
            >
              Selected Projects
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              {projects.map((proj, idx) => (
                <div key={idx} style={{ pageBreakInside: "avoid" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <strong style={{ fontSize: "12px" }}>{proj.title}</strong>
                    {proj.dateRange && (
                      <span style={{ fontSize: "10.5px", fontStyle: "italic", color: "#4b5563" }}>{proj.dateRange}</span>
                    )}
                  </div>
                  {proj.bullets?.length > 0 ? (
                    <ul style={{ margin: "2px 0 0 0", paddingLeft: "16px", color: "#1f2937" }}>
                      {proj.bullets.map((b, bIdx) => renderBulletItem(b, bIdx))}
                    </ul>
                  ) : proj.rawText ? (
                    <p style={{ margin: "2px 0 0 0", color: "#1f2937", whiteSpace: "pre-wrap" }}>{proj.rawText}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <section style={{ marginBottom: "11px", pageBreakInside: "avoid" }}>
            <h2
              style={{
                fontSize: sectionTitleSize,
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderBottom: "1px solid #cbd5e1",
                paddingBottom: "2px",
                margin: "0 0 4px 0",
                color: accentColor,
              }}
            >
              Education
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {education.map((edu, idx) => (
                <div key={idx} style={{ pageBreakInside: "avoid" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <strong style={{ fontSize: "11.5px" }}>{edu.title}</strong>
                      {edu.organization && <span style={{ fontStyle: "italic" }}> — {edu.organization}</span>}
                      {edu.bullets?.length > 0 && (
                        <span style={{ fontStyle: "italic", color: "#4b5563" }}> ({edu.bullets.join(" • ")})</span>
                      )}
                    </div>
                    {edu.dateRange && (
                      <span style={{ fontSize: "10.5px", fontStyle: "italic", color: "#4b5563" }}>{edu.dateRange}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Custom Sections */}
        {customSections?.map((cSec, idx) => (
          <section key={idx} style={{ marginBottom: "11px", pageBreakInside: "avoid" }}>
            <h2
              style={{
                fontSize: sectionTitleSize,
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderBottom: "1px solid #cbd5e1",
                paddingBottom: "2px",
                margin: "0 0 4px 0",
                color: accentColor,
              }}
            >
              {cSec.title}
            </h2>
            {cSec.entries?.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {cSec.entries.map((item, eIdx) => (
                  <div key={eIdx}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div>
                        <strong style={{ fontSize: "11.5px" }}>{item.title}</strong>
                        {item.organization && <span style={{ fontStyle: "italic", color: "#4b5563" }}> — {item.organization}</span>}
                      </div>
                      {item.dateRange && (
                        <span style={{ fontSize: "10.5px", fontStyle: "italic", color: "#4b5563" }}>{item.dateRange}</span>
                      )}
                    </div>
                    {item.bullets?.length > 0 ? (
                      <ul style={{ margin: "2px 0 0 0", paddingLeft: "16px", color: "#1f2937" }}>
                        {item.bullets.map((b, bIdx) => renderBulletItem(b, bIdx))}
                      </ul>
                    ) : item.rawText ? (
                      <p style={{ margin: "2px 0 0 0", color: "#1f2937", fontSize: "10.5px" }}>{item.rawText}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: "#1f2937", whiteSpace: "pre-wrap", fontSize: "10.5px" }}>{cSec.content}</div>
            )}
          </section>
        ))}
      </div>
    );
  }

  // -------------------------------------------------------------
  // TEMPLATE 5: HARVARD / WALL STREET (Refined Corporate Prestige)
  // -------------------------------------------------------------
  if (template === "harvard") {
    return (
      <div
        id={id}
        style={{
          fontFamily: "'Times New Roman', Times, Georgia, serif",
          fontSize: baseFontSize,
          lineHeight: "1.4",
          color: "#000000",
          backgroundColor: "#ffffff",
          padding: isCompact ? "24px 32px" : "28px 38px",
          width: "100%",
          maxWidth: "794px",
          minHeight: "1123px",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: "12px", borderBottom: `1.5px solid ${accentColor}`, paddingBottom: "6px" }}>
          <h1
            style={{
              fontSize: headingSize,
              fontWeight: "bold",
              color: accentColor,
              margin: "0 0 2px 0",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {name}
          </h1>
          {headline && (
            <div style={{ fontSize: "11px", fontStyle: "italic", color: "#404040", marginBottom: "3px" }}>
              {headline}
            </div>
          )}
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
          <section style={{ marginBottom: "10px", pageBreakInside: "avoid" }}>
            <h2
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                borderBottom: "1px solid #737373",
                paddingBottom: "2px",
                margin: "0 0 4px 0",
                color: accentColor,
              }}
            >
              Executive Summary
            </h2>
            <p style={{ margin: 0, textAlign: "justify", fontSize: "11px", lineHeight: "1.38" }}>
              {summary}
            </p>
          </section>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <section style={{ marginBottom: "10px", pageBreakInside: "avoid" }}>
            <h2
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                borderBottom: "1px solid #737373",
                paddingBottom: "2px",
                margin: "0 0 5px 0",
                color: accentColor,
              }}
            >
              Education
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {education.map((edu, idx) => (
                <div key={idx}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <strong style={{ fontSize: "11.5px" }}>{edu.title}</strong>
                      {edu.organization && <span> — {edu.organization}</span>}
                      {edu.bullets?.length > 0 && (
                        <span style={{ fontStyle: "italic", color: "#404040" }}> ({edu.bullets.join(" • ")})</span>
                      )}
                    </div>
                    {edu.dateRange && (
                      <span style={{ fontSize: "10.5px", fontStyle: "italic" }}>{edu.dateRange}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Work Experience */}
        {experience?.length > 0 && (
          <section style={{ marginBottom: "10px" }}>
            <h2
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                borderBottom: "1px solid #737373",
                paddingBottom: "2px",
                margin: "0 0 5px 0",
                color: accentColor,
              }}
            >
              Professional Experience
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {experience.map((item, idx) => (
                <div key={idx} style={{ pageBreakInside: "avoid" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <strong style={{ fontSize: "11.5px" }}>{item.organization || item.title}</strong>
                      {item.organization && <span style={{ fontStyle: "italic" }}> — {item.title}</span>}
                    </div>
                    {item.dateRange && (
                      <span style={{ fontSize: "10.5px", fontStyle: "italic" }}>{item.dateRange}</span>
                    )}
                  </div>
                  {item.bullets?.length > 0 ? (
                    <ul style={{ margin: "2px 0 0 0", paddingLeft: "16px" }}>
                      {item.bullets.map((b, bIdx) => renderBulletItem(b, bIdx))}
                    </ul>
                  ) : item.rawText ? (
                    <p style={{ margin: "2px 0 0 0", fontSize: "10.5px" }}>{item.rawText}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <section style={{ marginBottom: "10px" }}>
            <h2
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                borderBottom: "1px solid #737373",
                paddingBottom: "2px",
                margin: "0 0 5px 0",
                color: accentColor,
              }}
            >
              Key Projects & Initiatives
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {projects.map((proj, idx) => (
                <div key={idx} style={{ pageBreakInside: "avoid" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <strong style={{ fontSize: "11.5px" }}>{proj.title}</strong>
                    {proj.dateRange && <span style={{ fontSize: "10.5px", fontStyle: "italic" }}>{proj.dateRange}</span>}
                  </div>
                  {proj.bullets?.length > 0 ? (
                    <ul style={{ margin: "2px 0 0 0", paddingLeft: "16px" }}>
                      {proj.bullets.map((b, bIdx) => renderBulletItem(b, bIdx))}
                    </ul>
                  ) : proj.rawText ? (
                    <p style={{ margin: "2px 0 0 0", fontSize: "10.5px" }}>{proj.rawText}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <section style={{ marginBottom: "10px", pageBreakInside: "avoid" }}>
            <h2
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                borderBottom: "1px solid #737373",
                paddingBottom: "2px",
                margin: "0 0 4px 0",
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
                    <div key={idx} style={{ fontSize: "10.5px" }}>
                      <strong>{parts[0]}: </strong>
                      <span>{parts.slice(1).join(" – ")}</span>
                    </div>
                  );
                }

                return (
                  <div key={idx} style={{ fontSize: "10.5px" }}>
                    • {skill}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Custom Sections */}
        {customSections?.map((cSec, idx) => (
          <section key={idx} style={{ marginBottom: "10px", pageBreakInside: "avoid" }}>
            <h2
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                borderBottom: "1px solid #737373",
                paddingBottom: "2px",
                margin: "0 0 4px 0",
                color: accentColor,
              }}
            >
              {cSec.title}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {cSec.entries?.length > 0 ? (
                cSec.entries.map((item, eIdx) => (
                  <div key={eIdx}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div>
                        <strong style={{ fontSize: "11px" }}>{item.title}</strong>
                        {item.organization && <span> — {item.organization}</span>}
                      </div>
                      {item.dateRange && <span style={{ fontSize: "10px", fontStyle: "italic" }}>{item.dateRange}</span>}
                    </div>
                    {item.bullets?.length > 0 && (
                      <ul style={{ margin: "2px 0 0 0", paddingLeft: "16px" }}>
                        {item.bullets.map((b, bIdx) => renderBulletItem(b, bIdx))}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ fontSize: "10.5px" }}>{cSec.content}</div>
              )}
            </div>
          </section>
        ))}
      </div>
    );
  }

  // -------------------------------------------------------------
  // TEMPLATE 6: MINIMALIST COMPACT (Max 1-Page Space Optimization)
  // -------------------------------------------------------------
  return (
    <div
      id={id}
      style={{
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        fontSize: "10.5px",
        lineHeight: "1.34",
        color: "#0f172a",
        backgroundColor: "#ffffff",
        padding: "20px 24px",
        width: "100%",
        maxWidth: "794px",
        minHeight: "1123px",
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `2px solid ${accentColor}`, paddingBottom: "6px", marginBottom: "7px" }}>
        <div>
          <h1 style={{ fontSize: "18px", fontWeight: "800", color: accentColor, margin: "0", letterSpacing: "-0.02em" }}>
            {name}
          </h1>
          {headline && (
            <div style={{ fontSize: "10px", fontWeight: "600", color: "#64748b" }}>
              {headline}
            </div>
          )}
        </div>
        <div style={{ textAlign: "right", fontSize: "9.5px", color: "#475569" }}>
          <div>{contact.email} {contact.mobile && `• ${contact.mobile}`}</div>
          {contact.linkedin && <div>{contact.linkedin}</div>}
        </div>
      </header>

      {!hasStructuredData && renderFallbackContent()}

      {/* Summary */}
      {summary && (
        <section style={{ marginBottom: "7px", pageBreakInside: "avoid" }}>
          <p style={{ margin: "0", color: "#334155", textAlign: "justify", fontSize: "10px" }}>{summary}</p>
        </section>
      )}

      {/* Skills */}
      {skills?.length > 0 && (
        <section style={{ marginBottom: "7px", pageBreakInside: "avoid" }}>
          <div style={{ borderBottom: "1px solid #cbd5e1", paddingBottom: "1px", marginBottom: "3px" }}>
            <span style={{ fontWeight: "800", textTransform: "uppercase", fontSize: "10px", color: accentColor, letterSpacing: "0.05em" }}>
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
                  <div key={idx} style={{ fontSize: "10px", color: "#1e293b" }}>
                    <strong>{parts[0]}: </strong>
                    <span>{parts.slice(1).join(" – ")}</span>
                  </div>
                );
              }

              return (
                <div key={idx} style={{ fontSize: "10px", color: "#1e293b" }}>
                  • {skill}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Work Experience */}
      {experience?.length > 0 && (
        <section style={{ marginBottom: "7px" }}>
          <div style={{ borderBottom: "1px solid #cbd5e1", paddingBottom: "1px", marginBottom: "3px" }}>
            <span style={{ fontWeight: "800", textTransform: "uppercase", fontSize: "10px", color: accentColor, letterSpacing: "0.05em" }}>
              EXPERIENCE
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {experience.map((item, idx) => (
              <div key={idx} style={{ pageBreakInside: "avoid" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span>
                    <strong style={{ fontSize: "10.5px" }}>{item.title}</strong>
                    {item.organization && <span style={{ color: "#475569" }}> | {item.organization}</span>}
                  </span>
                  {item.dateRange && (
                    <span style={{ fontSize: "9px", color: "#64748b", fontWeight: "600" }}>{item.dateRange}</span>
                  )}
                </div>
                {item.bullets?.length > 0 ? (
                  <ul style={{ margin: "1px 0 0 0", paddingLeft: "14px", color: "#334155" }}>
                    {item.bullets.map((b, bIdx) => renderBulletItem(b, bIdx))}
                  </ul>
                ) : item.rawText ? (
                  <p style={{ margin: "1px 0 0 0", color: "#334155", fontSize: "10px" }}>{item.rawText}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <section style={{ marginBottom: "7px" }}>
          <div style={{ borderBottom: "1px solid #cbd5e1", paddingBottom: "1px", marginBottom: "3px" }}>
            <span style={{ fontWeight: "800", textTransform: "uppercase", fontSize: "10px", color: accentColor, letterSpacing: "0.05em" }}>
              PROJECTS
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {projects.map((proj, idx) => (
              <div key={idx} style={{ pageBreakInside: "avoid" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <strong style={{ fontSize: "10.5px" }}>{proj.title}</strong>
                  {proj.dateRange && <span style={{ fontSize: "9px", color: "#64748b" }}>{proj.dateRange}</span>}
                </div>
                {proj.bullets?.length > 0 ? (
                  <ul style={{ margin: "1px 0 0 0", paddingLeft: "14px", color: "#334155" }}>
                    {proj.bullets.map((b, bIdx) => renderBulletItem(b, bIdx))}
                  </ul>
                ) : proj.rawText ? (
                  <p style={{ margin: "1px 0 0 0", color: "#334155", fontSize: "10px" }}>{proj.rawText}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <section style={{ marginBottom: "7px", pageBreakInside: "avoid" }}>
          <div style={{ borderBottom: "1px solid #cbd5e1", paddingBottom: "1px", marginBottom: "3px" }}>
            <span style={{ fontWeight: "800", textTransform: "uppercase", fontSize: "10px", color: accentColor, letterSpacing: "0.05em" }}>
              EDUCATION
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            {education.map((edu, idx) => (
              <div key={idx} style={{ pageBreakInside: "avoid" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span>
                    <strong style={{ fontSize: "10px" }}>{edu.title}</strong>
                    {edu.organization && <span style={{ color: "#475569" }}> — {edu.organization}</span>}
                    {edu.bullets?.length > 0 && (
                      <span style={{ color: "#64748b" }}> ({edu.bullets.join(" • ")})</span>
                    )}
                  </span>
                  {edu.dateRange && <span style={{ fontSize: "9px", color: "#64748b" }}>{edu.dateRange}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Custom Sections */}
      {customSections?.map((cSec, idx) => (
        <section key={idx} style={{ marginBottom: "7px", pageBreakInside: "avoid" }}>
          <div style={{ borderBottom: "1px solid #cbd5e1", paddingBottom: "1px", marginBottom: "3px" }}>
            <span style={{ fontWeight: "800", textTransform: "uppercase", fontSize: "10px", color: accentColor, letterSpacing: "0.05em" }}>
              {cSec.title}
            </span>
          </div>
          {cSec.entries?.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {cSec.entries.map((item, eIdx) => (
                <div key={eIdx}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span>
                      <strong style={{ fontSize: "10px" }}>{item.title}</strong>
                      {item.organization && <span style={{ color: "#475569" }}> — {item.organization}</span>}
                    </span>
                    {item.dateRange && <span style={{ fontSize: "9px", color: "#64748b" }}>{item.dateRange}</span>}
                  </div>
                  {item.bullets?.length > 0 && (
                    <ul style={{ margin: "1px 0 0 0", paddingLeft: "14px", color: "#334155" }}>
                      {item.bullets.map((b, bIdx) => renderBulletItem(b, bIdx))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: "#334155", fontSize: "9.5px" }}>{cSec.content}</div>
          )}
        </section>
      ))}
    </div>
  );
}
