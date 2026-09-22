import React from "react";
import { getCareerRoadmap } from "@/actions/roadmap";
import RoadmapClient from "./_components/roadmap-client";

export const metadata = {
  title: "AI Career Roadmap | SensAI AI Mentor",
  description: "Generate and track custom AI-driven career roadmaps with interactive milestone checklists.",
};

export default async function RoadmapPage() {
  const initialRoadmap = await getCareerRoadmap();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <RoadmapClient initialRoadmap={initialRoadmap} />
    </div>
  );
}
