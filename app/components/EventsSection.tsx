import { motion } from "framer-motion";

const events = [
  {
    title: "Haldi Ceremony",
    date: "25 November 2025",
    day: "Tuesday",
    time: "11:00 AM onwards (Lunch from 1:30 PM)",
    location: "Anil Jha Niwas, Kunwar Singh Nagar, Janata Road, Patna",
    id: "haldi",
  },
  {
    title: "Mehndi & Sangeet",
    date: "25 November 2025",
    day: "Tuesday",
    time: "6:30 PM onwards",
    location: "Anil Jha Niwas, Patna",
    id: "mehndi",
  },
  {
    title: "Baarat Departure",
    date: "26 November 2025",
    day: "Wednesday",
    time: "5:30 AM",
    location: "From Patna to Bhagalpur",
    id: "baarat",
  },
  {
    title: "Wedding Ceremony",
    date: "26 November 2025",
    day: "Wednesday",
    time: "Evening",
    location: "Vaikuntham, Shiv Puri, Bhagalpur",
    id: "wedding",
  },
];
    const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay },
  }),
};


export default function EventsSection() {
  return (
    <section id="events" className="scroll-mt-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={0}
        variants={fadeInUp}
        className="mb-8 text-center"
      >
        <h2 className="text-2xl font-semibold tracking-tight">
          Wedding Events
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          All the important functions in one place ✨
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            custom={index * 0.1}
            variants={fadeInUp}
            className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-lg"
          >
            <h3 className="text-lg font-semibold">{event.title}</h3>
            <p className="mt-1 text-sm text-pink-200">
              {event.date} · {event.day}
            </p>
            <p className="mt-2 text-sm text-slate-300">{event.time}</p>
            <p className="mt-1 text-xs text-slate-400">
              {event.location}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}