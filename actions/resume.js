"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper to execute generation with automatic retry and model fallback (handles 503 Service Unavailable)
async function generateWithRetryAndFallback(contents) {
  const modelsToTry = [
    "gemini-1.5-flash",
    "gemini-2.0-flash",
    "gemini-2.5-flash",
    "gemini-1.5-pro",
  ];

  let lastError = null;

  for (const modelName of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const candidateModel = genAI.getGenerativeModel({ model: modelName });
        const result = await candidateModel.generateContent(contents);
        return result;
      } catch (err) {
        lastError = err;
        const errMsg = err?.message || "";
        console.warn(`[AI Fallback] ${modelName} (attempt ${attempt + 1}) error: ${errMsg}`);

        if (errMsg.includes("503") || errMsg.includes("high demand") || errMsg.includes("429")) {
          if (attempt === 0) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            continue;
          }
        }
        break;
      }
    }
  }

  throw new Error(
    `AI service is currently experiencing high demand. Please try again in a few moments. (${lastError?.message || "All models busy"})`
  );
}

export async function saveResume(content) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  try {
    const resume = await db.resume.upsert({   // update or insert
      where: {  //if iser found then update content
        userId: user.id,
      },
      update: {
        content,
      },
      create: {  // if not found then create
        userId: user.id,
        content,
      },
    });

    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw new Error("Failed to save resume");
  }
}


export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  return await db.resume.findUnique({
    where: {
      userId: user.id,
    },
  });
}


export async function improveWithAI({ current, type }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });
  if (!user) throw new Error("User not found");

  const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${current}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    
    Format the response as a single paragraph without any additional text or explanations.
  `;

  try {
    const result = await generateWithRetryAndFallback(prompt);
    const response = result.response;
    const improvedContent = response.text().trim();
    return improvedContent;
  } catch (error) {
    console.error("Error improving content:", error);
    throw new Error("Failed to improve content");
  }
}

export async function analyzeResumeAts({
  resumeContent,
  pdfBase64,
  jobDescription,
  targetRole = "",
  companyName = "",
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });
  if (!user) throw new Error("User not found");

  if (!jobDescription || jobDescription.trim().length < 20) {
    throw new Error("Please provide a valid Job Description with at least 20 characters.");
  }

  let contentToAnalyze = resumeContent?.trim();
  if (!contentToAnalyze && !pdfBase64) {
    const existing = await db.resume.findUnique({
      where: { userId: user.id },
    });
    contentToAnalyze = existing?.content?.trim();
  }

  if (!contentToAnalyze && !pdfBase64) {
    throw new Error("Please upload a resume file (PDF/TXT), paste your resume, or build one in the editor first.");
  }

  const prompt = `
You are a Lead ATS (Applicant Tracking System) Auditor and Senior Technical Recruiter.
Analyze the candidate's Resume against the Target Job Description with high precision and realistic recruiter standards.

Candidate Background / Industry: ${user.industry || "General Professional"}
Target Role: ${targetRole || "Role specified in Job Description"}
Target Company: ${companyName || "Target Company"}

--- TARGET JOB DESCRIPTION ---
${jobDescription}

${contentToAnalyze ? `--- CANDIDATE RESUME ---
${contentToAnalyze}` : `(The candidate's resume is attached as an uploaded PDF document. Please thoroughly analyze all sections, skills, work experience, projects, and education from the attached document.)`}

--- INSTRUCTIONS ---
1. Calculate a realistic ATS Match Score between 0 and 100 based on:
   - Keyword Match (35%): Direct and synonymous matching for required tech, frameworks, and methodologies.
   - Skills & Stack Alignment (25%): Coverage of essential technical/hard skills required.
   - Measurable Business Impact (20%): Use of metrics, percentages, numbers, and action-oriented STAR format.
   - ATS Structure & Readability (20%): Standard headings, layout clarity, contact details, chronological structure.
2. Determine matchLevel:
   - "Strong Match" (80-100)
   - "Moderate Match" (65-79)
   - "Low Match" (45-64)
   - "Critical Mismatch" (<45)
3. Provide an executive summary (2-3 sentences) detailing the resume's alignment and largest gap.
4. List 6-12 matchedKeywords (keywords found in BOTH resume and JD).
5. List 5-10 missingKeywords (crucial skills/keywords present in JD but ABSENT or weak in resume).
6. Group matched and missing into hardSkills and softSkills.
7. List 3-4 specific strengths.
8. List 3-5 concrete, prioritized improvement recommendations.
9. Provide 2-3 specific bullet rewrites:
   - original: A weak or generic bullet from the candidate's resume
   - improved: An ATS-optimized, high-impact rewrite incorporating missing keywords and quantifiable metrics
   - reason: Why this rewrite scores higher with ATS and hiring managers
${pdfBase64 ? `10. extractedResumeText: A clean markdown transcription of the text extracted from the candidate's uploaded resume document.` : ""}

Return strictly valid JSON only. Do NOT include markdown code fences (\`\`\`json) or any extra text.

JSON Schema:
{
  "atsScore": 82,
  "matchLevel": "Strong Match",
  "targetRole": "${targetRole || "Target Role"}",
  "companyName": "${companyName || ""}",
  "summary": "Executive summary...",
  "breakdown": {
    "keywordMatch": 80,
    "skillsMatch": 75,
    "quantifiableImpact": 85,
    "formattingClarity": 90
  },
  "matchedKeywords": ["React", "TypeScript", "Node.js"],
  "missingKeywords": ["Docker", "Kubernetes", "AWS"],
  "hardSkills": {
    "matched": ["React", "TypeScript"],
    "missing": ["Docker", "Kubernetes"]
  },
  "softSkills": {
    "matched": ["Agile", "Team Collaboration"],
    "missing": ["Cross-functional stakeholder leadership"]
  },
  "strengths": ["Clear timeline and work progression", "Strong action verbs in recent projects"],
  "improvements": ["Add Docker containerization to project descriptions", "Quantify revenue or latency impact"],
  "suggestedBulletRewrites": [
    {
      "original": "Worked on backend APIs with Node.js.",
      "improved": "Architected and deployed scalable Node.js microservices, decreasing API latency by 32% for 50k+ active users.",
      "reason": "Uses action verb, adds quantifiable metrics, and aligns with target architecture keywords."
    }
  ]${pdfBase64 ? `,
  "extractedResumeText": "Clean markdown representation of the candidate resume extracted from the document"` : ""}
}
`;

  try {
    let result;
    if (pdfBase64) {
      result = await generateWithRetryAndFallback([
        prompt,
        {
          inlineData: {
            data: pdfBase64,
            mimeType: "application/pdf",
          },
        },
      ]);
    } else {
      result = await generateWithRetryAndFallback(prompt);
    }

    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const data = JSON.parse(cleanedText);

    // Preserve jobDescription, targetRole, companyName so they reload properly
    const enrichedData = {
      ...data,
      jobDescription,
      targetRole: targetRole || data.targetRole || "",
      companyName: companyName || data.companyName || "",
      extractedResumeText: data.extractedResumeText || (contentToAnalyze || ""),
    };

    const finalContent = contentToAnalyze || data.extractedResumeText || "";

    // Save ATS score and feedback to DB
    await db.resume.upsert({
      where: { userId: user.id },
      update: {
        atsScore: data.atsScore,
        feedback: JSON.stringify(enrichedData),
        ...(finalContent ? { content: finalContent } : {}),
      },
      create: {
        userId: user.id,
        content: finalContent,
        atsScore: data.atsScore,
        feedback: JSON.stringify(enrichedData),
      },
    });

    revalidatePath("/resume");
    return enrichedData;
  } catch (error) {
    console.error("Error analyzing resume ATS score:", error);
    throw new Error(error.message || "Failed to analyze resume with ATS");
  }
}

export async function clearAtsFeedback() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  await db.resume.update({
    where: { userId: user.id },
    data: {
      atsScore: null,
      feedback: null,
    },
  });

  revalidatePath("/resume");
  return { success: true };
}