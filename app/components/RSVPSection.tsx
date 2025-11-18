import { motion } from "framer-motion";


    const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay },
  }),
};
export default function RSVPSection() {
  return (
    <section id="rsvp" className="scroll-mt-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={0}
        variants={fadeInUp}
        className="mb-6 text-center"
      >
        <h2 className="text-2xl font-semibold tracking-tight">
          RSVP / शुभकामनाएँ
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Let us know if you&apos;re joining or send your blessings 🥰
        </p>
      </motion.div>

      <motion.form
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={0.1}
        variants={fadeInUp}
        className="mx-auto max-w-xl space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-sm"
        onSubmit={(e) => {
          e.preventDefault();
          alert("Thank you for your response! You can wire this form later.");
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-slate-300">
              Your Name
            </label>
            <input
              type="text"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm outline-none ring-pink-400/40 focus:ring"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-300">
              Phone / WhatsApp
            </label>
            <input
              type="tel"
              className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm outline-none ring-pink-400/40 focus:ring"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-slate-300">
            Will you be joining us?
          </label>
          <select className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm outline-none ring-pink-400/40 focus:ring">
            <option>Yes, I will be there!</option>
            <option>Maybe, not sure yet</option>
            <option>Can&apos;t come, sending blessings</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs text-slate-300">
            Your message / शुभकामनाएँ
          </label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm outline-none ring-pink-400/40 focus:ring"
            placeholder="Write a short message for Pragya & Amit ..."
          />
        </div>

        <button
          type="submit"
          className="mt-2 w-full rounded-full bg-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 hover:bg-pink-600"
        >
          Send
        </button>
      </motion.form>
    </section>
  );
}