import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import Works from "@/components/sections/works";
import Experience from "@/components/sections/experience";
import Skills from "@/components/sections/skills";
import Contact from "@/components/sections/contact";

// Colour rhythm: slate → cream → ink → stone → ink → slate. Each section tucks
// under the curved edge of the next, so the page reads as one continuous fold.
export default function Home() {
  return (
    <main id="main" className="relative bg-pal-ink text-white">
      <Hero />
      <About />
      <Works />
      <Experience />
      <Skills />
      <Contact />
    </main>
  );
}
