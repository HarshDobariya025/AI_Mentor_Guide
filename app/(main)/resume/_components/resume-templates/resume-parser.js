// Ultra-resilient Markdown & Plain-Text Resume Parser for multi-template rendering
export function parseMarkdownResume(markdownContent, defaultName = "Candidate Name") {
  if (!markdownContent || typeof markdownContent !== "string") {
    return {
      name: defaultName,
      headline: "",
      contact: { email: "", mobile: "", linkedin: "", twitter: "", location: "", links: [] },
      summary: "",
      skills: [],
      experience: [],
      education: [],
      projects: [],
      customSections: [],
      rawContent: "",
    };
  }

  // 1. Normalize line breaks to standard \n
  const text = markdownContent
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();

  // Keep original lines (with leading indentation intact for sub-bullets)
  const rawLines = text.split("\n");

  const result = {
    name: defaultName,
    headline: "",
    contact: {
      email: "",
      mobile: "",
      linkedin: "",
      twitter: "",
      location: "",
      links: [],
    },
    summary: "",
    skills: [],
    experience: [],
    education: [],
    projects: [],
    customSections: [],
    rawContent: text,
  };

  // 2. Extract Candidate Name & Headline
  const divNameMatch = text.match(/<div align=["']center["']>([^<]+)<\/div>/i);
  if (divNameMatch && divNameMatch[1].trim() && !divNameMatch[1].includes("@")) {
    result.name = divNameMatch[1].trim();
  } else {
    const h1Match = text.match(/^#\s+([^\n]+)/m);
    if (h1Match && h1Match[1].trim()) {
      result.name = h1Match[1].trim();
    } else {
      const nonBlankIndices = [];
      rawLines.forEach((l, idx) => {
        const trimmed = l.trim();
        if (trimmed.length > 0 && !trimmed.startsWith("http") && !trimmed.includes("@")) {
          nonBlankIndices.push(idx);
        }
      });

      if (nonBlankIndices.length > 0) {
        const nameIdx = nonBlankIndices[0];
        const lineText = rawLines[nameIdx].trim();
        if (
          lineText.length < 50 &&
          !lineText.includes(":") &&
          !lineText.includes("|") &&
          !lineText.toLowerCase().startsWith("summary") &&
          !lineText.toLowerCase().startsWith("experience") &&
          !lineText.toLowerCase().startsWith("skill")
        ) {
          result.name = lineText.replace(/^[#*\s]+|[#*\s]+$/g, "").trim();

          // Check if there is a professional headline on the very next line (e.g. "Full Stack Developer / Mobile App Developer")
          if (nonBlankIndices.length > 1 && nonBlankIndices[1] === nameIdx + 1) {
            const possibleHeadline = rawLines[nameIdx + 1].trim();
            if (
              possibleHeadline.length < 70 &&
              !possibleHeadline.includes("@") &&
              !possibleHeadline.toLowerCase().includes("skill") &&
              !possibleHeadline.toLowerCase().includes("education")
            ) {
              result.headline = possibleHeadline;
            }
          }
        }
      }
    }
  }

  // 3. Extract Contact Details
  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
  if (emailMatch) result.contact.email = emailMatch[1];

  const phoneMatch = text.match(/(?:📱|\bphone|\bmobile|\btel|\bcell)?[:\s]*(\(?\+?[0-9]{1,4}\)?[\s.-]?[0-9]{3,5}[\s.-]?[0-9]{4,6})/i);
  if (phoneMatch) result.contact.mobile = phoneMatch[1].trim();

  const linkedinMatch =
    text.match(/\[(?:LinkedIn)\]\((https?:\/\/[^\s)]+)\)/i) ||
    text.match(/((?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i);
  if (linkedinMatch) {
    const url = linkedinMatch[1] || linkedinMatch[0];
    result.contact.linkedin = url.startsWith("http") ? url : `https://${url}`;
  }

  const twitterMatch =
    text.match(/\[(?:Twitter|X)\]\((https?:\/\/[^\s)]+)\)/i) ||
    text.match(/((?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/[a-zA-Z0-9_-]+)/i);
  if (twitterMatch) {
    const url = twitterMatch[1] || twitterMatch[0];
    result.contact.twitter = url.startsWith("http") ? url : `https://${url}`;
  }

  // 4. Known section keywords
  const KNOWN_SECTIONS = [
    "summary",
    "professional summary",
    "about",
    "profile",
    "objective",
    "career objective",
    "skills",
    "technical skills",
    "skills & expertise",
    "skills and expertise",
    "competencies",
    "technologies",
    "core competencies",
    "technical skills & competencies",
    "experience",
    "work experience",
    "employment history",
    "professional experience",
    "work history",
    "education",
    "academic background",
    "qualifications",
    "academic qualifications",
    "projects",
    "selected projects",
    "key projects",
    "personal projects",
    "key projects & initiatives",
    "achievements",
    "certifications",
    "awards",
    "honors",
    "publications",
    "interests",
  ];

  const isSectionHeader = (rawLine) => {
    const trimmed = rawLine.trim();
    if (!trimmed) return false;

    // Do not match indented lines as section headers
    if (/^\s{2,}|\t/.test(rawLine)) return false;

    const mdMatch = trimmed.match(/^(?:##?|###)\s+(.+)$/);
    if (mdMatch) {
      const clean = mdMatch[1].replace(/<[^>]*>/g, "").trim();
      if (clean.toLowerCase() === result.name.toLowerCase() || clean.includes("@")) {
        return false;
      }
      return true;
    }

    const boldMatch = trimmed.match(/^\*\*([^*]+)\*\*$/);
    if (boldMatch) {
      const clean = boldMatch[1].trim().toLowerCase();
      if (clean.length < 45 && KNOWN_SECTIONS.some((k) => clean === k || clean.startsWith(k + " ") || clean.endsWith(" " + k))) {
        return true;
      }
    }

    const cleanLine = trimmed.replace(/^[#*_\-\s:]+|[#*_\-\s:]+$/g, "").trim();
    if (cleanLine.length >= 3 && cleanLine.length <= 45) {
      const lower = cleanLine.toLowerCase();
      if (KNOWN_SECTIONS.some((k) => lower === k || lower.startsWith(k + " ") || lower.endsWith(" " + k))) {
        return true;
      }
    }

    return false;
  };

  const getCleanHeading = (line) => {
    return line
      .replace(/^(?:##?|###)\s+/, "")
      .replace(/<[^>]*>/g, "")
      .replace(/^[#*_\-\s:]+|[#*_\-\s:]+$/g, "")
      .trim();
  };

  // Group lines into sections
  const sections = [];
  let currentHeader = "HEADER_INFO";
  let currentRawLines = [];

  for (let i = 0; i < rawLines.length; i++) {
    const rawLine = rawLines[i];
    if (isSectionHeader(rawLine)) {
      if (currentRawLines.length > 0) {
        sections.push({
          header: currentHeader,
          content: currentRawLines.join("\n").trim(),
        });
      }
      currentHeader = getCleanHeading(rawLine);
      currentRawLines = [];
    } else {
      currentRawLines.push(rawLine);
    }
  }

  if (currentRawLines.length > 0) {
    sections.push({
      header: currentHeader,
      content: currentRawLines.join("\n").trim(),
    });
  }

  sections.forEach((sec) => {
    if (sec.header === "HEADER_INFO" || !sec.content) return;
    assignSection(sec.header, sec.content, result);
  });

  return result;
}

// Helper to assign parsed sections into resume result
function assignSection(heading, body, result) {
  if (!body) return;
  const headingLower = heading.toLowerCase();

  // Summary
  if (
    headingLower.includes("summary") ||
    headingLower.includes("about") ||
    headingLower.includes("profile") ||
    headingLower.includes("objective")
  ) {
    result.summary = body.replace(/^[#*\s-]+/, "").trim();
  }
  // Skills
  else if (
    headingLower.includes("skill") ||
    headingLower.includes("technologies") ||
    headingLower.includes("stack") ||
    headingLower.includes("competencies")
  ) {
    result.skills = parseSkills(body);
  }
  // Experience
  else if (
    headingLower.includes("experience") ||
    headingLower.includes("employment") ||
    headingLower.includes("work") ||
    headingLower.includes("history")
  ) {
    result.experience = parseSubEntries(body);
  }
  // Education
  else if (
    headingLower.includes("education") ||
    headingLower.includes("academic") ||
    headingLower.includes("qualifications")
  ) {
    result.education = parseSubEntries(body);
  }
  // Projects
  else if (headingLower.includes("project")) {
    result.projects = parseSubEntries(body);
  }
  // Custom Section (Achievements, Certifications, Publications, etc.)
  else {
    result.customSections.push({
      title: heading,
      content: body,
      entries: parseSubEntries(body),
    });
  }
}

// Helper to parse skills (normalizes broken line wraps and cleans bullets)
function parseSkills(body) {
  if (!body) return [];

  // Normalize broken line wraps like "Frontend \n Development"
  const normalizedBody = body
    .replace(/Frontend\s*\n\s*[-*•]?\s*Development/gi, "Frontend Development")
    .replace(/Mobile\s*\n\s*[-*•]?\s*Development/gi, "Mobile Development")
    .replace(/Backend\s*\n\s*[-*•]?\s*Development/gi, "Backend Development")
    .replace(/Cloud\s*\n\s*[-*•]?\s*Technologies/gi, "Cloud Technologies");

  const rawLines = normalizedBody
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const skillsList = [];

  rawLines.forEach((line) => {
    // Strip leading asterisks or dashes
    const cleanLine = line.replace(/^[-*•]\s*/, "").replace(/^\*\s*/, "").trim();
    if (!cleanLine) return;

    if (cleanLine.includes(" – ") || cleanLine.includes(": ") || cleanLine.includes(" - ")) {
      skillsList.push(cleanLine);
    } else if (cleanLine.includes(",")) {
      cleanLine
        .split(",")
        .map((s) => s.trim().replace(/^[-*•]\s*/, ""))
        .filter(Boolean)
        .forEach((s) => skillsList.push(s));
    } else {
      skillsList.push(cleanLine);
    }
  });

  return skillsList;
}

// Helper to parse sub-entries within a section (cleans bullets, extracts scores & dates)
function parseSubEntries(body) {
  if (!body || !body.trim()) return [];

  const rawLines = body.split("\n");
  const entries = [];
  let currentEntry = null;

  for (let i = 0; i < rawLines.length; i++) {
    const rawLine = rawLines[i];
    const line = rawLine.trim();
    if (!line) continue;

    // Check if indented (sub-bullet belonging to current entry)
    const isIndented = /^\s{2,}|\t/.test(rawLine);
    const isH3 = line.startsWith("### ");
    const isTopBullet = !isIndented && (line.startsWith("* ") || line.startsWith("- ") || line.startsWith("• "));
    const isBoldTitle = !isIndented && /^\*\*[^*]+\*\*/.test(line);

    if (isH3 || isTopBullet || isBoldTitle) {
      if (currentEntry) entries.push(currentEntry);

      let header = line.replace(/^\s*(###|\*|-|•)\s+|\*\*/g, "").replace(/\*\*$/, "").trim();
      let title = header;
      let organization = "";
      let dateRange = "";
      const initialBullets = [];

      // Parse Date if enclosed in parens like (Mar '23) or (Jan '24 - Apr '24)
      const dateInParens = header.match(/\(([^)]*(?:19|20|'|\bPresent\b)[^)]*)\)$/);
      if (dateInParens) {
        dateRange = dateInParens[1].trim();
        header = header.replace(/\(([^)]*(?:19|20|'|\bPresent\b)[^)]*)\)$/, "").trim();
        title = header;
      }

      // Parse Title @ Org or Title | Org or Title - Org
      if (header.includes(" @ ")) {
        const parts = header.split(" @ ");
        title = parts[0].trim();
        organization = parts[1].trim();
      } else if (header.includes(" | ")) {
        const parts = header.split(" | ");
        title = parts[0].trim();
        organization = parts[1].trim();
        // If there are additional parts (e.g. "PR : 92.50%"), capture as score bullet
        if (parts.length > 2) {
          for (let p = 2; p < parts.length; p++) {
            initialBullets.push(parts[p].trim());
          }
        }
      } else if (header.includes(" - ") && !dateRange) {
        const parts = header.split(" - ");
        title = parts[0].trim();
        organization = parts.slice(1).join(" - ").trim();
      }

      currentEntry = {
        title,
        organization,
        dateRange,
        bullets: initialBullets,
        rawText: "",
      };
    } else if (currentEntry) {
      // Check if line looks like a date range on its own line
      const isDate =
        !currentEntry.dateRange &&
        /(\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|20\d\d|19\d\d)\b.*(Present|\b\d{4}\b|\b'\d\d\b))/i.test(line);

      if (isDate) {
        currentEntry.dateRange = line.replace(/^[–—\s*-]+|[–—\s*]+$/g, "").trim();
      } else {
        // Strip ANY leading whitespace, dashes, or asterisks
        const cleanBullet = line.replace(/^\s*[-*•]+\s*/, "").replace(/^[*•-]\s*/, "").trim();
        if (cleanBullet) {
          currentEntry.bullets.push(cleanBullet);
        }
      }
    } else {
      // Freeform leading lines
      const cleanLine = line.replace(/^\s*[-*•]+\s*/, "").trim();
      currentEntry = {
        title: cleanLine,
        organization: "",
        dateRange: "",
        bullets: [],
        rawText: "",
      };
    }
  }

  if (currentEntry) entries.push(currentEntry);
  return entries;
}
