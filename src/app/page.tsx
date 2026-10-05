import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";

export default function Home() {
  return (
    <main id="main" className="relative bg-night text-fg">
      <Hero />
      <About />
      <section id="skills" className="h-[100vh] bg-surface" />
    </main>
  );
}
