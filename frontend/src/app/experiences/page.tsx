import ExperiencesHero from "@/src/components/experiences/ExperiencesHero";
import ExperiencesIntro from "@/src/components/experiences/ExperiencesIntro";
import RetreatGallery from "@/src/components/experiences/RetreatGallery";
import SeasonalDropsPreview from "@/src/components/experiences/SeasonalDropsPreview";

export const dynamic = "force-dynamic";

export default function ExperiencesPage() {
  return (
    <main className="min-h-screen bg-[#F3EFE7] pt-[72px] text-[#3a3a3a] sm:pt-[76px]">
      <ExperiencesHero />
      <ExperiencesIntro />
      <RetreatGallery />
      <SeasonalDropsPreview />
    </main>
  );
}
