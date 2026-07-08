import Hero from "../components/Hero/Hero";
import MyStory from "../components/MyStory/MyStory";
import FeaturedProjects from "../components/FeaturedProjects/FeaturedProjects";
import ExperienceTimeline from "../components/ExperienceTimeline/ExperienceTimeline";
import ImpactSection from "../components/Impact/ImpactSection";
import RecognitionSection from "../components/Recognition/RecognitionSection";
import ContactSection from "../components/Contact/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <MyStory />
      <FeaturedProjects />
      <ExperienceTimeline />
      <ImpactSection />
      <RecognitionSection />
      <ContactSection />
    </>
  );
}
