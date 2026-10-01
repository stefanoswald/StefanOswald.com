import { About } from "@/components/myperson/About";
import { Footer } from "@/components/myperson/Footer";
import { Hero } from "@/components/myperson/Hero";

/** stefanoswald.com/MyPerson: the video, the button, and a little about Stefan. */
export default function MyPersonPage() {
  return (
    <>
      <main>
        <Hero />
        <About />
      </main>
      <Footer />
    </>
  );
}
