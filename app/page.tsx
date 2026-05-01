import profileJson from "@/data/profile.json";
import { ResumeWebsiteLayout } from "@/components/ResumeWebsiteLayout";
import type { Profile } from "@/types/profile";

export const dynamic = "force-dynamic";

export default function Page() {
  return <ResumeWebsiteLayout profile={profileJson as unknown as Profile} />;
}
