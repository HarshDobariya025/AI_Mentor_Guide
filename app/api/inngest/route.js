import { inngest } from "@/lib/inngest/client";
import { serve } from "inngest/next";
import { generateIndustryInsights } from "@/lib/inngest/function";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    generateIndustryInsights, // This function is used to generate industry insights using Google Generative AI every WEEK
  ],
});
