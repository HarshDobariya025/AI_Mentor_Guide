"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  FileSearch,
  Target,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Wand2,
  Trash2,
  Loader2,
  UploadCloud,
  FileText,
  FileUp,
  Edit3,
  BookmarkCheck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { analyzeResumeAts, clearAtsFeedback, saveResume } from "@/actions/resume";
import { SAMPLE_JDS } from "./sample-jds";

export default function AtsScanner({
  resumeContent,
  initialScore,
  initialFeedback,
  onScoreUpdated,
  onNavigateToEdit,
}) {
  let parsedInitial = null;
  if (initialFeedback) {
    try {
      parsedInitial = typeof initialFeedback === "string" ? JSON.parse(initialFeedback) : initialFeedback;
    } catch (e) {
      // ignore
    }
  }

  // Resume source: "saved" | "upload" | "paste"
  const [resumeSource, setResumeSource] = useState("saved");
  const [customResumeText, setCustomResumeText] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null); // { name, size, type, base64 }

  // Target Job Description inputs
  const [jobDescription, setJobDescription] = useState(parsedInitial?.jobDescription || "");
  const [targetRole, setTargetRole] = useState(parsedInitial?.targetRole || "");
  const [companyName, setCompanyName] = useState(parsedInitial?.companyName || "");

  // Scanning & UI States
  const [isScanning, setIsScanning] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [analysis, setAnalysis] = useState(parsedInitial);
  const [copiedMissing, setCopiedMissing] = useState(false);
  const [copiedRewriteIndex, setCopiedRewriteIndex] = useState(null);

  const fileInputRef = useRef(null);

  // Active resume stats
  const savedWordCount = resumeContent ? resumeContent.trim().split(/\s+/).filter(Boolean).length : 0;
  const customWordCount = customResumeText ? customResumeText.trim().split(/\s+/).filter(Boolean).length : 0;

  // Handle sample JD button click
  const handleQuickFill = (sample) => {
    setJobDescription(sample.jd);
    setTargetRole(sample.role || sample.title);
    setCompanyName(sample.company);
    toast.info(`Loaded sample: ${sample.title}`);
  };

  // Handle file upload (PDF / TXT / MD)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        setUploadedFile({
          name: file.name,
          size: (file.size / 1024).toFixed(1) + " KB",
          type: "pdf",
          base64: base64Data,
        });
        setResumeSource("upload");
        toast.success(`Loaded PDF: ${file.name}`);
      };
      reader.readAsDataURL(file);
    } else if (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        setCustomResumeText(text);
        setUploadedFile({
          name: file.name,
          size: (file.size / 1024).toFixed(1) + " KB",
          type: "text",
        });
        setResumeSource("paste");
        toast.success(`Loaded file: ${file.name}`);
      };
      reader.readAsText(file);
    } else {
      toast.error("Please upload a PDF, TXT, or Markdown (.md) resume file.");
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.info("Removed uploaded file");
  };

  // Main scan handler
  const handleScan = async () => {
    let contentToScan = null;
    let pdfBase64ToScan = null;

    if (resumeSource === "saved") {
      if (!resumeContent || resumeContent.trim().length < 40) {
        toast.error("Your saved resume is empty. Please add content in the Form tab or upload/paste a resume.");
        return;
      }
      contentToScan = resumeContent;
    } else if (resumeSource === "upload") {
      if (!uploadedFile) {
        toast.error("Please select or drop a resume file to upload.");
        return;
      }
      if (uploadedFile.type === "pdf") {
        pdfBase64ToScan = uploadedFile.base64;
      } else {
        contentToScan = customResumeText;
      }
    } else if (resumeSource === "paste") {
      if (!customResumeText || customResumeText.trim().length < 40) {
        toast.error("Please paste your resume text (at least 40 characters).");
        return;
      }
      contentToScan = customResumeText;
    }

    if (!jobDescription || jobDescription.trim().length < 20) {
      toast.error("Please paste a target Job Description with at least 20 characters.");
      return;
    }

    setIsScanning(true);
    try {
      const data = await analyzeResumeAts({
        resumeContent: contentToScan,
        pdfBase64: pdfBase64ToScan,
        jobDescription,
        targetRole,
        companyName,
      });

      setAnalysis(data);
      if (onScoreUpdated) {
        onScoreUpdated(data.atsScore, JSON.stringify(data));
      }
      toast.success("ATS Resume Scan complete!");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to analyze resume with ATS");
    } finally {
      setIsScanning(false);
    }
  };

  // Clear previous analysis
  const handleClear = async () => {
    if (!confirm("Are you sure you want to clear the saved ATS analysis?")) return;
    setIsClearing(true);
    try {
      await clearAtsFeedback();
      setAnalysis(null);
      if (onScoreUpdated) onScoreUpdated(null, null);
      toast.success("ATS scan cleared");
    } catch (err) {
      toast.error("Failed to clear ATS feedback");
    } finally {
      setIsClearing(false);
    }
  };

  // Import scanned resume into active profile
  const handleImportToProfile = async () => {
    const textToSave = customResumeText || analysis?.extractedResumeText;
    if (!textToSave) {
      toast.error("No text available to import.");
      return;
    }

    setIsImporting(true);
    try {
      await saveResume(textToSave);
      toast.success("Imported this resume as your active Profile Resume!");
      if (onNavigateToEdit) onNavigateToEdit();
    } catch (err) {
      toast.error("Failed to import resume to profile");
    } finally {
      setIsImporting(false);
    }
  };

  const handleCopyMissing = () => {
    if (!analysis?.missingKeywords?.length) return;
    const text = analysis.missingKeywords.join(", ");
    navigator.clipboard.writeText(text);
    setCopiedMissing(true);
    toast.success("Missing keywords copied to clipboard!");
    setTimeout(() => setCopiedMissing(false), 2000);
  };

  const handleCopyRewrite = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedRewriteIndex(index);
    toast.success("Improved bullet point copied!");
    setTimeout(() => setCopiedRewriteIndex(null), 2000);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 65) return "text-amber-500";
    return "text-rose-500";
  };

  const getScoreBadgeVariant = (score) => {
    if (score >= 80) return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
    if (score >= 65) return "bg-amber-500/10 text-amber-500 border-amber-500/30";
    return "bg-rose-500/10 text-rose-500 border-rose-500/30";
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Top Banner / Setup Card */}
      <Card className="border border-primary/20 bg-gradient-to-r from-card via-card to-primary/5 shadow-md">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="outline" className="flex items-center gap-1.5 border-primary/30 text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> AI Recruiter & ATS Engine
                </Badge>
                {analysis?.atsScore !== undefined && (
                  <Badge variant="outline" className={getScoreBadgeVariant(analysis.atsScore)}>
                    Current Score: {analysis.atsScore}/100
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl md:text-3xl font-extrabold flex items-center gap-2">
                <FileSearch className="h-7 w-7 text-primary" />
                ATS Resume Checker & Job Description Matcher
              </CardTitle>
              <CardDescription className="text-sm md:text-base mt-1">
                Compare any resume (from your profile, an uploaded PDF, or pasted text) against a target job description to pinpoint missing keywords, compute ATS pass probability, and get instant bullet-point rewrites.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* STEP 1: RESUME SELECTION / UPLOAD SECTION */}
          <div className="space-y-3 p-4 rounded-xl border bg-muted/20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <FileText className="h-4 w-4" /> Step 1: Choose or Add Resume
              </span>
              <span className="text-xs text-muted-foreground">
                Select your profile resume, upload a PDF/file, or paste raw text
              </span>
            </div>

            {/* Resume Source Tabs */}
            <Tabs value={resumeSource} onValueChange={setResumeSource} className="w-full">
              <TabsList className="grid grid-cols-3 w-full max-w-md">
                <TabsTrigger value="saved" className="text-xs flex items-center gap-1.5">
                  <BookmarkCheck className="h-3.5 w-3.5" /> Saved Profile
                </TabsTrigger>
                <TabsTrigger value="upload" className="text-xs flex items-center gap-1.5">
                  <UploadCloud className="h-3.5 w-3.5" /> Upload File (PDF)
                </TabsTrigger>
                <TabsTrigger value="paste" className="text-xs flex items-center gap-1.5">
                  <Edit3 className="h-3.5 w-3.5" /> Paste Text
                </TabsTrigger>
              </TabsList>

              {/* Source 1: Saved Profile Resume */}
              <TabsContent value="saved" className="pt-3 space-y-2">
                <div className="p-3.5 rounded-lg border bg-background/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${savedWordCount > 40 ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
                      <span className="text-sm font-semibold">
                        {savedWordCount > 40 ? "Active Profile Resume Loaded" : "Profile Resume is Minimal / Empty"}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {savedWordCount} words
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 max-w-xl">
                      {resumeContent ? resumeContent.replace(/#/g, "").trim() : "No content written in the Form or Markdown tab yet."}
                    </p>
                  </div>

                  {onNavigateToEdit && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onNavigateToEdit}
                      className="text-xs shrink-0"
                    >
                      Edit in Builder <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </TabsContent>

              {/* Source 2: Upload Resume File */}
              <TabsContent value="upload" className="pt-3 space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.txt,.md"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {!uploadedFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-6 border-2 border-dashed border-primary/30 hover:border-primary/60 rounded-xl bg-background/60 hover:bg-muted/30 cursor-pointer transition-all flex flex-col items-center justify-center text-center space-y-2"
                  >
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <FileUp className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Click to upload your Resume</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Supports PDF (.pdf), Text (.txt), or Markdown (.md) documents
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-[11px]">
                      Gemini Multimodal Native PDF Scanning
                    </Badge>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg border bg-background/90 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold flex items-center gap-2">
                          {uploadedFile.name}
                          <Badge variant="outline" className="text-[10px] uppercase">
                            {uploadedFile.type}
                          </Badge>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {uploadedFile.size} • Ready for ATS scan
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Source 3: Paste Resume Text */}
              <TabsContent value="paste" className="pt-3 space-y-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Paste raw resume content (Experience, Skills, Projects, Summary)</span>
                    <span className="font-semibold">{customWordCount} words</span>
                  </div>
                  <Textarea
                    placeholder="Paste your complete resume text here (Markdown or plain text)..."
                    rows={6}
                    value={customResumeText}
                    onChange={(e) => setCustomResumeText(e.target.value)}
                    className="font-mono text-xs leading-relaxed bg-background"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* STEP 2: TARGET JOB DESCRIPTION SECTION */}
          <div className="space-y-4 p-4 rounded-xl border bg-muted/20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Target className="h-4 w-4" /> Step 2: Target Job Description
              </span>

              {/* Quick Fill Samples */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-muted-foreground uppercase font-semibold">
                  1-Click Samples:
                </span>
                {SAMPLE_JDS.map((sample) => (
                  <Button
                    key={sample.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickFill(sample)}
                    className="text-[11px] h-7 px-2 hover:border-primary/50"
                  >
                    {sample.title.split(" ")[0]} {sample.title.split(" ")[1]}
                  </Button>
                ))}
              </div>
            </div>

            {/* Target Role & Company */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Target Role / Job Title
                </label>
                <Input
                  placeholder="e.g. Senior Full-Stack Engineer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Target Company
                </label>
                <Input
                  placeholder="e.g. Stripe, Google, or Tech Startup"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-background"
                />
              </div>
            </div>

            {/* Target Job Description Textarea */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span className="font-semibold uppercase">Job Description Text *</span>
                <span>{jobDescription.length} characters</span>
              </div>
              <Textarea
                placeholder="Paste the job description, required qualifications, and key responsibilities..."
                rows={6}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="font-mono text-xs leading-relaxed bg-background resize-y"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              Scans against strict ATS keyword filters, tech stack alignment, and quantifiable metrics.
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {analysis && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  disabled={isClearing || isScanning}
                  className="text-muted-foreground hover:text-destructive"
                  title="Clear saved ATS analysis"
                >
                  {isClearing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </Button>
              )}

              <Button
                type="button"
                onClick={handleScan}
                disabled={isScanning}
                className="w-full sm:w-auto font-semibold px-6 shadow-md"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Auditing ATS Compatibility...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {analysis ? "Re-Scan Resume" : "Scan & Match Resume"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ANALYSIS REPORT SECTION */}
      {analysis && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          {/* Main Score Hero Card */}
          <Card className="border border-border/80 shadow-lg overflow-hidden bg-card">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 md:p-8 border-b">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                {/* Score Dial / Number */}
                <div className="flex items-center gap-6">
                  <div className="relative flex flex-col items-center justify-center h-28 w-28 rounded-2xl border-2 bg-background/90 shadow-inner shrink-0">
                    <span className={`text-4xl font-black tracking-tight ${getScoreColor(analysis.atsScore)}`}>
                      {analysis.atsScore}
                    </span>
                    <span className="text-[10px] font-semibold uppercase text-muted-foreground mt-0.5">
                      / 100 Score
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getScoreBadgeVariant(analysis.atsScore)}>
                        {analysis.matchLevel || (analysis.atsScore >= 80 ? "Strong Match" : "Moderate Match")}
                      </Badge>
                      {analysis.targetRole && (
                        <Badge variant="outline" className="text-xs">
                          {analysis.targetRole}
                        </Badge>
                      )}
                      {analysis.companyName && (
                        <Badge variant="secondary" className="text-xs">
                          {analysis.companyName}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight">
                      ATS Pass Compatibility
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                      {analysis.summary}
                    </p>
                  </div>
                </div>

                {/* Score Progress Bar Widget */}
                <div className="w-full lg:w-72 space-y-2 p-4 rounded-xl bg-background/70 border shrink-0">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-muted-foreground">Match Probability</span>
                    <span className={getScoreColor(analysis.atsScore)}>{analysis.atsScore}%</span>
                  </div>
                  <Progress value={analysis.atsScore} className="h-2.5" />
                  <p className="text-[11px] text-muted-foreground text-center">
                    {analysis.atsScore >= 80
                      ? "Excellent chance of clearing automated filters."
                      : analysis.atsScore >= 65
                      ? "Decent match; add missing keywords to increase ranking."
                      : "High risk of ATS filtering; update your experience & skills."}
                  </p>
                </div>
              </div>
            </div>

            {/* 4 Dimension Breakdown */}
            {analysis.breakdown && (
              <CardContent className="pt-6 pb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-primary" /> Multi-Factor Breakdown
                  </h4>

                  {/* Option to import scanned resume text into active builder */}
                  {(resumeSource !== "saved" && (customResumeText || analysis.extractedResumeText)) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleImportToProfile}
                      disabled={isImporting}
                      className="text-xs h-7 flex items-center gap-1 border-primary/40 text-primary"
                    >
                      {isImporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <BookmarkCheck className="h-3.5 w-3.5" />}
                      Set as Profile Resume
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-muted-foreground">Keyword Match</span>
                      <span className="font-bold">{analysis.breakdown.keywordMatch}%</span>
                    </div>
                    <Progress value={analysis.breakdown.keywordMatch} className="h-2" />
                    <p className="text-[11px] text-muted-foreground">
                      Exact & synonymous terminology overlap
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-muted-foreground">Skills Alignment</span>
                      <span className="font-bold">{analysis.breakdown.skillsMatch}%</span>
                    </div>
                    <Progress value={analysis.breakdown.skillsMatch} className="h-2" />
                    <p className="text-[11px] text-muted-foreground">
                      Coverage of required tech & tooling
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-muted-foreground">Measurable Impact</span>
                      <span className="font-bold">{analysis.breakdown.quantifiableImpact}%</span>
                    </div>
                    <Progress value={analysis.breakdown.quantifiableImpact} className="h-2" />
                    <p className="text-[11px] text-muted-foreground">
                      Quantifiable results, metrics, STAR verbs
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-muted-foreground">ATS Readability</span>
                      <span className="font-bold">{analysis.breakdown.formattingClarity}%</span>
                    </div>
                    <Progress value={analysis.breakdown.formattingClarity} className="h-2" />
                    <p className="text-[11px] text-muted-foreground">
                      Layout hierarchy, standard headings
                    </p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Keywords & Skills Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched Keywords */}
            <Card className="border border-emerald-500/20 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-emerald-500">
                    <CheckCircle2 className="h-5 w-5" /> Matched Keywords & Skills
                  </CardTitle>
                  <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">
                    {analysis.matchedKeywords?.length || 0} Found
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  These vital keywords from the job description were identified in your resume.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.matchedKeywords?.map((kw, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1 py-1"
                    >
                      <Check className="h-3 w-3" /> {kw}
                    </Badge>
                  ))}
                  {(!analysis.matchedKeywords || analysis.matchedKeywords.length === 0) && (
                    <span className="text-xs text-muted-foreground italic">No direct keyword matches detected.</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Missing Keywords */}
            <Card className="border border-rose-500/20 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-rose-500">
                    <AlertCircle className="h-5 w-5" /> Missing Keywords & Gaps
                  </CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyMissing}
                    className="h-7 text-xs flex items-center gap-1"
                  >
                    {copiedMissing ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    {copiedMissing ? "Copied" : "Copy List"}
                  </Button>
                </div>
                <CardDescription className="text-xs">
                  Crucial terms requested in the job description that you should add to your resume.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.missingKeywords?.map((kw, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 py-1"
                    >
                      + {kw}
                    </Badge>
                  ))}
                  {(!analysis.missingKeywords || analysis.missingKeywords.length === 0) && (
                    <span className="text-xs text-emerald-500 font-medium">
                      All key terms from the job description are covered!
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Strengths & Actionable Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                  <Award className="h-5 w-5 text-emerald-500" /> Resume Strengths
                </CardTitle>
                <CardDescription className="text-xs">
                  Elements that give your application an advantage with recruiters.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5">
                  {analysis.strengths?.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm leading-relaxed">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Improvement Recommendations */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                  <TrendingUp className="h-5 w-5 text-amber-500" /> Priority Fixes to Increase Score
                </CardTitle>
                <CardDescription className="text-xs">
                  Targeted changes to boost your ATS compatibility score.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5">
                  {analysis.improvements?.map((imp, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm leading-relaxed">
                      <span className="h-5 w-5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* AI Bullet Point Power Rewrites */}
          {analysis.suggestedBulletRewrites?.length > 0 && (
            <Card className="border border-primary/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Suggested Bullet-Point Rewrites
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  We spotted opportunities to convert generic statements into high-impact, ATS-optimized accomplishment statements.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.suggestedBulletRewrites.map((rewrite, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border bg-muted/30 space-y-3 transition-colors hover:border-primary/40"
                  >
                    {/* Before */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> Before (Weak / Generic)
                      </span>
                      <p className="text-sm font-mono bg-rose-500/5 text-muted-foreground p-2.5 rounded-lg border border-rose-500/20">
                        {rewrite.original}
                      </p>
                    </div>

                    {/* After */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> ATS-Optimized Rewrite
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyRewrite(rewrite.improved, idx)}
                          className="h-6 text-xs flex items-center gap-1 px-2"
                        >
                          {copiedRewriteIndex === idx ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-500" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" /> Copy
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-sm font-mono font-medium bg-emerald-500/10 text-foreground p-2.5 rounded-lg border border-emerald-500/30">
                        {rewrite.improved}
                      </p>
                    </div>

                    {/* Rationale */}
                    {rewrite.reason && (
                      <p className="text-xs text-muted-foreground italic flex items-center gap-1.5 pt-1">
                        <span className="font-semibold text-primary">Why it works:</span> {rewrite.reason}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
