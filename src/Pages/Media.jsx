import ContactSection from "../components/Contact/ContactSection";
import MediaDesk from "../components/MediaDesk/MediaDesk";
import MediaArchive from "../components/MediaArchive/MediaArchive";
import RecognitionDesk from "../components/RecognitionDesk/RecognitionDesk";

export default function Media() {
  return (
    <main>
      <MediaDesk />
      <MediaArchive />
      <RecognitionDesk />
    </main>
  );
}
