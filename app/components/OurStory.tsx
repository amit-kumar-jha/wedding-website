import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay },
  }),
};

export default function OurStory() {
  return (
    <section id="story" className="scroll-mt-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        custom={0}
        variants={fadeInUp}
        className="mx-auto max-w-3xl text-center"
      >
        <h2 className="text-2xl font-semibold tracking-tight mt-6">
          Our Story 💕
        </h2>
        <p className="mt-3 text-sm uppercase tracking-[0.3em] text-pink-300/80">
          From strangers to soulmates
        </p>

        <p className="mt-6 text-base leading-relaxed text-slate-300">
          What began as a simple conversation soon became a part of our daily
          lives. One day turned into many, and slowly, in the softest and most
          unexpected ways, we found comfort, joy, and a quiet kind of magic in
          each other.
          <br />
          <br />
          Our story is made of stolen smiles, late night talks, dreams shared
          without hesitation, and moments that felt like home long before we
          realised why. Somewhere between laughter and long pauses, two hearts
          chose each other gently, beautifully, and completely.
          <br />
          <br />
          This website is a small piece of that journey. Thank you for being
          part of our lives. we can&apos;t wait to celebrate our forever with you!
        </p>
      </motion.div>
    </section>
  );
}
