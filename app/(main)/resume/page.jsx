import { getResume } from "@/actions/resume";
import ResumeBuilder from "./_components/resume-builder";

export default async function ResumePage({ searchParams }) {
  const params = await searchParams;
  const resume = await getResume();

  return (
    <div className="container mx-auto py-6">
      <ResumeBuilder
        initialContent={resume?.content}
        initialResume={resume}
        initialTab={params?.tab || (resume?.content ? "preview" : "edit")}
      />
    </div>
  );
}