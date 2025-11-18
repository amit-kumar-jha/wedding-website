import { motion } from "framer-motion";

export default function Hero() {

    const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay },
  }),
};
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-white/10"
    >
      {/* Soft gradient blob background */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-0 h-80 w-80 rounded-full bg-pink-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl"
      />

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-20 md:flex-row ">
        <motion.div
          className="flex-1 text-center md:text-left"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <p className="text-xs uppercase tracking-[0.25em] text-pink-300/80">
            We’re getting married!
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            Pragya <span className="text-pink-300">&amp;</span> Amit
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            Join us as we celebrate our love on{" "}
            <span className="font-semibold text-pink-200">
              26 November 2025
            </span>{" "}
            in Bhagalpur, Bihar.
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Pre-wedding celebrations start on 25 November 2025.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <a
              href="#events"
              className="rounded-full bg-pink-500 px-6 py-2 text-sm font-medium text-white shadow-lg shadow-pink-500/30 hover:bg-pink-600"
            >
              View Events
            </a>
            {/* <a
              href="#rsvp"
              className="rounded-full border border-pink-300/60 px-6 py-2 text-sm font-medium text-pink-100 hover:bg-pink-300/10"
            >
              RSVP
            </a> */}
          </div>
        </motion.div>

        {/* Simple animated card for quick details */}
      <motion.div
  className="flex-1 w-full"
  initial={{ opacity: 0, scale: 0.9, y: 40 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.2 }}
>
  <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:p-6 shadow-2xl">
    <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-100">
      Wedding Details
    </h2>
    <p className="mt-2 text-sm text-slate-300">
      Programs, travel details, photos and more.
    </p>

    <dl className="mt-4 space-y-3">
      {/* Each event is a flex container that stacks on small screens and sits inline on sm+ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <dt className="text-sm text-slate-400">Haldi</dt>
        <dd className="text-sm font-medium text-slate-100">25 Nov 2025 · Patna</dd>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <dt className="text-sm text-slate-400">Mehndi &amp; Sangeet</dt>
        <dd className="text-sm font-medium text-slate-100">25 Nov 2025 · Evening</dd>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <dt className="text-sm text-slate-400">Baarat</dt>
        <dd className="text-sm font-medium text-slate-100">
          26 Nov 2025 · 5:30 AM · Patna → Bhagalpur
        </dd>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <dt className="text-sm text-slate-400">Wedding</dt>
        <dd className="text-sm font-medium text-slate-100">26 Nov 2025 · Bhagalpur</dd>
      </div>
    </dl>

    {/* Actions: stack on mobile, inline on larger screens */}
    <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div className="flex gap-2">
        <a
          href="https://maps.app.goo.gl/7CMXXq2MQmAUJseZ6"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-violet-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-95"
        >
          View Map
        </a>
      </div>

      <div className="text-xs text-slate-400 text-left sm:text-right">
        Last updated: <span className="text-slate-300 font-medium">Nov 18, 2025</span>
      </div>
    </div>
  </div>
</motion.div>

      </div>
    </section>
  );
}

