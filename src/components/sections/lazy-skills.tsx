"use client";

import dynamic from "next/dynamic";

// The stack table carries twelve brand icons and its own SVG animation, so it
// ships as a separate chunk. It still renders on the server — the fallback
// only appears during client-side navigations, before the chunk arrives.
// (next/dynamic only code-splits when it's called from a Client Component.)
const LazySkills = dynamic(() => import("./skills"), {
  loading: () => <section id="skills" aria-busy className="min-h-[100svh] bg-surface" />,
});

export default LazySkills;
