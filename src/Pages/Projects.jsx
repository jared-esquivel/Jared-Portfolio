import ContactSection from "../components/Contact/ContactSection";
// import FeaturedProjects from "../components/FeaturedProjects/FeaturedProjects";
import ProjectsHero from "../components/ProjectsHero/ProjectsHero";
import SoftwareDevelopmentSection from "../components/SoftwareDevelopment/SoftwareDevelopmentSection";
import LeadershipSection from "../components/Leadership/LeadershipSection";
import EngineeringSection from "../components/Engineering/EngineeringSection";

export default function Projects() {
  return (
    <main>
      <ProjectsHero />
      <SoftwareDevelopmentSection />
      {/* <FeaturedProjects /> */}
      <LeadershipSection />
      <EngineeringSection />
      <ContactSection />
    </main>
  );
}
