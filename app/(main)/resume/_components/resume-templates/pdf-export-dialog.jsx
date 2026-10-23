"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Printer,
  Sparkles,
  Layers,
  Palette,
  Check,
  Loader2,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { parseMarkdownResume } from "./resume-parser";
import TemplateRenderer from "./template-renderer";

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern Tech",
    tag: "Software & Startups",
    description: "Clean sans-serif typography, accent borders, and structured category skill sets.",
  },
  {
    id: "classic",
    name: "Executive Classic",
    tag: "Corporate & Ivy League",
    description: "Timeless serif styling, centered header, and horizontal divider rules.",
  },
  {
    id: "compact",
    name: "Minimalist Compact",
    tag: "One-Page Optimized",
    description: "High density layout designed to maximize space and fit everything cleanly.",
  },
];

const ACCENT_COLORS = [
  { id: "charcoal", name: "Slate Charcoal", hex: "#0f172a" },
  { id: "navy", name: "Corporate Navy", hex: "#1e3a8a" },
  { id: "emerald", name: "Tech Emerald", hex: "#065f46" },
  { id: "burgundy", name: "Executive Burgundy", hex: "#881337" },
];

export default function PdfExportDialog({ markdownContent, candidateName = "Candidate" }) {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [accentColor, setAccentColor] = useState("#0f172a");
  const [fontSize, setFontSize] = useState("normal");
  const [isDownloading, setIsDownloading] = useState(false);

  // Parse markdown or plain text resume into structured resume data
  const parsedResume = parseMarkdownResume(markdownContent, candidateName);

  // Clean Isolated Browser Print Preview (Zero DOM Clutter, Exactly 1 A4 Page)
  const handlePrint = () => {
    const element = document.getElementById("resume-export-sheet");
    if (!element) {
      toast.error("Resume preview not ready.");
      return;
    }

    const printWindow = window.open("", "_blank", "width=850,height=1000");
    if (!printWindow) {
      toast.error("Please allow popups in your browser to print the resume.");
      return;
    }

    const safeName = (parsedResume.name || candidateName || "Candidate").replace(/[^a-zA-Z0-9_\s-]/g, "");

    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${safeName} - Resume</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm 12mm;
            }
            @media print {
              html, body {
                margin: 0 !important;
                padding: 0 !important;
                background: #ffffff !important;
                color: #0f172a !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
            body {
              margin: 0;
              padding: 0;
              background-color: #ffffff;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            .resume-print-wrapper {
              width: 100%;
              max-width: 800px;
              margin: 0 auto;
              background: #ffffff;
              box-sizing: border-box;
            }
          </style>
        </head>
        <body>
          <div class="resume-print-wrapper">
            ${element.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.focus();
              window.print();
              setTimeout(function() {
                window.close();
              }, 1000);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Direct PDF Download via Isolated Iframe + jsPDF (Direct browser download, 0 CSS conflict)
  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    const toastId = toast.loading("Generating ATS PDF document...");

    let iframe = null;

    try {
      const element = document.getElementById("resume-export-sheet");
      if (!element) throw new Error("Resume container not found");

      const safeName = (parsedResume.name || candidateName || "Candidate")
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .replace(/__+/g, "_");

      // 1. Create a clean, isolated iframe (completely separate from Next.js & Tailwind v4)
      iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.left = "-9999px";
      iframe.style.top = "0";
      iframe.style.width = "800px";
      iframe.style.height = "1200px";
      iframe.style.border = "none";
      iframe.style.visibility = "hidden";
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              * { box-sizing: border-box; }
              body {
                margin: 0;
                padding: 0;
                background-color: #ffffff !important;
                color: #0f172a !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              }
              #clean-export-container {
                width: 800px;
                background-color: #ffffff !important;
                margin: 0 auto;
              }
            </style>
          </head>
          <body>
            <div id="clean-export-container">
              ${element.innerHTML}
            </div>
          </body>
        </html>
      `);
      iframeDoc.close();

      // Short delay for DOM rendering & font stabilization
      await new Promise((resolve) => setTimeout(resolve, 200));

      const target = iframeDoc.getElementById("clean-export-container");
      if (!target) throw new Error("Failed to initialize PDF render target");

      // 2. Render target via html2canvas inside the isolated iframe context
      const html2canvasModule = await import("html2canvas");
      const html2canvas = html2canvasModule.default || html2canvasModule;

      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 800,
      });

      // 3. Generate high-quality PDF via jsPDF
      const jspdfModule = await import("jspdf");
      const jsPDF = jspdfModule.jsPDF || jspdfModule.default;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
      const margin = 8; // 8mm margin
      const contentWidth = pdfWidth - margin * 2;
      const pageHeightUsable = pdfHeight - margin * 2;
      const totalImgHeight = (canvas.height * contentWidth) / canvas.width;

      const imgData = canvas.toDataURL("image/jpeg", 0.98);

      if (totalImgHeight <= pageHeightUsable) {
        // Fits on single page
        pdf.addImage(imgData, "JPEG", margin, margin, contentWidth, totalImgHeight, undefined, "FAST");
      } else {
        // Multi-page slicing
        let heightLeft = totalImgHeight;
        let position = margin;

        pdf.addImage(imgData, "JPEG", margin, position, contentWidth, totalImgHeight, undefined, "FAST");
        heightLeft -= pageHeightUsable;

        while (heightLeft > 5) {
          position -= pageHeightUsable;
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", margin, position, contentWidth, totalImgHeight, undefined, "FAST");
          heightLeft -= pageHeightUsable;
        }
      }

      // 4. Directly trigger native browser file download
      pdf.save(`${safeName}_Resume.pdf`);
      toast.success("PDF downloaded directly to your device!", { id: toastId });
    } catch (err) {
      console.error("Direct PDF download error:", err);
      toast.error(`Download failed: ${err.message || "Unknown error"}. You can also use 'Print / Save via Browser'.`, { id: toastId });
    } finally {
      if (iframe && iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1.5 shadow-sm">
          <Download className="h-4 w-4 text-primary" />
          <span>Export PDF</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-5xl lg:max-w-6xl w-[95vw] max-h-[92vh] flex flex-col p-0 gap-0 overflow-hidden bg-background">
        {/* Header */}
        <DialogHeader className="p-4 md:px-6 border-b bg-muted/20 flex flex-row items-center justify-between space-y-0">
          <div>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Multi-Template ATS PDF Exporter
            </DialogTitle>
            <DialogDescription className="text-xs mt-0.5">
              Choose an ATS-compliant template, select typography, and export clean PDF documents.
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Main Workspace (Split View) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 min-h-0">
          {/* Left Controls Panel */}
          <div className="md:col-span-5 lg:col-span-4 p-5 border-r border-border/60 space-y-6 bg-card overflow-y-auto">
            {/* Template Picker */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" /> 1. Select Template
              </label>
              <div className="space-y-2">
                {TEMPLATES.map((tmpl) => {
                  const isSelected = selectedTemplate === tmpl.id;
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => setSelectedTemplate(tmpl.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border/60 hover:border-primary/40 hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm text-foreground">{tmpl.name}</span>
                        {isSelected && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      <Badge variant="secondary" className="text-[10px] py-0 mb-1">
                        {tmpl.tag}
                      </Badge>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {tmpl.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Accent Color Picker */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5 text-primary" /> 2. Accent Palette
              </label>
              <div className="flex gap-2">
                {ACCENT_COLORS.map((col) => {
                  const isSelected = accentColor === col.hex;
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setAccentColor(col.hex)}
                      title={col.name}
                      className={`h-7 w-7 rounded-full transition-transform flex items-center justify-center ${
                        isSelected ? "ring-2 ring-primary ring-offset-2 scale-110" : "opacity-80 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: col.hex }}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font Density */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                3. Spacing & Density
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={fontSize === "normal" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFontSize("normal")}
                  className="text-xs h-8"
                >
                  Standard (A4)
                </Button>
                <Button
                  type="button"
                  variant={fontSize === "compact" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFontSize("compact")}
                  className="text-xs h-8"
                >
                  Compact (1-Page)
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <Button
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="w-full font-semibold shadow-md flex items-center justify-center gap-2"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" /> Download PDF File
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handlePrint}
                className="w-full text-xs flex items-center justify-center gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" /> Print / Save via Browser
              </Button>
            </div>
          </div>

          {/* Right Live Preview Panel */}
          <div className="md:col-span-7 lg:col-span-8 p-4 md:p-6 bg-muted/40 overflow-y-auto flex justify-center items-start">
            <div
              className="w-full max-w-[760px] rounded-md overflow-hidden bg-white text-black border"
              style={{ borderColor: "#cbd5e1", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <TemplateRenderer
                id="resume-export-sheet"
                resumeData={parsedResume}
                template={selectedTemplate}
                accentColor={accentColor}
                fontSize={fontSize}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
