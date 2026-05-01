/**
 * Shape of `data/profile.json`. The file is the single source of truth for
 * everything the resume site renders or feeds to the assistant.
 */

export interface ProfileLinks {
  github: string | null;
  linkedin: string | null;
  leetcode: string | null;
}

export interface ProfileCandidate {
  name: string;
  phone: string;
  email: string;
  location: string;
  links: ProfileLinks;
  headline: string;
  summary: string;
}

export interface ProfileExperience {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

export interface ProfileEducation {
  degree: string;
  institution: string;
  startYear: string;
  endYear: string;
  cgpa: string;
}

export interface ProfileSkills {
  programmingLanguages: string[];
  backend: string[];
  databasesAndSearch: string[];
  frontendAndMobile: string[];
  tools: string[];
  computerScience: string[];
  aiEngineering: string[];
}

export interface ProfileProject {
  name: string;
  links: { github?: string; demo?: string };
  startDate: string;
  endDate: string;
  description: string;
  highlights: string[];
}

export interface ProfileCertification {
  year: string;
  name: string;
  issuer: string;
  link?: string;
}

export interface ProfileHonor {
  year: string;
  title: string;
  organization: string;
  reason?: string;
}

export interface Profile {
  candidate: ProfileCandidate;
  experience: ProfileExperience[];
  education: ProfileEducation[];
  skills: ProfileSkills;
  projects: ProfileProject[];
  certifications: ProfileCertification[];
  honorsAndAwards: ProfileHonor[];
}

/** Treat `s` as a real http(s) URL or return null. Used because the JSON
 * stores placeholders like "Github" / "LinkedIn" rather than real URLs. */
export function isUrl(s: string | null | undefined): s is string {
  if (!s || typeof s !== "string") return false;
  return s.startsWith("http://") || s.startsWith("https://");
}
