"use client";

import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Clock, Edit, ListCheck, Loader2, RefreshCw, Save, Sparkles, Trash2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { updateRoadmapProgress, updateRoadmapMarkdown, deleteCareerRoadmap } from "@/actions/roadmap";

export default function RoadmapView({ roadmap: initialRoadmap, onRegenerate }) {
  const [roadmap, setRoadmap] = useState(initialRoadmap);
  const [checklist, setChecklist] = useState(initialRoadmap.checklistData || []);
  const [markdown, setMarkdown] = useState(initialRoadmap.markdownContent || "");
  const [progress, setProgress] = useState(initialRoadmap.progress || 0);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [isSavingMarkdown, setIsSavingMarkdown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Recalculate progress based on checked items
  const handleToggleItem = async (phaseId, itemId) => {
    let totalItems = 0;
    let completedItems = 0;

    const updatedChecklist = checklist.map((phase) => {
      if (phase.phaseId === phaseId) {
        const updatedItems = phase.items.map((item) => {
          const isTarget = item.id === itemId;
          const isDone = isTarget ? !item.completed : item.completed;
          totalItems++;
          if (isDone) completedItems++;
          return { ...item, completed: isDone };
        });
        return { ...phase, items: updatedItems };
      } else {
        phase.items.forEach((item) => {
          totalItems++;
          if (item.completed) completedItems++;
        });
        return phase;
      }
    });

    const newProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    setChecklist(updatedChecklist);
    setProgress(newProgress);

    // Save to DB
    setIsSavingProgress(true);
    try {
      await updateRoadmapProgress({
        checklistData: updatedChecklist,
        progress: newProgress,
      });
      toast.success("Progress saved!");
    } catch (err) {
      toast.error("Failed to save progress");
    } finally {
      setIsSavingProgress(false);
    }
  };

  const handleSaveMarkdown = async () => {
    setIsSavingMarkdown(true);
    try {
      await updateRoadmapMarkdown({ markdownContent: markdown });
      toast.success("Roadmap notes updated!");
    } catch (err) {
      toast.error("Failed to update roadmap text");
    } finally {
      setIsSavingMarkdown(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this career roadmap?")) return;
    setIsDeleting(true);
    try {
      await deleteCareerRoadmap();
      toast.success("Roadmap deleted");
      if (onRegenerate) onRegenerate();
    } catch (err) {
      toast.error("Failed to delete roadmap");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Summary Card */}
      <Card className="border-primary/20 bg-gradient-to-r from-card via-card to-primary/5 shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="default" className="bg-primary text-primary-foreground font-semibold">
                  {roadmap.targetLevel} Level
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {roadmap.timeframe}
                </Badge>
              </div>
              <CardTitle className="text-3xl font-extrabold flex items-center gap-2">
                <Trophy className="h-7 w-7 text-yellow-500" />
                {roadmap.targetRole} Roadmap
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Track milestones, edit learning materials, and monitor your skill progression.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button variant="outline" size="sm" onClick={onRegenerate} className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4" /> New Roadmap
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="flex items-center gap-1 text-muted-foreground">
              Overall Roadmap Completion
            </span>
            <span className="text-primary font-bold text-lg">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3 bg-primary/15" />
        </CardContent>
      </Card>

      {/* Tabs View */}
      <Tabs defaultValue="checklist" className="w-full space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="checklist" className="flex items-center gap-2 font-semibold">
            <ListCheck className="h-4 w-4" /> Interactive Checklist
          </TabsTrigger>
          <TabsTrigger value="markdown" className="flex items-center gap-2 font-semibold">
            <Edit className="h-4 w-4" /> Full Guide & Notes
          </TabsTrigger>
        </TabsList>

        {/* Checklist Content */}
        <TabsContent value="checklist" className="space-y-6">
          {checklist.map((phase, phaseIdx) => {
            const phaseCompletedCount = phase.items.filter((i) => i.completed).length;
            const phaseTotalCount = phase.items.length;
            const phaseDone = phaseTotalCount > 0 && phaseCompletedCount === phaseTotalCount;

            return (
              <Card key={phase.phaseId || phaseIdx} className="border border-border/60 shadow-md">
                <CardHeader className="bg-muted/30 pb-3">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-md ${phaseDone ? "bg-emerald-500/20 text-emerald-500" : "bg-primary/10 text-primary"}`}>
                        {phaseDone ? <CheckCircle2 className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold">{phase.phaseTitle}</CardTitle>
                        {phase.duration && (
                          <CardDescription className="text-xs font-medium">
                            Duration: {phase.duration}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                    <Badge variant={phaseDone ? "default" : "secondary"}>
                      {phaseCompletedCount} / {phaseTotalCount} Completed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  {phase.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleItem(phase.phaseId, item.id)}
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer select-none ${
                        item.completed
                          ? "bg-emerald-500/5 border-emerald-500/30 text-muted-foreground"
                          : "bg-card hover:border-primary/40 hover:bg-accent/40"
                      }`}
                    >
                      <Checkbox
                        id={item.id}
                        checked={item.completed}
                        onCheckedChange={() => handleToggleItem(phase.phaseId, item.id)}
                        className="mt-1"
                      />
                      <div className="space-y-1">
                        <label
                          htmlFor={item.id}
                          className={`font-semibold text-base cursor-pointer ${
                            item.completed ? "line-through text-muted-foreground" : "text-foreground"
                          }`}
                        >
                          {item.title}
                        </label>
                        {item.description && (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Markdown Content */}
        <TabsContent value="markdown" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Roadmap Detailed Notes & Markdown
            </h3>
            <Button onClick={handleSaveMarkdown} disabled={isSavingMarkdown} className="flex items-center gap-1">
              {isSavingMarkdown ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Edits
            </Button>
          </div>
          <div className="border rounded-lg overflow-hidden bg-background">
            <MDEditor
              value={markdown}
              onChange={setMarkdown}
              height={600}
              preview="live"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
