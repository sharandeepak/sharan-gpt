import * as React from "react";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/profile";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-fg-subtle">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="my-5 h-px bg-border" />;
}

function formatDateRange(startDate: string, endDate: string) {
  return `${startDate} – ${endDate === "Present" ? "Now" : endDate}`;
}

function ExperienceSection({ experience }: { experience: Profile["experience"] }) {
  return (
    <div>
      <SectionLabel>Experience</SectionLabel>
      <div className="flex flex-col gap-5">
        {experience.map((exp) => {
          const topHighlights = exp.highlights;
          return (
            <div key={`${exp.company}-${exp.startDate}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[13.5px] font-semibold text-fg">{exp.company}</p>
                  <p className="text-[12.5px] text-fg-muted">{exp.role}</p>
                </div>
                <span className="shrink-0 font-mono text-[11px] text-fg-subtle">
                  {formatDateRange(exp.startDate, exp.endDate)}
                </span>
              </div>
              {topHighlights.length > 0 && (
                <ul className="mt-2 flex flex-col gap-1">
                  {topHighlights.map((h, i) => (
                    <li key={i} className="flex gap-2 text-[12px] leading-[1.5] text-fg-muted">
                      <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-fg-subtle" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SkillsSection({ skills }: { skills: Profile["skills"] }) {
  const groups: { label: string; items: string[] }[] = [
    { label: "Languages", items: skills.programmingLanguages },
    { label: "Backend", items: skills.backend },
    { label: "Data", items: skills.databasesAndSearch },
    { label: "Tools", items: skills.tools },
  ];

  return (
    <div>
      <SectionLabel>Skills</SectionLabel>
      <div className="flex flex-col gap-3">
        {groups.map(({ label, items }) => (
          <div key={label} className="flex gap-2">
            <span className="w-[68px] shrink-0 text-[11px] text-fg-subtle pt-[3px]">{label}</span>
            <div className="flex flex-wrap gap-1">
              {items.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-full border border-border bg-panel-soft px-2 py-0.5 font-mono text-[11px] text-fg-muted"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsSection({ projects }: { projects: Profile["projects"] }) {
  return (
    <div>
      <SectionLabel>Projects</SectionLabel>
      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <div key={project.name}>
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-[13.5px] font-semibold text-fg">{project.name}</p>
              <span className="shrink-0 font-mono text-[11px] text-fg-subtle">
                {formatDateRange(project.startDate, project.endDate)}
              </span>
            </div>
            <p className="mt-1 text-[12px] leading-[1.5] text-fg-muted">{project.description}</p>
            {project.highlights.length > 0 && (
              <ul className="mt-2 flex flex-col gap-1">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex gap-2 text-[12px] leading-[1.5] text-fg-muted">
                    <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-fg-subtle" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationSection({ education }: { education: Profile["education"] }) {
  const edu = education[0];
  if (!edu) return null;
  return (
    <div>
      <SectionLabel>Education</SectionLabel>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[13.5px] font-semibold text-fg">{edu.institution}</p>
          <p className="text-[12.5px] text-fg-muted">{edu.degree}</p>
        </div>
        <div className="text-right">
          <span className="font-mono text-[11px] text-fg-subtle">
            {edu.startYear} – {edu.endYear}
          </span>
          <p className="font-mono text-[11px] text-fg-subtle">CGPA {edu.cgpa}</p>
        </div>
      </div>
    </div>
  );
}

export interface ResumeCardProps {
  profile: Profile;
  className?: string;
}

export function ResumeCard({ profile, className }: ResumeCardProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <ExperienceSection experience={profile.experience} />
      <Divider />
      <SkillsSection skills={profile.skills} />
      <Divider />
      <ProjectsSection projects={profile.projects} />
      <Divider />
      <EducationSection education={profile.education} />
    </div>
  );
}

export default ResumeCard;
