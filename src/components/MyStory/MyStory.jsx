import "./MyStory.css";
import NightSky from "../NightSky/NightSky";
import portrait from "../../assets/Jared-Headshot.png";

export default function MyStory() {
  return (
    <section className="story-section">
      <NightSky />

      <div className="story-shell">
        <aside className="story-profile">
          <img
            className="portrait-placeholder"
            src={portrait}
            alt="Portrait of Jared Esquivel"
          />

          <h2>Jared Esquivel</h2>
          <p className="profile-role">
            HackWatsonville Founder | Web Dev associate @BizzNEST | National
            Hispanic Heritage Youth Awardee
          </p>
          <p className="profile-location">Watsonville, California</p>
        </aside>

        <div className="story-content">
          <p className="story-kicker">My Story</p>

          <h1>
            Built to Innovate.
            <span>Ready to Lead.</span>
          </h1>

          <div className="story-copy">
            <p>I don't wait for opportunities, I build them.</p>
            <p>
              I'm a first-generation college student from Watsonville, studying
              Computer Science. Nobody in my family worked in tech, so I didn't
              grow up with that world around me, but I was always the kid asking
              how things worked, and that curiosity eventually turned into a
              real interest in how technology could open doors for people.
            </p>

            <p>
              My first shot at this came through Digital NEST, where I got to
              build websites, work with a team, and take on real client
              projects. That's where it clicked for me: web development isn't
              just writing clean code, it's building something people actually
              rely on.
            </p>

            <p>
              From there, I started HackWatsonville, ran some AI workshops, and
              kept finding ways to bring technology, creativity, and community
              together. Whether I'm building a website or creating an
              opportunity for another student, I'm chasing the same thing, using
              what I know to make a real difference.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
