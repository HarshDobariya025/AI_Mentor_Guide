"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateWithRetryAndFallback(prompt) {
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
        const result = await candidateModel.generateContent(prompt);
        return result;
      } catch (err) {
        lastError = err;
        const errMsg = err?.message || "";
        console.warn(`[Roadmap AI Fallback] ${modelName} error: ${errMsg}`);

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

  throw new Error(`AI service busy. Please try again. (${lastError?.message || "Service unavailable"})`);
}

export async function generateCareerRoadmap({ targetRole, targetLevel, timeframe, additionalNotes }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
You are an expert career strategist and tech mentor. Generate a detailed, highly actionable, step-by-step career roadmap for the user based on the following details:
- Target Role: ${targetRole}
- Target Level: ${targetLevel}
- Timeframe: ${timeframe}
- User Industry/Sub-industry: ${user.industry || "General Tech"}
- User Current Skills: ${user.skills ? user.skills.join(", ") : "Not specified"}
- User Experience: ${user.experience || 0} years
- Additional Notes / Focus Areas: ${additionalNotes || "None"}

Return your response in strictly valid JSON format with NO markdown code fences wrapping the root JSON.
Use this structure:
{
  "targetRole": "${targetRole}",
  "targetLevel": "${targetLevel}",
  "timeframe": "${timeframe}",
  "overview": "A compelling 2-3 sentence overview of this career journey.",
  "markdownContent": "A full, beautifully formatted Markdown roadmap with headers, bullet points, study links/resources, and key tips.",
  "checklistData": [
    {
      "phaseId": "phase-1",
      "phaseTitle": "Phase 1: Foundation & Essentials",
      "duration": "Month 1",
      "items": [
        { "id": "p1-1", "title": "Milestone title", "description": "Brief actionable task details", "completed": false }
      ]
    },
    {
      "phaseId": "phase-2",
      "phaseTitle": "Phase 2: Core Mastery & Projects",
      "duration": "Month 2-3",
      "items": [
        { "id": "p2-1", "title": "Milestone title", "description": "Brief actionable task details", "completed": false }
      ]
    },
    {
      "phaseId": "phase-3",
      "phaseTitle": "Phase 3: Advanced Skills & Interview Prep",
      "duration": "Month 4-6",
      "items": [
        { "id": "p3-1", "title": "Milestone title", "description": "Brief actionable task details", "completed": false }
      ]
    }
  ]
}

Ensure you provide at least 3-4 phases in checklistData, each with 3-5 concrete actionable items.
`;

  const result = await generateWithRetryAndFallback(prompt);
  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  const data = JSON.parse(cleanedText);

  // Save to database
  const roadmap = await db.roadmap.upsert({
    where: { userId: user.id },
    update: {
      targetRole: data.targetRole,
      targetLevel: data.targetLevel,
      timeframe: data.timeframe,
      markdownContent: data.markdownContent,
      checklistData: data.checklistData,
      progress: 0,
    },
    create: {
      userId: user.id,
      targetRole: data.targetRole,
      targetLevel: data.targetLevel,
      timeframe: data.timeframe,
      markdownContent: data.markdownContent,
      checklistData: data.checklistData,
      progress: 0,
    },
  });

  revalidatePath("/roadmap");
  return roadmap;
}

export async function getCareerRoadmap() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) return null;

  return await db.roadmap.findUnique({
    where: { userId: user.id },
  });
}

export async function updateRoadmapProgress({ checklistData, progress }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const updated = await db.roadmap.update({
    where: { userId: user.id },
    data: {
      checklistData,
      progress,
    },
  });

  revalidatePath("/roadmap");
  return updated;
}

export async function updateRoadmapMarkdown({ markdownContent }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const updated = await db.roadmap.update({
    where: { userId: user.id },
    data: { markdownContent },
  });

  revalidatePath("/roadmap");
  return updated;
}

export async function deleteCareerRoadmap() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  await db.roadmap.delete({
    where: { userId: user.id },
  });

  revalidatePath("/roadmap");
  return { success: true };
}
