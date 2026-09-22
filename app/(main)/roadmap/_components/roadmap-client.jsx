"use client";

import React, { useState } from "react";
import RoadmapGeneratorForm from "./roadmap-form";
import RoadmapView from "./roadmap-view";

export default function RoadmapClient({ initialRoadmap }) {
  const [roadmap, setRoadmap] = useState(initialRoadmap);
  const [mode, setMode] = useState(initialRoadmap ? "view" : "form");

  const handleGenerated = (newRoadmap) => {
    setRoadmap(newRoadmap);
    setMode("view");
  };

  const handleRegenerate = () => {
    setMode("form");
  };

  return (
    <div>
      {mode === "form" ? (
        <RoadmapGeneratorForm onGenerated={handleGenerated} />
      ) : (
        <RoadmapView roadmap={roadmap} onRegenerate={handleRegenerate} />
      )}
    </div>
  );
}
