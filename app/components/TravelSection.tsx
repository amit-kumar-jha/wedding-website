// import { motion } from "framer-motion";

//     const fadeInUp = {
//   hidden: { opacity: 0, y: 40 },
//   visible: (delay = 0) => ({
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.7, delay },
//   }),
// }; 

// export default function TravelSection() {
//   return (
//     <section id="travel" className="scroll-mt-24">
//       <motion.div
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, amount: 0.2 }}
//         custom={0}
//         variants={fadeInUp}
//         className="mb-6 text-center"
//       >
//         <h2 className="text-2xl font-semibold tracking-tight">
//           Travel & Stay
//         </h2>
//         <p className="mt-2 text-sm text-slate-400">
//           How to reach the venue and join the celebrations
//         </p>
//       </motion.div>

//       <div className="grid gap-6 md:grid-cols-2">
//         <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm">
//           <h3 className="text-base font-semibold">
//             Baarat from Patna to Bhagalpur
//           </h3>
//           <p className="mt-2 text-slate-300">
//             Baarat will leave from Patna at{" "}
//             <span className="font-semibold">5:30 AM</span> on{" "}
//             <span className="font-semibold">26 November 2025</span>.
//           </p>
//           <p className="mt-2 text-slate-400">
//             Please be ready a little before time. For exact pickup location &
//             travel coordination, contact the groom&apos;s family.
//           </p>
//         </div>

//         <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm">
//           <h3 className="text-base font-semibold">Wedding Venue</h3>
//           <p className="mt-2 text-slate-300">
//             <span className="font-semibold">Vaikuntham</span>, Shiv Puri,
//             Bhagalpur
//           </p>
//           <a
//             href="https://www.google.com/maps"
//             target="_blank"
//             rel="noreferrer"
//             className="mt-3 inline-flex text-xs text-pink-300 underline underline-offset-4 hover:text-pink-200"
//           >
//             Open in Google Maps
//           </a>
//           <p className="mt-2 text-slate-400">
//             We recommend arriving in Bhagalpur a few hours before the wedding
//             events. You can contact us for suggestions on nearby hotels or
//             guest houses.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay },
  }),
};

export default function TravelSection() {
  return (
    <section id="travel" className="scroll-mt-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={0}
        variants={fadeInUp}
        className="mb-6 text-center"
      >
        <h2 className="text-2xl font-semibold tracking-tight">Travel & Stay</h2>
        <p className="mt-2 text-sm text-slate-400">
          Direct Google Maps links to each event location
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Haldi */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm">
          <h3 className="text-base font-semibold">Haldi Ceremony Location</h3>
          <p className="mt-2 text-slate-300">
            <span className="font-semibold">Anil Jha Residence</span>, Kunwar Singh Nagar, Janata Road, Patna
          </p>

          <a
            href="https://maps.app.goo.gl/9dffuJvpjbwGdVF56"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex text-xs text-pink-300 underline underline-offset-4 hover:text-pink-200"
          >
            📍 Open Haldi Location in Google Maps
          </a>
        </div>

        {/* Mehndi & Sangeet */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm">
          <h3 className="text-base font-semibold">Mehndi & Sangeet</h3>
          <p className="mt-2 text-slate-300">
            Evening festivities on <span className="font-semibold">25 Nov, 6:30 PM</span>.
          </p>

          <a
            href="https://maps.app.goo.gl/9dffuJvpjbwGdVF56"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex text-xs text-pink-300 underline underline-offset-4 hover:text-pink-200"
          >
            📍 Open Mehndi Location in Google Maps
          </a>
        </div>

        {/* Baarat */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm">
          <h3 className="text-base font-semibold">Baarat Departure</h3>
          <p className="mt-2 text-slate-300">
            Baarat leaves from Patna at{" "}
            <span className="font-semibold">5:30 AM, 26 Nov 2025</span>.
          </p>
          <p className="mt-2 text-slate-400">Exact address & pickup point:</p>

          <a
            href="https://maps.app.goo.gl/9dffuJvpjbwGdVF56"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex text-xs text-pink-300 underline underline-offset-4 hover:text-pink-200"
          >
            📍 View Patna Departure Point
          </a>
        </div>

        {/* Wedding Venue */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm">
          <h3 className="text-base font-semibold">Wedding Venue</h3>
          <p className="mt-2 text-slate-300">
            <span className="font-semibold">Vaikuntham</span>, Shiv Puri, Bhagalpur
          </p>

          <a
            href="https://maps.app.goo.gl/7CMXXq2MQmAUJseZ6"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex text-xs text-pink-300 underline underline-offset-4 hover:text-pink-200"
          >
            📍 Open Wedding Venue in Google Maps
          </a>

          <p className="mt-2 text-slate-400">
            Recommended to arrive a few hours before the ceremony.
          </p>
        </div>
      </div>
    </section>
  );
}
