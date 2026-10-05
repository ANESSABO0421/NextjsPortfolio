import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import LazySkills from "@/components/sections/lazy-skills";
import Experience from "@/components/sections/experience";
import Works from "@/components/sections/works";
import Contact from "@/components/sections/contact";

export default function Home() {
  return (
    <main id="main" className="relative bg-night text-fg">
      <Hero />
      <About />
      <LazySkills />
      <Experience />
      <Works />
      <Contact />
    </main>
  );
}
