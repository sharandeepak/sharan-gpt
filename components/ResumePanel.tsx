import * as React from "react";
import { ProfileHighlights } from "@/components/ProfileHighlights";
import { ContactActions } from "@/components/ContactActions";
import { PdfResumeViewer } from "@/components/PdfResumeViewer";
import { cn } from "@/lib/utils";

export interface ResumePanelProfile {
  name: string;
  displayRole: string;
  location: string;
  tagline: string;
  contact: {
    email: string;
    phone: string;
    linkedin: string | null;
    github: string | null;
    leetcode: string | null;
  };
}

export interface ResumePanelProps {
  profile: ResumePanelProfile;
  resumeSrc?: string;
  resumeDownloadHref?: string;
  resumeFilename?: string;
  pageCount?: number;
  className?: string;
}

const DISPLAY_STACK = [
  "Java",
  "TypeScript",
  "PostgreSQL",
  "Elasticsearch",
  "Redis",
  "Docker",
  "React Native / Expo",
];

const STRENGTHS = [
  "Backend architecture",
  "Performance optimization",
  "Integrations",
  "Mobile delivery",
  "AI-assisted workflows",
];

export function ResumePanel({
  profile,
  resumeSrc = "/resume.pdf",
  resumeDownloadHref = "/resume.pdf",
  resumeFilename = "Sharan-Deepak-RB-Resume.pdf",
  pageCount,
  className,
}: ResumePanelProps) {
  return (
    <section
      aria-label="Resume"
      className={cn(
        "flex h-full min-h-0 flex-col gap-6 p-5 md:p-8",
        className
      )}
    >
      <ProfileHighlights
        name={profile.name}
        role={profile.displayRole}
        location={profile.location}
        tagline={profile.tagline}
        stack={DISPLAY_STACK}
        strengths={STRENGTHS}
      />

      <ContactActions
        email={profile.contact.email}
        phone={profile.contact.phone}
        linkedin={profile.contact.linkedin}
        github={profile.contact.github}
        leetcode={profile.contact.leetcode}
        resumeHref={resumeDownloadHref}
      />

      <div className="flex min-h-0 flex-1">
        <PdfResumeViewer
          src={resumeSrc}
          downloadHref={resumeDownloadHref}
          filename={resumeFilename}
          pageCount={pageCount}
          className="h-full w-full"
        />
      </div>
    </section>
  );
}

export default ResumePanel;
