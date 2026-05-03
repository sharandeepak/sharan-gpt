import * as React from "react";
import { ProfileHighlights } from "@/components/ProfileHighlights";
import { ContactActions } from "@/components/ContactActions";
import { ResumeCard } from "@/components/ResumeCard";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/profile";

export interface ResumePanelContact {
  email: string;
  phone: string;
  linkedin: string | null;
  github: string | null;
  leetcode: string | null;
}

export interface ResumePanelProps {
  profile: Profile;
  displayRole: string;
  contact: ResumePanelContact;
  resumeHref?: string;
  className?: string;
}

export function ResumePanel({
  profile,
  displayRole,
  contact,
  resumeHref = "/resume.pdf",
  className,
}: ResumePanelProps) {
  const { candidate } = profile;

  return (
    <section
      aria-label="Resume"
      className={cn("flex h-full min-h-0 flex-col", className)}
    >
      {/* Fixed header — name, role, contacts */}
      <div className="shrink-0 px-5 pb-4 pt-5 md:px-8 md:pt-8">
        <ProfileHighlights
          name={candidate.name}
          role={displayRole}
          location={candidate.location}
        />
        <div className="mt-4">
          <ContactActions
            email={contact.email}
            phone={contact.phone}
            linkedin={contact.linkedin}
            github={contact.github}
            leetcode={contact.leetcode}
            resumeHref={resumeHref}
          />
        </div>
      </div>

      <div className="mx-5 shrink-0 border-t border-border md:mx-8" />

      {/* Scrollable resume content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-8">
        <ResumeCard profile={profile} />
      </div>
    </section>
  );
}

export default ResumePanel;
