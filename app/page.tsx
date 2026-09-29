import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { Philosophy } from "@/components/philosophy";
import { Services } from "@/components/services";
import { Stack } from "@/components/stack";
import { Workflow } from "@/components/workflow";
import { Work } from "@/components/work";

export default function Home() {
  return (
    <main id="content" className="relative z-10">
        <Hero />
        <About />
        <Work />
        <Experience />
        <Stack />
        <Philosophy />
        <Workflow />
        <Services />
        <Contact />
    </main>
  );
}
