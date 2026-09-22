"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MapPin, Sparkles, Target, Zap } from "lucide-react";
import { toast } from "sonner";
import { generateCareerRoadmap } from "@/actions/roadmap";

export default function RoadmapGeneratorForm({ onGenerated }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      targetRole: "",
      targetLevel: "Mid",
      timeframe: "6 months",
      additionalNotes: "",
    },
  });

  const selectedLevel = watch("targetLevel");
  const selectedTimeframe = watch("timeframe");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await generateCareerRoadmap(data);
      toast.success("Career Roadmap generated successfully!");
      if (onGenerated) onGenerated(result);
    } catch (err) {
      toast.error(err.message || "Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto border-primary/20 bg-card/60 backdrop-blur-sm shadow-xl">
      <CardHeader className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mx-auto w-fit">
          <Sparkles className="h-6 w-6 animate-pulse" />
        </div>
        <CardTitle className="text-2xl md:text-3xl font-bold">
          Build Your Personalized AI Career Roadmap
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Define your target tech role, experience tier, and timeframe to generate an interactive milestone roadmap with a checklist and editable guide.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="targetRole" className="font-semibold flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" /> Target Role / Title
            </Label>
            <Input
              id="targetRole"
              placeholder="e.g. Senior Frontend Engineer, AI Solutions Architect, DevOps Engineer"
              {...register("targetRole", { required: "Target role is required" })}
              className="bg-background"
            />
            {errors.targetRole && (
              <p className="text-sm text-destructive">{errors.targetRole.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetLevel" className="font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" /> Target Level
              </Label>
              <Select
                value={selectedLevel}
                onValueChange={(val) => setValue("targetLevel", val)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select target level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entry">Entry Level (Junior)</SelectItem>
                  <SelectItem value="Mid">Mid Level (Intermediate)</SelectItem>
                  <SelectItem value="Senior">Senior Engineer / Lead</SelectItem>
                  <SelectItem value="Staff">Staff / Principal Architect</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeframe" className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Goal Timeframe
              </Label>
              <Select
                value={selectedTimeframe}
                onValueChange={(val) => setValue("timeframe", val)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3 months">3 Months (Accelerated)</SelectItem>
                  <SelectItem value="6 months">6 Months (Standard)</SelectItem>
                  <SelectItem value="9 months">9 Months (Comprehensive)</SelectItem>
                  <SelectItem value="12 months">12 Months (Long term)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalNotes" className="font-semibold">
              Additional Focus Areas or Constraints (Optional)
            </Label>
            <Textarea
              id="additionalNotes"
              placeholder="e.g. Focus heavily on System Design, Next.js, Cloud deployments, or transitioning from QA to Dev."
              {...register("additionalNotes")}
              className="h-24 bg-background"
            />
          </div>

          <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Crafting Your Custom AI Roadmap...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Career Roadmap
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
