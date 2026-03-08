import HeroSection from "@/components/HeroSection";
import DuraCitySection from "@/components/DuraCitySection";
import VisionSection from "@/components/VisionSection";
import CandidatesPreview from "@/components/CandidatesPreview";
import ProgramPreview from "@/components/ProgramPreview";
import CountdownSection from "@/components/CountdownSection";
import NewsPreview from "@/components/NewsPreview";
import GalleryPreview from "@/components/GalleryPreview";
import PollSection from "@/components/PollSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import JoinSection from "@/components/JoinSection";
import SocialProofSection from "@/components/SocialProofSection";

const Index = () => {
  return (
    <div>
      <HeroSection />
      <SocialProofSection />
      <DuraCitySection />
      <VisionSection />
      <CandidatesPreview />
      <ProgramPreview />
      <CountdownSection />
      <NewsPreview />
      <GalleryPreview />
      <PollSection />
      <TestimonialsSection />
      <JoinSection />
    </div>
  );
};

export default Index;
